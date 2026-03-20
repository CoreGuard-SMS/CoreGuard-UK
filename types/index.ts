export type UserRole = 'company_admin' | 'employee';

export type ShiftStatus = 'draft' | 'published' | 'in_progress' | 'completed' | 'cancelled';

export type EmployeeStatus = 'active' | 'inactive' | 'suspended';

export type ComplianceFlag = 'expiring_cert' | 'missing_training' | 'access_violation' | 'other';

export type CalendarView = 'month' | 'week' | 'day' | 'agenda';

export type CalendarEventType = 'shift' | 'training' | 'holiday' | 'unavailable';

export interface Organisation {
  id: string;
  name: string;
  industry: string;
  contactEmail: string;
  organisationPin: string;
  createdAt: Date;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  organisationId: string;
  createdAt: Date;
}

export interface Employee {
  id: string;
  userId: string;
  organisationId: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  status: EmployeeStatus;
  emergencyContact: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Site {
  id: string;
  organisationId: string;
  name: string;
  address: string;
  contactName: string;
  contactPhone: string;
  sitePin: string;
  requirements: {
    requiredTraining: string[];
    requiredLicences: string[];
  };
  createdAt: Date;
}

export interface SitePinAccess {
  id: string;
  siteId: string;
  employeeId: string;
  pinEntered: string;
  accessGranted: boolean;
  accessedAt: Date;
}

export interface TrainingRecord {
  id: string;
  employeeId: string;
  trainingType: string;
  certificationName: string;
  issueDate: Date;
  expiryDate: Date;
  documentUrl?: string;
  status: 'active' | 'expired' | 'expiring_soon';
}

export interface Licence {
  id: string;
  employeeId: string;
  licenceType: string;
  licenceNumber: string;
  issueDate: Date;
  expiryDate: Date;
  documentUrl?: string;
  status: 'active' | 'expired' | 'expiring_soon';
}

export interface Availability {
  id: string;
  employeeId: string;
  date: Date;
  isAvailable: boolean;
  recurringPattern?: {
    type: 'weekly' | 'monthly';
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  notes?: string;
}

export interface Shift {
  id: string;
  organisationId: string;
  siteId: string;
  siteName?: string;
  startTime: Date;
  endTime: Date;
  breakDuration: number;
  requiredRoles: {
    role: string;
    count: number;
  }[];
  requiredTraining: string[];
  requiredLicences: string[];
  status: ShiftStatus;
  createdBy: string;
  createdAt: Date;
  // Calendar-specific properties
  color?: string;
  allDay?: boolean;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[];
  };
}

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: CalendarEventType;
  color?: string;
  allDay?: boolean;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    endDate?: Date;
    daysOfWeek?: number[];
  };
  data?: any; // Additional data for different event types
}

export interface CalendarDay {
  date: Date;
  events: CalendarEvent[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
}

export interface ShiftAssignment {
  id: string;
  shiftId: string;
  employeeId: string;
  employeeName?: string;
  assignedRole: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  status: 'assigned' | 'checked_in' | 'checked_out' | 'no_show';
  notes?: string;
}

export interface ComplianceFlagRecord {
  id: string;
  employeeId: string;
  employeeName?: string;
  flagType: ComplianceFlag;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  resolved: boolean;
  createdAt: Date;
}

export interface EmployeeMatch {
  employee: Employee;
  matchScore: number;
  reasons: string[];
  qualifications: {
    training: TrainingRecord[];
    licences: Licence[];
  };
  availability: boolean;
}
