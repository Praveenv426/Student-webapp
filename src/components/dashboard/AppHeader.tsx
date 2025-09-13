import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export const AppHeader: React.FC = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <header className="bg-white border-b shadow-sm">
      <div className="flex h-14 sm:h-16 items-center px-3 sm:px-4 lg:px-6">
        {/* Mobile menu trigger */}
        <SidebarTrigger className="lg:hidden mr-2 h-8 w-8 sm:h-9 sm:w-9" />

        {/* Brand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col">
            <span className="font-semibold text-sm lg:text-base">NeuroCampus</span>
            <span className="text-xs text-gray-500 hidden md:block">AMC College - Student</span>
          </div>
        </div>

        {/* Live Clock & Actions */}
        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          {/* Live Clock */}
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-md border">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-sm font-mono font-medium text-gray-700 min-w-[72px]">
              {formatTime(currentTime)}
            </span>
          </div>

          {/* Notifications */}
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User info - hidden on small screens */}
          <span className="hidden lg:block text-sm font-medium truncate max-w-[120px]">
            {user?.name || "Student"}
          </span>
        </div>
      </div>
    </header>
  );
};
