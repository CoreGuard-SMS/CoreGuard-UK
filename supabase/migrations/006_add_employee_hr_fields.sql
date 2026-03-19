-- Add HR fields to employees table
ALTER TABLE employees 
ADD COLUMN email TEXT,
ADD COLUMN department TEXT,
ADD COLUMN emergency_phone TEXT,
ADD COLUMN employee_id TEXT,
ADD COLUMN start_date DATE,
ADD COLUMN salary_type TEXT DEFAULT 'salary',
ADD COLUMN salary TEXT,
ADD COLUMN contracted_hours TEXT,
ADD COLUMN employment_type TEXT DEFAULT 'Full Time',
ADD COLUMN work_schedule TEXT DEFAULT '8',
ADD COLUMN manager TEXT,
ADD COLUMN location TEXT,
ADD COLUMN sites TEXT; -- JSON array of site IDs

-- Update existing employees to have default values
UPDATE employees 
SET 
  salary_type = 'salary',
  employment_type = 'Full Time', 
  work_schedule = '8',
  status = 'active'
WHERE salary_type IS NULL OR employment_type IS NULL OR work_schedule IS NULL;
