-- Drop existing function if it exists
DROP FUNCTION IF EXISTS increment_link_clicks(BIGINT);

-- Function to increment link clicks
CREATE OR REPLACE FUNCTION increment_link_clicks(link_id BIGINT)
RETURNS void AS $$
BEGIN
  -- Increment click count on links table
  UPDATE links SET click_count = click_count + 1 WHERE id = link_id;
  
  -- Insert or update aggregated clicks by date/hour
  INSERT INTO link_clicks (link_id, click_date, hour, total_clicks)
  VALUES (link_id, CURRENT_DATE, EXTRACT(HOUR FROM NOW())::INT, 1)
  ON CONFLICT (link_id, click_date, hour)
  DO UPDATE SET total_clicks = link_clicks.total_clicks + 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
