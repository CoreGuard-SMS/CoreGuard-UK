"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EnhancedStatCard } from "@/components/ui/enhanced-stat-card";
import { Calendar, Clock, MapPin, CheckCircle, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { getEmployeeShifts } from "@/lib/actions/shift";

// Native date utilities to avoid TDZ issues
const format = (date: Date, formatStr: string) => {
  switch (formatStr) {
    case 'PPP':
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    case 'p':
      return date.toLocaleTimeString('en-GB', { 
        hour: 'numeric', 
        minute: '2-digit' 
      });
    default:
      return date.toLocaleString();
  }
};

const isFuture = (date: Date) => date > new Date();
const isToday = (date: Date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

export default function EmployeeDashboardPage() {
  const [shifts, setShifts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const employeeId = "emp-1"; // This should come from auth context
        const shiftData = await getEmployeeShifts(employeeId);
        setShifts(shiftData || []);
      } catch (error) {
        console.error('Error fetching shifts:', error);
        setShifts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchShifts();
  }, []);

  const upcomingShifts = shifts.filter(s => s.startTime && (isFuture(new Date(s.startTime)) || isToday(new Date(s.startTime))));
  const nextShift = upcomingShifts[0];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Welcome back, John!
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s your schedule and updates
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <EnhancedStatCard
          title="Shifts This Week"
          value={upcomingShifts.length}
          icon={Calendar}
          description="Upcoming shifts"
          trend={{ value: 8, isPositive: true }}
        />

        <EnhancedStatCard
          title="Hours This Month"
          value="32"
          icon={Clock}
          description="Total hours worked"
          trend={{ value: 12, isPositive: true }}
        />

        <EnhancedStatCard
          title="Sites Accessible"
          value="2"
          icon={MapPin}
          description="Active sites"
          trend={{ value: 0, isPositive: true }}
        />
      </div>

      {nextShift && (
        <GlassCard className="border-primary/50 bg-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Next Shift</CardTitle>
                <CardDescription className="text-gray-200">
                  {isToday(nextShift.startTime) ? 'Today' : format(nextShift.startTime, 'EEEE, MMMM dd')}
                </CardDescription>
              </div>
              <Badge variant="default" className="bg-primary/80">Upcoming</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-white">{nextShift.siteName}</p>
                  <p className="text-xs text-gray-300">Site</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {format(nextShift.startTime, 'h:mm a')}
                  </p>
                  <p className="text-xs text-gray-300">Start time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {format(nextShift.endTime, 'h:mm a')}
                  </p>
                  <p className="text-xs text-gray-300">End time</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-300" />
                <div>
                  <p className="text-sm font-medium text-white">
                    {Math.round((nextShift.endTime.getTime() - nextShift.startTime.getTime()) / (1000 * 60 * 60))}h
                  </p>
                  <p className="text-xs text-gray-300">Duration</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Link href={`/employee/shifts/${nextShift.id}`} className="flex-1">
                <Button className="w-full bg-primary/80 hover:bg-primary text-white">View Details</Button>
              </Link>
              {isToday(nextShift.startTime) && (
                <Button variant="outline" className="flex-1 bg-white/10 hover:bg-white/20 text-white border-white/20">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Check In
                </Button>
              )}
            </div>
          </CardContent>
        </GlassCard>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Upcoming Shifts</CardTitle>
            <CardDescription className="text-gray-200">{upcomingShifts.length} shifts scheduled</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingShifts.slice(0, 3).map((shift) => (
                <div key={shift.id} className="flex items-center justify-between p-3 border border-white/20 rounded-lg bg-white/5">
                  <div className="space-y-1">
                    <p className="font-medium text-white">{shift.siteName}</p>
                    <p className="text-sm text-gray-300">
                      {format(shift.startTime, 'MMM dd • h:mm a')} - {format(shift.endTime, 'h:mm a')}
                    </p>
                  </div>
                  <Link href={`/employee/shifts/${shift.id}`}>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">View</Button>
                  </Link>
                </div>
              ))}
              {upcomingShifts.length === 0 && (
                <p className="text-sm text-gray-300 text-center py-4">
                  No upcoming shifts
                </p>
              )}
            </div>
            <Link href="/employee/shifts">
              <Button variant="outline" className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white border-white/20">
                View All Shifts
              </Button>
            </Link>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-200">Common tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/employee/shifts">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                View My Schedule
              </Button>
            </Link>
            <Link href="/employee/site-access">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Access Site
              </Button>
            </Link>
            <Link href="/employee/profile/availability">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <Clock className="mr-2 h-4 w-4" />
                Update Availability
              </Button>
            </Link>
            <Link href="/employee/profile">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <CheckCircle className="mr-2 h-4 w-4" />
                View Certifications
              </Button>
            </Link>
          </CardContent>
        </GlassCard>
      </div>
    </div>
  );
}
