const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api";
const TOKEN_REFRESH_TIMEOUT = 10000;

export const getApiBaseUrl = (): string => {
  const stored = localStorage.getItem("API_BASE_URL");
  return (stored && stored.trim()) ? stored : DEFAULT_API_BASE_URL;
};

export const setApiBaseUrl = (url: string): void => {
  try {
    const trimmed = (url || "").trim().replace(/\/$/, "");
    if (trimmed) {
      localStorage.setItem("API_BASE_URL", trimmed);
    }
  } catch {}
};

export { TOKEN_REFRESH_TIMEOUT };
