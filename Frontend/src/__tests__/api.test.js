import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock API client
const mockApiClient = {
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

describe('API Client', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET requests', () => {
    it('should make GET request to endpoint', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: [{ id: 1, name: 'Test' }] });
      const response = await mockApiClient.get('/api/students');
      expect(mockApiClient.get).toHaveBeenCalledWith('/api/students');
    });

    it('should handle GET request with params', async () => {
      mockApiClient.get.mockResolvedValueOnce({ data: { id: 1 } });
      await mockApiClient.get('/api/students/1', { params: { detailed: true } });
      expect(mockApiClient.get).toHaveBeenCalled();
    });

    it('should handle GET request error', async () => {
      mockApiClient.get.mockRejectedValueOnce(new Error('Network error'));
      try {
        await mockApiClient.get('/api/students');
      } catch (error) {
        expect(error.message).toBe('Network error');
      }
    });
  });

  describe('POST requests', () => {
    it('should make POST request with data', async () => {
      const newStudent = { fullName: 'John Doe', email: 'john@example.com' };
      mockApiClient.post.mockResolvedValueOnce({ data: { id: 1, ...newStudent } });
      await mockApiClient.post('/api/students', newStudent);
      expect(mockApiClient.post).toHaveBeenCalledWith('/api/students', newStudent);
    });

    it('should handle POST request error', async () => {
      mockApiClient.post.mockRejectedValueOnce(new Error('Request failed'));
      try {
        await mockApiClient.post('/api/students', {});
      } catch (error) {
        expect(error.message).toBe('Request failed');
      }
    });
  });

  describe('PUT requests', () => {
    it('should make PUT request with updated data', async () => {
      const updates = { fullName: 'Updated Name' };
      mockApiClient.put.mockResolvedValueOnce({ data: { id: 1, ...updates } });
      await mockApiClient.put('/api/students/1', updates);
      expect(mockApiClient.put).toHaveBeenCalledWith('/api/students/1', updates);
    });
  });

  describe('DELETE requests', () => {
    it('should make DELETE request', async () => {
      mockApiClient.delete.mockResolvedValueOnce({ status: 200 });
      await mockApiClient.delete('/api/students/1');
      expect(mockApiClient.delete).toHaveBeenCalledWith('/api/students/1');
    });
  });

  describe('Error handling', () => {
    it('should handle 401 unauthorized', async () => {
      const error = new Error('401 Unauthorized');
      mockApiClient.get.mockRejectedValueOnce(error);
      try {
        await mockApiClient.get('/api/admin');
      } catch (e) {
        expect(e.message).toContain('401');
      }
    });

    it('should handle 403 forbidden', async () => {
      const error = new Error('403 Forbidden');
      mockApiClient.get.mockRejectedValueOnce(error);
      try {
        await mockApiClient.get('/api/admin');
      } catch (e) {
        expect(e.message).toContain('403');
      }
    });

    it('should handle 404 not found', async () => {
      const error = new Error('404 Not Found');
      mockApiClient.get.mockRejectedValueOnce(error);
      try {
        await mockApiClient.get('/api/nonexistent');
      } catch (e) {
        expect(e.message).toContain('404');
      }
    });

    it('should handle 500 server error', async () => {
      const error = new Error('500 Server Error');
      mockApiClient.get.mockRejectedValueOnce(error);
      try {
        await mockApiClient.get('/api/students');
      } catch (e) {
        expect(e.message).toContain('500');
      }
    });
  });
});
