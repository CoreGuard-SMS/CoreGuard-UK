import { Site } from '@/types';
import { supabase } from '@/lib/supabase/client';

// Generate a sequential 4-digit PIN starting from 0001
let sitePinCounter = 1;
export function generateSitePin(): string {
  const pin = sitePinCounter.toString().padStart(4, '0');
  sitePinCounter++;
  return pin;
}

// Reset function to start PINs from 0001 again
export function resetSitePinCounter(): void {
  sitePinCounter = 1;
}

export async function getSites(organisationId?: string): Promise<Site[]> {
  let query = supabase.from('sites').select('*');
  
  if (organisationId) {
    query = query.eq('organisation_id', organisationId);
  }
  
  const { data, error } = await query.order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
  
  // Map database fields to frontend format
  return (data || []).map(site => ({
    id: site.id,
    organisationId: site.organisation_id,
    name: site.name,
    address: site.address,
    contactName: site.contact_name,
    contactPhone: site.contact_phone,
    sitePin: site.site_pin,
    requirements: site.requirements || { requiredTraining: [], requiredLicences: [] },
    createdAt: new Date(site.created_at),
  }));
}

export async function getSiteById(id: string): Promise<Site | null> {
  const { data, error } = await supabase
    .from('sites')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error('Error fetching site:', error);
    return null;
  }
  
  if (data) {
    return {
      id: data.id,
      organisationId: data.organisation_id,
      name: data.name,
      address: data.address,
      contactName: data.contact_name,
      contactPhone: data.contact_phone,
      sitePin: data.site_pin,
      requirements: data.requirements || { requiredTraining: [], requiredLicences: [] },
      createdAt: new Date(data.created_at),
    };
  }
  
  return null;
}

export async function createSite(site: Omit<Site, 'id' | 'createdAt'>): Promise<Site | null> {
  const { data, error } = await supabase
    .from('sites')
    .insert({
      organisation_id: site.organisationId,
      name: site.name,
      address: site.address,
      contact_name: site.contactName,
      contact_phone: site.contactPhone,
      site_pin: site.sitePin,
      requirements: site.requirements,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating site:', error);
    return null;
  }
  
  // Map database fields back to frontend format
  if (data) {
    return {
      id: data.id,
      organisationId: data.organisation_id,
      name: data.name,
      address: data.address,
      contactName: data.contact_name,
      contactPhone: data.contact_phone,
      sitePin: data.site_pin,
      requirements: data.requirements,
      createdAt: new Date(data.created_at),
    };
  }
  
  return null;
}

export async function updateSite(id: string, updates: Partial<Site>): Promise<Site | null> {
  const { data, error } = await supabase
    .from('sites')
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
  const { error } = await supabase
    .from('sites')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error('Error deleting site:', error);
    return false;
  }
  
  return true;
}

export async function validateSitePin(siteId: string, pin: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('sites')
    .select('site_pin')
    .eq('id', siteId)
    .single();
  
  if (error) {
    console.error('Error validating site PIN:', error);
    return false;
  }
  
  return data?.site_pin === pin;
}
