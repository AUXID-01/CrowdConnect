const API_BASE_URL = import.meta.env.VITE_API_URL; // your backend base URL

export default API_BASE_URL;

// Register a new user
export const registerUser = async (formData) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, { // ✅ added /api
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  return response.json();
};

// Login
export const loginUser = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, { // ✅ added /api
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
};

// Get current user profile
export const getCurrentUser = async (token) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, { // ✅ added /api
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.json();
};
