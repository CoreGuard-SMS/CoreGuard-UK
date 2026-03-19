"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getEmployees(filters?: {
  status?: string;
  siteId?: string;
  organisationId?: string;
}) {
  let query = supabaseAdmin.from('employees').select('*');
  
  if (filters?.organisationId) {
    query = query.eq('organisation_id', filters.organisationId);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.siteId) {
    query = query.eq('site_id', filters.siteId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
  
  return data || [];
}

export async function getEmployeeById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching employee:', error);
    return null;
  }
  
  return data;
}

export async function createEmployee(employee: any) {
  const employeeData = {
    organisation_id: employee.organisation_id,
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone,
    role: employee.role,
    department: employee.department,
    status: employee.status || 'active',
    emergency_contact: employee.emergency_contact,
    emergency_phone: employee.emergency_phone,
    employee_id: employee.employee_id,
    start_date: employee.start_date,
    salary_type: employee.salary_type,
    salary: employee.salary,
    contracted_hours: employee.contracted_hours,
    employment_type: employee.employment_type,
    work_schedule: employee.work_schedule,
    manager: employee.manager,
    location: employee.location,
    sites: employee.sites ? JSON.stringify(employee.sites) : null,
    created_at: new Date().toISOString(),
  };
  
  const { data, error } = await supabaseAdmin
    .from('employees')
    .insert(employeeData as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating employee:', error);
    return null;
  }
  
  return data;
}

export async function updateEmployee(id: string, updates: any) {
  const { data, error } = await (supabaseAdmin.from('employees') as any)
    .update(updates as any)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating employee:', error);
    return null;
  }
  
  return data;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('employees')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting employee:', error);
    return false;
  }
  
  return true;
}
