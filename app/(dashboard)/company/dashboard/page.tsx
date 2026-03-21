"use client";

import { Users, MapPin, Calendar, AlertTriangle } from "lucide-react";
import { StatCard } from "@/components/stat-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import WeatherCard from "@/components/weather-card";
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
    <div className="space-y-6">
      <NotificationSystem />
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here&apos;s an overview of your organisation.
          </p>
        </div>
        <WeatherCard />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Active Employees"
          value={stats.employeeCount}
          icon={Users}
          description="Total active employees"
        />
        <StatCard
          title="Active Sites"
          value={stats.siteCount}
          icon={MapPin}
          description="Across all locations"
        />
        <StatCard
          title="Upcoming Shifts"
          value={stats.upcomingShifts}
          icon={Calendar}
          description="Published shifts"
        />
        <StatCard
          title="Compliance Alerts"
          value={stats.complianceAlerts}
          icon={AlertTriangle}
          description={stats.complianceAlerts > 0 ? "Requires attention" : "All clear"}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/company/shifts/create">
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="mr-2 h-4 w-4" />
                Create New Shift
              </Button>
            </Link>
            <Link href="/company/employees">
              <Button className="w-full justify-start" variant="outline">
                <Users className="mr-2 h-4 w-4" />
                Manage Employees
              </Button>
            </Link>
            <Link href="/company/sites/create">
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="mr-2 h-4 w-4" />
                Add New Site
              </Button>
            </Link>
            <Link href="/company/compliance">
              <Button className="w-full justify-start" variant="outline">
                <AlertTriangle className="mr-2 h-4 w-4" />
                View Compliance
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.detail}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.complianceAlerts > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Compliance Alerts
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                You have {stats.complianceAlerts} compliance alert{stats.complianceAlerts > 1 ? 's' : ''} that require attention.
              </p>
            </div>
            <Link href="/company/compliance">
              <Button className="w-full mt-4" variant="outline">
                View All Alerts
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
