const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

class APIClient {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    try {
      const response = await fetch(url, {
        headers: defaultHeaders,
        ...options,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error = new Error(
          errorData.message || `HTTP ${response.status}: ${response.statusText}`
        );
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  analyzeJobDescription(jobDescription) {
    return this.request('/api/interview/analyze-jd', {
      method: 'POST',
      body: JSON.stringify({ jobDescription }),
    });
  }

  evaluateAnswer(question, answer, skills) {
    return this.request('/api/interview/evaluate-answer', {
      method: 'POST',
      body: JSON.stringify({ question, answer, skills }),
    });
  }

  getHealth() {
    return this.request('/api/health');
  }
}

export const apiClient = new APIClient();
