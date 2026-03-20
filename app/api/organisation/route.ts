import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    console.log("Organisation API called with userId:", userId);

    if (!userId) {
      console.log("No userId provided in request");
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get organisation by user ID
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("organisation_id")
      .eq("id", userId)
      .single();

    console.log("User query result:", { data: user, error: userError });

    if (userError || !user) {
      console.log("User not found or error:", userError);
      
      // Check if this is the seed data user ID and return a mock organisation
      if (userId === "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11") {
        console.log("Returning mock organisation for seed data user");
        const mockOrg = {
          id: "mock-org-id",
          name: "CoreGuard Security",
          industry: "Security Services",
          contact_email: "admin@secureguard.com",
          organisation_pin: "123456",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        return NextResponse.json(mockOrg);
      }
      
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Get organisation details
    const { data: organisation, error: orgError } = await supabase
      .from("organisations")
      .select("*")
      .eq("id", user.organisation_id)
      .single();

    if (orgError || !organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(organisation);

  } catch (error) {
    console.error("Organisation API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
