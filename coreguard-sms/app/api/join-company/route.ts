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
    
    console.log("Join company API called with:", {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      organisationPin: body.organisationPin,
      hasPassword: !!body.password,
    });

    // Simple validation
    if (!body.firstName || !body.lastName || !body.email || !body.password || !body.organisationPin) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Validate PIN format (6 digits)
    if (!/^\d{6}$/.test(body.organisationPin)) {
      return NextResponse.json(
        { error: "Organisation PIN must be exactly 6 digits" },
        { status: 400 }
      );
    }

    // Validate password match
    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Find organisation by PIN
    const { data: organisation, error: orgError } = await supabase
      .from("organisations")
      .select("id, name")
      .eq("organisation_pin", body.organisationPin)
      .single();

    if (orgError || !organisation) {
      return NextResponse.json(
        { error: "Invalid organisation PIN" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existingUser, error: userCheckError } = await supabase
      .from("users")
      .select("id")
      .eq("email", body.email);

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

    // Hash the password before storing
    const hashedPassword = await bcrypt.hash(body.password, 12);

    // Create the user
    const { data: user, error: userError } = await supabase
      .from("users")
      .insert({
        email: body.email,
        password_hash: hashedPassword,
        role: "employee",
        organisation_id: organisation.id,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (userError || !user) {
      console.error("User creation error:", userError);
      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }

    // Create the employee record
    const { data: employee, error: empError } = await supabase
      .from("employees")
      .insert({
        user_id: user.id,
        organisation_id: organisation.id,
        first_name: body.firstName,
        last_name: body.lastName,
        role: "employee",
        status: "active",
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (empError || !employee) {
      console.error("Employee creation error:", empError);
      // Rollback user creation if employee creation fails
      await supabase.from("users").delete().eq("id", user.id);
      return NextResponse.json(
        { error: "Failed to create employee record" },
        { status: 500 }
      );
    }

    // Send welcome email
    try {
      const fullName = `${body.firstName} ${body.lastName}`;
      await emailService.sendWelcomeEmail(body.email, fullName);
      console.log("Welcome email sent successfully");
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail the registration flow if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Successfully joined company!",
      organisationId: organisation.id,
      userId: user.id,
      employeeId: employee.id,
    });

  } catch (error) {
    console.error("Join company API error:", error);
    return NextResponse.json(
      { 
        error: "An unexpected error occurred: " + (error instanceof Error ? error.message : 'Unknown error')
      },
      { status: 500 }
    );
  }
}
