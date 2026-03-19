# CoreGuard SMS - Smart Shift Management System

A comprehensive shift scheduling and site management platform for security services, built with Next.js, TypeScript, and shadcn/ui.

## Features

### Company Portal
- **Dashboard**: Overview of employees, sites, shifts, and compliance alerts
- **Employee Management**: Track employees, qualifications, certifications, and availability
- **Site Management**: Manage locations with PIN-based access control
- **Smart Shift Scheduling**: Auto-suggest employees based on qualifications and availability
- **Compliance Tracking**: Monitor expiring certifications and training requirements
- **Reports**: Generate shift summaries, employee hours, and compliance audits

### Employee Portal
- **Personal Dashboard**: View upcoming shifts and quick stats
- **Shift Management**: View assigned shifts and check in/out
- **Site Access**: PIN-based site access with validation
- **Profile Management**: Update personal info, certifications, and licences
- **Availability Calendar**: Set available/unavailable dates

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Authentication**: Better Auth (email/password)
- **Forms**: React Hook Form + Zod
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
coreguard-sms/
├── app/
│   ├── (auth)/              # Authentication pages
│   │   ├── login/
│   │   ├── register/
│   │   ├── register-company/
│   │   ├── join-company/
│   │   └── forgot-password/
│   ├── (dashboard)/         # Dashboard layouts
│   │   ├── company/         # Company portal routes
│   │   └── employee/        # Employee portal routes
│   ├── api/auth/            # Better Auth API routes
│   └── page.tsx             # Landing page
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── app-sidebar.tsx      # Navigation sidebar
│   └── stat-card.tsx        # Dashboard stat cards
├── lib/
│   ├── auth.ts              # Better Auth config
│   ├── auth-client.ts       # Auth client utilities
│   ├── mock-data.ts         # Placeholder data
│   ├── services/            # Business logic services
│   │   ├── employee-service.ts
│   │   ├── shift-service.ts
│   │   ├── site-service.ts
│   │   └── compliance-service.ts
│   └── utils.ts             # Utility functions
└── types/
    └── index.ts             # TypeScript type definitions
```

## Key Routes

### Public Routes
- `/` - Landing page
- `/login` - User login
- `/register` - Choose registration type
- `/register-company` - Company registration (generates org PIN)
- `/join-company` - Employee registration (requires org PIN)
- `/forgot-password` - Password reset

### Company Portal (`/company/*`)
- `/company/dashboard` - Overview and quick actions
- `/company/employees` - Employee list and management
- `/company/employees/[id]` - Employee details with tabs
- `/company/sites` - Site list and management
- `/company/sites/create` - Create new site with PIN
- `/company/sites/[siteId]` - Site details
- `/company/shifts` - Shift calendar and list
- `/company/shifts/create` - Smart shift creation with employee matching
- `/company/shifts/[shiftId]` - Shift details
- `/company/compliance` - Compliance dashboard and flags
- `/company/reports` - Report generation
- `/company/settings` - Organisation settings and PIN management

### Employee Portal (`/employee/*`)
- `/employee/dashboard` - Personal dashboard
- `/employee/shifts` - My shifts (upcoming/past)
- `/employee/shifts/[shiftId]` - Shift details and check-in
- `/employee/site-access` - Accessible sites
- `/employee/site/[siteId]` - Site details and PIN entry
- `/employee/profile` - Personal info and certifications
- `/employee/profile/availability` - Availability calendar

## Mock Data & Testing

The application currently uses mock data for testing the UI. Key features:

- **Organisation PIN**: `123456` (shown on company registration)
- **Site PINs**: Each site has a unique 6-digit PIN (e.g., `654321` for Downtown Office Complex)
- **Smart Matching**: Employee suggestions based on training, licences, and availability
- **Compliance Tracking**: Automatic flagging of expiring certifications

### Test Flows

1. **Company Registration**:
   - Go to `/register-company`
   - Fill in company details
   - Receive organisation PIN
   - Access company dashboard

2. **Employee Join**:
   - Go to `/join-company`
   - Enter organisation PIN (`123456`)
   - Fill in employee details
   - Access employee dashboard

3. **Create Shift**:
   - Navigate to `/company/shifts/create`
   - Select site and date
   - Click "Get Suggestions" to see smart employee matching
   - Assign employees and create shift

4. **Site Access**:
   - Employee navigates to `/employee/site-access`
   - Select a site
   - Enter site PIN to check in

## Next Steps: Backend Integration

The frontend is complete and ready for backend integration. Next phases:

### Phase 8: Supabase Setup
1. Create Supabase project
2. Set up database schema (10 tables)
3. Configure Row-Level Security policies
4. Set up storage buckets for documents

### Phase 9: Backend Integration
1. Replace mock data with Supabase queries
2. Implement server actions for CRUD operations
3. Integrate Better Auth with Supabase
4. Add real-time subscriptions for live updates

### Phase 10: Production
1. Environment configuration
2. Performance optimization
3. Error handling and logging
4. Deployment setup

## Development

### Adding New Components
```bash
npx shadcn@latest add [component-name]
```

### Code Style
- TypeScript strict mode enabled
- ESLint configured
- Tailwind CSS for styling
- Dark mode support built-in

## License

MIT
