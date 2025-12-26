import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * ================================
 * CONFIG
 * ================================
 */
const API_BASE_URL = "http://192.168.1.6:3000";

/**
 * ================================
 * TOKEN HELPERS
 * ================================
 */
const TOKEN_KEY = "authToken";

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    console.error("❌ Failed to get token", err);
    return null;
  }
};

export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (err) {
    console.error("❌ Failed to save token", err);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    console.error("❌ Failed to remove token", err);
  }
};

/**
 * ================================
 * CORE REQUEST HELPER (JSON)
 * ================================
 */
const apiRequest = async (
  endpoint,
  method = "GET",
  body = null,
  requiresAuth = false
) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {
    "Content-Type": "application/json",
  };

  if (requiresAuth) {
    const token = await getToken();
    if (!token) {
      throw new Error("Not authenticated. Please login again.");
    }
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && ["POST", "PUT", "PATCH"].includes(method)) {
    config.body = JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new Error("Network error. Is the backend running?");
  }

  let data = null;
  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    data = await response.json();
  }

  if (!response.ok) {
    console.error("API ERROR", {
      url,
      method,
      status: response.status,
      response: data,
    });
    throw new Error(data?.message || "Request failed");
  }

  return data;
};

/**
 * ================================
 * AUTH APIs
 * ================================
 */
export const authApi = {
  signup: (name, email, password) =>
    apiRequest("/api/auth/register", "POST", {
      name,
      email,
      password,
    }),

  login: async (email, password) => {
    const data = await apiRequest("/api/auth/login", "POST", {
      email,
      password,
    });

    if (data?.token) {
      await saveToken(data.token);
    }

    return data;
  },

  getCurrentUser: () =>
    apiRequest("/api/auth/me", "GET", null, true),

  logout: async () => {
    await removeToken();
  },
};

/**
 * ================================
 * ISSUE APIs
 * ================================
 * (multipart/form-data)
 */
export const issueApi = {
  createIssue: async (formData) => {
    const token = await getToken();
    if (!token) {
      throw new Error("Not authenticated");
    }

    const res = await fetch(`${API_BASE_URL}/api/issues`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ DO NOT set Content-Type manually for FormData
      },
      body: formData,
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      console.error("createIssue error", data);
      throw new Error(data?.message || "Failed to create issue");
    }

    return data;
  },

  getMyIssues: () =>
    apiRequest("/api/issues/my", "GET", null, true),

  getAllIssues: () =>
    apiRequest("/api/issues", "GET", null, true),

  updateStatus: (id, payload) =>
    apiRequest(`/api/issues/${id}`, "PATCH", payload, true),
};
