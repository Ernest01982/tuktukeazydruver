import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, DollarSign, TrendingUp, Calendar } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import { formatCurrency } from '../lib/utils'

interface EarningsData {
  totalEarnings: number
  completedRides: number
  averageEarning: number
}

export function EarningsPage() {
  const navigate = useNavigate()
  const { driver } = useAuth()
  const [earningsData, setEarningsData] = useState<EarningsData>({
    totalEarnings: 0,
    completedRides: 0,
    averageEarning: 0
  })
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEarnings()
  }, [period, driver?.id])

  const loadEarnings = async () => {
    if (!driver?.id) return

    setLoading(true)
    try {
      let query = supabase
        .from('rides')
        .select('final_fare, estimated_fare, created_at')
        .eq('driver_id', driver.id)
        .eq('status', 'COMPLETED')

      // Add date filters
      const now = new Date()
      let startDate: Date | null = null

      switch (period) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
      }

      if (startDate) {
        query = query.gte('created_at', startDate.toISOString())
      }

      const { data, error } = await query

      if (error) throw error

      const rides = data || []
      const totalEarnings = rides.reduce((sum, ride) => {
        return sum + (ride.final_fare || ride.estimated_fare || 0)
      }, 0)

      setEarningsData({
        totalEarnings,
        completedRides: rides.length,
        averageEarning: rides.length > 0 ? totalEarnings / rides.length : 0
      })
    } catch (error) {
      console.error('Error loading earnings:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPeriodLabel = (p: typeof period) => {
    switch (p) {
      case 'today': return 'Today'
      case 'week': return 'This Week'
      case 'month': return 'This Month'
      case 'all': return 'All Time'
    }
  }

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
            <div>
              <h1 className="text-lg font-semibold text-text">Earnings</h1>
              <p className="text-text/60 text-sm">Track your income</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Period Filter */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-primary" />
            <span className="font-medium text-text">Time Period</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(['today', 'week', 'month', 'all'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-text hover:bg-gray-200'
                }`}
              >
                {getPeriodLabel(p)}
              </button>
            ))}
          </div>
        </div>

        {/* Earnings Summary */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Main Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-full mb-3">
                  <DollarSign className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-text mb-1">
                  {formatCurrency(earningsData.totalEarnings)}
                </h2>
                <p className="text-text/60">{getPeriodLabel(period)} Earnings</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <TrendingUp className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-lg font-bold text-text">{earningsData.completedRides}</p>
                    <p className="text-text/60 text-sm">Completed Rides</p>
                  </div>
                </div>
                <div className="text-center">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <DollarSign className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-lg font-bold text-text">
                      {formatCurrency(earningsData.averageEarning)}
                    </p>
                    <p className="text-text/60 text-sm">Avg per Ride</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <h3 className="font-semibold text-text mb-3">Performance</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-text/60 text-sm">Total Lifetime Rides</span>
                  <span className="font-medium text-text">{driver?.total_rides}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text/60 text-sm">Driver Rating</span>
                  <span className="font-medium text-text">{driver?.rating.toFixed(1)} ⭐</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text/60 text-sm">Account Status</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    driver?.is_verified ? 'bg-green-100 text-green-800' : 'bg-accent text-text'
                  }`}>
                    {driver?.is_verified ? 'Verified' : 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {earningsData.totalEarnings === 0 && (
              <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="font-semibold text-text mb-2">No earnings yet</h3>
                <p className="text-text/60 text-sm">
                  Complete your first ride to start earning!
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}