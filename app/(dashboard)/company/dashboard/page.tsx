"use client";

import { Users, MapPin, Calendar, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { EnhancedStatCard } from "@/components/ui/enhanced-stat-card";
import { GlassCard } from "@/components/ui/glass-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import NotificationSystem from "@/components/notification-system";
import { useNotifications } from "@/components/notification-system";

export default function CompanyDashboardPage() {
  const { user } = useAuth();
  const notifications = useNotifications();
  const [stats, setStats] = useState({
    employeeCount: 0,
    siteCount: 0,
    upcomingShifts: 0,
    complianceAlerts: 0,
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.organisationId) {
      fetchDashboardData();
      // Add demo notifications
      setTimeout(() => {
        notifications.success("Welcome back!", "Dashboard loaded successfully");
      }, 1000);
      
      setTimeout(() => {
        notifications.info("Weather Update", "Check out the new weather widget");
      }, 2000);
      
      if (stats.complianceAlerts > 0) {
        setTimeout(() => {
          notifications.warning("Compliance Alert", `${stats.complianceAlerts} items need attention`);
        }, 3000);
      }
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch stats
      const statsResponse = await fetch(`/api/dashboard/stats?organisationId=${user.organisationId}`);
      const orgStats = await statsResponse.json();
      setStats(orgStats);

      // Fetch recent activity
      const activityResponse = await fetch(`/api/dashboard/activity?organisationId=${user.organisationId}`);
      const activities = await activityResponse.json();
      setRecentActivity(activities);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 space-y-6">
      <NotificationSystem />
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your organisation.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <EnhancedStatCard
          title="Active Employees"
          value={stats.employeeCount}
          icon={Users}
          description="Total active employees"
          trend={{ value: 12, isPositive: true }}
        />
        <EnhancedStatCard
          title="Active Sites"
          value={stats.siteCount}
          icon={MapPin}
          description="Across all locations"
          trend={{ value: 8, isPositive: true }}
        />
        <EnhancedStatCard
          title="Upcoming Shifts"
          value={stats.upcomingShifts}
          icon={Calendar}
          description="Published shifts"
          trend={{ value: 5, isPositive: false }}
        />
        <EnhancedStatCard
          title="Compliance Alerts"
          value={stats.complianceAlerts}
          icon={AlertTriangle}
          description={stats.complianceAlerts > 0 ? "Requires attention" : "All clear"}
          trend={{ value: 15, isPositive: stats.complianceAlerts === 0 }}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
            <CardDescription className="text-gray-200">Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/company/shifts/create">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Create New Shift
              </Button>
            </Link>
            <Link href="/company/employees">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Employees
              </Button>
            </Link>
            <Link href="/company/sites/create">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Add New Site
              </Button>
            </Link>
            <Link href="/company/compliance">
              <Button className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border-white/20" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Compliance
              </Button>
            </Link>
          </CardContent>
        </GlassCard>

        <GlassCard>
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
            <CardDescription className="text-gray-200">Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium text-white">{activity.action}</p>
                    <p className="text-xs text-gray-200">{activity.detail}</p>
                    <p className="text-xs text-gray-300">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </GlassCard>
      </div>

      {stats.complianceAlerts > 0 && (
        <GlassCard className="border-orange-200/50 bg-orange-500/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              Compliance Alerts
            </CardTitle>
            <CardDescription className="text-orange-200">Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-orange-200">
                You have {stats.complianceAlerts} compliance alert{stats.complianceAlerts > 1 ? 's' : ''} that require attention.
              </p>
            </div>
            <Link href="/company/compliance">
              <Button className="w-full mt-4 bg-orange-500/20 hover:bg-orange-500/30 text-white border-orange-400/30" variant="outline">
                View All Alerts
              </Button>
            </Link>
          </CardContent>
        </GlassCard>
      )}
    </div>
  );
}
