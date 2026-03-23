// @ts-nocheck
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class APIClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.accessToken = localStorage.getItem('accessToken');
    this.refreshToken = localStorage.getItem('refreshToken');
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAuthHeader() {
    return this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {};
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${this.baseURL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: this.refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      this.setTokens(data.accessToken, data.refreshToken);
      return data.accessToken;
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    let response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401 && this.refreshToken) {
      try {
        await this.refreshAccessToken();
        headers.Authorization = `Bearer ${this.accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });
      } catch (error) {
        this.clearTokens();
        window.location.href = '/login';
        throw error;
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth endpoints
  async register(email, password, name) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    try {
      await this.request('/auth/logout', { method: 'POST' });
    } finally {
      this.clearTokens();
    }
  }

  async getCurrentUser() {
    return this.request('/auth/me', { method: 'GET' });
  }

  // Branch endpoints
  async getBranches() {
    return this.request('/branches', { method: 'GET' });
  }

  async getBranch(id) {
    return this.request(`/branches/${id}`, { method: 'GET' });
  }

  async createBranch(branchData) {
    const payload = {
      branch_name: branchData.branch_name || branchData.name,
      developer_name: branchData.developer_name,
      parent_branch: branchData.parent_branch,
      changes_description: branchData.changes_description || branchData.description,
      has_jira_task: branchData.has_jira_task || false,
      jira_link: branchData.jira_link,
      merged_with_dev: branchData.merged_with_dev || false,
      merged_with_demo: branchData.merged_with_demo || false,
      merged_with_beta: branchData.merged_with_beta || false,
      status: branchData.status || 'active',
    };
    return this.request('/branches', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  }

  async updateBranch(id, branchData) {
    const payload = {
      branch_name: branchData.branch_name || branchData.name,
      developer_name: branchData.developer_name,
      parent_branch: branchData.parent_branch,
      changes_description: branchData.changes_description || branchData.description,
      has_jira_task: branchData.has_jira_task || false,
      jira_link: branchData.jira_link,
      merged_with_dev: branchData.merged_with_dev || false,
      merged_with_demo: branchData.merged_with_demo || false,
      merged_with_beta: branchData.merged_with_beta || false,
      status: branchData.status || 'active',
    };
    return this.request(`/branches/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  }

  async deleteBranch(id) {
    return this.request(`/branches/${id}`, { method: 'DELETE' });
  }
}

export const apiClient = new APIClient();
