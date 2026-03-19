"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { storeUserAfterRegistration } from "@/hooks/use-auth";

export default function RegisterCompanyPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    companyName: "",
    organisationPIN: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/register-company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Registration failed');
        setIsLoading(false);
        return;
      }

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Store the newly created user in localStorage
        const newUser = {
          id: result.userId, // Use the actual user ID from users table
          email: formData.adminEmail,
          role: "company_admin",
          organisationId: result.organisationId,
          name: formData.adminName,
        };
        storeUserAfterRegistration(newUser);
        
        setSuccess(true);
        setIsLoading(false);
      }
    } catch (error) {
      setError('An unexpected error occurred');
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/company/dashboard");
  };

  if (success) {
    return (
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Company Created!</CardTitle>
          <CardDescription>
            Your organisation has been successfully created and added to the database.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-primary/10 border-2 border-primary rounded-lg p-6 text-center">
            <p className="text-sm text-muted-foreground mb-2">Your Organisation PIN</p>
            <p className="text-4xl font-bold tracking-wider text-primary">{formData.organisationPIN}</p>
          </div>
          <Button onClick={handleContinue} className="w-full">
            Continue to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Register Company</CardTitle>
        <CardDescription>
          Create your organisation and get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Acme Security Services"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="organisationPIN">Organisation PIN (6 digits)</Label>
            <Input
              id="organisationPIN"
              type="text"
              placeholder="123456"
              value={formData.organisationPIN}
              onChange={(e) => setFormData({ ...formData, organisationPIN: e.target.value })}
              maxLength={6}
              pattern="[0-9]{6}"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminName">Admin Name</Label>
            <Input
              id="adminName"
              type="text"
              placeholder="John Smith"
              value={formData.adminName}
              onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminEmail">Admin Email</Label>
            <Input
              id="adminEmail"
              type="email"
              placeholder="admin@company.com"
              value={formData.adminEmail}
              onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="adminPassword">Admin Password</Label>
            <Input
              id="adminPassword"
              type="password"
              placeholder="••••••••"
              value={formData.adminPassword}
              onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
              required
            />
          </div>

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create Company"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
