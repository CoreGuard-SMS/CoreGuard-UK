import { Employee } from '@/types';
import { supabase } from '@/lib/supabase/client';

export async function getEmployees(filters?: {
  role?: string;
  status?: string;
  siteId?: string;
  organisationId?: string;
}): Promise<Employee[]> {
  let query = supabase.from('employees').select('*');
  
  if (filters?.organisationId) {
    query = query.eq('organisation_id', filters.organisationId);
  }
  
  if (filters?.role) {
    query = query.eq('role', filters.role);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching employees:', error);
    return [];
  }
  
  return data || [];
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
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

export async function getSuggestedEmployees(siteId: string, date: string): Promise<Employee[]> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('status', 'active')
    .in('site_ids', [siteId]);
  
  if (error) {
    console.error('Error fetching suggested employees:', error);
    return [];
  }
  
  return data || [];
}
