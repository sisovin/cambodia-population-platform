"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiClient = exports.APIClient = void 0;
class APIClient {
    baseURL;
    tenantId;
    constructor(baseURL) {
        this.baseURL = baseURL || process.env.API_BASE_URL || 'http://localhost:3001';
        this.tenantId = typeof window !== 'undefined'
            ? localStorage.getItem('tenantId')
            : null;
    }
    async request(endpoint, options = {}) {
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
    async login(credentials) {
        return this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
    }
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }
    // Citizen endpoints
    async searchCitizens(query) {
        return this.request(`/citizens/search?q=${encodeURIComponent(query)}`);
    }
    async getCitizen(id) {
        return this.request(`/citizens/${id}`);
    }
}
exports.APIClient = APIClient;
exports.apiClient = new APIClient();
