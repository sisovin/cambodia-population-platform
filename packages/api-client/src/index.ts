import axios from 'axios';

export class APIClient {
  private baseURL: string;
  private tenantId: string | null;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.API_BASE_URL || 'http://localhost:3001';
    this.tenantId = typeof window !== 'undefined' 
      ? localStorage.getItem('tenantId') 
      : null;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'x-tenant-id': this.tenantId || '',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Auth endpoints
  async login(credentials: { email: string; password: string }) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: any) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Citizen endpoints
  async searchCitizens(query: string) {
    return this.request(`/citizens/search?q=${encodeURIComponent(query)}`);
  }

  async getCitizen(id: string) {
    return this.request(`/citizens/${id}`);
  }
}

export const apiClient = new APIClient();