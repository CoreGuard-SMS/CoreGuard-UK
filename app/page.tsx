"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/theme-toggle";
import { 
  Shield, 
  Users, 
  MapPin, 
  Calendar, 
  FileCheck, 
  BarChart3,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  AlertTriangle,
  FileText,
  Car,
  Key,
  RefreshCw,
  TrendingUp,
  Lock,
  Zap,
  Globe
} from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: Users,
      title: "Employee Management",
      description: "Track qualifications, certifications, and availability in one centralized platform",
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-950"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "AI-powered employee matching based on skills, licenses, and availability",
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-950"
    },
    {
      icon: MapPin,
      title: "Site Management",
      description: "Manage multiple locations with PIN-based access control and check-ins",
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-950"
    },
    {
      icon: FileCheck,
      title: "Compliance Tracking",
      description: "Automated alerts for expiring certifications and training requirements",
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-950"
    },
    {
      icon: FileText,
      title: "Digital Forms",
      description: "9 essential forms including daily logs, incident reports, and patrol logs",
      color: "text-red-600",
      bgColor: "bg-red-50 dark:bg-red-950"
    },
    {
      icon: BarChart3,
      title: "Reports & Analytics",
      description: "Generate professional PDF reports for clients and regulatory compliance",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50 dark:bg-indigo-950"
    }
  ];

  const forms = [
    { name: "Daily Occurrence Log", icon: FileText },
    { name: "Incident Reports", icon: AlertTriangle },
    { name: "Patrol Logs", icon: MapPin },
    { name: "Visitor Logs", icon: Users },
    { name: "Vehicle Logs", icon: Car },
    { name: "Key Register", icon: Key },
    { name: "Equipment Checks", icon: CheckCircle },
    { name: "Site Handovers", icon: RefreshCw },
    { name: "Risk Reports", icon: Shield }
  ];

  const stats = [
    { label: "Sites Managed", value: "500+", icon: MapPin },
    { label: "Active Users", value: "2,000+", icon: Users },
    { label: "Shifts Scheduled", value: "10,000+", icon: Calendar },
    { label: "Forms Submitted", value: "50,000+", icon: FileText }
  ];

  const benefits = [
    { text: "Reduce scheduling time by 70%", icon: Clock },
    { text: "Ensure 100% compliance tracking", icon: CheckCircle },
    { text: "Real-time site access control", icon: Lock },
    { text: "Instant incident reporting", icon: Zap },
    { text: "Professional client reports", icon: FileCheck },
    { text: "Mobile-friendly interface", icon: Globe }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img 
                src="https://iili.io/q76YPsf.png" 
                alt="CoreGuard SMS Logo" 
                className="h-12 w-auto object-contain dark:hidden"
              />
              <img 
                src="https://iili.io/q76sBKg.png" 
                alt="CoreGuard SMS Logo" 
                className="h-12 w-auto object-contain hidden dark:block"
              />
            </div>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <Badge className="inline-flex" variant="outline">
                <Sparkles className="mr-1 h-3 w-3" />
                The Complete Security Management Platform
              </Badge>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                Smart Shift Management for{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                  Security Services
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
                Streamline scheduling, site management, compliance tracking, and digital forms for your security operations
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link href="/register-company">
                  <Button size="lg" className="text-lg px-8 py-6 group w-full sm:w-auto">
                    Register Your Company
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/join-company">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 w-full sm:w-auto">
                    Join as Employee
                  </Button>
                </Link>
              </div>
              {/* Trust Indicators */}
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm text-muted-foreground">No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-600" />
                  <span className="text-sm text-muted-foreground">Enterprise security</span>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                {/* Enhanced Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-96 h-96 bg-gradient-to-br from-primary/20 via-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-8 -right-8 w-96 h-96 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-primary/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-full blur-2xl animate-pulse delay-500" />
                
                {/* Enhanced Main Image Container */}
                <div className="relative rounded-3xl overflow-hidden border border-primary/30 shadow-2xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 backdrop-blur-xl">
                  <div className="aspect-[4/3] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-8 relative">
                    {/* Enhanced Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-blue-500/20" />
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    
                    {/* Enhanced Security Guard Illustration */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-blue-500/20 animate-gradient-shift" />
                      
                      <div className="relative z-10 text-center space-y-6">
                        {/* Enhanced Central Hub */}
                        <div className="relative">
                          <div className="w-40 h-40 mx-auto bg-gradient-to-br from-primary/30 via-blue-500/20 to-purple-500/30 rounded-full flex items-center justify-center backdrop-blur-md border-2 border-primary/40 shadow-2xl animate-pulse-slow">
                            <div className="w-32 h-32 bg-gradient-to-br from-primary/50 to-blue-500/50 rounded-full flex items-center justify-center backdrop-blur-sm border border-primary/60">
                              <Users className="w-20 h-20 text-primary animate-pulse" />
                            </div>
                          </div>
                          {/* Orbiting Elements */}
                          <div className="absolute inset-0 animate-rotate-slow">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-green-500 rounded-full shadow-lg shadow-green-500/50 animate-pulse" />
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50 animate-pulse delay-300" />
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-purple-500 rounded-full shadow-lg shadow-purple-500/50 animate-pulse delay-600" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-lg shadow-yellow-500/50 animate-pulse delay-900" />
                          </div>
                        </div>
                        
                        {/* Enhanced Status Section */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-center gap-3 bg-black/30 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/30">
                            <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                            <span className="text-white text-sm font-semibold tracking-wide">LIVE SECURITY MONITORING</span>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                          </div>
                          
                          {/* Enhanced Stats Grid */}
                          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
                            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-xl hover:scale-105 transition-transform">
                              <MapPin className="w-6 h-6 text-primary mx-auto mb-2 drop-shadow-lg" />
                              <div className="text-lg font-bold text-white">12</div>
                              <div className="text-xs text-white/90 font-medium">SITES</div>
                            </div>
                            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-xl hover:scale-105 transition-transform">
                              <Calendar className="w-6 h-6 text-primary mx-auto mb-2 drop-shadow-lg" />
                              <div className="text-lg font-bold text-white">45</div>
                              <div className="text-xs text-white/90 font-medium">SHIFTS</div>
                            </div>
                            <div className="bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md rounded-xl p-4 border border-white/30 shadow-xl hover:scale-105 transition-transform">
                              <Users className="w-6 h-6 text-primary mx-auto mb-2 drop-shadow-lg" />
                              <div className="text-lg font-bold text-white">89</div>
                              <div className="text-xs text-white/90 font-medium">GUARDS</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Cards */}
                <div className="absolute -top-8 -right-8 bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-800/90 rounded-2xl shadow-2xl p-6 border border-primary/20 backdrop-blur-xl animate-float hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">Shift Completed</div>
                      <div className="text-xs text-muted-foreground font-medium">Downtown Site</div>
                      <div className="text-xs text-green-600 font-semibold">Just now</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-8 -left-8 bg-gradient-to-br from-white/90 to-white/80 dark:from-slate-900/90 dark:to-slate-800/90 rounded-2xl shadow-2xl p-6 border border-primary/20 backdrop-blur-xl animate-float-delayed hover:scale-105 transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-foreground">98% Compliance</div>
                      <div className="text-xs text-muted-foreground font-medium">All sites secure</div>
                      <div className="text-xs text-blue-600 font-semibold">Excellent rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index} 
                  className={`text-center transition-all duration-500 delay-${index * 100}`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <Icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <div className="text-4xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">Features</Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed specifically for security service providers
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/50"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-7 w-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Forms Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Badge className="mb-4" variant="outline">
              <FileText className="mr-1 h-3 w-3" />
              Digital Forms
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Complete Audit Trail</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              9 essential forms for comprehensive security documentation and compliance
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {forms.map((form, index) => {
              const Icon = form.icon;
              return (
                <div 
                  key={index}
                  className="p-4 rounded-lg border bg-card hover:bg-accent transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <Icon className="h-6 w-6 mb-2 text-primary group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-medium">{form.name}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="outline">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  Benefits
                </Badge>
                <h2 className="text-4xl md:text-5xl font-bold">
                  Transform Your Security Operations
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join hundreds of security companies already using CoreGuard to streamline their operations
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => {
                    const Icon = benefit.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <span className="text-lg">{benefit.text}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-3xl blur-3xl" />
                <Card className="relative border-2">
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Compliance Score</span>
                        <Badge variant="default">98%</Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-[98%] rounded-full" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">45</div>
                        <div className="text-xs text-muted-foreground">Active Shifts</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-xs text-muted-foreground">Sites</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">89</div>
                        <div className="text-xs text-muted-foreground">Employees</div>
                      </div>
                      <div className="p-4 rounded-lg bg-muted">
                        <div className="text-2xl font-bold">2</div>
                        <div className="text-xs text-muted-foreground">Alerts</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground dark:bg-secondary dark:text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Security Operations?
            </h2>
            <p className="text-xl opacity-90">
              Join CoreGuard today and experience the future of security management
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/register-company">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 group dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 dark:border-secondary-foreground dark:text-secondary-foreground dark:hover:bg-secondary-foreground/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <img 
                    src="https://iili.io/q76YPsf.png" 
                    alt="CoreGuard SMS Logo" 
                    className="h-10 w-auto object-contain dark:hidden"
                  />
                  <img 
                    src="https://iili.io/q76sBKg.png" 
                    alt="CoreGuard SMS Logo" 
                    className="h-10 w-auto object-contain hidden dark:block"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                The complete security management platform for modern security services.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Security</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-foreground transition-colors">Privacy</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Terms</Link></li>
                <li><Link href="#" className="hover:text-foreground transition-colors">Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 CoreGuard SMS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
