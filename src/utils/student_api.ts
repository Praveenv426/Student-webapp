import { getApiBaseUrl } from "./config";
import { fetchWithTokenRefresh } from "./authService";

// ------------------ Types ------------------
export interface StudentDashboardOverview {
  attendance_percentage: number;
  total_classes: number;
  attended_classes: number;
  internal_marks: Array<{
    subject: string;
    test_number: number;
    mark: number;
    max_mark: number;
  }>;
  certificates_count: number;
  leave_requests_count: number;
}

export interface Certificate {
  id: string;
  title: string;
  file: string | null;
  uploaded_at: string;
}

export interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

export interface StudentProfile {
  user_id: string;
  username: string;
  email: string;
  role: "student";
  department: string | null;
  branch: string;
  semester: number;
  section: string;
  profile_image?: string;
}

// ------------------ API Calls ------------------

// Dashboard overview
export const getStudentDashboard = async () => {
  try {
    const response = await fetchWithTokenRefresh(`${getApiBaseUrl()}/student/dashboard/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    return { success: false, message: "Network error" };
  }
};

// Attendance records
export const getStudentAttendance = async () => {
  try {
    const response = await fetchWithTokenRefresh(`${getApiBaseUrl()}/student/attendance/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    return { success: false, message: "Network error" };
  }
};

// Internal marks
export const getStudentMarks = async () => {
  try {
    const response = await fetchWithTokenRefresh(`${getApiBaseUrl()}/student/internal-marks/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    return { success: false, message: "Network error" };
  }
};

// Certificates
export const getStudentCertificates = async () => {
  try {
    const response = await fetchWithTokenRefresh(`${getApiBaseUrl()}/student/certificates/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
    });
    return await response.json();
  } catch (e) {
    return { success: false, message: "Network error" };
  }
};

// Leave requests
export const getStudentLeaveRequests = async (): Promise<LeaveRequest[]> => {
  const res = await fetchWithTokenRefresh(`${getApiBaseUrl()}/student/leave-requests/`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || "Failed to fetch leave requests");
  return data.data;
};

export const applyStudentLeave = async (data: { start_date: string; end_date: string; reason: string }) => {
  try {
    const response = await fetchWithTokenRefresh(`${getApiBaseUrl()}/student/apply-leave/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Ty
