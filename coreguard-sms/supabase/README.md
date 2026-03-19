# Supabase Database Setup

This directory contains the database schema and migrations for CoreGuard SMS.

## Database Schema

The database consists of 11 tables:

1. **organisations** - Company/organisation records with unique PINs
2. **users** - User authentication and role management
3. **employees** - Employee profiles and information
4. **sites** - Location management with site-specific PINs
5. **site_pin_access** - Access log for site PIN entries
6. **training_records** - Employee training certifications
7. **licences** - Employee licences and permits
8. **availability** - Employee availability calendar
9. **shifts** - Shift scheduling and requirements
10. **shift_assignments** - Employee-to-shift assignments
11. **compliance_flags** - Compliance alerts and warnings

## Migrations

### 001_initial_schema.sql
Creates all tables, indexes, and database functions:
- UUID extension
- All 11 tables with proper relationships
- Performance indexes
- Auto-update triggers for `updated_at` columns
- PIN generation functions
- Compliance checking functions

### 002_rls_policies.sql
Implements Row-Level Security (RLS):
- Enables RLS on all tables
- Helper functions for user context
- Policies for company admins (full access to their org)
- Policies for employees (limited access to own data)
- Cross-table security checks

### 003_seed_data.sql
Populates database with test data:
- 1 test organisation (SecureGuard Services)
- 5 test users (1 admin, 4 employees)
- 4 test employees with profiles
- 3 test sites with PINs
- Training records and licences
- Sample shifts and assignments
- Compliance flags
- Availability records

## Running Migrations

### Option 1: Using Supabase CLI

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Link to your project:
```bash
supabase link --project-ref fptwotgkihrnlfxxpirx
```

3. Run migrations:
```bash
supabase db push
```

### Option 2: Using Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/fptwotgkihrnlfxxpirx
2. Navigate to SQL Editor
3. Copy and paste each migration file in order:
   - 001_initial_schema.sql
   - 002_rls_policies.sql
   - 003_seed_data.sql
4. Execute each migration

### Option 3: Using Migration Files Directly

Run each SQL file against your Supabase database in order.

## Environment Variables

After running migrations, update your `.env.local` file with:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fptwotgkihrnlfxxpirx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-from-supabase
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-from-supabase
```

Get your keys from: https://supabase.com/dashboard/project/fptwotgkihrnlfxxpirx/settings/api

## Test Data

After seeding, you can test with:

**Organisation PIN**: `123456`
**Site PINs**: 
- Downtown Office Complex: `654321`
- Riverside Shopping Mall: `789012`
- Tech Park Building A: `345678`

**Test Users**:
- Admin: `admin@secureguard.com`
- Employee: `john.smith@secureguard.com`

(Note: Passwords need to be properly hashed with Better Auth)

## Security Features

### Row-Level Security (RLS)
All tables have RLS enabled with policies that:
- Restrict data access to users within the same organisation
- Allow company admins full CRUD access to their org's data
- Allow employees read access and limited write access to their own data
- Prevent cross-organisation data leaks

### Helper Functions
- `auth.user_organisation_id()` - Gets current user's organisation
- `auth.is_company_admin()` - Checks if user is admin
- `auth.user_employee_id()` - Gets current user's employee record

### Automatic Features
- `updated_at` timestamps auto-update on record changes
- Organisation PINs are unique and auto-generated
- Site PINs are auto-generated
- Compliance flags auto-created for expiring certifications

## Database Functions

### generate_organisation_pin()
Generates a unique 6-digit PIN for organisations.

### generate_site_pin()
Generates a 6-digit PIN for sites.

### check_expiring_certifications()
Scans for certifications/licences expiring in 30 days and creates compliance flags.

### update_updated_at_column()
Trigger function that updates the `updated_at` timestamp on row updates.

## Indexes

Performance indexes are created on:
- Foreign keys
- Frequently queried columns (status, dates, email)
- Join columns
- Filter columns

## Next Steps

1. Run the migrations in your Supabase project
2. Update `.env.local` with your Supabase credentials
3. Test the connection with the Supabase client
4. Implement server actions to replace mock data
5. Test RLS policies with different user roles
