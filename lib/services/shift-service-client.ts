import { Shift, ShiftAssignment } from '@/types';
import { supabase } from '@/lib/supabase/client';

export async function getShifts(filters?: {
  status?: string;
  siteId?: string;
  organisationId?: string;
}): Promise<Shift[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.organisationId) {
      params.append('organisationId', filters.organisationId);
    }
    
    if (filters?.siteId) {
      params.append('siteId', filters.siteId);
    }
    
    if (filters?.status) {
      params.append('status', filters.status);
    }

    const response = await fetch(`/api/shifts?${params.toString()}`);
    
    if (!response.ok) {
      console.error('Error fetching shifts:', response.statusText);
      return [];
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return (data || []).map((shift: any) => ({
      ...shift,
      startTime: new Date(shift.startTime),
      endTime: new Date(shift.endTime),
      createdAt: new Date(shift.createdAt),
    }));
  } catch (error) {
    console.error('Error fetching shifts:', error);
    return [];
  }
}

export async function getShiftById(id: string): Promise<Shift | null> {
  try {
    const response = await fetch(`/api/shifts?id=${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      console.error('Error fetching shift:', response.statusText);
      return null;
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Error fetching shift:', error);
    return null;
  }
}

export async function createShift(shift: Omit<Shift, 'id' | 'createdAt'>): Promise<Shift | null> {
  try {
    const response = await fetch('/api/shifts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shift),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error creating shift:', errorData.error);
      return null;
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return {
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      createdAt: new Date(data.createdAt),
    };
  } catch (error) {
    console.error('Error creating shift:', error);
    return null;
  }
}

export async function createMultipleShifts(shifts: Omit<Shift, 'id' | 'createdAt'>[]): Promise<Shift[]> {
  try {
    const results = await Promise.allSettled(
      shifts.map(shift => createShift(shift))
    );

    const successfulShifts = results
      .filter((result): result is PromiseFulfilledResult<Shift> => 
        result.status === 'fulfilled' && result.value !== null
      )
      .map(result => result.value);

    return successfulShifts;
  } catch (error) {
    console.error('Error creating multiple shifts:', error);
    return [];
  }
}

export async function updateShift(id: string, updates: Partial<Shift>): Promise<Shift | null> {
  const { data, error } = await supabase
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
  const { error } = await supabase
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
  let query = supabase.from('shift_assignments').select('*');
  
  if (shiftId) {
    query = query.eq('shift_id', shiftId);
  }
  
  const { data, error } = await query.order('created_at', { ascending: true });
  
  if (error) {
    console.error('Error fetching shift assignments:', error);
    return [];
  }
  
  return data || [];
}

export async function assignEmployeeToShift(
  shiftId: string,
  employeeId: string,
  role: string
): Promise<ShiftAssignment | null> {
  const { data, error } = await supabase
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
  const { error } = await supabase
    .from('shift_assignments')
    .delete()
    .eq('id', assignmentId);
  
  if (error) {
    console.error('Error unassigning employee from shift:', error);
    return false;
  }
  
  return true;
}

export async function getEmployeeShifts(employeeId: string): Promise<Shift[]> {
  const { data, error } = await supabase
    .from('shift_assignments')
    .select(`
      *,
      shifts (
        id,
        title,
        start_time,
        end_time,
        site_id,
        status,
        sites (
          id,
          name,
          address
        )
      )
    `)
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching employee shifts:', error);
    return [];
  }
  
  return data?.map(assignment => ({
    ...assignment.shifts,
    assignment: {
      id: assignment.id,
      status: assignment.status,
      assigned_role: assignment.assigned_role
    }
  })) || [];
}
