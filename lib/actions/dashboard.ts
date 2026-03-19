"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { getEmployees } from "@/lib/services/employee-service";
import { getSites } from "@/lib/services/site-service";
import { getShifts } from "@/lib/services/shift-service";
import { getComplianceFlags } from "@/lib/services/compliance-service";

export async function getRecentActivity(organisationId: string) {
  const activities: any[] = [];
  const now = new Date();

  try {
    // Get recent employees (last 24 hours)
    const employees = await getEmployees({ organisationId });
    const recentEmployees = employees.filter((emp: any) => {
      const empDate = new Date(emp.created_at);
      const hoursDiff = (now.getTime() - empDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });
    
    recentEmployees.forEach((emp: any) => {
      const hoursAgo = Math.floor((now.getTime() - new Date(emp.created_at).getTime()) / (1000 * 60 * 60));
      activities.push({
        id: `emp-${emp.id}`,
        action: "New employee joined",
        detail: `${emp.first_name} ${emp.last_name} joined the organisation`,
        time: hoursAgo === 0 ? "Just now" : hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`
      });
    });

    // Get recent shifts (last 24 hours)
    const shifts = await getShifts({ organisationId });
    const recentShifts = shifts.filter((shift: any) => {
      const shiftDate = new Date(shift.created_at);
      const hoursDiff = (now.getTime() - shiftDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });
    
    recentShifts.forEach((shift: any) => {
      const hoursAgo = Math.floor((now.getTime() - new Date(shift.created_at).getTime()) / (1000 * 60 * 60));
      activities.push({
        id: `shift-${shift.id}`,
        action: "Shift created",
        detail: `${shift.title || 'New shift'} scheduled`,
        time: hoursAgo === 0 ? "Just now" : hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`
      });
    });

    // Get recent compliance alerts (last 24 hours)
    const complianceFlags = await getComplianceFlags(false);
    const recentFlags = complianceFlags.filter((flag: any) => {
      const flagDate = new Date(flag.created_at);
      const hoursDiff = (now.getTime() - flagDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });
    
    recentFlags.forEach((flag: any) => {
      const hoursAgo = Math.floor((now.getTime() - new Date(flag.created_at).getTime()) / (1000 * 60 * 60));
      activities.push({
        id: `flag-${flag.id}`,
        action: "Compliance alert",
        detail: flag.description,
        time: hoursAgo === 0 ? "Just now" : hoursAgo === 1 ? "1 hour ago" : `${hoursAgo} hours ago`
      });
    });

  } catch (error) {
    console.error("Error fetching recent activity:", error);
  }

  // Sort by time (most recent first) and limit to 5 items
  return activities.sort((a, b) => {
    const timeA = parseInt(a.time) || 0;
    const timeB = parseInt(b.time) || 0;
    return timeA - timeB;
  }).slice(0, 5);
}
