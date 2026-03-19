-- Insert test organisation
INSERT INTO organisations (id, name, industry, contact_email, organisation_pin)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'SecureGuard Services',
    'Security Services',
    'admin@secureguard.com',
    '123456'
);

-- Insert test users (passwords are hashed 'password123')
INSERT INTO users (id, email, password_hash, role, organisation_id)
VALUES 
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'admin@secureguard.com', '$2a$10$YourHashedPasswordHere', 'company_admin', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'john.smith@secureguard.com', '$2a$10$YourHashedPasswordHere', 'employee', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'sarah.johnson@secureguard.com', '$2a$10$YourHashedPasswordHere', 'employee', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'michael.brown@secureguard.com', '$2a$10$YourHashedPasswordHere', 'employee', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'emily.davis@secureguard.com', '$2a$10$YourHashedPasswordHere', 'employee', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Insert test employees
INSERT INTO employees (id, user_id, organisation_id, first_name, last_name, phone, role, status, emergency_contact)
VALUES 
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'John', 'Smith', '+1-555-0101', 'Security Guard', 'active', 'Jane Smith: +1-555-0102'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Sarah', 'Johnson', '+1-555-0201', 'Senior Security Guard', 'active', 'Mike Johnson: +1-555-0202'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Michael', 'Brown', '+1-555-0301', 'Security Supervisor', 'active', 'Lisa Brown: +1-555-0302'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Emily', 'Davis', '+1-555-0401', 'Security Guard', 'active', 'Tom Davis: +1-555-0402');

-- Insert test sites
INSERT INTO sites (id, organisation_id, name, address, contact_name, contact_phone, site_pin, requirements)
VALUES 
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Downtown Office Complex', '123 Main St, Downtown, NY 10001', 'Robert Martinez', '+1-555-1001', '654321', 
     '{"requiredTraining": ["Basic Security Training", "Fire Safety"], "requiredLicences": ["Security Guard License"]}'::jsonb),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Riverside Shopping Mall', '456 River Rd, Riverside, NY 10002', 'Jennifer Lee', '+1-555-1002', '789012',
     '{"requiredTraining": ["Basic Security Training", "Customer Service", "Emergency Response"], "requiredLicences": ["Security Guard License"]}'::jsonb),
    ('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Tech Park Building A', '789 Innovation Dr, Tech Park, NY 10003', 'Alex Chen', '+1-555-1003', '345678',
     '{"requiredTraining": ["Basic Security Training", "Access Control Systems"], "requiredLicences": ["Security Guard License", "Technology Security Clearance"]}'::jsonb);

-- Insert test training records
INSERT INTO training_records (employee_id, training_type, certification_name, issue_date, expiry_date, status)
VALUES 
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Certification', 'Basic Security Training', '2024-01-15', '2025-01-15', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Certification', 'Fire Safety', '2024-01-20', '2025-01-20', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Certification', 'Basic Security Training', '2024-01-20', '2025-01-20', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Certification', 'Emergency Response', '2024-02-01', '2024-04-15', 'expiring_soon'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Certification', 'Basic Security Training', '2024-02-01', '2025-02-01', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Certification', 'Access Control Systems', '2024-02-05', '2025-02-05', 'active');

-- Insert test licences
INSERT INTO licences (employee_id, licence_type, licence_number, issue_date, expiry_date, status)
VALUES 
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Security Guard License', 'SG-2024-001', '2024-01-10', '2026-01-10', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Security Guard License', 'SG-2024-002', '2024-01-15', '2026-01-15', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Security Guard License', 'SG-2024-003', '2024-01-25', '2026-01-25', 'active'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Technology Security Clearance', 'TSC-2024-001', '2024-02-01', '2025-02-01', 'active');

-- Insert test shifts
INSERT INTO shifts (id, organisation_id, site_id, start_time, end_time, break_duration, required_roles, required_training, required_licences, status, created_by)
VALUES 
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 
     '2024-03-20 08:00:00+00', '2024-03-20 16:00:00+00', 30,
     '[{"role": "Security Guard", "count": 2}]'::jsonb,
     '["Basic Security Training", "Fire Safety"]'::jsonb,
     '["Security Guard License"]'::jsonb,
     'published', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12',
     '2024-03-21 10:00:00+00', '2024-03-21 18:00:00+00', 30,
     '[{"role": "Security Guard", "count": 3}, {"role": "Security Supervisor", "count": 1}]'::jsonb,
     '["Basic Security Training", "Customer Service"]'::jsonb,
     '["Security Guard License"]'::jsonb,
     'published', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13',
     '2024-03-22 06:00:00+00', '2024-03-22 14:00:00+00', 30,
     '[{"role": "Security Guard", "count": 1}]'::jsonb,
     '["Basic Security Training", "Access Control Systems"]'::jsonb,
     '["Security Guard License", "Technology Security Clearance"]'::jsonb,
     'draft', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11');

-- Insert test shift assignments
INSERT INTO shift_assignments (shift_id, employee_id, assigned_role, check_in_time, status)
VALUES 
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Security Guard', '2024-03-20 07:55:00+00', 'checked_in'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Security Guard', NULL, 'assigned'),
    ('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Security Supervisor', NULL, 'assigned');

-- Insert test compliance flags
INSERT INTO compliance_flags (employee_id, flag_type, severity, description, resolved)
VALUES 
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'expiring_cert', 'medium', 'Emergency Response certification expiring in 30 days', false),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'missing_training', 'high', 'Missing required Fire Safety training', false);

-- Insert test availability
INSERT INTO availability (employee_id, date, is_available, notes)
VALUES 
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-03-20', true, NULL),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2024-03-21', false, 'Personal appointment'),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-03-20', true, NULL),
    ('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2024-03-21', true, NULL);
