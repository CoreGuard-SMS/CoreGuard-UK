import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mockUser = {
    id: "mock-employee-id",
    name: "John Employee",
    email: "john@company.com",
    role: "employee",
    organisationId: "mock-org-id"
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar role="employee" user={mockUser} />
        <main className="flex-1 overflow-auto">
          <div className="flex items-center gap-2 p-4">
            <SidebarTrigger />
            <div className="container mx-auto space-y-6">
              {children}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
