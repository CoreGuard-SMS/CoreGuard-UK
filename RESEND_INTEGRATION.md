# Resend Email Integration

This document describes how to use the Resend API integration in CoreGuard SMS.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install resend
```

### 2. Configure Environment Variables

Add your Resend API key to your `.env.local` file:

```env
# Replace 're_xxxxxxxxx' with your actual Resend API key
RESEND_API_KEY=re_xxxxxxxxx
```

**IMPORTANT**: You must replace `re_xxxxxxxxx` with your real Resend API key!

### 3. Get Your Resend API Key

1. Sign up at [resend.com](https://resend.com)
2. Go to your dashboard
3. Navigate to API Keys
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## Usage Examples

### Basic Email Sending

```typescript
import { emailService } from '@/lib/email/resend';

// Send a custom email
await emailService.sendCustomEmail({
  to: 'user@example.com',
  subject: 'Hello World',
  html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
});
```

### Pre-built Email Templates

```typescript
import { emailService } from '@/lib/email/resend';

// Welcome email
await emailService.sendWelcomeEmail('user@example.com', 'John Doe');

// Company created email
await emailService.sendCompanyCreatedEmail(
  'admin@company.com', 
  'Security Corp', 
  '123456'
);

// Password reset email
await emailService.sendPasswordResetEmail(
  'user@example.com',
  'https://yourapp.com/reset-password?token=abc123'
);
```

### Advanced Usage

```typescript
import { sendEmail, emailTemplates } from '@/lib/email/resend';

// Send with custom options
await sendEmail({
  to: ['user1@example.com', 'user2@example.com'],
  subject: 'Multiple Recipients',
  html: '<p>This email goes to multiple people</p>',
  from: 'custom@yourdomain.com',
  replyTo: 'support@yourdomain.com'
});

// Use template with customization
const template = emailTemplates.welcome('John Doe');
await sendEmail({
  to: 'user@example.com',
  ...template,
  subject: 'Custom Welcome Subject'
});
```

## Available Email Templates

### Welcome Email
- **Purpose**: Send welcome emails to new users
- **Function**: `sendWelcomeEmail(email, userName)`
- **Customization**: User name, login link

### Company Created Email
- **Purpose**: Send confirmation when a new company is created
- **Function**: `sendCompanyCreatedEmail(email, companyName, organisationPin)`
- **Customization**: Company name, organisation PIN, dashboard link

### Password Reset Email
- **Purpose**: Send password reset links
- **Function**: `sendPasswordResetEmail(email, resetLink)`
- **Customization**: Reset link, expiration warning

## Testing the Integration

### API Test Endpoint

You can test the email integration using the built-in test endpoint:

```bash
curl -X POST http://localhost:3000/api/test-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "testName": "My Test"
  }'
```

### Test in Your Code

```typescript
// Test basic functionality
try {
  const result = await emailService.sendCustomEmail({
    to: 'kyle.robb.civiguard@gmail.com',
    subject: 'Hello World',
    html: '<p>Congrats on sending your <strong>first email</strong>!</p>'
  });
  
  console.log('Email sent successfully:', result);
} catch (error) {
  console.error('Failed to send email:', error);
}
```

## Integration Points

### Company Registration
Add email sending to the company registration flow:

```typescript
// In register-company/page.tsx
import { emailService } from '@/lib/email/resend';

// After successful company creation
await emailService.sendCompanyCreatedEmail(
  formData.adminEmail,
  formData.companyName,
  formData.organisationPIN
);
```

### User Registration
Add welcome emails for new users:

```typescript
// After successful user registration
await emailService.sendWelcomeEmail(userEmail, userName);
```

### Password Reset
Implement password reset functionality:

```typescript
// Generate reset token and send email
const resetToken = generateResetToken();
const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

await emailService.sendPasswordResetEmail(userEmail, resetLink);
```

## Error Handling

The email service includes comprehensive error handling:

```typescript
try {
  await emailService.sendCustomEmail({
    to: 'user@example.com',
    subject: 'Test',
    html: '<p>Test email</p>'
  });
} catch (error) {
  // Errors are logged automatically
  // Handle user feedback here
  console.error('Email failed to send:', error);
}
```

## Security Considerations

1. **API Key Security**: Never expose your Resend API key in client-side code
2. **Environment Variables**: Always use environment variables for sensitive data
3. **Rate Limiting**: Be aware of Resend's rate limits
4. **Input Validation**: Validate email addresses before sending

## Troubleshooting

### Common Issues

1. **API Key Error**: Make sure you replaced `re_xxxxxxxxx` with your real API key
2. **Environment Variables**: Ensure `.env.local` is properly configured
3. **Domain Verification**: Verify your sending domain in Resend dashboard
4. **Rate Limits**: Check if you've hit Resend's rate limits

### Debug Mode

Enable debug logging by setting:

```env
DEBUG=resend
```

## Next Steps

1. Replace the placeholder API key with your real Resend API key
2. Test the integration using the test endpoint
3. Add email sending to your registration flows
4. Customize email templates as needed
5. Set up domain verification for production use

## Support

- [Resend Documentation](https://resend.com/docs)
- [Resend API Reference](https://resend.com/docs/api-reference)
- [CoreGuard SMS Documentation](./README.md)
