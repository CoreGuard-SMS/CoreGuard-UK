import { Resend } from 'resend';

// Initialize Resend with API key
// IMPORTANT: Replace 're_xxxxxxxxx' with your real Resend API key in .env.local
const resend = new Resend(process.env.RESEND_API_KEY || 're_xxxxxxxxx');

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    const { data, error } = await resend.emails.send({
      from: options.from || 'onboarding@resend.dev',
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      text: options.text,
      replyTo: options.replyTo,
    } as any);

    if (error) {
      console.error('Resend API error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
}

// Pre-configured email templates for CoreGuard SMS
export const emailTemplates = {
  welcome: (userName: string) => ({
    subject: 'Welcome to CoreGuard SMS',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Welcome to CoreGuard SMS</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${userName},</p>
          <p>Welcome to CoreGuard SMS! Your account has been successfully created.</p>
          <p>You can now log in and start managing your security operations.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Log In to Your Account
            </a>
          </div>
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  companyCreated: (companyName: string, organisationPin: string) => ({
    subject: `Welcome to CoreGuard SMS - ${companyName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Company Created Successfully</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Congratulations!</p>
          <p>Your company <strong>${companyName}</strong> has been successfully created in CoreGuard SMS.</p>
          <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Your Organisation PIN</p>
            <p style="font-size: 32px; font-weight: bold; letter-spacing: 2px; margin: 0;">${organisationPin}</p>
            <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Share this PIN with employees to join your organisation</p>
          </div>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Access Your Dashboard
            </a>
          </div>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  passwordReset: (resetLink: string) => ({
    subject: 'Reset Your CoreGuard SMS Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Password Reset</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>You requested to reset your password for your CoreGuard SMS account.</p>
          <p>Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p>This link will expire in 1 hour for security reasons.</p>
          <p>If you didn't request this password reset, you can safely ignore this email.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};

// Helper functions for common email scenarios
export const emailService = {
  sendWelcomeEmail: async (email: string, userName: string) => {
    return sendEmail({
      to: email,
      ...emailTemplates.welcome(userName),
    });
  },

  sendCompanyCreatedEmail: async (email: string, companyName: string, organisationPin: string) => {
    return sendEmail({
      to: email,
      ...emailTemplates.companyCreated(companyName, organisationPin),
    });
  },

  sendPasswordResetEmail: async (email: string, resetLink: string) => {
    return sendEmail({
      to: email,
      ...emailTemplates.passwordReset(resetLink),
    });
  },

  sendCustomEmail: async (options: EmailOptions) => {
    return sendEmail(options);
  },
};
