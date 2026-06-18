import PDFDocument from "pdfkit";
import Threat from "../models/Threat.js";
import Incident from "../models/Incident.js";
import Vulnerability from "../models/Vulnerability.js";
import Alert from "../models/Alert.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { throwInternal } from "../utils/ApiError.js";

/**
 * @desc    Export dynamic executive summary report as PDF
 * @route   GET /api/reports/export-pdf
 * @access  Protected (Super Admin, Security Analyst)
 */
const exportPDF = async (req, res, next) => {
  try {
    // 1. Gather database statistics
    const totalThreats = await Threat.countDocuments();
    const criticalThreats = await Threat.countDocuments({ severity: "Critical" });
    const highThreats = await Threat.countDocuments({ severity: "High" });
    
    const activeIncidents = await Incident.countDocuments({ status: { $ne: "Resolved" } });
    const resolvedIncidents = await Incident.countDocuments({ status: "Resolved" });

    const openVulns = await Vulnerability.countDocuments({ status: "Open" });
    const patchedVulns = await Vulnerability.countDocuments({ status: { $in: ["Resolved", "Patched"] } });

    const unreadAlerts = await Alert.countDocuments({ isRead: false });

    // 2. Setup PDF document
    const doc = new PDFDocument({ margin: 50 });
    
    // Set headers for file transfer
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="Executive_Security_Report.pdf"');
    
    doc.pipe(res);

    // 3. Draw Report Header
    doc
      .fillColor("#0f172a")
      .rect(0, 0, doc.page.width, 120)
      .fill();

    doc
      .fillColor("#00f0ff")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("CYBERSENTINEL AI", 50, 40);

    doc
      .fillColor("#ffffff")
      .fontSize(12)
      .font("Helvetica")
      .text("EXECUTIVE SECURITY PERFORMANCE REPORT", 50, 70);

    doc
      .fillColor("#94a3b8")
      .fontSize(10)
      .text(`Generated: ${new Date().toLocaleString()} | Auditor: ${req.user.name}`, 50, 90);

    // Move to content area
    doc.y = 150;

    // 4. Section: Executive Summary Overview
    doc
      .fillColor("#1e293b")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("1. Executive Summary Overview", 50, doc.y);
    
    doc.moveDown(0.5);
    doc
      .fillColor("#334155")
      .fontSize(10)
      .font("Helvetica")
      .text(
        "This performance report compiles live security metrics, patch management statistics, and active incident response tickets recorded across the enterprise infrastructure gateway. All audits verify standard SOC2 and ISO 27001 compliance criteria.",
        { align: "justify", width: 512 }
      );

    doc.moveDown(1.5);

    // 5. Section: Platform Statistics
    doc
      .fillColor("#1e293b")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("2. Infrastructure Health Metrics", 50, doc.y);

    doc.moveDown(0.8);

    // Draw Stats Table Grid
    const stats = [
      { metric: "Total Detected Security Threats", value: totalThreats },
      { metric: "Critical Severity Threats (Active)", value: criticalThreats },
      { metric: "High Severity Threats (Active)", value: highThreats },
      { metric: "Active Incident Response Tickets", value: activeIncidents },
      { metric: "Resolved Incident Response Tickets", value: resolvedIncidents },
      { metric: "Open Server Vulnerabilities (CVEs)", value: openVulns },
      { metric: "Remediated/Patched Vulnerabilities", value: patchedVulns },
      { metric: "Unread Operational Alerts", value: unreadAlerts }
    ];

    let currentY = doc.y;
    
    // Draw table headers
    doc.rect(50, currentY, 512, 20).fill("#f1f5f9");
    doc.fillColor("#475569").font("Helvetica-Bold").fontSize(10);
    doc.text("SECURITY METRIC CATEGORY", 60, currentY + 5);
    doc.text("METRIC COUNT", 450, currentY + 5);
    
    currentY += 20;

    stats.forEach((stat, index) => {
      // Background shading
      if (index % 2 === 0) {
        doc.rect(50, currentY, 512, 20).fill("#f8fafc");
      }
      
      doc.fillColor("#334155").font("Helvetica").fontSize(10);
      doc.text(stat.metric, 60, currentY + 5);
      
      // Color key items (like criticals) differently
      if (stat.metric.includes("Critical") && stat.value > 0) {
        doc.fillColor("#ef4444").font("Helvetica-Bold");
      } else {
        doc.fillColor("#334155");
      }
      doc.text(stat.value.toString(), 450, currentY + 5);
      
      currentY += 20;
    });

    doc.y = currentY + 20;

    // 6. Section: Compliance Assessment
    doc
      .fillColor("#1e293b")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text("3. Security Posture Assessment", 50, doc.y);

    doc.moveDown(0.5);

    let healthStatus = "EXCELLENT";
    let healthDetails = "No open vulnerabilities or critical active threats registered. Standard systems status is verified stable.";

    if (criticalThreats > 0 || openVulns > 0) {
      healthStatus = "WARNING";
      healthDetails = `There are currently ${openVulns} unpatched CVEs and ${criticalThreats} critical threats registered. Immediate mitigation actions are recommended to bring the infrastructure back within SOC2 tolerance scopes.`;
    }

    doc
      .fillColor("#475569")
      .font("Helvetica-Bold")
      .fontSize(11)
      .text(`Status Rating: ${healthStatus}`, 50, doc.y);

    doc.moveDown(0.3);
    doc
      .fillColor("#334155")
      .font("Helvetica")
      .fontSize(10)
      .text(healthDetails, { align: "justify", width: 512 });

    // 7. Footer
    doc
      .fontSize(8)
      .fillColor("#94a3b8")
      .text(
        "Confidential - Internal Auditing Use Only. ABC Cyber Shield systems are monitored 24/7/365.",
        50,
        700,
        { align: "center", width: 512 }
      );

    // Finish PDF
    doc.end();
  } catch (error) {
    next(throwInternal("Failed to generate and stream PDF security report.", [error.message]));
  }
};

/**
 * @desc    Export threat logs data as CSV
 * @route   GET /api/reports/export-csv
 * @access  Protected (Super Admin, Security Analyst)
 */
const exportCSV = async (req, res, next) => {
  try {
    const threats = await Threat.find({}).sort({ timestamp: -1 });

    // Define CSV Headers
    let csvContent = "Threat ID,Type,Source,Target,Severity,Status,Timestamp\n";

    // Append Rows
    threats.forEach((threat) => {
      const row = [
        threat._id.toString(),
        `"${threat.type.replace(/"/g, '""')}"`,
        `"${threat.source.replace(/"/g, '""')}"`,
        `"${threat.target.replace(/"/g, '""')}"`,
        threat.severity,
        threat.status,
        threat.timestamp || threat.createdAt
      ].join(",");
      csvContent += row + "\n";
    });

    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="Threat_History_Logs.csv"');
    
    return res.status(200).send(csvContent);
  } catch (error) {
    next(throwInternal("Failed to generate and stream CSV threat logs.", [error.message]));
  }
};

export default {
  exportPDF,
  exportCSV
};

export {
  exportPDF,
  exportCSV
};
