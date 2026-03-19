"use server";

import { supabaseAdmin } from "@/lib/supabase/server";

export async function getSites(filters?: {
  organisationId?: string;
  status?: string;
}) {
  let query = supabaseAdmin.from('sites').select('*');
  
  if (filters?.organisationId) {
    query = query.eq('organisation_id', filters.organisationId);
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  const { data, error } = await query.order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
  
  return data || [];
}

export async function getSiteById(id: string) {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching site:', error);
    return null;
  }
  
  return data;
}

export async function createSite(site: {
  name: string;
  address: string;
  city: string;
  postcode: string;
  organisationId: string;
  status?: string;
  phone?: string;
  email?: string;
  manager?: string;
}) {
  const { data, error } = await (supabaseAdmin.from('sites') as any)
    .insert({
      name: site.name,
      address: site.address,
      city: site.city,
      postcode: site.postcode,
      organisation_id: site.organisationId,
      status: 'active',
      phone: site.phone,
      email: site.email,
      manager: site.manager,
      created_at: new Date().toISOString(),
    } as any)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating site:', error);
    return null;
  }
  
  return data;
}

export async function updateSite(id: string, updates: any) {
  const { data, error } = await (supabaseAdmin.from('sites') as any)
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) {
    console.error('Error updating site:', error);
    return null;
  }
  
  return data;
}

export async function deleteSite(id: string): Promise<boolean> {
  const { error } = await supabaseAdmin
    .from('sites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting site:', error);
    return false;
  }
  
  return true;
}
