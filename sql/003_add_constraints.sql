-- Add constraints to enforce data integrity

-- 1. Ensure user name is not empty or just whitespace
ALTER TABLE users ADD CONSTRAINT check_user_name_not_empty CHECK (length(trim(name)) > 0);

-- 2. Ensure task title is not empty or just whitespace
ALTER TABLE tasks ADD CONSTRAINT check_task_title_not_empty CHECK (length(trim(title)) > 0);

-- 3. Ensure due_date is not in the past (optional, but good for some apps)
-- ALTER TABLE tasks ADD CONSTRAINT check_due_date_future CHECK (due_date >= CURRENT_DATE);
