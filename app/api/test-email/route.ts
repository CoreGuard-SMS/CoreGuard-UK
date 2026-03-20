import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/lib/email/resend';

export async function POST(request: NextRequest) {
  try {
    const { email, testName } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email address is required' },
        { status: 400 }
      );
    }

    // Test basic email sending
    const result = await emailService.sendCustomEmail({
      to: email,
      subject: `CoreGuard SMS Test - ${testName || 'Basic Test'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
            <h1>CoreGuard SMS Email Test</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <p>This is a test email from CoreGuard SMS.</p>
            <p><strong>Test Name:</strong> ${testName || 'Basic Test'}</p>
            <p><strong>Sent at:</strong> ${new Date().toLocaleString()}</p>
            <p>If you receive this email, the Resend integration is working correctly!</p>
            <p>Best regards,<br>The CoreGuard Team</p>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
            <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: 'Test email sent successfully',
      data: result,
    });
  } catch (error) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
