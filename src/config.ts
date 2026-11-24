// Dynamic API Base URL helper for Local vs Production (Vercel/Render)
export const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL !== undefined && import.meta.env.VITE_API_BASE_URL !== '') {
    return import.meta.env.VITE_API_BASE_URL;
  }
  // When developing with Vite dev server (port 3000), route API calls to Express on port 5000
  if (typeof window !== 'undefined') {
    if (window.location.port === '3000') {
      const host = window.location.hostname || 'localhost';
      return `http://${host}:5000`;
    }
  }
  // In production (served by server.js or reverse proxy), use same-origin relative path
  return '';
};

export const API_BASE_URL = getApiBaseUrl();
