-- Forms System Tables for CoreGuard SMS
-- Tracks daily logs, incidents, patrols, visitors, vehicles, equipment, handovers, and risk reports

-- 1. Daily Occurrence Logs
CREATE TABLE daily_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Basic Info
    log_date DATE NOT NULL,
    shift_start_time TIMESTAMPTZ NOT NULL,
    shift_end_time TIMESTAMPTZ,
    supervisor_name TEXT,
    weather TEXT,
    
    -- Shift Summary
    total_incidents INTEGER DEFAULT 0,
    equipment_issues TEXT,
    handover_notes TEXT,
    officer_signature TEXT,
    supervisor_signature TEXT,
    
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'submitted')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily Log Activity Entries (timeline events)
CREATE TABLE daily_log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_log_id UUID REFERENCES daily_logs(id) ON DELETE CASCADE,
    
    entry_time TIMESTAMPTZ NOT NULL,
    event_type TEXT NOT NULL CHECK (event_type IN ('patrol', 'incident', 'visitor', 'alarm', 'maintenance', 'suspicious_activity', 'other')),
    description TEXT NOT NULL,
    action_taken TEXT,
    reported_to TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Incident Reports
CREATE TABLE incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Basic Details
    incident_date DATE NOT NULL,
    incident_time TIMESTAMPTZ NOT NULL,
    
    -- Incident Type
    incident_type TEXT NOT NULL CHECK (incident_type IN ('theft', 'assault', 'suspicious_person', 'property_damage', 'fire_alarm', 'medical_emergency', 'trespassing', 'other')),
    
    -- Location
    location_detail TEXT NOT NULL,
    
    -- Description
    description TEXT NOT NULL,
    
    -- Actions Taken
    actions_taken JSONB DEFAULT '[]'::jsonb, -- Array of actions
    
    -- People Involved
    people_involved JSONB DEFAULT '[]'::jsonb, -- Array of {name, description, contact, role}
    
    -- Evidence
    evidence_photos JSONB DEFAULT '[]'::jsonb,
    evidence_videos JSONB DEFAULT '[]'::jsonb,
    evidence_documents JSONB DEFAULT '[]'::jsonb,
    
    -- Authorities
    police_contacted BOOLEAN DEFAULT false,
    police_reference TEXT,
    emergency_services_involved TEXT,
    
    -- Outcome
    outcome TEXT NOT NULL DEFAULT 'ongoing' CHECK (outcome IN ('resolved', 'ongoing', 'escalated')),
    
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'reviewed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Patrol Logs
CREATE TABLE patrol_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    patrol_date DATE NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Patrol Log Entries
CREATE TABLE patrol_log_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patrol_log_id UUID REFERENCES patrol_logs(id) ON DELETE CASCADE,
    
    patrol_time TIMESTAMPTZ NOT NULL,
    area_checked TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('secure', 'issue_found', 'maintenance_needed', 'incident')),
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Visitor Logs
CREATE TABLE visitor_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    visitor_name TEXT NOT NULL,
    company TEXT,
    purpose_of_visit TEXT NOT NULL,
    person_visiting TEXT,
    time_in TIMESTAMPTZ NOT NULL,
    time_out TIMESTAMPTZ,
    vehicle_registration TEXT,
    id_checked BOOLEAN DEFAULT false,
    badge_issued BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Vehicle Logs
CREATE TABLE vehicle_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    vehicle_registration TEXT NOT NULL,
    driver_name TEXT NOT NULL,
    company TEXT,
    purpose TEXT NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    departure_time TIMESTAMPTZ,
    parking_location TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Key Register
