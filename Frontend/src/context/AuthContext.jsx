import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to get auth headers with JWT token
  const getAuthHeaders = () => {
    const token = localStorage.getItem("auth_token");
    return token ? { "Authorization": `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("auth_token");
      const storedUser = localStorage.getItem("auth_user");

      if (token && storedUser) {
        try {
          // Verify token against backend /api/auth/me
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/me`, {
            headers: {
              ...getAuthHeaders(),
            },
          });

          if (response.ok) {
            const result = await response.json();
            setUser(result.data);
            localStorage.setItem("auth_user", JSON.stringify(result.data));
          } else {
            // Token expired or invalid
            logout();
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Network error: Fallback to stored user so page still renders offline if needed
          setUser(JSON.parse(storedUser));
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { user: loggedInUser, token } = result.data;
        setUser(loggedInUser);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(loggedInUser));
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || "Invalid email or password credentials." 
        };
      }
    } catch (error) {
      console.error("Login API request failed:", error);
      return { 
        success: false, 
        message: "Network error. Unable to connect to authorization server." 
      };
    }
  };

  const register = async (name, email, password, role = "Employee") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        const { user: registeredUser, token } = result.data;
        setUser(registeredUser);
        localStorage.setItem("auth_token", token);
        localStorage.setItem("auth_user", JSON.stringify(registeredUser));
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || "Registration failed. Please check inputs." 
        };
      }
    } catch (error) {
      console.error("Registration API request failed:", error);
      return { 
        success: false, 
        message: "Network error. Unable to connect to authorization server." 
      };
    }
  };

  const updateProfile = async (name, email, profilePicture) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ name, email, profilePicture }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setUser(result.data);
        localStorage.setItem("auth_user", JSON.stringify(result.data));
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || "Profile update failed." 
        };
      }
    } catch (error) {
      console.error("Profile update API request failed:", error);
      return { 
        success: false, 
        message: "Network error. Unable to connect to server." 
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading, getAuthHeaders, updateProfile }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
