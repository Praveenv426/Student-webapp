import { getApiBaseUrl, TOKEN_REFRESH_TIMEOUT } from "./config";

interface AuthResponse {
  success: boolean;
  message?: string;
  user_id?: string;
  username?: string;
  email?: string;
  role?: "admin" | "hod" | "teacher" | "student";
  department?: string | null;
  profile_image?: string | null;
}

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse extends AuthResponse {
  access?: string;
  refresh?: string;
  profile?: {
    user_id?: string;
    username?: string;
    email?: string;
    role?: string;
    department?: string | null;
    profile_image?: string | null;
    branch?: string;
    semester?: number;
    section?: string;
  };
}

interface VerifyOTPRequest {
  user_id: string;
  otp: string;
}

interface ResendOTPRequest {
  user_id: string;
}

interface ForgotPasswordRequest {
  email: string;
}

interface ResetPasswordRequest {
  user_id: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}

interface GenericResponse {
  success: boolean;
  message?: string;
  user_id?: string;
}

interface RefreshTokenResponse {
  success: boolean;
  access?: string;
  refresh?: string;
  message?: string;
}

let refreshInterval: NodeJS.Timeout | null = null;

// Token refresh logic
export const refreshToken = async (): Promise<RefreshTokenResponse> => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    if (!refresh) throw new Error("No refresh token available");

    const response = await fetch(`${getApiBaseUrl()}/token/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ refresh }),
      signal: AbortSignal.timeout(TOKEN_REFRESH_TIMEOUT),
    });

    const result: RefreshTokenResponse = await response.json();
    if (!response.ok) throw new Error(result.message || "Token refresh failed");

    return { success: true, access: result.access, refresh: result.refresh };
  } catch (error: any) {
    localStorage.clear();
    stopTokenRefresh();
    return { success: false, message: error.message || "Network error" };
  }
};

export const startTokenRefresh = () => {
  stopTokenRefresh();
  refreshInterval = setInterval(async () => {
    const refreshResult = await refreshToken();
    if (refreshResult.success && refreshResult.access) {
      localStorage.setItem("access_token", refreshResult.access);
      if (refreshResult.refresh) localStorage.setItem("refresh_token", refreshResult.refresh);
    } else {
      localStorage.clear();
      stopTokenRefresh();
      window.location.href = "/";
    }
  }, 900000);
};

export const stopTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
  }
};

// Generic fetch with token refresh
export const fetchWithTokenRefresh = async (url: string, options: RequestInit): Promise<Response> => {
  const accessToken = localStorage.getItem("access_token");
  if (!accessToken) throw new Error("No access token available");

  options.headers = { ...options.headers, Authorization: `Bearer ${accessToken}`, 'ngrok-skip-browser-warning': 'true' };
  const response = await fetch(url, options);

  if (response.status === 401) {
    const refreshResult = await refreshToken();
    if (refreshResult.success && refreshResult.access) {
      localStorage.setItem("access_token", refreshResult.access);
      if (refreshResult.refresh) localStorage.setItem("refresh_token", refreshResult.refresh);
      options.headers = { ...options.headers, Authorization: `Bearer ${refreshResult.access}`, 'ngrok-skip-browser-warning': 'true' };
      return fetch(url, options);
    } else {
      localStorage.clear();
      stopTokenRefresh();
      window.location.href = "/";
      throw new Error("Failed to refresh token");
    }
  }

  return response;
};

// Student login
export const loginUser = async ({ username, password }: LoginRequest): Promise<LoginResponse> => {
  if (!username?.trim() || !password?.trim()) return { success: false, message: "Username and password required" };

  try {
    const response = await fetch(`${getApiBaseUrl()}/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ username, password }),
    });
    const result: LoginResponse = await response.json();

    if (response.ok && result.success) {
      if (result.message !== "OTP sent") {
        localStorage.setItem("access_token", result.access || "");
        localStorage.setItem("refresh_token", result.refresh || "");
        localStorage.setItem("role", result.role || "");
        localStorage.setItem("user", JSON.stringify(result.profile || {}));
        startTokenRefresh();
      }
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to connect to the server" };
  }
};

// OTP, resend, forgot/reset password, logout functions
export const verifyOTP = async ({ user_id, otp }: VerifyOTPRequest): Promise<LoginResponse> => {
  if (!user_id?.trim() || !otp?.trim()) return { success: false, message: "User ID and OTP required" };
  try {
    const response = await fetch(`${getApiBaseUrl()}/verify-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ user_id, otp }),
    });
    const result: LoginResponse = await response.json();
    if (response.ok && result.success) {
      localStorage.setItem("access_token", result.access || "");
      localStorage.setItem("refresh_token", result.refresh || "");
      localStorage.setItem("role", result.role || "");
      localStorage.setItem("user", JSON.stringify(result.profile || {}));
      startTokenRefresh();
    }
    return result;
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to connect to the server" };
  }
};

export const resendOTP = async ({ user_id }: ResendOTPRequest): Promise<GenericResponse> => {
  if (!user_id?.trim()) return { success: false, message: "User ID required" };
  try {
    const response = await fetch(`${getApiBaseUrl()}/resend-otp/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ user_id }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to connect to the server" };
  }
};

export const forgotPassword = async ({ email }: ForgotPasswordRequest): Promise<GenericResponse> => {
  if (!email?.trim()) return { success: false, message: "Email required" };
  try {
    const response = await fetch(`${getApiBaseUrl()}/forgot-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ email }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to connect to the server" };
  }
};

export const resetPassword = async ({ user_id, otp, new_password, confirm_password }: ResetPasswordRequest): Promise<GenericResponse> => {
  if (!user_id?.trim() || !otp?.trim() || !new_password?.trim() || !confirm_password?.trim()) {
    return { success: false, message: "All fields required" };
  }
  try {
    const response = await fetch(`${getApiBaseUrl()}/reset-password/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ user_id, otp, new_password, confirm_password }),
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, message: error.response?.data?.message || "Failed to connect to the server" };
  }
};

export const logoutUser = async (): Promise<GenericResponse> => {
  try {
    const refresh = localStorage.getItem("refresh_token");
    const accessToken = localStorage.getItem("access_token");
    if (!refresh) {
      localStorage.clear();
      stopTokenRefresh();
      return { success: true, message: "Logged out successfully (no refresh token)" };
    }
    const response = await fetch(`${getApiBaseUrl()}/logout/`, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken || ""}`, "Content-Type": "application/json", 'ngrok-skip-browser-warning': 'true' },
      body: JSON.stringify({ refresh }),
    });
    localStorage.clear();
    stopTokenRefresh();
    if (!response.ok) return { success: true, message: "Logged out successfully (server error ignored)" };
    return await response.json();
  } catch (error: any) {
    localStorage.clear();
    stopTokenRefresh();
    return { success: true, message: "Logged out successfully (error ignored)" };
  }
};

export type { LoginRequest, LoginResponse };
