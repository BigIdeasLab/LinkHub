-- Create profiles table
CREATE TABLE profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(255) UNIQUE NOT NULL,
  display_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(2048),
  theme_settings JSONB DEFAULT '{"theme":"minimal"}',
  custom_domain VARCHAR(255),
  plan VARCHAR(50) DEFAULT 'free',
  onboarded BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create links table
CREATE TABLE links (
  id BIGSERIAL PRIMARY KEY,
  profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(2048) NOT NULL,
  platform VARCHAR(100),
  icon_type VARCHAR(50) DEFAULT 'platform',
  custom_icon_url VARCHAR(2048),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  click_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create link_click_events table (raw events)
CREATE TABLE link_click_events (
  id BIGSERIAL PRIMARY KEY,
  link_id BIGINT NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create link_clicks table (aggregated by date/hour)
CREATE TABLE link_clicks (
  id BIGSERIAL PRIMARY KEY,
  link_id BIGINT NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  click_date DATE NOT NULL,
  hour INT NOT NULL,
  total_clicks INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(link_id, click_date, hour)
);

-- Create page_view_events table (raw events)
CREATE TABLE page_view_events (
  id BIGSERIAL PRIMARY KEY,
  profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  user_agent VARCHAR(2048),
  referrer VARCHAR(2048),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create page_views table (aggregated by date)
CREATE TABLE page_views (
  id BIGSERIAL PRIMARY KEY,
  profile_id BIGINT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  view_date DATE NOT NULL,
  total_views INT DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(profile_id, view_date)
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_view_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "Users can read own profile" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can read public profiles" ON profiles
  FOR SELECT USING (true);

-- Links RLS policies
CREATE POLICY "Users can read own links" ON links
  FOR SELECT USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own links" ON links
  FOR ALL USING (
    profile_id IN (
      SELECT id FROM profiles WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Service role can manage links" ON links
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Anyone can read active public links" ON links
  FOR SELECT USING (is_active = true);

-- Click events RLS policies
CREATE POLICY "Anyone can insert click events" ON link_click_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage click events" ON link_click_events
  FOR ALL USING (auth.role() = 'service_role');

-- Link clicks aggregated RLS policies
CREATE POLICY "Service role can manage link clicks" ON link_clicks
  FOR ALL USING (auth.role() = 'service_role');

-- Page view events RLS policies
CREATE POLICY "Anyone can insert page view events" ON page_view_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can manage page view events" ON page_view_events
  FOR ALL USING (auth.role() = 'service_role');

-- Page views aggregated RLS policies
CREATE POLICY "Service role can manage page views" ON page_views
  FOR ALL USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_username ON profiles(username);
CREATE INDEX idx_links_profile_id ON links(profile_id);
CREATE INDEX idx_links_is_active ON links(is_active);
CREATE INDEX idx_link_click_events_link_id ON link_click_events(link_id);
CREATE INDEX idx_link_click_events_timestamp ON link_click_events(timestamp);
CREATE INDEX idx_link_clicks_link_id ON link_clicks(link_id);
CREATE INDEX idx_link_clicks_date ON link_clicks(click_date);
CREATE INDEX idx_page_view_events_profile_id ON page_view_events(profile_id);
CREATE INDEX idx_page_view_events_timestamp ON page_view_events(timestamp);
CREATE INDEX idx_page_views_profile_id ON page_views(profile_id);
CREATE INDEX idx_page_views_date ON page_views(view_date);
