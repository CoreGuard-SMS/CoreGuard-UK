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
    const siteId = searchParams.get('id');

    // If siteId is provided, get single site
    if (siteId) {
      const { data: site, error } = await supabase
        .from("sites")
        .select("*")
        .eq("id", siteId)
        .single();

      if (error) {
        console.error("Site API error:", error);
        return NextResponse.json(
          { error: `Database error: ${error.message}` },
          { status: 500 }
        );
      }

      if (!site) {
        return NextResponse.json(
          { error: "Site not found" },
          { status: 404 }
        );
      }

      // Map database fields to frontend format
      const responseSite = {
        id: site.id,
        organisationId: site.organisation_id,
        name: site.name,
        address: site.address,
        contactName: site.contact_name,
        contactPhone: site.contact_phone,
        sitePin: site.site_pin,
        requirements: site.requirements || { requiredTraining: [], requiredLicences: [] },
        createdAt: site.created_at,
      };

      return NextResponse.json(responseSite);
    }

    // Otherwise, require organisationId and get all sites
    if (!organisationId) {
      return NextResponse.json(
        { error: "Organisation ID is required" },
        { status: 400 }
      );
    }

    // Get sites for the organisation
    const { data: sites, error } = await supabase
      .from("sites")
      .select("*")
      .eq("organisation_id", organisationId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Sites API error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(sites || []);

  } catch (error) {
    console.error("Sites API error:", error);
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
      name,
      address,
      contactName,
      contactPhone,
      sitePin,
      requirements,
    } = body;

    // Validate required fields
    if (!organisationId || !name || !address || !contactName || !contactPhone || !sitePin) {
      return NextResponse.json(
        { error: "Missing required fields: organisationId, name, address, contactName, contactPhone, sitePin" },
        { status: 400 }
      );
    }

    // Create the site
    const { data: site, error } = await supabase
      .from("sites")
      .insert({
        organisation_id: organisationId,
        name,
        address,
        contact_name: contactName,
        contact_phone: contactPhone,
        site_pin: sitePin,
        requirements: requirements || { requiredTraining: [], requiredLicences: [] },
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Site creation error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Map database fields back to frontend format
    const responseSite = {
      id: site.id,
      organisationId: site.organisation_id,
      name: site.name,
      address: site.address,
      contactName: site.contact_name,
      contactPhone: site.contact_phone,
      sitePin: site.site_pin,
      requirements: site.requirements,
      createdAt: site.created_at,
    };

    return NextResponse.json(responseSite, { status: 201 });

  } catch (error) {
    console.error("Site creation API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
