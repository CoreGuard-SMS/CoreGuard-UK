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
      console.log("Returning mock activity for seed data");
      const mockActivity = [
        {
          type: 'employee',
          title: 'New employee: John Smith',
          description: 'Employee joined the company',
          timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        },
        {
          type: 'shift',
          title: 'Shift scheduled',
          description: 'Shift for employee assigned to Main Office',
          timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        }
      ];
      return NextResponse.json(mockActivity);
    }

    // Get recent employees (last 5)
    const { data: recentEmployees, error: empError } = await supabase
      .from("employees")
      .select("first_name, last_name, created_at")
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Get recent shifts (last 5)
    const { data: recentShifts, error: shiftError } = await supabase
      .from("shifts")
      .select("employee_id, site_id, start_time, end_time, status")
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false })
      .limit(5);

    // Combine activities
    const activities = [
      ...(recentEmployees || []).map(emp => ({
        type: 'employee',
        title: `New employee: ${emp.first_name} ${emp.last_name}`,
        description: 'Employee joined the company',
        timestamp: emp.created_at,
      })),
      ...(recentShifts || []).map(shift => ({
        type: 'shift',
        title: `Shift scheduled`,
        description: `Shift for employee ${shift.employee_id}`,
        timestamp: shift.start_time,
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

    return NextResponse.json(activities);

  } catch (error) {
    console.error("Dashboard activity API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
