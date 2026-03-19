import { Site } from '@/types';
import { supabaseAdmin } from '@/lib/supabase/server';

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
  let query = supabaseAdmin.from('sites').select('*');
  
  if (organisationId) {
    query = query.eq('organisation_id', organisationId);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching sites:', error);
    return [];
  }
  
  return data || [];
}

export async function getSiteById(id: string): Promise<Site | null> {
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

export async function createSite(site: Omit<Site, 'id' | 'createdAt'>): Promise<Site | null> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .insert({
      ...site,
      created_at: new Date().toISOString(),
    })
    .select()
    .single();
  
  if (error) {
    console.error('Error creating site:', error);
    return null;
  }
  
  return data;
}

export async function updateSite(id: string, updates: Partial<Site>): Promise<Site | null> {
  const { data, error } = await supabaseAdmin
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

export async function validateSitePin(siteId: string, pin: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('sites')
    .select('site_pin')
    .eq('id', siteId)
    .eq('site_pin', pin)
    .single();
  
  if (error) {
    console.error('Error validating site PIN:', error);
    return false;
  }
  
  return data !== null;
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
