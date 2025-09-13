import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppHeaderDashboardLayout } from "@/components/dashboard/AppHeaderDashboardLayout";
import { SideNav } from "@/components/dashboard/SideNav";
import {
  BookOpen,
  CheckSquare,
  ClipboardList,
  Bell,
  FileText,
  Calendar,
  Users,
  FileCheck,
  Download,
} from "lucide-react";

const todaySchedule = [
  { subject: "Math", time: "09:00 AM - 10:00 AM", room: "A101", teacher: "Mr. Smith" },
  { subject: "Physics", time: "10:15 AM - 11:15 AM", room: "B202", teacher: "Dr. Brown" },
  { subject: "English", time: "11:30 AM - 12:30 PM", room: "C303", teacher: "Ms. Johnson" },
];

const latestMaterials = [
  { icon: FileText, color: "text-red-500", title: "Database Normalization", desc: "Database Systems • Today • 2.3 MB" },
  { icon: BookOpen, color: "text-orange-500", title: "TCP/IP Protocol Suite", desc: "Computer Networks • Yesterday • 5.7 MB" },
  { icon: ClipboardList, color: "text-green-600", title: "Binary Search Trees", desc: "Data Structures • 2 days ago • 4.5 MB" },
];

const leaveRequests = [
  { title: "Medical Leave", date: "Apr 15–17, 2025", status: "Pending", icon: Calendar, color: "text-blue-600" },
  { title: "Family Function", date: "Mar 25, 2025", status: "Approved", icon: Users, color: "text-green-600" },
  { title: "Personal Emergency", date: "Feb 10–12, 2025", status: "Rejected", icon: Calendar, color: "text-red-500" },
];

const StudentDashboardOverview: React.FC = () => {
  return (
    <AppHeaderDashboardLayout sidebar={<SideNav />}>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Cards Top Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Today's Lectures</CardTitle>
              <CardDescription>3 lectures scheduled</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <BookOpen className="text-blue-600 w-5 h-5" />
                <span className="text-sm font-medium">Next: Database Systems at 11:30 AM</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Attendance Status</CardTitle>
              <CardDescription>Overall attendance: 85%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <CheckSquare className="text-yellow-500 w-5 h-5" />
                <span className="text-sm font-medium">Warning: Low in Computer Networks (68%)</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Pending Assignments</CardTitle>
              <CardDescription>2 assignments due</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <ClipboardList className="text-red-500 w-5 h-5" />
                <span className="text-sm font-medium">Due Today: Algorithm Analysis</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Unread Announcements</CardTitle>
              <CardDescription>3 new announcements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Bell className="text-yellow-500 w-5 h-5" />
                <span className="text-sm font-medium">Latest: Mid-term exam schedule</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's Schedule */}
        <motion.div className="col-span-1 md:col-span-2 xl:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {todaySchedule.map((item, idx) => (
                  <Card key={idx} className="border-0 shadow-sm">
                    <CardHeader>
                      <CardTitle>{item.subject}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-600 space-y-1">
                      <div>🕘 {item.time}</div>
                      <div>🏫 Room: {item.room}</div>
                      <div>👨‍🏫 {item.teacher}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Study Materials */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Latest Study Materials</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {latestMaterials.map((mat, idx) => (
                  <li key={idx} className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <mat.icon className={`${mat.color} w-5 h-5`} />
                      <div>
                        <p className="text-sm font-medium">{mat.title}</p>
                        <p className="text-xs text-gray-500">{mat.desc}</p>
                      </div>
                    </div>
                    <Download className="text-gray-400 hover:text-gray-600 w-4 h-4 cursor-pointer" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Leave Requests */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
          <Card className="border-0 shadow-premium">
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {leaveRequests.map((leave, idx) => (
                  <li key={idx} className="flex justify-between items-start">
                    <div className="flex gap-3 items-center">
                      <leave.icon className={`${leave.color} w-5 h-5`} />
                      <div>
                        <p className="text-sm font-medium">{leave.title}</p>
                        <p className="text-xs text-gray-500">{leave.date}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-medium ${leave.status === "Approved" ? "text-green-600" : leave.status === "Rejected" ? "text-red-500" : "text-yellow-500"}`}>
                      {leave.status}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </AppHeaderDashboardLayout>
  );
};

export default StudentDashboardOverview;
