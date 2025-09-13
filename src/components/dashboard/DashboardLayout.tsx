import React from 'react';
import { AppHeader } from './AppHeader';
import { SideNav } from './SideNav';
import { StudentSideNav } from './StudentSideNav';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/ui/logo';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export const DashboardLayout: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center px-4">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Logo size="lg" className="h-16 sm:h-20" />
          <div className="space-y-2">
            <h2 className="text-lg sm:text-xl font-semibold">AMC College</h2>
            <p className="text-sm sm:text-base font-medium text-gray-600">Loading NeuroCampus...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 overflow-hidden">
        {/* Conditional Sidebar */}
        {user.role === 'admin' ? <SideNav /> : <StudentSideNav />}

        <SidebarInset className="flex-1 flex flex-col min-w-0">
          <AppHeader />
          <main className="flex-1 overflow-hidden">
            <div className="h-[calc(100vh-4rem)] overflow-y-auto">
              <div className="p-3 sm:p-4 md:p-6 lg:p-8 w-full max-w-full">
                <div className="max-w-full overflow-hidden">
                  <Outlet />
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};
