import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organisationId = searchParams.get('organisationId');

    if (!organisationId) {
      return NextResponse.json(
        { error: "Organisation ID is required" },
        { status: 400 }
      );
    }

    // Handle mock organisation for seed data
    if (organisationId === "mock-org-id") {
      console.log("Returning mock stats for seed data");
      const mockStats = {
        employeeCount: 5,
        siteCount: 3,
        upcomingShifts: 12,
        complianceAlerts: 2,
      };
      return NextResponse.json(mockStats);
    }

    // Get employee count
    const { count: employeeCount, error: empError } = await supabase
      .from("employees")
      .select("id", { count: 'exact' })
      .eq("organisation_id", organisationId)
      .eq("status", "active");

    // Get site count
    const { count: siteCount, error: siteError } = await supabase
      .from("sites")
      .select("id", { count: 'exact' })
      .eq("organisation_id", organisationId);

    // Get upcoming shifts (next 7 days)
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    
    const { count: upcomingShifts, error: shiftError } = await supabase
      .from("shifts")
      .select("id", { count: 'exact' })
      .eq("organisation_id", organisationId)
      .gte("start_time", new Date().toISOString())
      .lte("start_time", sevenDaysFromNow.toISOString());

    // Get compliance alerts (expiring certifications in next 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { count: expiringCerts, error: certError } = await supabase
      .from("training_records")
      .select("id", { count: 'exact' })
      .eq("status", "active")
      .lte("expiry_date", thirtyDaysFromNow.toISOString());

    const stats = {
      employeeCount: employeeCount || 0,
      siteCount: siteCount || 0,
      upcomingShifts: upcomingShifts || 0,
      complianceAlerts: expiringCerts || 0,
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error("Dashboard stats API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
