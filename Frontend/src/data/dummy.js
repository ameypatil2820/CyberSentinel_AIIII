export const dummyUsers = [
  { id: 1, name: "Super Admin", email: "admin@patilcybershield.com", role: "Super Admin", status: "Active" },
  { id: 2, name: "Security Analyst", email: "analyst@abccybershield.com", role: "Security Analyst", status: "Active" },
  { id: 3, name: "Employee User", email: "employee@abccybershield.com", role: "Employee", status: "Active" },
];

export const dummyThreats = [
  { id: "T-1001", type: "Phishing", source: "192.168.1.45", target: "mail-server", severity: "High", status: "Active", timestamp: "2026-06-11T10:30:00Z" },
  { id: "T-1002", type: "Malware", source: "External IP", target: "Workstation-12", severity: "Critical", status: "Active", timestamp: "2026-06-11T11:15:00Z" },
  { id: "T-1003", type: "Unauthorized Access", source: "VPN Node", target: "Database-1", severity: "High", status: "Resolved", timestamp: "2026-06-10T14:20:00Z" },
  { id: "T-1004", type: "Ransomware", source: "10.0.0.5", target: "File-Server", severity: "Critical", status: "Active", timestamp: "2026-06-11T12:00:00Z" },
  { id: "T-1005", type: "Network Attack", source: "Unknown IP", target: "Gateway", severity: "Medium", status: "Mitigated", timestamp: "2026-06-11T09:45:00Z" },
];

export const dummyIncidents = [
  { id: "INC-001", title: "Suspicious Login Attempt", assignee: "Security Analyst", priority: "High", status: "Investigating", date: "2026-06-11T11:00:00Z" },
  { id: "INC-002", title: "Malware Detected on HR PC", assignee: "Super Admin", priority: "Critical", status: "Open", date: "2026-06-11T11:30:00Z" },
];

export const dummyAlerts = [
  { id: 1, message: "Critical Malware Detected on Workstation-12", type: "critical", isRead: false, timestamp: "2026-06-11T11:15:00Z" },
  { id: 2, message: "Multiple failed login attempts for user admin@abccybershield.com", type: "warning", isRead: false, timestamp: "2026-06-11T10:45:00Z" },
];

export const dummyVulnerabilities = [
  { cve: "CVE-2024-3456", target: "192.168.1.10", severity: "Critical", description: "Remote code execution vulnerability.", status: "Open" },
  { cve: "CVE-2023-1234", target: "abccybershield.com", severity: "Medium", description: "Cross-site scripting vulnerability.", status: "Resolved" },
];

export const getInitialData = (key, defaultData) => {
  const storedData = localStorage.getItem(key);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(key, JSON.stringify(defaultData));
  return defaultData;
};
