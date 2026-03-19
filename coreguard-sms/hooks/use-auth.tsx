"use client";

import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user from localStorage first
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        // Fallback to seed data user
        useSeedDataUser();
      }
    } else {
      // Fallback to seed data user
      useSeedDataUser();
    }
    setLoading(false);
  }, []);

  const useSeedDataUser = () => {
    const seedUser = {
      id: "b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
      email: "admin@secureguard.com",
      role: "company_admin",
      organisationId: "mock-org-id",
    };
    setUser(seedUser);
  };

  return { user, loading };
}

// Helper function to store user after successful registration
export function storeUserAfterRegistration(user: any) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}
