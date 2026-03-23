-- Users table with authentication and medical information
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('citizen', 'responder')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Medical profiles for citizens
CREATE TABLE IF NOT EXISTS medical_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  imss_number VARCHAR(50),
  blood_type VARCHAR(5) CHECK (blood_type IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  allergies TEXT,
  medical_conditions TEXT,
  emergency_contact_name VARCHAR(255),
  emergency_contact_phone VARCHAR(20),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Emergency responders (police, private security)
CREATE TABLE IF NOT EXISTS responders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  organization_name VARCHAR(255) NOT NULL,
  responder_type VARCHAR(20) NOT NULL CHECK (responder_type IN ('police', 'private_security', 'medical')),
  badge_number VARCHAR(50),
  service_area TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Emergency alerts
CREATE TABLE IF NOT EXISTS alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  alert_type VARCHAR(30) NOT NULL CHECK (alert_type IN ('manual', 'fall_detection', 'heart_rate', 'sos')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'responding', 'resolved', 'cancelled')),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  location_address TEXT,
  message TEXT,
  responder_id UUID REFERENCES responders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Smartwatch data monitoring
CREATE TABLE IF NOT EXISTS smartwatch_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  heart_rate INTEGER,
  steps INTEGER,
  fall_detected BOOLEAN DEFAULT FALSE,
  movement_intensity VARCHAR(20) CHECK (movement_intensity IN ('low', 'moderate', 'high', 'sudden')),
  battery_level INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alert responses
CREATE TABLE IF NOT EXISTS alert_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
  responder_id UUID REFERENCES responders(id) ON DELETE CASCADE,
  response_type VARCHAR(20) CHECK (response_type IN ('acknowledged', 'en_route', 'arrived', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_user_id ON alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_created_at ON alerts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_smartwatch_user_id ON smartwatch_data(user_id);
CREATE INDEX IF NOT EXISTS idx_smartwatch_recorded_at ON smartwatch_data(recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_responders_type ON responders(responder_type);
CREATE INDEX IF NOT EXISTS idx_responders_active ON responders(is_active);
