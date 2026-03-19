# CoreGuard SMS - Backend Integration Guide

## Phase 8 Complete: Supabase Backend Setup ✅

The database schema, Row-Level Security policies, and seed data have been created and are ready to deploy to your Supabase project.

## What's Been Created

### Database Schema (11 Tables)
✅ **organisations** - Company records with unique PINs
✅ **users** - Authentication and role management  
✅ **employees** - Employee profiles and details
✅ **sites** - Location management with site PINs
✅ **site_pin_access** - Access logging
✅ **training_records** - Certifications tracking
✅ **licences** - Licence management
✅ **availability** - Employee availability calendar
✅ **shifts** - Shift scheduling
✅ **shift_assignments** - Employee-to-shift mapping
✅ **compliance_flags** - Compliance alerts

### Security Features
✅ Row-Level Security (RLS) enabled on all tables
✅ Organisation-scoped data access
✅ Role-based permissions (admin vs employee)
✅ Helper functions for user context
✅ Cross-table security checks

### Database Functions
✅ `generate_organisation_pin()` - Unique 6-digit PIN generation
✅ `generate_site_pin()` - Site PIN generation
✅ `check_expiring_certifications()` - Auto-flag expiring certs
✅ `update_updated_at_column()` - Auto-update timestamps

### Performance Optimizations
✅ Indexes on all foreign keys
✅ Indexes on frequently queried columns
✅ Indexes on filter/search columns

## Next Steps: Deploy to Supabase

### Step 1: Get Your Supabase Credentials

1. Go to your Supabase project: https://supabase.com/dashboard/project/fptwotgkihrnlfxxpirx
2. Navigate to **Settings** → **API**
3. Copy the following:
   - Project URL
   - `anon` public key
   - `service_role` secret key

### Step 2: Update Environment Variables

Edit `.env.local` and replace with your actual keys:

```env
NEXT_PUBLIC_SUPABASE_URL=https://fptwotgkihrnlfxxpirx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-actual-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 3: Run Database Migrations

**Option A: Using Supabase Dashboard (Recommended)**

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file in order:
   - `supabase/migrations/001_initial_schema.sql`
   - `supabase/migrations/002_rls_policies.sql`
   - `supabase/migrations/003_seed_data.sql`
3. Click **Run** for each file

**Option B: Using Supabase CLI**

```bash
# Install CLI
npm install -g supabase

# Link project
supabase link --project-ref fptwotgkihrnlfxxpirx

# Push migrations
supabase db push
```

### Step 4: Verify Database Setup

After running migrations, verify in Supabase dashboard:

1. **Table Editor** - Check all 11 tables exist
2. **Authentication** - Verify RLS is enabled
3. **SQL Editor** - Run test query:

```sql
SELECT * FROM organisations;
```

You should see "SecureGuard Services" with PIN `123456`.

## Phase 9: Implement Server Actions

Now that the database is ready, we need to create server actions to replace the mock data.

### Server Actions to Create

1. **Organisation Actions** (`app/actions/organisation.ts`)
   - `createOrganisation()` - Register new company
   - `joinOrganisation()` - Employee join with PIN
   - `getOrganisation()` - Fetch org details

2. **Employee Actions** (`app/actions/employee.ts`)
   - `getEmployees()` - List with filters
   - `getEmployeeById()` - Employee details
   - `updateEmployee()` - Edit employee
   - `getSuggestedEmployees()` - Smart matching

3. **Site Actions** (`app/actions/site.ts`)
   - `createSite()` - Create with PIN
   - `getSites()` - List sites
   - `getSiteById()` - Site details
   - `validateSitePin()` - PIN verification

4. **Shift Actions** (`app/actions/shift.ts`)
   - `createShift()` - Create shift
   - `getShifts()` - List with filters
   - `getShiftById()` - Shift details
   - `assignEmployees()` - Assign to shift
   - `checkIn()` / `checkOut()` - Attendance

5. **Compliance Actions** (`app/actions/compliance.ts`)
   - `getComplianceFlags()` - Active flags
   - `getExpiringCertifications()` - Expiring certs
   - `resolveFlag()` - Mark resolved

### Integration Better Auth with Supabase

Update `lib/auth.ts` to use Supabase as the database:

```typescript
import { betterAuth } from "better-auth";
import { supabaseAdapter } from "better-auth/adapters/supabase";

export const auth = betterAuth({
  database: supabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    key: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### Update Components to Use Server Actions

Replace mock service calls with server actions:

**Before:**
```typescript
import { getEmployees } from '@/lib/services/employee-service';
const employees = getEmployees();
```

**After:**
```typescript
import { getEmployees } from '@/app/actions/employee';
const employees = await getEmployees();
```

## Testing Checklist

After implementing server actions:

- [ ] Company registration creates org with PIN
- [ ] Employee can join using org PIN
- [ ] Login redirects to correct portal (company/employee)
- [ ] Company admin can create sites with PINs
- [ ] Smart shift matching suggests qualified employees
- [ ] Employee can enter site PIN for access
- [ ] Compliance flags show expiring certifications
- [ ] RLS prevents cross-organisation data access
- [ ] All CRUD operations work correctly

## Database Schema Reference

### Key Relationships

```
organisations (1) ──→ (many) users
organisations (1) ──→ (many) employees
organisations (1) ──→ (many) sites
organisations (1) ──→ (many) shifts

users (1) ──→ (1) employees
employees (1) ──→ (many) training_records
employees (1) ──→ (many) licences
employees (1) ──→ (many) availability
employees (1) ──→ (many) shift_assignments
employees (1) ──→ (many) compliance_flags

sites (1) ──→ (many) shifts
sites (1) ──→ (many) site_pin_access

shifts (1) ──→ (many) shift_assignments
```

### Test Data Available

After seeding:

**Organisation:**
- Name: SecureGuard Services
- PIN: `123456`

**Sites:**
- Downtown Office Complex - PIN: `654321`
- Riverside Shopping Mall - PIN: `789012`
- Tech Park Building A - PIN: `345678`

**Employees:**
- John Smith (Security Guard)
- Sarah Johnson (Senior Security Guard)
- Michael Brown (Security Supervisor)
- Emily Davis (Security Guard)

## Production Considerations

Before deploying to production:

1. **Environment Variables**
   - Set production Supabase URL and keys
   - Use different database for production

2. **Security**
   - Review and test all RLS policies
   - Ensure service role key is never exposed to client
   - Implement rate limiting on auth endpoints

3. **Performance**
   - Monitor query performance
   - Add additional indexes if needed
   - Implement caching for frequently accessed data

4. **Backups**
   - Enable automatic backups in Supabase
   - Test restore procedures

5. **Monitoring**
   - Set up error logging
   - Monitor database performance
   - Track API usage

## Support

For issues or questions:
- Supabase Docs: https://supabase.com/docs
- Better Auth Docs: https://better-auth.com
- Next.js Docs: https://nextjs.org/docs
