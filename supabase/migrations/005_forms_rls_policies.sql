-- Row-Level Security Policies for Forms Tables

-- Enable RLS on all forms tables
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrol_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE patrol_log_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicle_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE key_register ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_reports ENABLE ROW LEVEL SECURITY;

-- Daily Logs Policies
CREATE POLICY "Users can view daily logs in their organisation"
    ON daily_logs FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create daily logs"
    ON daily_logs FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own daily logs"
    ON daily_logs FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all daily logs"
    ON daily_logs FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Daily Log Entries Policies
CREATE POLICY "Users can view daily log entries in their organisation"
    ON daily_log_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM daily_logs dl
            WHERE dl.id = daily_log_entries.daily_log_id
            AND dl.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Employees can manage entries in their daily logs"
    ON daily_log_entries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM daily_logs dl
            WHERE dl.id = daily_log_entries.daily_log_id
            AND dl.employee_id = public.user_employee_id()
        )
    );

CREATE POLICY "Company admins can manage all daily log entries"
    ON daily_log_entries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM daily_logs dl
            WHERE dl.id = daily_log_entries.daily_log_id
            AND dl.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

-- Incident Reports Policies
CREATE POLICY "Users can view incident reports in their organisation"
    ON incident_reports FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create incident reports"
    ON incident_reports FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own incident reports"
    ON incident_reports FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all incident reports"
    ON incident_reports FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Patrol Logs Policies
CREATE POLICY "Users can view patrol logs in their organisation"
    ON patrol_logs FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create patrol logs"
    ON patrol_logs FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own patrol logs"
    ON patrol_logs FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all patrol logs"
    ON patrol_logs FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Patrol Log Entries Policies
CREATE POLICY "Users can view patrol log entries in their organisation"
    ON patrol_log_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM patrol_logs pl
            WHERE pl.id = patrol_log_entries.patrol_log_id
            AND pl.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Employees can manage entries in their patrol logs"
    ON patrol_log_entries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM patrol_logs pl
            WHERE pl.id = patrol_log_entries.patrol_log_id
            AND pl.employee_id = public.user_employee_id()
        )
    );

CREATE POLICY "Company admins can manage all patrol log entries"
    ON patrol_log_entries FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM patrol_logs pl
            WHERE pl.id = patrol_log_entries.patrol_log_id
            AND pl.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

-- Visitor Logs Policies
CREATE POLICY "Users can view visitor logs in their organisation"
    ON visitor_logs FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create visitor logs"
    ON visitor_logs FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own visitor logs"
    ON visitor_logs FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all visitor logs"
    ON visitor_logs FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Vehicle Logs Policies
CREATE POLICY "Users can view vehicle logs in their organisation"
    ON vehicle_logs FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create vehicle logs"
    ON vehicle_logs FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own vehicle logs"
    ON vehicle_logs FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all vehicle logs"
    ON vehicle_logs FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Key Register Policies
CREATE POLICY "Users can view key register in their organisation"
    ON key_register FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create key register entries"
    ON key_register FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own key register entries"
    ON key_register FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all key register entries"
    ON key_register FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Equipment Checks Policies
CREATE POLICY "Users can view equipment checks in their organisation"
    ON equipment_checks FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create equipment checks"
    ON equipment_checks FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own equipment checks"
    ON equipment_checks FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all equipment checks"
    ON equipment_checks FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Site Handovers Policies
CREATE POLICY "Users can view site handovers in their organisation"
    ON site_handovers FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create site handovers"
    ON site_handovers FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND (shift_ending_employee_id = public.user_employee_id() OR shift_starting_employee_id = public.user_employee_id())
    );

CREATE POLICY "Employees can update handovers they are involved in"
    ON site_handovers FOR UPDATE
    USING (
        shift_ending_employee_id = public.user_employee_id() 
        OR shift_starting_employee_id = public.user_employee_id()
    );

CREATE POLICY "Company admins can manage all site handovers"
    ON site_handovers FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Risk Reports Policies
CREATE POLICY "Users can view risk reports in their organisation"
    ON risk_reports FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Employees can create risk reports"
    ON risk_reports FOR INSERT
    WITH CHECK (
        organisation_id = public.user_organisation_id()
        AND employee_id = public.user_employee_id()
    );

CREATE POLICY "Employees can update their own risk reports"
    ON risk_reports FOR UPDATE
    USING (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all risk reports"
    ON risk_reports FOR ALL
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());
