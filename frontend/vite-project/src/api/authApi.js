// Base URL of your backend
const API_BASE_URL = import.meta.env.VITE_API_URL; 
export default API_BASE_URL;

// ---------------- REGISTER USER ----------------
export const registerUser = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
      credentials: "include", // ✅ include cookies if backend uses them
    });

    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Register Error:", error);
    throw error;
  }
};

// ---------------- LOGIN USER ----------------
export const loginUser = async (credentials) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
      credentials: "include", // ✅ include cookies if backend uses them
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

// ---------------- GET CURRENT USER ----------------
export const getCurrentUser = async (token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include", // optional if backend uses cookies
    });

    if (!response.ok) {
      throw new Error(`Get user failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Get Current User Error:", error);
    throw error;
  }
};
