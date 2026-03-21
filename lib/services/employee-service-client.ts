import { Employee } from '@/types';
import { supabase } from '@/lib/supabase/client';

export async function getEmployees(filters?: {
  role?: string;
  status?: string;
  siteId?: string;
  organisationId?: string;
}): Promise<Employee[]> {
  try {
    // Use API route for now to test
    if (filters?.organisationId) {
      const response = await fetch(`/api/employees?organisationId=${filters.organisationId}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Employee API result:', data);
        
        // Transform API data to match Employee interface
        return data.map((emp: any) => ({
          id: emp.id,
          userId: emp.user_id,
          organisationId: filters.organisationId,
          firstName: emp.first_name,
          lastName: emp.last_name,
          phone: emp.phone,
          role: emp.role,
          status: emp.status,
          emergencyContact: '', // Not in API response
          avatarUrl: emp.avatar_url,
          createdAt: new Date(emp.created_at)
        }));
      }
    }
    
    // Fallback to direct Supabase query
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
    
    console.log('Employee query result:', { data, error });
    
    if (error) {
      console.error('Error fetching employees:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getEmployees:', error);
    return [];
  }
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
