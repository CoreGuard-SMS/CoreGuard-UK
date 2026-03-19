// Form Types for CoreGuard SMS

export type EventType = 'patrol' | 'incident' | 'visitor' | 'alarm' | 'maintenance' | 'suspicious_activity' | 'other';

export type IncidentType = 'theft' | 'assault' | 'suspicious_person' | 'property_damage' | 'fire_alarm' | 'medical_emergency' | 'trespassing' | 'other';

export type PatrolStatus = 'secure' | 'issue_found' | 'maintenance_needed' | 'incident';

export type EquipmentStatus = 'pass' | 'fail' | 'not_available';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type IncidentOutcome = 'resolved' | 'ongoing' | 'escalated';

// Daily Log Types
export interface DailyLog {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  log_date: string;
  shift_start_time: string;
  shift_end_time?: string;
  supervisor_name?: string;
  weather?: string;
  total_incidents: number;
  equipment_issues?: string;
  handover_notes?: string;
  officer_signature?: string;
  supervisor_signature?: string;
  status: 'in_progress' | 'completed' | 'submitted';
  created_at: string;
  updated_at: string;
}

export interface DailyLogEntry {
  id: string;
  daily_log_id: string;
  entry_time: string;
  event_type: EventType;
  description: string;
  action_taken?: string;
  reported_to?: string;
  attachments: string[];
  created_at: string;
  updated_at: string;
}

// Incident Report Types
export interface PersonInvolved {
  name: string;
  description: string;
  contact: string;
  role: 'staff' | 'visitor' | 'suspect' | 'witness';
}

export interface IncidentReport {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  incident_date: string;
  incident_time: string;
  incident_type: IncidentType;
  location_detail: string;
  description: string;
  actions_taken: string[];
  people_involved: PersonInvolved[];
  evidence_photos: string[];
  evidence_videos: string[];
  evidence_documents: string[];
  police_contacted: boolean;
  police_reference?: string;
  emergency_services_involved?: string;
  outcome: IncidentOutcome;
  status: 'draft' | 'submitted' | 'reviewed';
  created_at: string;
  updated_at: string;
}

// Patrol Log Types
export interface PatrolLog {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  patrol_date: string;
  status: 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface PatrolLogEntry {
  id: string;
  patrol_log_id: string;
  patrol_time: string;
  area_checked: string;
  status: PatrolStatus;
  notes?: string;
  created_at: string;
}

// Visitor Log Types
export interface VisitorLog {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  visitor_name: string;
  company?: string;
  purpose_of_visit: string;
  person_visiting?: string;
  time_in: string;
  time_out?: string;
  vehicle_registration?: string;
  id_checked: boolean;
  badge_issued: boolean;
  created_at: string;
  updated_at: string;
}

// Vehicle Log Types
export interface VehicleLog {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  vehicle_registration: string;
  driver_name: string;
  company?: string;
  purpose: string;
  arrival_time: string;
  departure_time?: string;
  parking_location?: string;
  created_at: string;
  updated_at: string;
}

// Key Register Types
export interface KeyRegister {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  key_id: string;
  key_description: string;
  issued_to: string;
  time_issued: string;
  time_returned?: string;
  signature?: string;
  status: 'issued' | 'returned';
  created_at: string;
  updated_at: string;
}

// Equipment Check Types
export interface EquipmentItem {
  item: string;
  status: EquipmentStatus;
  notes?: string;
}

export interface EquipmentCheck {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  check_date: string;
  check_time: string;
  radio_status?: EquipmentStatus;
  body_camera_status?: EquipmentStatus;
  torch_status?: EquipmentStatus;
  ppe_status?: EquipmentStatus;
  vehicle_status?: EquipmentStatus;
  other_equipment: EquipmentItem[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

// Site Handover Types
export interface SiteHandover {
  id: string;
  organisation_id: string;
  site_id: string;
  handover_date: string;
  handover_time: string;
  shift_ending_employee_id: string;
  shift_starting_employee_id: string;
  incidents_during_shift?: string;
  open_issues?: string;
  equipment_status?: string;
  special_instructions?: string;
  officer_handing_over_signature?: string;
  officer_taking_over_signature?: string;
  status: 'pending' | 'completed';
  created_at: string;
  updated_at: string;
}

// Risk Report Types
export interface RiskReport {
  id: string;
  organisation_id: string;
  site_id: string;
  shift_id: string;
  employee_id: string;
  report_date: string;
  report_time: string;
  location_detail: string;
  hazard_type: string;
  description: string;
  risk_level: RiskLevel;
  immediate_action_taken?: string;
  photos: string[];
  status: 'open' | 'in_progress' | 'resolved';
  created_at: string;
  updated_at: string;
}
