-- Trigger to auto-increment click_count when a click event is inserted
CREATE OR REPLACE FUNCTION handle_link_click()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE links SET click_count = click_count + 1 WHERE id = NEW.link_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Drop trigger if it exists
DROP TRIGGER IF EXISTS link_click_increment ON link_click_events;

-- Create trigger
CREATE TRIGGER link_click_increment
AFTER INSERT ON link_click_events
FOR EACH ROW
EXECUTE FUNCTION handle_link_click();
