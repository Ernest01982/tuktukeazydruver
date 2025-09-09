/*
  # Create rides and driver locations tables

  1. New Tables
    - `rides`
      - `id` (uuid, primary key)
      - `rider_id` (uuid, references auth.users)
      - `driver_id` (uuid, references auth.users, nullable)
      - `pickup_address` (text)
      - `pickup_lat` (float8)
      - `pickup_lng` (float8)
      - `dropoff_address` (text)
      - `dropoff_lat` (float8) 
      - `dropoff_lng` (float8)
      - `estimated_fare` (numeric)
      - `final_fare` (numeric, nullable)
      - `status` (text with constraint)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `driver_locations`
      - `driver_id` (uuid, primary key references auth.users)
      - `location` (geography point)
      - `updated_at` (timestamp)

  2. Functions
    - `set_driver_location(lng, lat)` - RPC for updating driver location

  3. Security
    - Enable RLS on both tables
    - Add appropriate policies
*/

-- Rides table
CREATE TABLE IF NOT EXISTS rides (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  rider_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  driver_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  pickup_address text NOT NULL,
  pickup_lat float8 NOT NULL,
  pickup_lng float8 NOT NULL,
  dropoff_address text NOT NULL,
  dropoff_lat float8 NOT NULL,
  dropoff_lng float8 NOT NULL,
  estimated_fare numeric(10,2) NOT NULL,
  final_fare numeric(10,2),
  status text NOT NULL DEFAULT 'REQUESTED',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  CONSTRAINT valid_status CHECK (status IN ('REQUESTED', 'ASSIGNED', 'ENROUTE', 'STARTED', 'COMPLETED', 'CANCELLED'))
);

-- Driver locations table
CREATE TABLE IF NOT EXISTS driver_locations (
  driver_id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  location geography(POINT, 4326) NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE rides ENABLE ROW LEVEL SECURITY;
ALTER TABLE driver_locations ENABLE ROW LEVEL SECURITY;

-- Rides policies
CREATE POLICY "Riders can read own rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (auth.uid() = rider_id);

CREATE POLICY "Drivers can read assigned rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can read available rides"
  ON rides
  FOR SELECT
  TO authenticated
  USING (
    status = 'REQUESTED' AND 
    auth.uid() IN (SELECT id FROM drivers WHERE is_verified = true)
  );

CREATE POLICY "Drivers can update assigned rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = driver_id);

CREATE POLICY "Drivers can assign themselves to available rides"
  ON rides
  FOR UPDATE
  TO authenticated
  USING (
    status = 'REQUESTED' AND 
    auth.uid() IN (SELECT id FROM drivers WHERE is_verified = true)
  );

-- Driver locations policies
CREATE POLICY "Drivers can manage own location"
  ON driver_locations
  FOR ALL
  TO authenticated
  USING (auth.uid() = driver_id);

CREATE POLICY "Public can read driver locations for matching"
  ON driver_locations
  FOR SELECT
  TO authenticated
  USING (driver_id IN (SELECT id FROM drivers WHERE is_verified = true AND online = true));

-- Function to set driver location
CREATE OR REPLACE FUNCTION set_driver_location(lng float8, lat float8)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO driver_locations (driver_id, location, updated_at)
  VALUES (auth.uid(), ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography, now())
  ON CONFLICT (driver_id)
  DO UPDATE SET 
    location = ST_SetSRID(ST_MakePoint(lng, lat), 4326)::geography,
    updated_at = now();
END;
$$;

-- Add updated_at trigger for rides
CREATE TRIGGER update_rides_updated_at BEFORE UPDATE ON rides
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_rides_status ON rides(status);
CREATE INDEX IF NOT EXISTS idx_rides_driver_id ON rides(driver_id);
CREATE INDEX IF NOT EXISTS idx_rides_created_at ON rides(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_driver_locations_location ON driver_locations USING GIST(location);