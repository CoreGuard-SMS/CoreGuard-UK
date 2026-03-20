# CoreGuard SMS - Deployment Guide

## Database Migration Steps

Now that your environment variables are configured, follow these steps to deploy the complete database schema to Supabase.

### Step 1: Access Supabase SQL Editor

1. Go to your Supabase project: https://supabase.com/dashboard/project/fptwotgkihrnlfxxpirx
2. Navigate to **SQL Editor** in the left sidebar

### Step 2: Run Migrations in Order

Execute each migration file in the SQL Editor in this exact order:

#### Migration 1: Initial Schema
**File**: `supabase/migrations/001_initial_schema.sql`

Creates:
- Core tables (organisations, users, employees, sites, shifts, etc.)
- Indexes for performance
- Helper functions (PIN generation, compliance checks)
- Triggers for auto-updates

**Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

#### Migration 2: RLS Policies
**File**: `supabase/migrations/002_rls_policies.sql`

Creates:
- Row-Level Security policies for all core tables
- Helper functions for user context
- Organisation-scoped access control

**Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

#### Migration 3: Seed Data
**File**: `supabase/migrations/003_seed_data.sql`

Creates:
- Test organisation (SecureGuard Services)
- Test users and employees
- Sample sites, shifts, training records
- Demo data for testing

**Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

#### Migration 4: Forms Tables
**File**: `supabase/migrations/004_forms_tables.sql`

Creates:
- 11 forms tables (daily logs, incidents, patrols, etc.)
- Indexes for forms
- Triggers for forms

**Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

#### Migration 5: Forms RLS Policies
**File**: `supabase/migrations/005_forms_rls_policies.sql`

Creates:
- RLS policies for all forms tables
- Employee and admin permissions
- Secure form access

**Action**: Copy entire file contents → Paste in SQL Editor → Click "Run"

### Step 3: Verify Database Setup

After running all migrations, verify in Supabase:

1. **Table Editor** → Should see 22 tables total:
   - Core: organisations, users, employees, sites, shifts, etc. (11 tables)
   - Forms: daily_logs, incident_reports, patrol_logs, etc. (11 tables)

2. **Authentication** → Check RLS is enabled on all tables

3. **SQL Editor** → Run verification query:
```sql
-- Check organisation exists
SELECT * FROM organisations;

-- Check tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Count should be 22
SELECT COUNT(*) as table_count
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### Step 4: Test the Application

1. **Restart dev server** (if running):
```bash
npm run dev
```

2. **Test authentication flow**:
   - Visit http://localhost:3000
   - Try company registration
   - Try employee join with PIN `123456`

3. **Test forms**:
   - Navigate to `/employee/forms`
   - Open Daily Log form
   - Test form submission

### Step 5: Verify RLS Policies

Test that Row-Level Security is working:

1. Create a test user in Supabase Auth
2. Try to access data from different organisations
3. Verify cross-organisation data is blocked

## Database Schema Overview

### Core Tables (11)
1. `organisations` - Company records
2. `users` - Authentication
3. `employees` - Employee profiles
4. `sites` - Locations
5. `site_pin_access` - Access logs
6. `training_records` - Certifications
7. `licences` - Licences
8. `availability` - Employee availability
9. `shifts` - Shift scheduling
10. `shift_assignments` - Employee assignments
11. `compliance_flags` - Compliance alerts

### Forms Tables (11)
1. `daily_logs` - Daily occurrence logs
2. `daily_log_entries` - Log timeline entries
3. `incident_reports` - Incident documentation
4. `patrol_logs` - Patrol sessions
5. `patrol_log_entries` - Patrol checks
6. `visitor_logs` - Visitor tracking
7. `vehicle_logs` - Vehicle tracking
8. `key_register` - Key control
9. `equipment_checks` - Equipment verification
10. `site_handovers` - Shift handovers
11. `risk_reports` - Risk observations

## Test Data Available

After seeding:

**Organisation PIN**: `123456`

**Sites**:
- Downtown Office Complex - PIN: `654321`
- Riverside Shopping Mall - PIN: `789012`
- Tech Park Building A - PIN: `345678`

**Test Users**:
- Admin: `admin@secureguard.com`
- Employees: `john.smith@secureguard.com`, `sarah.johnson@secureguard.com`

## Troubleshooting

### Migration Errors

**Error: "relation already exists"**
- Solution: Drop the table first or skip that migration

**Error: "permission denied for schema auth"**
- Solution: Already fixed in migration 002 - uses `public` schema

**Error: "function does not exist"**
- Solution: Ensure migrations run in order (001 before 002)

### Connection Errors

**Error: "Invalid API key"**
- Solution: Check `.env.local` has correct `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Error: "Failed to fetch"**
- Solution: Verify `NEXT_PUBLIC_SUPABASE_URL` is correct

### RLS Errors

**Error: "new row violates row-level security policy"**
- Solution: Check user is authenticated and has correct role

## Next Steps

After successful deployment:

1. **Phase 9D**: Implement PDF export functionality
2. **Phase 9E**: Create server actions for forms
3. **Phase 10**: Production deployment and testing

## Production Deployment

For production:

1. Create separate Supabase project for production
2. Run all migrations in production database
3. Update environment variables for production
4. Enable automatic backups in Supabase
5. Set up monitoring and logging
6. Configure custom domain
7. Enable SSL/HTTPS

## Support

- Supabase Docs: https://supabase.com/docs
- CoreGuard Docs: See README.md and FORMS_SYSTEM.md
- Database Schema: See migration files in `/supabase/migrations/`
