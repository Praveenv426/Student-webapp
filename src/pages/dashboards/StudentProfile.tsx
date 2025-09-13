import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { getFullStudentProfile } from "@/utils/student_api";
import { AppHeaderDashboardLayout } from "@/components/dashboard/AppHeaderDashboardLayout";
import { SideNav } from "@/components/dashboard/SideNav";

const StudentProfile = () => {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    department: "",
    dob: "",
    year_of_study: "",
    address: "",
    about: "",
    cgpa: "",
    semester: "",
    enrollment_year: "",
    graduation_year: "",
    advisor: "",
    status: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getFullStudentProfile();
      if (data.success && data.profile) {
        setForm((prev) => ({ ...prev, ...data.profile }));
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  return (
    <AppHeaderDashboardLayout sidebar={<SideNav />}>
      <div className="p-6 space-y-6 text-gray-900">
        <h2 className="text-lg font-semibold">Profile</h2>

        <Tabs defaultValue="profile" className="space-y-6">
          {/* Personal Info */}
          <Card className="bg-white border border-gray-300">
            <div className="p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/4 flex flex-col items-center text-center">
                <img
                  src="/default-avatar.png"
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover mb-2"
                />
                <p className="font-medium">
                  {form.first_name} {form.last_name}
                </p>
                <p className="text-sm text-gray-500">21CS234</p>
              </div>
              <div className="w-full md:w-3/4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Full Name</Label>
                    <Input
                      name="first_name"
                      value={form.first_name}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Input
                      name="department"
                      value={form.department}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Year of Study</Label>
                    <Input
                      name="year_of_study"
                      value={form.year_of_study}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <Label>About</Label>
                  <Textarea
                    name="about"
                    value={form.about}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Academic Info */}
          <Card className="bg-white border border-gray-300">
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Current CGPA</Label>
                <Input value={form.cgpa} onChange={handleChange} name="cgpa" />
              </div>
              <div>
                <Label>Current Semester</Label>
                <Input
                  value={form.semester}
                  onChange={handleChange}
                  name="semester"
                />
              </div>
              <div>
                <Label>Enrollment Year</Label>
                <Input
                  value={form.enrollment_year}
                  onChange={handleChange}
                  name="enrollment_year"
                />
              </div>
              <div>
                <Label>Expected Graduation</Label>
                <Input
                  value={form.graduation_year}
                  onChange={handleChange}
                  name="graduation_year"
                />
              </div>
              <div>
                <Label>Faculty Advisor</Label>
                <Input
                  value={form.advisor}
                  onChange={handleChange}
                  name="advisor"
                />
              </div>
              <div>
                <Label>Student Status</Label>
                <Input
                  value={form.status}
                  onChange={handleChange}
                  name="status"
                  className="text-green-600 font-semibold"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button className="mt-4">Save Changes</Button>
          </div>
        </Tabs>
      </div>
    </AppHeaderDashboardLayout>
  );
};

export default StudentProfile;
