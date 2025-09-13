import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  FileText,
  UserCircle,
  ClipboardList,
  Bell,
  Calendar,
  BookMarked,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: string[];
}

const navigationItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["student", "admin"] },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, roles: ["student", "admin"] },
  { label: "Study Materials", href: "/dashboard/study-materials", icon: BookOpen, roles: ["student"] },
  { label: "Timetable", href: "/dashboard/timetable", icon: CalendarDays, roles: ["student"] },
  { label: "Submit Leave", href: "/dashboard/leave-request", icon: FileText, roles: ["student"] },
  { label: "Profile", href: "/dashboard/profile", icon: UserCircle, roles: ["student", "admin"] },
  { label: "Manage Users", href: "/dashboard/admin/users", icon: ClipboardList, roles: ["admin"] },
  { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart3, roles: ["admin"] },
  { label: "Manage Courses", href: "/dashboard/admin/courses", icon: BookMarked, roles: ["admin"] },
];


export const SideNav: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  if (!user) return null;

  const userNavItems = navigationItems;

  const handleLinkClick = () => setOpenMobile(false);

  const handleLogout = () => {
    logout();
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r bg-white">
      <SidebarHeader className="p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <Logo size="sm" className="h-8 w-8" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm text-gray-900">NeuroCampus</span>
            <span className="text-xs text-gray-600">AMC College</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 bg-white">
        <SidebarMenu>
          {userNavItems.map((item, index) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    onClick={handleLinkClick}
                    className={cn(
                      "w-full justify-start gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 hover:text-gray-900",
                      isActive && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    <Link to={item.href} className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </motion.div>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-4 bg-white border-t">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
            <UserCircle className="h-6 w-6 text-gray-600" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-600 capitalize">{user.role}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="w-full justify-start gap-2 border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
