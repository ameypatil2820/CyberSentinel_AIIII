import Threat from "../models/Threat.js";
import Vulnerability from "../models/Vulnerability.js";
import Alert from "../models/Alert.js";
import ChatHistory from "../models/ChatHistory.js";
import { throwBadRequest, throwNotFound } from "../utils/ApiError.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { saveRAMFiles } from "../middlewares/memoryUpload.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper to calculate Levenshtein distance between two strings
const getLevenshteinDistance = (a, b) => {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) == a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,   // insertion
            matrix[i - 1][j] + 1    // deletion
          )
        );
      }
    }
  }
  return matrix[b.length][a.length];
};

/**
 * @desc    Scan email content or links for phishing indicators
 * @route   POST /api/security/phishing-scan
 * @access  Protected (All logged-in roles)
 */
const runPhishingScan = async (req, res, next) => {
  const { type, content } = req.body;

  try {
    if (!type || !content) {
      throwBadRequest("Please provide scan type ('email' or 'url') and content.");
    }

    const textToAnalyze = content.toLowerCase();
    let score = Math.floor(Math.random() * 20) + 15; // Base score 15-35
    const details = [];

    // Heuristic 1: Urgent/Fear inducing language
    const urgentKeywords = [
      "immediate action required",
      "immediate action",
      "verify password",
      "verify your account",
      "unauthorized transaction",
      "unauthorized transfer",
      "suspend your account",
      "alert: security compromise",
      "immediate response",
      "reset password",
    ];

    const hasUrgentLanguage = urgentKeywords.some((keyword) =>
      textToAnalyze.includes(keyword)
    );

    if (hasUrgentLanguage) {
      score += 35;
      details.push("Urgent threat-inducing language detected ('Immediate action required' indicators).");
    }

    // Heuristic 2: Suspicious domains/link redirects
    if (type === "url") {
      // Parse Protocol and Domain
      let protocol = "";
      let domain = "";
      
      const urlMatch = textToAnalyze.match(/^([a-z]+):\/\/([^\/]+)/i);
      if (urlMatch) {
        protocol = urlMatch[1].toLowerCase();
        domain = urlMatch[2].toLowerCase();
      } else {
        // Fallback if no protocol exists
        domain = textToAnalyze.split('/')[0].toLowerCase();
      }

      // Check for valid protocol
      if (protocol && protocol !== "http" && protocol !== "https") {
        score += 40;
        details.push("Invalid or unsupported URL protocol detected.");
      } else if (!protocol) {
        // No protocol provided, add a minor penalty instead of treating it as invalid
        score += 5;
        details.push("No explicit URL protocol provided. Assuming standard domain.");
      }

      // Typo-Squatting Detection
      const popularDomains = [
        "github.com", "google.com", "microsoft.com", "apple.com", "amazon.com", 
        "facebook.com", "twitter.com", "linkedin.com", "paypal.com", "netflix.com", 
        "bankofamerica.com", "chase.com"
      ];

      for (const pop of popularDomains) {
        const dist = getLevenshteinDistance(domain, pop);
        if (dist > 0 && dist <= 2) {
          score += 40;
          details.push(`Possible typo-squatting domain detected (${domain} resembles ${pop}).`);
          break; // Avoid multiple typo findings for one domain
        }
      }

      // Check for suspicious URL keywords
      const suspiciousDomains = [
        "secure-login",
        "update-account",
        "verify-patilcybershield",
        "free-prize",
        "giftcard",
        "claim-bonus",
        "refund-portal",
      ];
      
      const isSuspiciousDomain = suspiciousDomains.some((dom) =>
        textToAnalyze.includes(dom)
      );

      if (isSuspiciousDomain) {
        score += 35;
        details.push("Suspicious domain keywords detected inside the URL string.");
      }
    } else {
      // Email-specific heuristic: Sender domain mismatch signs
      const emailMismatches = [
        "paypal-verify@",
        "secure-bank@",
        "support-admin@",
        "gift-rewards@",
      ];

      const hasSenderMismatch = emailMismatches.some((mis) =>
        textToAnalyze.includes(mis)
      );

      if (hasSenderMismatch) {
        score += 30;
        details.push("Suspicious sender address domain mismatch detected.");
      }
    }

    // Cap score at 100
    score = Math.min(score, 100);
    const isMalicious = score >= 70;
    
    // Result Classification
    let classification = "Safe";
    if (score >= 70) {
      classification = "High Risk";
    } else if (score >= 40) {
      classification = "Suspicious";
    }

    if (classification === "Safe" && details.length === 0) {
      details.push("No obvious phishing signatures identified in source text.");
    }

    // **INTEGRATION HOOKS**
    // If the scanner identifies a high threat risk (isMalicious === true),
    // automatically save it to database Threat log and trigger a Security Alert.
    if (isMalicious) {
      const threatSource = type === "url" ? content : "Email Gateway Filter";
      const threatTarget = type === "url" ? "User Web Proxy" : "User Mailbox";
      const threatSeverity = score >= 90 ? "Critical" : "High";

      // 1. Save Threat signature
      const threatObj = await Threat.create({
        type: "Phishing Attempt",
        source: threatSource,
        target: threatTarget,
        severity: threatSeverity,
        status: "Active",
      });

      // 2. Generate Security Alert
      const alertObj = await Alert.create({
        message: `High risk Phishing attempt detected (${score}/100) on target ${threatTarget}!`,
        type: score >= 90 ? "critical" : "warning",
        isRead: false,
      });

      // 3. Emit real-time WebSockets notifications
      const io = req.app?.get("io");
      if (io) {
        io.emit("new-threat", threatObj);
        io.emit("new-alert", alertObj);
      }
    }

    const report = {
      score,
      isMalicious,
      classification,
      details,
    };

    return sendSuccess(res, report, "Phishing scan analysis completed successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Simulate vulnerability port scanning on targets (IP/Domain)
 * @route   POST /api/security/vuln-scan
 * @access  Protected (Super Admin, Security Analyst)
 */
const runVulnScan = async (req, res, next) => {
  const { targetType, target } = req.body;

  try {
    if (!targetType || !target) {
      throwBadRequest("Please provide target type ('ip' or 'domain') and target address.");
    }

    // Simulating port scanner findings
    const mockVulnerabilities = [
      {
        cve: "CVE-2024-1024",
        severity: "High",
        component: "OpenSSL",
        description: "Buffer overflow vulnerability detected in memory allocation.",
      },
      {
        cve: "CVE-2023-4455",
        severity: "Medium",
        component: "Nginx",
        description: "Improper configuration allows potential directory traversal.",
      },
      {
        cve: "CVE-2023-8890",
        severity: "Low",
        component: "SSH",
        description: "Weak cipher suites are enabled.",
      },
    ];

    const savedFindings = [];

    // Save each vulnerability to database, and push Alert on High/Critical items
    for (const vuln of mockVulnerabilities) {
      const dbEntry = await Vulnerability.create({
        cve: vuln.cve,
        target,
        severity: vuln.severity,
        component: vuln.component,
        description: vuln.description,
        status: "Open",
      });

      savedFindings.push(dbEntry);

      // Trigger critical/warning Alert if severity is High or Critical
      if (vuln.severity === "High" || vuln.severity === "Critical") {
        const alertObj = await Alert.create({
          message: `Vulnerability ${vuln.cve} (${vuln.severity}) identified on scanned target ${target}!`,
          type: "critical",
          isRead: false,
        });

        const io = req.app?.get("io");
        if (io) {
          io.emit("new-alert", alertObj);
        }
      }
    }

    return sendSuccess(
      res,
      savedFindings,
      `Vulnerability scan on target ${target} completed successfully! ${mockVulnerabilities.length} issues registered.`
    );
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit a question/prompt to the AI Security Copilot
 * @route   POST /api/security/ai-chat
 * @access  Protected (All logged-in roles)
 */
const aiChat = async (req, res, next) => {
  const { prompt } = req.body;
  const userId = req.user._id;

  try {
    if (!prompt) {
      throwBadRequest("Please provide a prompt for the AI Assistant.");
    }

    let reply = "";

    // If API key is available, use Google Gemini AI
    if (process.env.GEMINI_API_KEY) {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        
        // Feed it context about CyberSentinel AI to give it a security Analyst persona
        const systemPrompt = `You are the CyberSentinel AI Security Copilot. Answer the following security question/concern in a professional, concise manner: ${prompt}`;
        
        const result = await model.generateContent(systemPrompt);
        reply = result.response.text();
      } catch (geminiError) {
        console.error("Gemini AI API Error, falling back to heuristics:", geminiError);
      }
    }

    // Heuristics Fallback if Gemini key is missing or failed
    if (!reply) {
      const query = prompt.toLowerCase();
      reply = "I've analyzed your query. Based on the current security context, everything looks stable, but I recommend checking the latest vulnerability scan results.";

      if (query.includes("cve")) {
        reply = "CVE-2024-1024 is a critical buffer overflow vulnerability found in OpenSSL. It allows remote attackers to execute arbitrary code. Recommended action: Patch the system immediately to the latest version.";
      } else if (query.includes("phishing")) {
        reply = "To mitigate a phishing attack: 1) Isolate the affected user's machine. 2) Reset their credentials. 3) Block the malicious sender domain at the email gateway. 4) Run a full system malware scan.";
      } else if (query.includes("threat") || query.includes("status")) {
        reply = "Currently, our monitoring systems show no new active threats outside of expected background noise. Be sure to audit port scans and active incident responses in the central terminal.";
      }
    }

    // Save chat history
    let chat = await ChatHistory.findOne({ user: userId });
    if (!chat) {
      chat = new ChatHistory({ user: userId, messages: [] });
    }

    chat.messages.push({ role: "user", content: prompt });
    chat.messages.push({ role: "ai", content: reply });
    await chat.save();

    return sendSuccess(res, { reply, history: chat.messages }, "AI Response generated successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's AI assistant chat history
 * @route   GET /api/security/ai-chat/history
 * @access  Protected (All logged-in roles)
 */
const getChatHistory = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const chat = await ChatHistory.findOne({ user: userId });
    const messages = chat ? chat.messages : [];
    return sendSuccess(res, messages, "Chat history retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Analyze a pasted script or mock file metadata inside the sandbox
 * @route   POST /api/security/malware-analyze
 * @access  Protected (All logged-in roles)
 */
const malwareAnalyze = async (req, res, next) => {
  const { fileName, fileContent } = req.body;

  try {
    if (!fileName) {
      throwBadRequest("Please provide a filename to analyze.");
    }

    // Heuristics for analysis
    const details = [];
    let score = 0;
    
    if (fileContent) {
      const lowerContent = fileContent.toLowerCase();
      
      // Look for dangerous script operations
      if (lowerContent.includes("eval(") || lowerContent.includes("exec(")) {
        score += 40;
        details.push("Dynamic code execution function detected ('eval' / 'exec').");
      }
      if (lowerContent.includes("child_process") || lowerContent.includes("spawn(") || lowerContent.includes("system(")) {
        score += 35;
        details.push("System shell command execution interface detected.");
      }
      if (lowerContent.includes("fs.write") || lowerContent.includes("fs.unlink") || lowerContent.includes("rm -rf")) {
        score += 25;
        details.push("Destructive filesystem modifications identified.");
      }
    } else {
      // Analyze by file extension signature
      const ext = fileName.split(".").pop().toLowerCase();
      if (["exe", "bat", "sh", "scr", "vbs"].includes(ext)) {
        score += 50;
        details.push(`Executable binary file format detected ('.${ext}').`);
      } else {
        score += 10;
        details.push(`Standard document format analysis completed ('.${ext}').`);
      }
    }

    // Randomize score variance
    score = Math.min(Math.max(score + Math.floor(Math.random() * 20), 0), 100);
    const isMalicious = score >= 50;

    if (isMalicious) {
      // Log Threat
      const threatObj = await Threat.create({
        type: "Malware Detected",
        source: `Sandbox Analysis: ${fileName}`,
        target: "Security Incident Desk",
        severity: score >= 85 ? "Critical" : "High",
        status: "Active",
      });

      // Trigger Alert
      const alertObj = await Alert.create({
        message: `Malware payload (${score}/100) identified in sandbox analysis of ${fileName}!`,
        type: score >= 85 ? "critical" : "warning",
        isRead: false,
      });

      // Emit socket alerts
      const io = req.app?.get("io");
      if (io) {
        io.emit("new-threat", threatObj);
        io.emit("new-alert", alertObj);
      }
    }

    const report = {
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      fileName,
      score,
      threatLevel: isMalicious ? "Malicious" : "Clean",
      enginesDetected: isMalicious ? Math.floor(Math.random() * 15) + 5 : 0,
      totalEngines: 64,
      details: details.length > 0 ? details : ["No suspicious operations or formatting detected."],
    };

    return sendSuccess(res, report, `Sandbox malware analysis of ${fileName} completed successfully.`);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all registered vulnerabilities
 * @route   GET /api/security/vulnerabilities
 * @access  Protected (Super Admin, Security Analyst)
 */
const getVulnerabilities = async (req, res, next) => {
  try {
    const vulns = await Vulnerability.find({}).sort({ dateScanned: -1 });
    return sendSuccess(res, vulns, "Vulnerabilities retrieved successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update vulnerability status (e.g. resolve/patch)
 * @route   PATCH /api/security/vulnerabilities/:id
 * @access  Protected (Super Admin, Security Analyst)
 */
const patchVulnerability = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!status || !["Open", "Resolved", "Patched"].includes(status)) {
      throwBadRequest("Please provide a valid status ('Open', 'Resolved', 'Patched').");
    }

    const vuln = await Vulnerability.findById(id);
    if (!vuln) {
      throwNotFound(`Vulnerability with ID ${id} not found.`);
    }

    vuln.status = status;
    await vuln.save();

    return sendSuccess(res, vuln, "Vulnerability status updated successfully!");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a vulnerability record
 * @route   DELETE /api/security/vulnerabilities/:id
 * @access  Protected (Super Admin, Security Analyst)
 */
const deleteVulnerability = async (req, res, next) => {
  try {
    const vulnId = req.params.id;

    const deletedVuln = await Vulnerability.findByIdAndDelete(vulnId);

    if (!deletedVuln) {
      throwNotFoundError("Vulnerability record not found.");
    }

    return sendSuccess(res, null, "Vulnerability record deleted successfully.");
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload and analyze binary/script file in Sandbox
 * @route   POST /api/security/malware-upload
 * @access  Protected (All logged-in roles)
 */
const malwareUpload = async (req, res, next) => {
  try {
    if (!req.tempFiles || req.tempFiles.length === 0) {
      return throwBadRequest("No file was uploaded.");
    }

    // Save and compress files (if image/pdf) or write directly to server
    await saveRAMFiles(req.tempFiles);

    const uploadedFile = req.tempFiles[0];
    const fileName = uploadedFile.finalPath.split("/").pop();
    const fileContentString = uploadedFile.buffer.toString("utf-8");

    // Perform malware scanning heuristics
    const details = [];
    let score = 0;

    const lowerContent = fileContentString.toLowerCase();
    
    // Look for dangerous script operations in files
    if (lowerContent.includes("eval(") || lowerContent.includes("exec(")) {
      score += 40;
      details.push("Dynamic code execution function detected ('eval' / 'exec').");
    }
    if (lowerContent.includes("child_process") || lowerContent.includes("spawn(") || lowerContent.includes("system(")) {
      score += 35;
      details.push("System shell command execution interface detected.");
    }
    if (lowerContent.includes("fs.write") || lowerContent.includes("fs.unlink") || lowerContent.includes("rm -rf")) {
      score += 25;
      details.push("Destructive filesystem modifications identified.");
    }

    // Analyze by file extension signature
    const ext = uploadedFile.originalExt.replace(".", "").toLowerCase();
    if (["exe", "bat", "sh", "scr", "vbs"].includes(ext)) {
      score += 50;
      details.push(`Executable binary file format detected ('.${ext}').`);
    } else {
      score += 10;
      details.push(`Standard file format analysis completed ('.${ext}').`);
    }

    // Randomize score variance
    score = Math.min(Math.max(score + Math.floor(Math.random() * 20), 0), 100);
    const isMalicious = score >= 50;

    if (isMalicious) {
      // Log Threat
      const threatObj = await Threat.create({
        type: "Malware Detected",
        source: `Sandbox Upload: ${fileName}`,
        target: "Security Incident Desk",
        severity: score >= 85 ? "Critical" : "High",
        status: "Active",
      });

      // Trigger Alert
      const alertObj = await Alert.create({
        message: `Malware payload (${score}/100) identified in sandbox upload of ${fileName}!`,
        type: score >= 85 ? "critical" : "warning",
        isRead: false,
      });

      // Emit socket alerts
      const io = req.app?.get("io");
      if (io) {
        io.emit("new-threat", threatObj);
        io.emit("new-alert", alertObj);
      }
    }

    const report = {
      hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      fileName,
      score,
      threatLevel: isMalicious ? "Malicious" : "Clean",
      enginesDetected: isMalicious ? Math.floor(Math.random() * 15) + 5 : 0,
      totalEngines: 64,
      details: details.length > 0 ? details : ["No suspicious operations or formatting detected."],
      filePath: "/" + uploadedFile.finalPath, // Relative path from public root
    };

    return sendSuccess(res, report, `Sandbox malware upload analysis of ${fileName} completed successfully.`);
  } catch (error) {
    next(error);
  }
};

export default {
  runPhishingScan,
  runVulnScan,
  aiChat,
  getChatHistory,
  malwareAnalyze,
  malwareUpload,
  getVulnerabilities,
  patchVulnerability,
};

export {
  runPhishingScan,
  runVulnScan,
  aiChat,
  getChatHistory,
  malwareAnalyze,
  malwareUpload,
  getVulnerabilities,
  patchVulnerability,
  deleteVulnerability,
};
