import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/card";
import DashboardCard from "../common/DashboardCard";
import { Activity, BookOpen, Calendar, Clock } from "lucide-react";
import { AppHeaderDashboardLayout } from "@/components/dashboard/AppHeaderDashboardLayout";
import { SideNav } from "@/components/dashboard/SideNav";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface DashboardStats {
  attendance_status?: { average: number; below_75_count: number };
  next_class?: { subject: string; start_time: string; room: string };
  today_classes?: number;
  pending_assignments?: number;
  recent_activities?: { title: string; timestamp: string }[];
}

const StudentStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatAttendancePercentage = (percentage: number | string): string =>
    percentage ? `${percentage}%` : "NA";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/student/dashboard/`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        if (data.success) setStats(data.data);
        else setError(data.message || "Failed to fetch dashboard data");
      } catch {
        setError("Network error while fetching dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div className="w-full h-48 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
  if (error) return <div className="text-red-600 text-center py-8">{error}</div>;

  return (
    <AppHeaderDashboardLayout sidebar={<SideNav />}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Overall Attendance"
            value={formatAttendancePercentage(stats?.attendance_status?.average || 0)}
            icon={<Activity className="text-blue-500" />}
          />
          <DashboardCard
            title="Next Class"
            value={stats?.next_class?.subject || "No upcoming classes"}
            description={stats?.next_class ? `${stats.next_class.start_time} | Room ${stats.next_class.room}` : ""}
            icon={<Clock className="text-green-500" />}
          />
          <DashboardCard
            title="Today's Classes"
            value={stats?.today_classes || 0}
            icon={<Calendar className="text-purple-500" />}
          />
          <DashboardCard
            title="Pending Assignments"
            value={stats?.pending_assignments || 0}
            icon={<BookOpen className="text-orange-500" />}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest academic activities and updates</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.recent_activities?.length ? (
              <div className="space-y-4">
                {stats.recent_activities.map((activity, i) => (
                  <div key={i} className="flex items-center p-3 rounded-lg hover:bg-accent transition-colors">
                    <div className="mr-4 p-2 rounded-full bg-primary/10">
                      <Activity className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No recent activities</p>
            )}
          </CardContent>
        </Card>

        {stats?.attendance_status?.below_75_count > 0 && (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-700">Attendance Warning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-red-600">
                Your attendance is below 75% in {stats.attendance_status.below_75_count} subject
                {stats.attendance_status.below_75_count > 1 ? "s" : ""}. Please improve your attendance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppHeaderDashboardLayout>
  );
};

export default StudentStats;
