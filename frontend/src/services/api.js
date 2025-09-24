const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: this.getAuthHeaders(),
            ...options
        };

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `HTTP error! status: ${response.status}`);
        }

        return data;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
        }
    }

    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    post(endpoint, data) {
        return this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
        });
    }

    put(endpoint, data) {
        return this.request(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
        });
    }

    patch(endpoint, data) {
        return this.request(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(data)
        });
    }

    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
}

export default new ApiService();