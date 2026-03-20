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
    const siteId = searchParams.get('siteId');
    const status = searchParams.get('status');
    const shiftId = searchParams.get('id');

    // If shiftId is provided, get single shift
    if (shiftId) {
      const { data: shift, error } = await supabase
        .from("shifts")
        .select("*")
        .eq("id", shiftId)
        .single();

      if (error) {
        console.error("Shift API error:", error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        );
      }

      if (!shift) {
        return NextResponse.json(
          { error: "Shift not found" },
          { status: 404 }
        );
      }

      // Get site name for the response
      let fetchedSiteName = null;
      if (shift.site_id) {
        const { data: site } = await supabase
          .from("sites")
          .select("name")
          .eq("id", shift.site_id)
          .single();
        fetchedSiteName = site?.name;
      }

      // Map database fields to frontend format
      const responseShift = {
        id: shift.id,
        organisationId: shift.organisation_id,
        siteId: shift.site_id,
        siteName: fetchedSiteName,
        startTime: shift.start_time,
        endTime: shift.end_time,
        breakDuration: shift.break_duration,
        requiredRoles: shift.required_roles || [],
        requiredTraining: shift.required_training || [],
        requiredLicences: shift.required_licences || [],
        status: shift.status,
        createdBy: shift.created_by,
        createdAt: shift.created_at,
      };

      return NextResponse.json(responseShift);
    }

    // Require organisationId for listing shifts
    if (!organisationId) {
      return NextResponse.json(
        { error: "Organisation ID is required" },
        { status: 400 }
      );
    }

    // Build query
    let query = supabase
      .from("shifts")
      .select("*");

    if (organisationId) {
      query = query.eq("organisation_id", organisationId);
    }

    if (siteId) {
      query = query.eq("site_id", siteId);
    }

    if (status) {
      query = query.eq("status", status);
    }

    const { data: shifts, error } = await query.order("start_time", { ascending: true });

    if (error) {
      console.error("Shifts API error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Get all site names for mapping
    const siteIds = [...new Set((shifts || []).map(shift => shift.site_id).filter(Boolean))];
    const { data: sites } = await supabase
      .from("sites")
      .select("id, name")
      .in("id", siteIds);

    const siteMap = new Map((sites || []).map(site => [site.id, site.name]));

    // Map database fields to frontend format
    const responseShifts = (shifts || []).map(shift => ({
      id: shift.id,
      organisationId: shift.organisation_id,
      siteId: shift.site_id,
      siteName: siteMap.get(shift.site_id) || null,
      startTime: shift.start_time,
      endTime: shift.end_time,
      breakDuration: shift.break_duration,
      requiredRoles: shift.required_roles || [],
      requiredTraining: shift.required_training || [],
      requiredLicences: shift.required_licences || [],
      status: shift.status,
      createdBy: shift.created_by,
      createdAt: shift.created_at,
    }));

    return NextResponse.json(responseShifts);

  } catch (error) {
    console.error("Shifts API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      organisationId,
      siteId,
      siteName,
      startTime,
      endTime,
      breakDuration,
      requiredRoles,
      requiredTraining,
      requiredLicences,
      status,
      createdBy,
    } = body;

    // Validate required fields
    if (!organisationId || !siteId || !startTime || !endTime || !createdBy) {
      return NextResponse.json(
        { error: "Missing required fields: organisationId, siteId, startTime, endTime, createdBy" },
        { status: 400 }
      );
    }

    // Create the shift
    const { data: shift, error } = await supabase
      .from("shifts")
      .insert({
        organisation_id: organisationId,
        site_id: siteId,
        start_time: startTime,
        end_time: endTime,
        break_duration: breakDuration || 0,
        required_roles: requiredRoles || [],
        required_training: requiredTraining || [],
        required_licences: requiredLicences || [],
        status: status || 'draft',
        created_by: createdBy,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Shift creation error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Get site name for the response
    let fetchedSiteName = null;
    if (siteId) {
      const { data: site } = await supabase
        .from("sites")
        .select("name")
        .eq("id", siteId)
        .single();
      fetchedSiteName = site?.name;
    }

    // Map database fields back to frontend format
    const responseShift = {
      id: shift.id,
      organisationId: shift.organisation_id,
      siteId: shift.site_id,
      siteName: fetchedSiteName,
      startTime: shift.start_time,
      endTime: shift.end_time,
      breakDuration: shift.break_duration,
      requiredRoles: shift.required_roles,
      requiredTraining: shift.required_training,
      requiredLicences: shift.required_licences,
      status: shift.status,
      createdBy: shift.created_by,
      createdAt: shift.created_at,
    };

    return NextResponse.json(responseShift, { status: 201 });

  } catch (error) {
    console.error("Shift creation API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
