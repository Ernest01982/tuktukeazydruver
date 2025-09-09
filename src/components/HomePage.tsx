import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Power, MapPin, DollarSign, Clock, AlertCircle, User } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase, type Ride } from '../lib/supabase'
import { formatCurrency } from '../lib/utils'
import toast from 'react-hot-toast'

export function HomePage() {
  const { driver, signOut, refetch, isVerified } = useAuth()
  const navigate = useNavigate()
  const [isOnline, setIsOnline] = useState(driver?.online ?? false)
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(false)
  const [toggling, setToggling] = useState(false)

  useEffect(() => {
    if (driver) {
      setIsOnline(driver.online)
      if (driver.online) {
        loadAvailableRides()
      }
    }
  }, [driver])

  const loadAvailableRides = async () => {
    if (!isOnline) return
    
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('rides')
        .select('*')
        .eq('status', 'REQUESTED')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRides(data || [])
    } catch (error) {
      console.error('Error loading rides:', error)
      toast.error('Failed to load available rides')
    } finally {
      setLoading(false)
    }
  }

  const toggleOnlineStatus = async () => {
    if (!driver) return

    setToggling(true)
    try {
      const newStatus = !isOnline
      const { error } = await supabase
        .from('drivers')
        .update({ online: newStatus })
        .eq('id', driver.id)

      if (error) throw error

      setIsOnline(newStatus)
      await refetch()
      
      if (newStatus) {
        toast.success('You are now online')
        loadAvailableRides()
      } else {
        toast.success('You are now offline')
        setRides([])
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    } finally {
      setToggling(false)
    }
  }

  const acceptRide = async (rideId: string) => {
    if (!driver || !isVerified) return

    try {
      const { error } = await supabase
        .from('rides')
        .update({ 
          driver_id: driver.id, 
          status: 'ASSIGNED' 
        })
        .eq('id', rideId)
        .eq('status', 'REQUESTED') // Guard: only if still REQUESTED

      if (error) throw error

      toast.success('Ride accepted!')
      navigate(`/ride/${rideId}`)
    } catch (error) {
      console.error('Failed to accept ride:', error)
      toast.error('Failed to accept ride')
      loadAvailableRides() // Refresh list
    }
  }

  const handleLogout = async () => {
    const { error } = await signOut()
    if (error) {
      toast.error('Error signing out')
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-text">Welcome back!</h1>
              <p className="text-text/60 text-sm">{driver?.name}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-text/60 hover:text-text transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Verification Banner */}
      {!isVerified && (
        <div className="bg-accent text-text px-4 py-3 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium text-sm">Awaiting Verification</p>
            <p className="text-xs opacity-90">Your account is pending verification. You cannot accept rides yet.</p>
          </div>
        </div>
      )}

      <div className="px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-text/60 text-sm">Rating</span>
            </div>
            <p className="text-lg font-bold text-text">{driver?.rating.toFixed(1)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-text/60 text-sm">Total Rides</span>
            </div>
            <p className="text-lg font-bold text-text">{driver?.total_rides}</p>
          </div>
        </div>

        {/* Online Status Toggle */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Power className="w-5 h-5 text-primary" />
              <div>
                <h3 className="font-semibold text-text">Driver Status</h3>
                <p className="text-text/60 text-sm">
                  {isOnline ? 'You are online and available' : 'You are offline'}
                </p>
              </div>
            </div>
            <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
          </div>
          
          <button
            onClick={toggleOnlineStatus}
            disabled={toggling || !isVerified}
            className={`w-full py-3 rounded-xl font-medium transition-colors ${
              isOnline 
                ? 'bg-secondary text-white hover:bg-secondary/90' 
                : 'bg-primary text-white hover:bg-primary/90'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {toggling ? 'Updating...' : (isOnline ? 'Go Offline' : 'Go Online')}
          </button>
        </div>

        {/* Available Rides */}
        {isOnline && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text">Available Rides</h3>
              {loading && (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              )}
            </div>

            {rides.length === 0 ? (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-text/60">No rides available right now</p>
                <p className="text-text/40 text-sm mt-1">New rides will appear here automatically</p>
              </div>
            ) : (
              <div className="space-y-3">
                {rides.map((ride) => (
                  <div key={ride.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm text-text/60">Pickup</span>
                        </div>
                        <p className="text-text font-medium text-sm mb-3">{ride.pickup_address}</p>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-2 h-2 rounded-full bg-secondary"></div>
                          <span className="text-sm text-text/60">Drop-off</span>
                        </div>
                        <p className="text-text font-medium text-sm">{ride.dropoff_address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">{formatCurrency(ride.estimated_fare)}</p>
                        <p className="text-xs text-text/60">{formatTime(ride.created_at)}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => acceptRide(ride.id)}
                      disabled={!isVerified}
                      className="w-full bg-primary text-white py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {!isVerified ? 'Verification Required' : 'Accept Ride'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 gap-3">
          <button
            onClick={() => navigate('/earnings')}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors"
          >
            <DollarSign className="w-5 h-5 text-primary" />
            <span className="font-medium text-text">View Earnings</span>
          </button>
        </div>
      </div>
    </div>
  )
}