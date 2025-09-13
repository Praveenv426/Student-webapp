import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Megaphone, Bell } from "lucide-react";
import { getNotifications } from "@/utils/student_api";
import { AppHeaderDashboardLayout } from "@/components/dashboard/AppHeaderDashboardLayout";
import { SideNav } from "@/components/dashboard/SideNav";

interface Notification {
  id: string;
  title: string;
  message: string;
}

const StudentNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const data = await getNotifications();
      if (data.success && Array.isArray(data.data)) {
        setNotifications(data.data);
      }
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-48 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AppHeaderDashboardLayout sidebar={<SideNav />}>
      <div className="p-6 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Megaphone className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>
              View all recent updates from your institution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {notifications.length > 0 ? (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border p-4 hover:bg-accent transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.message}
                        </p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        New
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 mb-2" />
                  <p>No notifications available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppHeaderDashboardLayout>
  );
};

export default StudentNotifications;

