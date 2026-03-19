import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { emailService } from '@/lib/email/resend';
import bcrypt from 'bcryptjs';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("API route called with:", {
      companyName: body.companyName,
      organisationPIN: body.organisationPIN,
      adminName: body.adminName,
      adminEmail: body.adminEmail,
      hasPassword: !!body.adminPassword,
    });

    // Simple validation
    if (!body.companyName || !body.organisationPIN || !body.adminName || !body.adminEmail || !body.adminPassword) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(body.organisationPIN)) {
      return NextResponse.json(
        { error: "Organisation PIN must be exactly 6 digits" },
        { status: 400 }
      );
    }

    // Check if company already exists
    const { data: existingCompany, error: checkError } = await supabase
      .from("organisations")
      .select("id")
      .eq("name", body.companyName);

    if (checkError) {
      console.error("Company check error:", checkError);
      return NextResponse.json(
        { error: "Error checking company existence" },
        { status: 500 }
      );
    }

    if (existingCompany && existingCompany.length > 0) {
      return NextResponse.json(
        { error: "Company with this name already exists" },
        { status: 400 }
      );
    }

    // Check if admin email already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", body.adminEmail);

    if (userCheckError) {
      console.error("Email check error:", userCheckError);
      return NextResponse.json(
        { error: `Database error: ${userCheckError.message}` },
        { status: 500 }
      );
    }

    if (existingUser && existingUser.length > 0) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if organisation PIN already exists
    const { data: existingPin, error: pinCheckError } = await supabase
      .from("organisations")
      .select("id")
      .eq("organisation_pin", body.organisationPIN);

    if (pinCheckError) {
      console.error("PIN check error:", pinCheckError);
      return NextResponse.json(
        { error: `Database error: ${pinCheckError.message}` },
        { status: 500 }
      );
    }

    if (existingPin && existingPin.length > 0) {
      return NextResponse.json(
        { error: "This organisation PIN is already in use. Please choose a different PIN." },
        { status: 400 }
      );
    }

    // Create the organisation
    const { data: organisation, error: orgError } = await supabase
      .from("organisations")
      .insert({
        name: body.companyName,
        industry: "Security Services",
        contact_email: body.adminEmail,
        organisation_pin: body.organisationPIN,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (orgError || !organisation) {
      console.error("Organisation creation error:", orgError);
      return NextResponse.json(
        { error: `Failed to create organisation: ${orgError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(body.adminPassword, 12);

    // Create the admin user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email: body.adminEmail,
        password_hash: hashedPassword,
        role: "company_admin",
        organisation_id: organisation.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError || !user) {
      console.error("User creation error:", userError);
      // Rollback organisation creation if user creation fails
      await supabase.from("organisations").delete().eq("id", organisation.id);
      return NextResponse.json(
        { error: "Failed to create admin user account" },
        { status: 500 }
      );
    }

    // Split adminName into first and last name
    const nameParts = body.adminName.trim().split(' ');
    const firstName = nameParts[0] || 'Admin';
    const lastName = nameParts.slice(1).join(' ') || 'User';

    // Create the admin employee record
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .insert({
        user_id: user.id,
        organisation_id: organisation.id,
        first_name: firstName,
        last_name: lastName,
        role: "company_admin",
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (empError || !employee) {
      console.error("Employee creation error:", empError);
      // Rollback both user and organisation creation if employee creation fails
      await supabase.from("users").delete().eq("id", user.id);
      await supabase.from("organisations").delete().eq("id", organisation.id);
      return NextResponse.json(
        { error: "Failed to create admin employee record" },
        { status: 500 }
      );
    }

    // Create initial sites for the organisation
    const defaultSites = [
      { 
        name: "Main Office", 
        address: "Company Headquarters", 
        contact_name: body.adminName,
        contact_phone: "+44 20 1234 5678",
        site_pin: "111111" 
      },
      { 
        name: "Site A", 
        address: "Primary Location", 
        contact_name: body.adminName,
        contact_phone: "+44 20 1234 5678",
        site_pin: "222222" 
      },
      { 
        name: "Site B", 
        address: "Secondary Location", 
        contact_name: body.adminName,
        contact_phone: "+44 20 1234 5678",
        site_pin: "333333" 
      },
    ];

    const { error: sitesError } = await supabase
      .from("sites")
      .insert(
        defaultSites.map((site) => ({
          organisation_id: organisation.id,
          name: site.name,
          address: site.address,
          contact_name: site.contact_name,
          contact_phone: site.contact_phone,
          site_pin: site.site_pin,
          requirements: JSON.stringify([]), // Empty requirements array
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );

    if (sitesError) {
      console.error("Sites creation error:", sitesError);
      // Don't fail the whole operation, just log it
    }

    // Send company creation email
    try {
      await emailService.sendCompanyCreatedEmail(
        body.adminEmail,
        body.companyName,
        body.organisationPIN
      );
      console.log("Company creation email sent successfully");
    } catch (emailError) {
      console.error('Failed to send company creation email:', emailError);
      // Don't fail the registration flow if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Company registered successfully!",
      organisationId: organisation.id,
      userId: user.id,
      employeeId: employee.id,
    });

  } catch (error) {
    console.error("API route error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
