import { EmailOptions } from './resend';

// Additional email templates for CoreGuard SMS operations
export const additionalEmailTemplates = {
  // Shift assignment notification
  shiftAssigned: (employeeName: string, siteName: string, shiftDate: string, shiftTime: string) => ({
    subject: `New Shift Assignment - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Shift Assignment</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${employeeName},</p>
          <p>You have been assigned a new shift:</p>
          <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Site:</strong> ${siteName}</p>
            <p><strong>Date:</strong> ${shiftDate}</p>
            <p><strong>Time:</strong> ${shiftTime}</p>
          </div>
          <p>Please arrive 15 minutes before your shift start time.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Training expiry reminder
  trainingExpiryReminder: (employeeName: string, certificationName: string, expiryDate: string) => ({
    subject: `Training Expiry Reminder - ${certificationName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>Training Expiry Reminder</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${employeeName},</p>
          <p>Your training certification is expiring soon:</p>
          <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Certification:</strong> ${certificationName}</p>
            <p><strong>Expiry Date:</strong> ${expiryDate}</p>
          </div>
          <p>Please renew your certification before the expiry date to maintain compliance.</p>
          <p>Contact your supervisor for assistance with renewal.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Licence expiry reminder
  licenceExpiryReminder: (employeeName: string, licenceType: string, licenceNumber: string, expiryDate: string) => ({
    subject: `Licence Expiry Reminder - ${licenceType}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>Licence Expiry Reminder</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${employeeName},</p>
          <p>Your licence is expiring soon:</p>
          <div style="background: #fef2f2; border: 2px solid #dc2626; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Licence Type:</strong> ${licenceType}</p>
            <p><strong>Licence Number:</strong> ${licenceNumber}</p>
            <p><strong>Expiry Date:</strong> ${expiryDate}</p>
          </div>
          <p>Please renew your licence before the expiry date to maintain compliance.</p>
          <p>Contact your supervisor for assistance with renewal.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Site requirements update
  siteRequirementsUpdated: (siteName: string, newRequirements: string[]) => ({
    subject: `Site Requirements Updated - ${siteName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Site Requirements Updated</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>The requirements for ${siteName} have been updated:</p>
          <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>New Requirements:</strong></p>
            <ul>
              ${newRequirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
          </div>
          <p>Please ensure you meet these requirements for your next shift at this site.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Employee profile updated
  employeeProfileUpdated: (employeeName: string, updatedFields: string[]) => ({
    subject: 'Your Profile Has Been Updated',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
          <h1>Profile Updated</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${employeeName},</p>
          <p>Your profile has been updated with the following changes:</p>
          <div style="background: #dbeafe; border: 2px solid #3b82f6; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <ul>
              ${updatedFields.map(field => `<li>${field}</li>`).join('')}
            </ul>
          </div>
          <p>If you did not make these changes, please contact your administrator.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),

  // Schedule change notification
  scheduleChangeNotification: (employeeName: string, originalShift: string, newShift: string, reason: string) => ({
    subject: 'Schedule Change Notification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
          <h1>Schedule Change</h1>
        </div>
        <div style="padding: 20px; background: #f9fafb;">
          <p>Hi ${employeeName},</p>
          <p>Your schedule has been changed:</p>
          <div style="background: #fef3c7; border: 2px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <p><strong>Original Shift:</strong> ${originalShift}</p>
            <p><strong>New Shift:</strong> ${newShift}</p>
            <p><strong>Reason:</strong> ${reason}</p>
          </div>
          <p>Please acknowledge this change and contact your supervisor if you have any questions.</p>
          <p>Best regards,<br>The CoreGuard Team</p>
        </div>
        <div style="background: #e5e7eb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
        </div>
      </div>
    `,
  }),
};

// Helper functions for additional email scenarios
export const additionalEmailService = {
  sendShiftAssignment: async (email: string, employeeName: string, siteName: string, shiftDate: string, shiftTime: string) => {
    const { sendEmail } = await import('./resend');
    return sendEmail({
      to: email,
      ...additionalEmailTemplates.shiftAssigned(employeeName, siteName, shiftDate, shiftTime),
    });
  },

  sendTrainingExpiryReminder: async (email: string, employeeName: string, certificationName: string, expiryDate: string) => {
    const { sendEmail } = await import('./resend');
    return sendEmail({
      to: email,
      ...additionalEmailTemplates.trainingExpiryReminder(employeeName, certificationName, expiryDate),
    });
  },

  sendLicenceExpiryReminder: async (email: string, employeeName: string, licenceType: string, licenceNumber: string, expiryDate: string) => {
    const { sendEmail } = await import('./resend');
    return sendEmail({
      to: email,
      ...additionalEmailTemplates.licenceExpiryReminder(employeeName, licenceType, licenceNumber, expiryDate),
    });
  },

  sendSiteRequirementsUpdate: async (email: string, siteName: string, newRequirements: string[]) => {
    const { sendEmail } = await import('./resend');
    return sendEmail({
      to: email,
      ...additionalEmailTemplates.siteRequirementsUpdated(siteName, newRequirements),
    });
  },

  sendEmployeeProfileUpdate: async (email: string, employeeName: string, updatedFields: string[]) => {
    const { sendEmail } = await import('./resend');
    return sendEmail({
      to: email,
      ...additionalEmailTemplates.employeeProfileUpdated(employeeName, updatedFields),
    });
  },

  sendScheduleChangeNotification: async (email: string, employeeName: string, originalShift: string, newShift: string, reason: string) => {
    const { sendEmail } = await import('./resend');
    return sendEmail({
      to: email,
      ...additionalEmailTemplates.scheduleChangeNotification(employeeName, originalShift, newShift, reason),
    });
  },
};
