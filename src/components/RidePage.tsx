import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, User, Clock, ArrowLeft } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useLocation } from '../hooks/useLocation'
import { supabase, type Ride } from '../lib/supabase'
import toast from 'react-hot-toast'

export function RidePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { driver, isVerified } = useAuth()
  const location = useLocation()
  const [ride, setRide] = useState<Ride | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const locationUpdateRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (!id) {
      navigate('/home')
      return
    }

    loadRide()
    
    // Set up real-time subscription
    const subscription = supabase
      .channel(`ride:${id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rides',
          filter: `id=eq.${id}`
        },
        (payload) => {
          const updatedRide = payload.new as Ride
          setRide(updatedRide)
          
          // Check if ride was cancelled
          if (updatedRide.status === 'CANCELLED') {
            toast.error('Ride has been cancelled by the rider')
            setTimeout(() => navigate('/home'), 2000)
          }
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
      if (locationUpdateRef.current) {
        clearInterval(locationUpdateRef.current)
      }
    }
  }, [id, navigate])

  // Start location tracking when online and has location
  useEffect(() => {
    if (!driver?.online || !location.latitude || !location.longitude) return

    // Update location immediately
    updateDriverLocation()

    // Set up interval to update location every 10 seconds
    locationUpdateRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') {
        updateDriverLocation()
      }
    }, 10000)

    return () => {
      if (locationUpdateRef.current) {
        clearInterval(locationUpdateRef.current)
      }
    }
  }, [driver?.online, location.latitude, location.longitude])

  const loadRide = async () => {
    if (!id) return

    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      // Check if this driver is assigned to this ride
      if (data.driver_id !== driver?.id) {
        toast.error('You are not assigned to this ride')
        navigate('/home')
        return
      }

      setRide(data)
    } catch (error) {
      console.error('Error loading ride:', error)
      toast.error('Failed to load ride details')
      navigate('/home')
    } finally {
      setLoading(false)
    }
  }

  const updateDriverLocation = async () => {
    if (!location.latitude || !location.longitude || !navigator.onLine) return

    try {
      await supabase.rpc('set_driver_location', {
        lng: location.longitude,
        lat: location.latitude
      })
    } catch (error) {
      console.error('Error updating location:', error)
    }
  }

  const updateRideStatus = async (newStatus: Ride['status']) => {
    if (!ride || !isVerified) return

    // Define valid transitions
    const validTransitions: Record<Ride['status'], Ride['status'][]> = {
      'REQUESTED': [],
      'ASSIGNED': ['ENROUTE'],
      'ENROUTE': ['STARTED'],
      'STARTED': ['COMPLETED'],
      'COMPLETED': [],
      'CANCELLED': []
    }

    if (!validTransitions[ride.status].includes(newStatus)) {
      toast.error('Invalid status transition')
      return
    }

    setUpdating(true)
    try {
      const { error } = await supabase
        .from('rides')
        .update({ status: newStatus })
        .eq('id', ride.id)

      if (error) throw error

      setRide({ ...ride, status: newStatus })
      toast.success(`Ride status updated to ${newStatus.toLowerCase()}`)

      if (newStatus === 'COMPLETED') {
        setTimeout(() => navigate('/home'), 2000)
      }
    } catch (error) {
      toast.error('Failed to update ride status')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusColor = (status: Ride['status']) => {
    switch (status) {
      case 'ASSIGNED': return 'bg-accent text-text'
      case 'ENROUTE': return 'bg-primary text-white'
      case 'STARTED': return 'bg-green-500 text-white'
      case 'COMPLETED': return 'bg-gray-500 text-white'
      default: return 'bg-gray-200 text-text'
    }
  }

  const getNextStatus = (currentStatus: Ride['status']) => {
    switch (currentStatus) {
      case 'ASSIGNED': return { status: 'ENROUTE' as const, label: 'En Route to Pickup' }
      case 'ENROUTE': return { status: 'STARTED' as const, label: 'Start Trip' }
      case 'STARTED': return { status: 'COMPLETED' as const, label: 'Complete Trip' }
      default: return null
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!ride) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <p className="text-text/60 mb-4">Ride not found</p>
          <button
            onClick={() => navigate('/home')}
            className="bg-primary text-white px-6 py-2 rounded-xl"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const nextStatus = getNextStatus(ride.status)

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/home')}
              className="p-2 -ml-2 text-text/60 hover:text-text transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-text">Active Ride</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ride.status)}`}>
                  {ride.status}
                </span>
                <span className="text-text/60 text-sm">#{ride.id.slice(0, 8)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      {!isVerified && (
        <div className="bg-accent text-text px-4 py-3">
          <p className="text-sm">⚠️ Actions disabled - Awaiting verification</p>
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Trip Details */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-text">Trip Details</h3>
            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {formatCurrency(ride.final_fare || ride.estimated_fare)}
              </p>
              <p className="text-xs text-text/60">
                {ride.final_fare ? 'Final Fare' : 'Estimated'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-text/60 mb-1">Pickup Location</p>
                <p className="text-text font-medium">{ride.pickup_address}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-secondary mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-text/60 mb-1">Drop-off Location</p>
                <p className="text-text font-medium">{ride.dropoff_address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mini Map Placeholder */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-text mb-3">Route Map</h3>
          <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
            <div className="text-center text-text/60">
              <MapPin className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">Map integration would go here</p>
              <p className="text-xs">Shows pickup → destination route</p>
            </div>
          </div>
        </div>

        {/* Rider Info (Limited) */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-text/60" />
            </div>
            <div>
              <p className="font-medium text-text">Rider</p>
              <div className="flex items-center gap-2 text-sm text-text/60">
                <Clock className="w-4 h-4" />
                <span>Requested {new Date(ride.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Location Status */}
        {location.error ? (
          <div className="bg-secondary/10 border border-secondary/20 rounded-xl p-4">
            <p className="text-secondary text-sm">⚠️ Location access required for tracking</p>
          </div>
        ) : location.latitude && location.longitude ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-green-800 text-sm">✓ Location tracking active</p>
          </div>
        ) : (
          <div className="bg-accent/10 border border-accent/20 rounded-xl p-4">
            <p className="text-text text-sm">📍 Getting location...</p>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      {nextStatus && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
          <button
            onClick={() => updateRideStatus(nextStatus.status)}
            disabled={updating || !isVerified}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updating ? 'Updating...' : nextStatus.label}
          </button>
        </div>
      )}
    </div>
  )
}