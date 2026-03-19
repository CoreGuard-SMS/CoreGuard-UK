"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getEmployeeTraining(employeeId: string) {
  const { data, error } = await supabaseAdmin
    .from('training_records')
    .select(`
      *,
      training_types (
        name,
        description,
        validity_period
      )
    `)
    .eq('employee_id', employeeId)
    .order('completion_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching employee training:', error);
    return [];
  }
  
  return data || [];
}

export async function getEmployeeLicences(employeeId: string) {
  const { data, error } = await supabaseAdmin
    .from('licences')
    .select(`
      *,
      licence_types (
        name,
        description,
        validity_period
      )
    `)
    .eq('employee_id', employeeId)
    .order('issue_date', { ascending: false });
  
  if (error) {
    console.error('Error fetching employee licences:', error);
    return [];
  }
  
  return data || [];
}

export async function createTrainingRecord(record: {
  employeeId: string;
  trainingTypeId: string;
  completionDate: string;
  expiryDate?: string;
  certificateNumber?: string;
  notes?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('training_records')
    .insert({
      employee_id: record.employeeId,
      training_type: record.trainingTypeId,
      certification_name: record.certificateNumber || "Training Certificate",
      issue_date: record.completionDate,
      expiry_date: record.expiryDate || record.completionDate,
      document_url: record.notes,
      status: 'active',
      created_at: new Date().toISOString(),
    } as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding training record:', error);
    return null;
  }
  
  return data;
}

export async function addLicence(licence: {
  employeeId: string;
  licenceTypeId: string;
  issueDate: string;
  expiryDate?: string;
  licenceNumber?: string;
  issuingAuthority?: string;
  notes?: string;
}) {
  const { data, error } = await supabaseAdmin
    .from('licences')
    .insert({
      employee_id: licence.employeeId,
      licence_type: licence.licenceTypeId,
      issue_date: licence.issueDate,
      expiry_date: licence.expiryDate || licence.issueDate,
      licence_number: licence.licenceNumber || "N/A",
      document_url: licence.notes,
      status: 'active',
      created_at: new Date().toISOString(),
    } as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error adding licence:', error);
    return null;
  }
  
  return data;
}
