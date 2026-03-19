-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Organisations table
CREATE TABLE organisations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    industry TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    organisation_pin TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table (extends Better Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('company_admin', 'employee')),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Employees table
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    emergency_contact TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sites table
CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    site_pin TEXT NOT NULL,
    requirements JSONB DEFAULT '{"requiredTraining": [], "requiredLicences": []}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Site PIN access log
CREATE TABLE site_pin_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    pin_entered TEXT NOT NULL,
    access_granted BOOLEAN NOT NULL,
    accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Training records
CREATE TABLE training_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    training_type TEXT NOT NULL,
    certification_name TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'expiring_soon')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Licences
CREATE TABLE licences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    licence_type TEXT NOT NULL,
    licence_number TEXT NOT NULL,
    issue_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    document_url TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'expiring_soon')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Availability
CREATE TABLE availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT true,
    recurring_pattern JSONB,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Shifts
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    break_duration INTEGER NOT NULL DEFAULT 0,
    required_roles JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_training JSONB NOT NULL DEFAULT '[]'::jsonb,
    required_licences JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'in_progress', 'completed', 'cancelled')),
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shift assignments
CREATE TABLE shift_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    assigned_role TEXT NOT NULL,
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'checked_in', 'checked_out', 'no_show')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(shift_id, employee_id)
);

-- Compliance flags
CREATE TABLE compliance_flags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    flag_type TEXT NOT NULL CHECK (flag_type IN ('expiring_cert', 'missing_training', 'access_violation', 'other')),
    severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    resolved BOOLEAN NOT NULL DEFAULT false,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_users_organisation ON users(organisation_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_employees_user ON employees(user_id);
CREATE INDEX idx_employees_organisation ON employees(organisation_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_sites_organisation ON sites(organisation_id);
CREATE INDEX idx_training_employee ON training_records(employee_id);
CREATE INDEX idx_training_expiry ON training_records(expiry_date);
CREATE INDEX idx_licences_employee ON licences(employee_id);
CREATE INDEX idx_licences_expiry ON licences(expiry_date);
CREATE INDEX idx_availability_employee ON availability(employee_id);
CREATE INDEX idx_availability_date ON availability(date);
CREATE INDEX idx_shifts_organisation ON shifts(organisation_id);
CREATE INDEX idx_shifts_site ON shifts(site_id);
CREATE INDEX idx_shifts_status ON shifts(status);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
CREATE INDEX idx_shift_assignments_shift ON shift_assignments(shift_id);
CREATE INDEX idx_shift_assignments_employee ON shift_assignments(employee_id);
CREATE INDEX idx_compliance_employee ON compliance_flags(employee_id);
CREATE INDEX idx_compliance_resolved ON compliance_flags(resolved);

-- Function to generate organisation PIN
CREATE OR REPLACE FUNCTION generate_organisation_pin()
RETURNS TEXT AS $$
DECLARE
    new_pin TEXT;
    pin_exists BOOLEAN;
BEGIN
    LOOP
        new_pin := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
        SELECT EXISTS(SELECT 1 FROM organisations WHERE organisation_pin = new_pin) INTO pin_exists;
        EXIT WHEN NOT pin_exists;
    END LOOP;
    RETURN new_pin;
END;
$$ LANGUAGE plpgsql;

-- Function to generate site PIN
CREATE OR REPLACE FUNCTION generate_site_pin()
RETURNS TEXT AS $$
BEGIN
    RETURN LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all tables
CREATE TRIGGER update_organisations_updated_at BEFORE UPDATE ON organisations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sites_updated_at BEFORE UPDATE ON sites
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_records_updated_at BEFORE UPDATE ON training_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_licences_updated_at BEFORE UPDATE ON licences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_availability_updated_at BEFORE UPDATE ON availability
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shift_assignments_updated_at BEFORE UPDATE ON shift_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_compliance_flags_updated_at BEFORE UPDATE ON compliance_flags
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to check expiring certifications and create flags
CREATE OR REPLACE FUNCTION check_expiring_certifications()
RETURNS void AS $$
BEGIN
    -- Flag certifications expiring in 30 days
    INSERT INTO compliance_flags (employee_id, flag_type, severity, description)
    SELECT 
        employee_id,
        'expiring_cert',
        CASE 
            WHEN expiry_date - CURRENT_DATE <= 7 THEN 'high'
            WHEN expiry_date - CURRENT_DATE <= 14 THEN 'medium'
            ELSE 'low'
        END,
        'Certification "' || certification_name || '" expires on ' || expiry_date::TEXT
    FROM training_records
    WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        AND status = 'active'
        AND NOT EXISTS (
            SELECT 1 FROM compliance_flags cf
            WHERE cf.employee_id = training_records.employee_id
                AND cf.flag_type = 'expiring_cert'
                AND cf.description LIKE '%' || training_records.certification_name || '%'
                AND cf.resolved = false
        );

    -- Flag licences expiring in 30 days
    INSERT INTO compliance_flags (employee_id, flag_type, severity, description)
    SELECT 
        employee_id,
        'expiring_cert',
        CASE 
            WHEN expiry_date - CURRENT_DATE <= 7 THEN 'high'
            WHEN expiry_date - CURRENT_DATE <= 14 THEN 'medium'
            ELSE 'low'
        END,
        'Licence "' || licence_type || '" expires on ' || expiry_date::TEXT
    FROM licences
    WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        AND status = 'active'
        AND NOT EXISTS (
            SELECT 1 FROM compliance_flags cf
            WHERE cf.employee_id = licences.employee_id
                AND cf.flag_type = 'expiring_cert'
                AND cf.description LIKE '%' || licences.licence_type || '%'
                AND cf.resolved = false
        );
END;
$$ LANGUAGE plpgsql;
