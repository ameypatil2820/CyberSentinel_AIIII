import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { user, getAuthHeaders } = useAuth();
  const [threats, setThreats] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [vulnerabilities, setVulnerabilities] = useState([]);

  // Fetch all initial data
  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch alerts (accessible to all logged-in roles)
      const resAlerts = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/alerts`, { headers: getAuthHeaders() });
      if (resAlerts.ok) {
        const data = await resAlerts.json();
        setAlerts(data.data || []);
      }

      // Fetch threats (restricted to Super Admin and Security Analyst)
      if (user.role === "Super Admin" || user.role === "Security Analyst") {
        const resThreats = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/threats`, { headers: getAuthHeaders() });
        if (resThreats.ok) {
          const data = await resThreats.json();
          setThreats(data.data || []);
        }

        const resIncidents = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/incidents`, { headers: getAuthHeaders() });
        if (resIncidents.ok) {
          const data = await resIncidents.json();
          setIncidents(data.data || []);
        }

        const resVulns = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/security/vulnerabilities`, { headers: getAuthHeaders() });
        if (resVulns.ok) {
          const data = await resVulns.json();
          setVulnerabilities(data.data || []);
        }
      }

      // Fetch users (restricted to Super Admin only)
      if (user.role === "Super Admin") {
        const resUsers = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/users`, { headers: getAuthHeaders() });
        if (resUsers.ok) {
          const data = await resUsers.json();
          setUsers(data.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching data from API:", error);
    }
  };

  useEffect(() => {
    fetchData();

    if (!user) return;

    // Connect to server socket
    const socketUrl = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? "http://localhost:5000" : window.location.origin);
    const socket = io(socketUrl, {
      transports: ["polling", "websocket"],
      autoConnect: true,
    });

    socket.on("connect", () => {
      console.log("[Socket.io] Connected to server feed.");
    });

    socket.on("new-threat", (newThreat) => {
      console.log("[Socket.io] Dynamic threat received:", newThreat);
      setThreats((prev) => {
        if (prev.some((t) => t._id === newThreat._id)) return prev;
        return [newThreat, ...prev];
      });
    });

    socket.on("new-alert", (newAlert) => {
      console.log("[Socket.io] Dynamic alert received:", newAlert);
      setAlerts((prev) => {
        if (prev.some((a) => a._id === newAlert._id)) return prev;
        return [newAlert, ...prev];
      });
    });

    socket.on("disconnect", () => {
      console.log("[Socket.io] Disconnected from server feed.");
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  // Operations
  const addIncident = async (newIncident) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/incidents`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(newIncident),
      });
      if (response.ok) {
        const result = await response.json();
        setIncidents((prev) => [result.data, ...prev]);
        return { success: true };
      }
      return { success: false, message: "Failed to create incident." };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error occurred." };
    }
  };

  const updateIncident = async (id, updates) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/incidents/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify(updates),
      });
      if (response.ok) {
        const result = await response.json();
        setIncidents((prev) =>
          prev.map((i) => (i._id === id || i.id === id ? result.data : i))
        );
        return { success: true, data: result.data };
      }
      return { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };

  const addIncidentNote = async (id, text) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/incidents/${id}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ text }),
      });
      if (response.ok) {
        const result = await response.json();
        setIncidents((prev) =>
          prev.map((i) => (i._id === id || i.id === id ? result.data : i))
        );
        return { success: true, data: result.data };
      }
      return { success: false };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  };

  const markAlertAsRead = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/alerts/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        const result = await response.json();
        setAlerts((prev) =>
          prev.map((a) => (a._id === id ? result.data : a))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleUserStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/users/${id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (response.ok) {
        const result = await response.json();
        setUsers((prev) =>
          prev.map((u) => (u._id === id ? result.data : u))
        );
        return { success: true };
      }
      const errRes = await response.json();
      return { success: false, message: errRes.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error occurred." };
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ""}/api/users/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        setUsers((prev) => prev.filter((u) => u._id !== id && u.id !== id));
        return { success: true };
      }
      const errRes = await response.json();
      return { success: false, message: errRes.message };
    } catch (error) {
      console.error(error);
      return { success: false, message: "Network error occurred." };
    }
  };

  return (
    <DataContext.Provider value={{
      threats,
      incidents, addIncident, updateIncident, addIncidentNote,
      alerts, markAlertAsRead,
      users, toggleUserStatus, deleteUser,
      vulnerabilities,
      fetchData
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