CREATE TABLE key_register (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    key_id TEXT NOT NULL,
    key_description TEXT NOT NULL,
    issued_to TEXT NOT NULL,
    time_issued TIMESTAMPTZ NOT NULL,
    time_returned TIMESTAMPTZ,
    signature TEXT,
    
    status TEXT NOT NULL DEFAULT 'issued' CHECK (status IN ('issued', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Equipment Checks
CREATE TABLE equipment_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    check_date DATE NOT NULL,
    check_time TIMESTAMPTZ NOT NULL,
    
    -- Equipment Status
    radio_status TEXT CHECK (radio_status IN ('pass', 'fail', 'not_available')),
    body_camera_status TEXT CHECK (body_camera_status IN ('pass', 'fail', 'not_available')),
    torch_status TEXT CHECK (torch_status IN ('pass', 'fail', 'not_available')),
    ppe_status TEXT CHECK (ppe_status IN ('pass', 'fail', 'not_available')),
    vehicle_status TEXT CHECK (vehicle_status IN ('pass', 'fail', 'not_available')),
    other_equipment JSONB DEFAULT '[]'::jsonb, -- Array of {item, status, notes}
    
    notes TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Site Handovers
CREATE TABLE site_handovers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    
    handover_date DATE NOT NULL,
    handover_time TIMESTAMPTZ NOT NULL,
    
    shift_ending_employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    shift_starting_employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Handover Notes
    incidents_during_shift TEXT,
    open_issues TEXT,
    equipment_status TEXT,
    special_instructions TEXT,
    
    -- Signatures
    officer_handing_over_signature TEXT,
    officer_taking_over_signature TEXT,
    
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Risk Observation Reports
CREATE TABLE risk_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organisation_id UUID REFERENCES organisations(id) ON DELETE CASCADE,
    site_id UUID REFERENCES sites(id) ON DELETE CASCADE,
    shift_id UUID REFERENCES shifts(id) ON DELETE CASCADE,
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    
    report_date DATE NOT NULL,
    report_time TIMESTAMPTZ NOT NULL,
    
    location_detail TEXT NOT NULL,
    hazard_type TEXT NOT NULL,
    description TEXT NOT NULL,
    risk_level TEXT NOT NULL CHECK (risk_level IN ('low', 'medium', 'high', 'critical')),
    immediate_action_taken TEXT,
    
    photos JSONB DEFAULT '[]'::jsonb,
    
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_daily_logs_site ON daily_logs(site_id);
CREATE INDEX idx_daily_logs_shift ON daily_logs(shift_id);
CREATE INDEX idx_daily_logs_employee ON daily_logs(employee_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(log_date);
CREATE INDEX idx_daily_logs_organisation ON daily_logs(organisation_id);

CREATE INDEX idx_daily_log_entries_log ON daily_log_entries(daily_log_id);
CREATE INDEX idx_daily_log_entries_time ON daily_log_entries(entry_time);

CREATE INDEX idx_incident_reports_site ON incident_reports(site_id);
CREATE INDEX idx_incident_reports_shift ON incident_reports(shift_id);
CREATE INDEX idx_incident_reports_employee ON incident_reports(employee_id);
CREATE INDEX idx_incident_reports_date ON incident_reports(incident_date);
CREATE INDEX idx_incident_reports_type ON incident_reports(incident_type);
CREATE INDEX idx_incident_reports_organisation ON incident_reports(organisation_id);

CREATE INDEX idx_patrol_logs_site ON patrol_logs(site_id);
CREATE INDEX idx_patrol_logs_shift ON patrol_logs(shift_id);
CREATE INDEX idx_patrol_logs_date ON patrol_logs(patrol_date);
CREATE INDEX idx_patrol_logs_organisation ON patrol_logs(organisation_id);

CREATE INDEX idx_patrol_log_entries_log ON patrol_log_entries(patrol_log_id);

CREATE INDEX idx_visitor_logs_site ON visitor_logs(site_id);
CREATE INDEX idx_visitor_logs_time_in ON visitor_logs(time_in);
CREATE INDEX idx_visitor_logs_organisation ON visitor_logs(organisation_id);

CREATE INDEX idx_vehicle_logs_site ON vehicle_logs(site_id);
CREATE INDEX idx_vehicle_logs_registration ON vehicle_logs(vehicle_registration);
CREATE INDEX idx_vehicle_logs_organisation ON vehicle_logs(organisation_id);

CREATE INDEX idx_key_register_site ON key_register(site_id);
CREATE INDEX idx_key_register_status ON key_register(status);
CREATE INDEX idx_key_register_organisation ON key_register(organisation_id);

CREATE INDEX idx_equipment_checks_site ON equipment_checks(site_id);
CREATE INDEX idx_equipment_checks_shift ON equipment_checks(shift_id);
CREATE INDEX idx_equipment_checks_date ON equipment_checks(check_date);
CREATE INDEX idx_equipment_checks_organisation ON equipment_checks(organisation_id);

CREATE INDEX idx_site_handovers_site ON site_handovers(site_id);
CREATE INDEX idx_site_handovers_date ON site_handovers(handover_date);
CREATE INDEX idx_site_handovers_organisation ON site_handovers(organisation_id);

CREATE INDEX idx_risk_reports_site ON risk_reports(site_id);
CREATE INDEX idx_risk_reports_risk_level ON risk_reports(risk_level);
CREATE INDEX idx_risk_reports_status ON risk_reports(status);
CREATE INDEX idx_risk_reports_organisation ON risk_reports(organisation_id);

-- Triggers for updated_at
CREATE TRIGGER update_daily_logs_updated_at BEFORE UPDATE ON daily_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_log_entries_updated_at BEFORE UPDATE ON daily_log_entries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patrol_logs_updated_at BEFORE UPDATE ON patrol_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visitor_logs_updated_at BEFORE UPDATE ON visitor_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_logs_updated_at BEFORE UPDATE ON vehicle_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_key_register_updated_at BEFORE UPDATE ON key_register
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_equipment_checks_updated_at BEFORE UPDATE ON equipment_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_site_handovers_updated_at BEFORE UPDATE ON site_handovers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_risk_reports_updated_at BEFORE UPDATE ON risk_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
