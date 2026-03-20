-- Enable Row Level Security on all tables
ALTER TABLE organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_pin_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE licences ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE compliance_flags ENABLE ROW LEVEL SECURITY;

-- Helper function to get current user's organisation_id
CREATE OR REPLACE FUNCTION public.user_organisation_id()
RETURNS UUID AS $$
    SELECT organisation_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to check if user is company admin
CREATE OR REPLACE FUNCTION public.is_company_admin()
RETURNS BOOLEAN AS $$
    SELECT role = 'company_admin' FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function to get current user's employee_id
CREATE OR REPLACE FUNCTION public.user_employee_id()
RETURNS UUID AS $$
    SELECT id FROM public.employees WHERE user_id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Organisations policies
CREATE POLICY "Users can view their own organisation"
    ON organisations FOR SELECT
    USING (id = public.user_organisation_id());

CREATE POLICY "Company admins can update their organisation"
    ON organisations FOR UPDATE
    USING (id = public.user_organisation_id() AND public.is_company_admin());

-- Users policies
CREATE POLICY "Users can view users in their organisation"
    ON users FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Company admins can insert users in their organisation"
    ON users FOR INSERT
    WITH CHECK (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Company admins can update users in their organisation"
    ON users FOR UPDATE
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Employees policies
CREATE POLICY "Users can view employees in their organisation"
    ON employees FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Company admins can insert employees"
    ON employees FOR INSERT
    WITH CHECK (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Company admins can update employees"
    ON employees FOR UPDATE
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Employees can update their own record"
    ON employees FOR UPDATE
    USING (user_id = auth.uid());

-- Sites policies
CREATE POLICY "Users can view sites in their organisation"
    ON sites FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Company admins can insert sites"
    ON sites FOR INSERT
    WITH CHECK (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Company admins can update sites"
    ON sites FOR UPDATE
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Company admins can delete sites"
    ON sites FOR DELETE
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Site PIN access policies
CREATE POLICY "Users can view site access logs in their organisation"
    ON site_pin_access FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM sites s
            WHERE s.id = site_pin_access.site_id
            AND s.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Employees can insert their own site access logs"
    ON site_pin_access FOR INSERT
    WITH CHECK (employee_id = public.user_employee_id());

-- Training records policies
CREATE POLICY "Users can view training records in their organisation"
    ON training_records FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = training_records.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Company admins can insert training records"
    ON training_records FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = training_records.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

CREATE POLICY "Company admins can update training records"
    ON training_records FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = training_records.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

-- Licences policies
CREATE POLICY "Users can view licences in their organisation"
    ON licences FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = licences.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Company admins can insert licences"
    ON licences FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = licences.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

CREATE POLICY "Company admins can update licences"
    ON licences FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = licences.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

-- Availability policies
CREATE POLICY "Users can view availability in their organisation"
    ON availability FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = availability.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Employees can manage their own availability"
    ON availability FOR ALL
    USING (employee_id = public.user_employee_id())
    WITH CHECK (employee_id = public.user_employee_id());

CREATE POLICY "Company admins can manage all availability"
    ON availability FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = availability.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

-- Shifts policies
CREATE POLICY "Users can view shifts in their organisation"
    ON shifts FOR SELECT
    USING (organisation_id = public.user_organisation_id());

CREATE POLICY "Company admins can insert shifts"
    ON shifts FOR INSERT
    WITH CHECK (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Company admins can update shifts"
    ON shifts FOR UPDATE
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

CREATE POLICY "Company admins can delete shifts"
    ON shifts FOR DELETE
    USING (organisation_id = public.user_organisation_id() AND public.is_company_admin());

-- Shift assignments policies
CREATE POLICY "Users can view shift assignments in their organisation"
    ON shift_assignments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM shifts s
            WHERE s.id = shift_assignments.shift_id
            AND s.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Company admins can manage shift assignments"
    ON shift_assignments FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM shifts s
            WHERE s.id = shift_assignments.shift_id
            AND s.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );

CREATE POLICY "Employees can update their own shift assignments"
    ON shift_assignments FOR UPDATE
    USING (employee_id = public.user_employee_id());

-- Compliance flags policies
CREATE POLICY "Users can view compliance flags in their organisation"
    ON compliance_flags FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = compliance_flags.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
    );

CREATE POLICY "Company admins can manage compliance flags"
    ON compliance_flags FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM employees e
            WHERE e.id = compliance_flags.employee_id
            AND e.organisation_id = public.user_organisation_id()
        )
        AND public.is_company_admin()
    );
