"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getOrganisationByUserId(userId: string) {
  try {
    const { data: user, error: userError } = await (supabaseAdmin.from("users") as any)
      .select("organisation_id")
      .eq("id", userId)
      .single();

    if (userError || !user) {
      console.error("Error fetching user organisation:", userError);
      return null;
    }

    const { data: organisation, error: orgError } = await (supabaseAdmin.from("organisations") as any)
      .select("*")
      .eq("id", user.organisation_id)
      .single();

    if (orgError || !organisation) {
      console.error("Error fetching organisation:", orgError);
      return null;
    }

    return organisation;
  } catch (error) {
    console.error("Unexpected error fetching organisation:", error);
    return null;
  }
}

export async function getOrganisationStats(organisationId: string) {
  try {
    // Get employee count
    let employeeCount = 0;
    let empError = null;
    try {
      const { count, error } = await supabaseAdmin
        .from("employees")
        .select("*", { count: "exact", head: true })
        .eq("organisation_id", organisationId)
        .eq("status", "active");
      
      employeeCount = count || 0;
      empError = error;
    } catch (error) {
      empError = error;
    }

    if (empError) {
      console.error("Error fetching employee count:", empError);
      employeeCount = 0;
    }

    // Get site count
    let siteCount = 0;
    let siteError = null;
    try {
      const { count, error } = await supabaseAdmin
        .from("sites")
        .select("*", { count: "exact", head: true })
        .eq("organisation_id", organisationId);
      
      siteCount = count || 0;
      siteError = error;
    } catch (error) {
      siteError = error;
    }

    if (siteError) {
      console.error("Error fetching site count:", siteError);
      siteCount = 0;
    }

    // Get upcoming shifts (simplified - would need actual shift table)
    const upcomingShifts = 0; // Placeholder until shift table is implemented

    // Get compliance alerts (simplified - would need actual compliance table)
    const complianceAlerts = 0; // Placeholder until compliance table is implemented

    return {
      employeeCount: employeeCount || 0,
      siteCount: siteCount || 0,
      upcomingShifts,
      complianceAlerts,
    };
  } catch (error) {
    console.error("Error fetching organisation stats:", error);
    return {
      employeeCount: 0,
      siteCount: 0,
      upcomingShifts: 0,
      complianceAlerts: 0,
    };
  }
}

export async function updateOrganisation(organisationId: string, data: {
  name?: string;
  industry?: string;
  contact_email?: string;
}) {
  try {
    const { error } = await (supabaseAdmin.from("organisations") as any)
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", organisationId);

    if (error) {
      console.error("Error updating organisation:", error);
      return {
        error: "Failed to update organisation",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error updating organisation:", error);
    return {
      error: "An unexpected error occurred",
    };
  }
}

export async function regenerateOrganisationPin(organisationId: string) {
  try {
    const newPin = Math.floor(100000 + Math.random() * 900000).toString();

    const { error } = await (supabaseAdmin.from("organisations") as any)
      .update({
        organisation_pin: newPin,
        updated_at: new Date().toISOString(),
      })
      .eq("id", organisationId);

    if (error) {
      console.error("Error regenerating PIN:", error);
      return {
        error: "Failed to regenerate PIN",
      };
    }

    return {
      success: true,
      pin: newPin,
    };
  } catch (error) {
    console.error("Unexpected error regenerating PIN:", error);
    return {
      error: "An unexpected error occurred",
    };
  }
}
