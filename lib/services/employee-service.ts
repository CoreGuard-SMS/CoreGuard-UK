import { Employee, EmployeeMatch, TrainingRecord, Licence, Availability } from '@/types';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function getEmployees(filters?: {
  role?: string;
  status?: string;
  siteId?: string;
  organisationId?: string;
}): Promise<Employee[]> {
  let query = supabaseAdmin.from('employees').select('*');
  
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

export async function getEmployeeTraining(employeeId: string): Promise<TrainingRecord[]> {
  const { data, error } = await supabaseAdmin
    .from('training_records')
    .select('*')
    .eq('employee_id', employeeId);
  
  if (error) {
    console.error('Error fetching training records:', error);
    return [];
  }
  
  return data || [];
}

export async function getEmployeeLicences(employeeId: string): Promise<Licence[]> {
  const { data, error } = await supabaseAdmin
    .from('licences')
    .select('*')
    .eq('employee_id', employeeId);
  
  if (error) {
    console.error('Error fetching licences:', error);
    return [];
  }
  
  return data || [];
}

export async function getEmployeeAvailability(employeeId: string, date: Date): Promise<boolean> {
  const dateStr = date.toISOString().split('T')[0];
  
  const { data, error } = await supabaseAdmin
    .from('availability')
    .select('is_available')
    .eq('employee_id', employeeId)
    .eq('date', dateStr)
    .single();
  
  if (error || !data) {
    // Default to available if no record found
    return true;
  }
  
  return data.is_available;
}

export async function checkEmployeeQualifications(
  employeeId: string,
  requiredTraining: string[],
  requiredLicences: string[]
): Promise<{ qualified: boolean; missing: string[] }> {
  const training = await getEmployeeTraining(employeeId);
  const licences = await getEmployeeLicences(employeeId);

  const activeTraining = training
    .filter(t => t.status === 'active')
    .map(t => t.certificationName);
  
  const activeLicences = licences
    .filter(l => l.status === 'active')
    .map(l => l.licenceType);

  const missing: string[] = [];

  requiredTraining.forEach(req => {
    if (!activeTraining.includes(req)) {
      missing.push(`Training: ${req}`);
    }
  });

  requiredLicences.forEach(req => {
    if (!activeLicences.includes(req)) {
      missing.push(`Licence: ${req}`);
    }
  });

  return {
    qualified: missing.length === 0,
    missing,
  };
}

export async function getSuggestedEmployees(
  requiredTraining: string[],
  requiredLicences: string[],
  shiftDate: Date,
  requiredRole?: string,
  organisationId?: string
): Promise<EmployeeMatch[]> {
  let employees = await getEmployees({ 
    status: 'active', 
    organisationId 
  });

  if (requiredRole) {
    employees = employees.filter(emp => emp.role === requiredRole);
  }

  const matches: EmployeeMatch[] = [];

  for (const employee of employees) {
    const training = await getEmployeeTraining(employee.id);
    const licences = await getEmployeeLicences(employee.id);
    const isAvailable = await getEmployeeAvailability(employee.id, shiftDate);
    const qualifications = await checkEmployeeQualifications(
      employee.id,
      requiredTraining,
      requiredLicences
    );

    let matchScore = 0;
    const reasons: string[] = [];

    if (qualifications.qualified) {
      matchScore += 50;
      reasons.push('Meets all qualification requirements');
    } else {
      reasons.push(`Missing: ${qualifications.missing.join(', ')}`);
    }

    if (isAvailable) {
      matchScore += 30;
      reasons.push('Available on shift date');
    } else {
      reasons.push('Not available on shift date');
    }

    if (employee.role.includes('Senior') || employee.role.includes('Supervisor')) {
      matchScore += 10;
      reasons.push('Experienced role');
    }

    const activeTraining = training.filter(t => t.status === 'active');
    if (activeTraining.length > requiredTraining.length) {
      matchScore += 10;
      reasons.push('Additional certifications');
    }

    matches.push({
      employee,
      matchScore,
      reasons,
      qualifications: {
        training,
        licences,
      },
      availability: isAvailable,
    });
  }

  return matches
    .filter(match => match.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);
}
