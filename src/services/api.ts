/**
 * AuraVMS API Client configured for Network & Local Access.
 * Dynamically resolves host IP so another PC/device on LAN can connect.
 */

const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  const hostname = window.location.hostname || 'localhost';
  return `http://${hostname}:8000/api/v1`;
};

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('auravms_auth_token');
    const baseUrl = getApiBaseUrl();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.info(`[VMS Network Client] Operating with storage engine for ${endpoint}`);
      throw error;
    }
  }

  static get<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static post<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static put<T>(endpoint: string, data: unknown) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
