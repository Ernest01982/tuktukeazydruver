import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types
export interface Profile {
  id: string
  email: string
  role: 'rider' | 'driver' | 'admin'
  created_at: string
  updated_at: string
}

export interface Driver {
  id: string
  name: string
  phone?: string
  license_number?: string
  vehicle_type: string
  vehicle_plate?: string
  is_verified: boolean
  online: boolean
  rating: number
  total_rides: number
  created_at: string
  updated_at: string
}

export interface Ride {
  id: string
  rider_id: string
  driver_id?: string
  pickup_address: string
  pickup_lat: number
  pickup_lng: number
  dropoff_address: string
  dropoff_lat: number
  dropoff_lng: number
  estimated_fare: number
  final_fare?: number
  status: 'REQUESTED' | 'ASSIGNED' | 'ENROUTE' | 'STARTED' | 'COMPLETED' | 'CANCELLED'
  created_at: string
  updated_at: string
}

export interface DriverLocation {
  driver_id: string
  location: {
    type: 'Point'
    coordinates: [number, number]
  }
  updated_at: string
}