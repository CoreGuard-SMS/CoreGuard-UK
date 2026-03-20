import { ComplianceFlagRecord } from '@/types';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function getComplianceFlags(resolved?: boolean): Promise<ComplianceFlagRecord[]> {
  let query = supabaseAdmin.from('compliance_flags').select('*');
  
  if (resolved !== undefined) {
    query = query.eq('resolved', resolved);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching compliance flags:', error);
    return [];
  }
  
  return data || [];
}

export async function getComplianceFlagsByEmployee(employeeId: string): Promise<ComplianceFlagRecord[]> {
  const { data, error } = await supabaseAdmin
    .from('compliance_flags')
    .select('*')
    .eq('employee_id', employeeId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching employee compliance flags:', error);
    return [];
  }
  
  return data || [];
}

export async function createComplianceFlag(flag: Omit<ComplianceFlagRecord, 'id' | 'createdAt'>): Promise<ComplianceFlagRecord | null> {
  const { data, error } = await (supabaseAdmin.from('compliance_flags') as any)
    .insert({
      ...flag,
      created_at: new Date().toISOString(),
    } as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating compliance flag:', error);
    return null;
  }
  
  return data;
}

export async function resolveComplianceFlag(id: string): Promise<boolean> {
  const { error } = await (supabaseAdmin.from('compliance_flags') as any)
    .update({ resolved: true })
    .eq('id', id);
  
  if (error) {
    console.error('Error resolving compliance flag:', error);
    return false;
  }
  
  return true;
}

export async function checkExpiringCertifications(organisationId: string, daysThreshold: number = 30): Promise<ComplianceFlagRecord[]> {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  const { data, error } = await supabaseAdmin
    .from('training_records')
    .select(`
      *,
      employees!inner(
        id,
        first_name,
        last_name,
        organisation_id
      )
    `)
    .eq('employees.organisation_id', organisationId)
    .lte('expiry_date', thresholdDate.toISOString())
    .gt('expiry_date', new Date().toISOString())
    .eq('status', 'active');
  
  if (error) {
    console.error('Error checking expiring certifications:', error);
    return [];
  }
  
  const flags: ComplianceFlagRecord[] = [];
  
  for (const record of data || []) {
    const recordTyped = record as any; // Type assertion for Supabase result
    const daysUntilExpiry = Math.ceil((new Date(recordTyped.expiry_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    
    const existingFlag = await getComplianceFlagsByEmployee(recordTyped.employee_id);
    const alreadyFlagged = existingFlag.some(flag => 
      flag.flagType === 'expiring_cert' && 
      flag.description.includes(recordTyped.certification_name)
    );
    
    if (!alreadyFlagged) {
      const flag = await createComplianceFlag({
        employeeId: recordTyped.employee_id,
        employeeName: `${recordTyped.employees.first_name} ${recordTyped.employees.last_name}`,
        flagType: 'expiring_cert',
        severity: daysUntilExpiry <= 7 ? 'high' : 'medium',
        description: `${recordTyped.certification_name} expiring in ${daysUntilExpiry} days`,
        resolved: false,
      });
      
      if (flag) {
        flags.push(flag);
      }
    }
  }
  
  return flags;
}

// Get expiring certifications for display
export async function getExpiringCertifications(organisationId: string, daysThreshold: number = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  const { data, error } = await supabaseAdmin
    .from('training_records')
    .select(`
      *,
      employees!inner(
        id,
        first_name,
        last_name
      )
    `)
    .eq('employees.organisation_id', organisationId)
    .lte('expiry_date', thresholdDate.toISOString())
    .eq('status', 'active');
  
  if (error) {
    console.error('Error fetching expiring certifications:', error);
    return [];
  }
  
  return data || [];
}

// Get expiring licences for display
export async function getExpiringLicences(organisationId: string, daysThreshold: number = 30) {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);
  
  const { data, error } = await supabaseAdmin
    .from('licences')
    .select(`
      *,
      employees!inner(
        id,
        first_name,
        last_name
      )
    `)
    .eq('employees.organisation_id', organisationId)
    .lte('expiry_date', thresholdDate.toISOString())
    .eq('status', 'active');
  
  if (error) {
    console.error('Error fetching expiring licences:', error);
    return [];
  }
  
  return data || [];
}

// Calculate overall compliance score
export async function getComplianceScore(organisationId: string): Promise<number> {
  try {
    // Get total number of active employees
    const { data: employees, error: empError } = await supabaseAdmin
      .from('employees')
      .select('id')
      .eq('organisation_id', organisationId)
      .eq('status', 'active');
    
    if (empError || !employees || employees.length === 0) {
      return 100; // No employees = perfect compliance
    }
    
    const employeesTyped = employees as any[];
    
    // Get total active training records
    const { data: trainingRecords, error: trainingError } = await supabaseAdmin
      .from('training_records')
      .select('employee_id, status, expiry_date')
      .in('employee_id', employeesTyped.map(e => e.id as string));
    
    // Get total active licences
    const { data: licences, error: licenceError } = await supabaseAdmin
      .from('licences')
      .select('employee_id, status, expiry_date')
      .in('employee_id', employeesTyped.map(e => e.id as string));
    
    // Get unresolved compliance flags
    const flags = await getComplianceFlags(false);
    
    // Calculate score based on:
    // - Active certifications without issues
    // - Active licences without issues  
    // - Number of unresolved flags
    
    let totalScore = 100;
    const totalEmployees = employeesTyped.length;
    
    // Deduct points for expired/expiring certifications
    const expiredCerts = (trainingRecords || []).filter((record: any) => 
      new Date(record.expiry_date) < new Date() || record.status !== 'active'
    ).length;
    
    // Deduct points for expired/expiring licences
    const expiredLicences = (licences || []).filter((licence: any) => 
      new Date(licence.expiry_date) < new Date() || licence.status !== 'active'
    ).length;
    
    // Deduct points for compliance flags
    const penaltyPerFlag = 5;
    const flagPenalty = flags.length * penaltyPerFlag;
    
    // Calculate final score
    const certPenalty = totalEmployees > 0 ? (expiredCerts / totalEmployees) * 20 : 0;
    const licencePenalty = totalEmployees > 0 ? (expiredLicences / totalEmployees) * 20 : 0;
    
    totalScore = Math.max(0, 100 - certPenalty - licencePenalty - flagPenalty);
    
    return Math.round(totalScore);
  } catch (error) {
    console.error('Error calculating compliance score:', error);
    return 85; // Default score if calculation fails
  }
}
