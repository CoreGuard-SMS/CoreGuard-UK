import { Shift, ShiftAssignment } from '@/types';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function getShifts(filters?: {
  status?: string;
  siteId?: string;
  organisationId?: string;
}): Promise<Shift[]> {
  let query = supabaseAdmin.from('shifts').select('*');
  
  if (filters?.organisationId) {
    query = query.eq('organisation_id', filters.organisationId);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.siteId) {
    query = query.eq('site_id', filters.siteId);
  }
  
  const { data, error } = await query.order('start_time', { ascending: true });
  
  if (error) {
    console.error('Error fetching shifts:', error);
    return [];
  }
  
  return data || [];
}

export async function getShiftById(id: string): Promise<Shift | null> {
  const { data, error } = await supabaseAdmin
    .from('shifts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching shift:', error);
    return null;
  }
  
  return data;
}

export async function createShift(shift: Omit<Shift, 'id' | 'createdAt'>): Promise<Shift | null> {
  const { data, error } = await (supabaseAdmin as any)
    .from('shifts')
    .insert({
      ...shift,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating shift:', error);
    return null;
  }
  
  return data;
}

export async function updateShift(id: string, updates: Partial<Shift>): Promise<Shift | null> {
  const { data, error } = await (supabaseAdmin as any)
    .from('shifts')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating shift:', error);
    return null;
  }
  
  return data;
}

export async function deleteShift(id: string): Promise<boolean> {
  const { error } = await (supabaseAdmin as any)
    .from('shifts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting shift:', error);
    return false;
  }
  
  return true;
}

export async function getShiftAssignments(shiftId?: string): Promise<ShiftAssignment[]> {
  let query = supabaseAdmin.from('shift_assignments').select('*');
  
  if (shiftId) {
    query = query.eq('shift_id', shiftId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching shift assignments:', error);
    return [];
  }
  
  return data || [];
}

export async function getEmployeeShifts(employeeId: string): Promise<ShiftAssignment[]> {
  const { data, error } = await supabaseAdmin
    .from('shift_assignments')
    .select(`
      *,
      shifts (
        id,
        title,
        start_time,
        end_time,
        status,
        sites (
          name
        )
      )
    `)
    .eq('employee_id', employeeId);
  
  if (error) {
    console.error('Error fetching employee shifts:', error);
    return [];
  }
  
  return data || [];
}

export async function assignEmployeeToShift(
  shiftId: string,
  employeeId: string,
  role: string
): Promise<ShiftAssignment | null> {
  const { data, error } = await (supabaseAdmin as any)
    .from('shift_assignments')
    .insert({
      shift_id: shiftId,
      employee_id: employeeId,
      assigned_role: role,
      status: 'assigned',
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error assigning employee to shift:', error);
    return null;
  }
  
  return data;
}

export async function unassignEmployeeFromShift(assignmentId: string): Promise<boolean> {
  const { error } = await (supabaseAdmin as any)
    .from('shift_assignments')
    .delete()
    .eq('id', assignmentId);
  
  if (error) {
    console.error('Error unassigning employee from shift:', error);
    return false;
  }
  
  return true;
}
