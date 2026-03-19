"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createCompany(formData: FormData) {
  try {
    // Extract form data
    const companyName = formData.get("companyName") as string;
    const organisationPIN = formData.get("organisationPIN") as string;
    const adminName = formData.get("adminName") as string;
    const adminEmail = formData.get("adminEmail") as string;
    const adminPassword = formData.get("adminPassword") as string;

    console.log("Server action called with:", {
      companyName,
      organisationPIN,
      adminName,
      adminEmail,
      hasPassword: !!adminPassword,
    });

    // Simple validation
    if (!companyName || !organisationPIN || !adminName || !adminEmail || !adminPassword) {
      return {
        error: "All required fields must be filled",
      };
    }

    // Test basic functionality
    return {
      success: true,
      message: "Server action is working!",
      organisationId: "test-id",
      userId: "test-user-id",
      employeeId: "test-employee-id",
    };

  } catch (error) {
    console.error("Company creation error:", error);
    return {
      error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error'),
    };
  }
}
