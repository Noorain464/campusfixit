import AsyncStorage from "@react-native-async-storage/async-storage";

// Base URL for your API - change this to your server URL
// IMPORTANT: For React Native on physical devices, use your computer's IP address instead of localhost
// Example: 'http://192.168.1.100:3000/api' (replace with your actual IP)
// For iOS Simulator/Android Emulator, you can use 'http://localhost:3000/api'
// To find your IP: On Mac/Linux run 'ifconfig', on Windows run 'ipconfig'
// Update this to your machine IP + server port. Server listens on 3000 by default.
const API_BASE_URL = "http://192.168.1.6:3000";

// API Calls for Login Signup and getCurrentUser

// Helper functions for Tokens

export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return token;
  } catch (error) {
    console.error("Token cannot be retrieved:", error);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem('authToken', token)
    return token
  } catch (error) {
    console.error("Token cannot be Saved")
    return null
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
    return true;
  } catch (error) {
    console.error("Token cannot be removed:", error);
    return false;
  }
};




const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = false
) => {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "application/json",
    };

    // Add JWT token to headers if authentication is required
    if (requiresAuth) {
      const token = await getToken();
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      } else {
        throw new Error("No authentication token found. Please login again.");
      }
    }

    const config = {
      method,
      headers,
    };

    if (body && (method === "POST" || method === "PUT" || method === "PATCH")) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // Check if response is JSON
    const contentType = response.headers.get("content-type");
    let data;

    try {
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If not JSON, get text response (likely HTML error page)
        const text = await response.text();
        console.error("Non-JSON response received:", text.substring(0, 200));

        if (!response.ok) {
          throw new Error(`Server error: ${response.status} ${response.statusText}. Please check if the server is running at ${url}`);
        }
        throw new Error("Server returned non-JSON response. Please check the API endpoint.");
      }
    } catch (parseError) {
      // If JSON parsing fails, it might be HTML or other content
      if (parseError instanceof SyntaxError && parseError.message.includes("JSON")) {
        throw new Error(`Server returned invalid JSON. Please check if the server is running at ${url}. The server might be returning an HTML error page.`);
      }
      throw parseError;
    }

    if (!response.ok) {
      const errorMessage = data?.message || data?.error || `Server error: ${response.status}`;
      console.error("API error response:", { url, method, status: response.status, body: data });
      throw new Error(errorMessage);
    }

    return data;
  } catch (error) {
    console.error("apiRequest failed", { endpoint, method, requiresAuth, error });
    if (error instanceof Error) throw error;
    throw new Error(error?.message || "Network error occurred");
  }
};

// login and Sign up
export const authApi = {
  // signup
  signup: async (name, email, password) => {
    return apiRequest("/api/auth/register", "POST", { name, email, password });
  },

  login: async (email, password) => {
  const data = await apiRequest("/api/auth/login", "POST", {
    email,
    password,
  });

  await saveToken(data.token);
  return data;
},


  // Get current user (verify token)
  getCurrentUser: async () => {
    return apiRequest("/api/auth/me", "GET", null, true);
  },

  // Logout
  logout: async () => {
    await removeToken();
    return { success: true, message: "Logged out successfully" };
  },
};

export const issueApi = {
  createIssue: async (formData) => {
    const token = await getToken();

    const res = await fetch(`${API_BASE_URL}/api/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch (err) {
      const text = await res.text().catch(() => "<unreadable>");
      console.error("createIssue: non-JSON response", { status: res.status, text });
      throw new Error(`Failed to create issue: server returned status ${res.status}`);
    }

    if (!res.ok) {
      console.error("createIssue failed", { status: res.status, body: data });
      throw new Error(data.message || "Failed to create issue");
    }

    return data;
  },

  getMyIssues: async () => {
    return apiRequest("/api/issues/my", "GET", null, true);
  },

  getAllIssues: async () => {
    return apiRequest("/api/issues", "GET", null, true);
  },

  updateStatus: async (id, status) => {
    return apiRequest(
      `/api/issues/${id}/status`,
      "PATCH",
      { status },
      true
    );
  },
};
