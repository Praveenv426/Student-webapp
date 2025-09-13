import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCircle2, Clock3, XCircle } from "lucide-react";
import { getLeaveRequests } from "@/utils/student_api";
import { AppHeaderDashboardLayout } from "@/components/dashboard/AppHeaderDashboardLayout";
import { SideNav } from "@/components/dashboard/SideNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LeaveStatusType = "PENDING" | "APPROVED" | "REJECTED";

interface LeaveRequest {
  id: string;
  title?: string;
  reason?: string;
  start_date: string;
  end_date?: string;
  applied_on?: string;
  status: LeaveStatusType;
}

const statusStyles: Record<
  LeaveStatusType,
  { icon: JSX.Element; color: string; bg: string }
> = {
  PENDING: {
    icon: <Clock3 className="w-3.5 h-3.5 text-yellow-500" />,
    color: "text-yellow-600",
    bg: "bg-yellow-100",
  },
  APPROVED: {
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  REJECTED: {
    icon: <XCircle className="w-3.5 h-3.5 text-red-600" />,
    color: "text-red-600",
    bg: "bg-red-100",
  },
};

const LeaveStatus: React.FC = () => {
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaves = async () => {
      const data = await getLeaveRequests();
      if (data.success && Array.isArray(data.data)) {
        setLeaves(data.data);
      }
      setLoading(false);
    };
    fetchLeaves();
  }, []);

  return (
    <AppHeaderDashboardLayout sidebar={<SideNav />}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Leave Requests</h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-1.5 flex items-center gap-1">
            <Bell className="w-4 h-4" />
            Apply for Leave
          </Button>
        </div>

        {/* Loading / Empty State */}
        {loading ? (
          <div className="text-sm text-gray-500">Loading leave requests...</div>
        ) : leaves.length === 0 ? (
          <div className="text-sm text-gray-500">No leave requests found.</div>
        ) : (
          <div className="grid gap-4">
            {leaves.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="flex justify-between items-start">
                    {/* Left Section */}
                    <div className="space-y-1 text-sm">
                      <p className="font-medium">{item.title ?? "Leave Request"}</p>
                      <p className="text-xs text-gray-500">
                        From: {item.start_date}
                        {item.end_date ? ` To: ${item.end_date}` : ""}
                      </p>
                      {item.reason && <p className="text-xs text-gray-500">{item.reason}</p>}
                      {item.applied_on && (
                        <p className="text-xs text-gray-400">Applied on: {item.applied_on}</p>
                      )}
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        className={`text-xs font-medium px-2 py-0.5 rounded-full border-none ${statusStyles[item.status].bg} ${statusStyles[item.status].color}`}
                      >
                        <div className="flex items-center gap-1">
                          {statusStyles[item.status].icon}
                          {item.status.charAt(0) + item.status.slice(1).toLowerCase()}
                        </div>
                      </Badge>
                      <span className="text-xs text-gray-400">#{item.id.slice(0, 6)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppHeaderDashboardLayout>
  );
};

export default LeaveStatus;
