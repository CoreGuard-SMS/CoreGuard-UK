"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import {
  LayoutDashboard,
  Users,
  MapPin,
  Calendar,
  FileCheck,
  BarChart3,
  Settings,
  Building2,
  UserCircle,
  Clock,
  Shield,
  LogOut,
} from "lucide-react";
import ThemeToggle from "@/components/theme-toggle";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const companyNavItems = [
  {
    title: "Dashboard",
    url: "/company/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Employees",
    url: "/company/employees",
    icon: Users,
  },
  {
    title: "Sites",
    url: "/company/sites",
    icon: MapPin,
  },
  {
    title: "Shifts",
    url: "/company/shifts",
    icon: Calendar,
  },
  {
    title: "Forms",
    url: "/company/forms",
    icon: FileCheck,
  },
  {
    title: "Compliance",
    url: "/company/compliance",
    icon: FileCheck,
  },
  {
    title: "Reports",
    url: "/company/reports",
    icon: BarChart3,
  },
  {
    title: "Settings",
    url: "/company/settings",
    icon: Settings,
  },
];

const employeeNavItems = [
  {
    title: "Dashboard",
    url: "/employee/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "My Shifts",
    url: "/employee/shifts",
    icon: Calendar,
  },
  {
    title: "Site Access",
    url: "/employee/site-access",
    icon: Shield,
  },
  {
    title: "Forms",
    url: "/employee/forms",
    icon: FileCheck,
  },
  {
    title: "Profile",
    url: "/employee/profile",
    icon: UserCircle,
  },
];

interface AppSidebarProps {
  role: "company" | "employee";
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    organisationId?: string;
  };
}

export function AppSidebar({ role, user }: AppSidebarProps) {
  const pathname = usePathname();
  const { push } = useNavigationLoading();
  const [organisation, setOrganisation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navItems = role === "company" ? companyNavItems : employeeNavItems;

  // Debug: Log what user data is being passed
  console.log("AppSidebar received user:", user);

  useEffect(() => {
    if (user?.id) {
      fetchOrganisation();
    }
  }, [user]);

  const fetchOrganisation = async () => {
    if (!user?.id) {
      console.log("No user ID available for fetching organisation");
      return;
    }
    
    setLoading(true);
    try {
      console.log("Fetching organisation for user ID:", user.id);
      const response = await fetch(`/api/organisation?userId=${user.id}`);
      const orgData = await response.json();
      console.log("Fetched organisation data:", orgData);
      setOrganisation(orgData);
    } catch (error) {
      console.error("Error fetching organisation for sidebar:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold">CoreGuard SMS</p>
              <p className="text-xs text-muted-foreground">
                {role === "company" ? "Company Portal" : "Employee Portal"}
              </p>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    isActive={pathname === item.url}
                    onClick={() => push(item.url)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 w-full hover:bg-sidebar-accent rounded-lg p-2 transition-colors">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left text-sm">
              <p className="font-medium">{user?.name || 'User'}</p>
              <p className="text-xs text-muted-foreground truncate">
                {organisation?.name || 'Loading...'}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
