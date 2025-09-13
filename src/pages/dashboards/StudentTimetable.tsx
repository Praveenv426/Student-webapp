import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { CalendarDays, Download, Filter } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { getTimetable } from "@/utils/student_api";

const StudentTimetable = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [facultyFilter, setFacultyFilter] = useState("all");
  const [roomFilter, setRoomFilter] = useState("all");
  const [timetableData, setTimetableData] = useState<any[]>([]);

  useEffect(() => {
    const fetchTimetable = async () => {
      const data = await getTimetable();
      if (data.success && Array.isArray(data.data)) {
        setTimetableData(data.data);
      }
    };
    fetchTimetable();
  }, []);

  const uniqueSubjects = [
    "all",
    ...Array.from(new Set(timetableData.map((entry) => entry.subject))),
  ];
  const uniqueFaculty = [
    "all",
    ...Array.from(new Set(timetableData.map((entry) => entry.faculty))),
  ];
  const uniqueRooms = [
    "all",
    ...Array.from(new Set(timetableData.map((entry) => entry.room))),
  ];

  const filteredData = timetableData.filter((entry) => {
    return (
      (subjectFilter === "all" || entry.subject === subjectFilter) &&
      (facultyFilter === "all" || entry.faculty === facultyFilter) &&
      (roomFilter === "all" || entry.room === roomFilter)
    );
  });

  const exportToCSV = () => {
    const csvRows = [
      ["Day", "Start Time", "End Time", "Subject", "Faculty", "Room"],
      ...filteredData.map((row) =>
        [row.day, row.start_time, row.end_time, row.subject, row.faculty, row.room].join(",")
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `timetable.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const clearFilters = () => {
    setSubjectFilter("all");
    setFacultyFilter("all");
    setRoomFilter("all");
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Timetable</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilterModal(true)}>
            <Filter className="w-4 h-4 mr-2" /> Filter
          </Button>
          <Button variant="outline" size="sm" onClick={exportToCSV}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="w-5 h-5" /> Timetable
            </h2>
          </div>

          <ScrollArea className="w-full overflow-auto">
            <table className="w-full border text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="text-left p-2">Day</th>
                  <th className="text-left p-2">Start Time</th>
                  <th className="text-left p-2">End Time</th>
                  <th className="text-left p-2">Subject</th>
                  <th className="text-left p-2">Faculty</th>
                  <th className="text-left p-2">Room</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((entry, idx) => (
                  <tr key={idx} className="border-t">
                    <td className="p-2 font-medium">{entry.day}</td>
                    <td className="p-2">{entry.start_time}</td>
                    <td className="p-2">{entry.end_time}</td>
                    <td className="p-2">{entry.subject}</td>
                    <td className="p-2">{entry.faculty}</td>
                    <td className="p-2">{entry.room}</td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-500">
                      No timetable entries found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </ScrollArea>
        </div>
      </CardContent>

      {/* Filter Modal */}
      <Dialog open={showFilterModal} onOpenChange={setShowFilterModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Timetable</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Subject</label>
              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueSubjects.map((subj) => (
                    <SelectItem key={subj} value={subj}>{subj}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Faculty</label>
              <Select value={facultyFilter} onValueChange={setFacultyFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select faculty" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueFaculty.map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Room</label>
              <Select value={roomFilter} onValueChange={setRoomFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select room" />
                </SelectTrigger>
                <SelectContent>
                  {uniqueRooms.map((r) => (
                    <SelectItem key={r} value={r}>{r}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end pt-2">
              <Button variant="secondary" onClick={clearFilters}>Clear Filters</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default StudentTimetable;
