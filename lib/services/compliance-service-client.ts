import { supabase } from '@/lib/supabase/client';

export async function getComplianceFlags(organisationId: string) {
  try {
    const response = await fetch(`/api/compliance/flags?organisationId=${organisationId}`);
    if (!response.ok) {
      console.error('Error fetching compliance flags:', response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getComplianceFlags:', error);
    return [];
  }
}

export async function getExpiringCertifications(organisationId: string, days: number = 30) {
  try {
    const response = await fetch(`/api/compliance/certifications?organisationId=${organisationId}&days=${days}`);
    if (!response.ok) {
      console.error('Error fetching expiring certifications:', response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getExpiringCertifications:', error);
    return [];
  }
}

export async function getExpiringLicences(organisationId: string, days: number = 30) {
  try {
    const response = await fetch(`/api/compliance/licences?organisationId=${organisationId}&days=${days}`);
    if (!response.ok) {
      console.error('Error fetching expiring licences:', response.statusText);
      return [];
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getExpiringLicences:', error);
    return [];
  }
}

export async function getComplianceScore(organisationId: string) {
  try {
    const response = await fetch(`/api/compliance/score?organisationId=${organisationId}`);
    if (!response.ok) {
      console.error('Error fetching compliance score:', response.statusText);
      return { score: 0, total: 0, percentage: 0 };
    }
    return await response.json();
  } catch (error) {
    console.error('Error in getComplianceScore:', error);
    return { score: 0, total: 0, percentage: 0 };
  }
}
