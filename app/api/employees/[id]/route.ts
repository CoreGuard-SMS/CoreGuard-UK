import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Get employee details
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .select(`
        *,
        users (
          email
        )
      `)
      .eq("id", id)
      .single();

    if (empError || !employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    // Get employee training
    const { data: training, error: trainingError } = await supabase
      .from("training_records")
      .select("*")
      .eq("employee_id", id)
      .order("created_at", { ascending: false });

    // Get employee licences
    const { data: licences, error: licenceError } = await supabase
      .from("licences")
      .select("*")
      .eq("employee_id", id)
      .order("created_at", { ascending: false });

    // Get employee shifts
    const { data: shifts, error: shiftError } = await supabase
      .from("shifts")
      .select(`
        *,
        sites (
          name
        )
      `)
      .eq("employee_id", id)
      .order("start_time", { ascending: false })
      .limit(10);

    const employeeData = {
      ...employee,
      training: training || [],
      licences: licences || [],
      shifts: shifts || [],
    };

    return NextResponse.json(employeeData);

  } catch (error) {
    console.error("Employee detail API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
