import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Megaphone, Bell } from "lucide-react";
import { getAnnouncements } from "@/utils/student_api";
import { AppHeaderDashboardLayout } from "@/components/dashboard/AppHeaderDashboardLayout";
import { SideNav } from "@/components/dashboard/SideNav";

const categoryStyles = {
  academic: "bg-blue-500",
  sports: "bg-green-500",
  cultural: "bg-purple-500",
  general: "bg-gray-500",
};

const priorityStyles = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-green-500",
};

interface Announcement {
  id?: number;
  title: string;
  content: string;
  created_at: string;
  category?: string;
  priority?: string;
  from?: string;
}

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const response = await getAnnouncements();
        if (response.success && response.data) {
          setAnnouncements(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  return (
    <AppHeaderDashboardLayout sidebar={<SideNav />}>
      <div className="space-y-6">
        {loading ? (
          <div className="w-full h-48 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5" />
                <CardTitle>Announcements</CardTitle>
              </div>
              <CardDescription>
                Stay updated with the latest announcements and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 mb-2" />
                  <p>No announcements at the moment</p>
                </div>
              )}

              {announcements.map((announcement, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                >
                  <Card className="hover:bg-accent transition-colors">
                    <CardContent className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{announcement.title}</h3>
                          {announcement.priority === "high" && (
                            <Badge
                              variant="destructive"
                              className="uppercase text-[10px]"
                            >
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {announcement.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{announcement.from || "Admin Office"}</span>
                          <span>•</span>
                          <span>{announcement.created_at}</span>
                        </div>
                      </div>
                      {announcement.category && (
                        <Badge
                          variant="secondary"
                          className={`${
                            categoryStyles[
                              announcement.category as keyof typeof categoryStyles
                            ] || "bg-gray-400"
                          } text-white`}
                        >
                          {announcement.category}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </AppHeaderDashboardLayout>
  );
};

export default StudentAnnouncements;

