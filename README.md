# CyberSentinel AI 🛡️

CyberSentinel AI is a next-generation, AI-powered Enterprise Security Platform built on the MERN stack. It leverages Google's Gemini AI and heuristic analysis to proactively hunt, monitor, and mitigate cyber threats before they breach your perimeter. 

Engineered by **Balaji Patil** ([GitHub Profile](https://github.com/BalajiPatil1207)).
<<<<<<< HEAD

![CyberSentinel AI](Frontend/public/favicon.ico)
=======
*Note: Add a hero screenshot here*
>>>>>>> 4f05c0a39b7edc0e523af53b71a820ed11150e54

## 🌟 Key Features

- **🧠 AI Security Copilot:** Powered by Google Gemini to analyze threats, answer security queries, and provide mitigation strategies instantly.
- **🦠 Malware Sandbox:** Upload suspicious binaries and scripts to a secure heuristics engine that detects dangerous code patterns.
- **🎣 Phishing Detection:** Scan emails and URLs using AI NLP to determine scam likelihood and protect your employees from social engineering.
- **🚨 Real-Time Alerts:** Live threat monitoring dashboards with WebSocket (Socket.io) integration for instant security notifications.
- **👥 Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for Super Admins, Security Analysts, and standard Employees.
- **🎨 Modern UI/UX:** Stunning glassmorphism design, dark mode, and seamless animations using Tailwind CSS and Framer Motion.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite)**
- **Tailwind CSS** (Styling & Responsiveness)
- **Framer Motion** (Animations)
- **Lucide React** (Icons)
- **React Router** (Navigation)
- **Socket.io-client** (Real-time updates)

### Backend
- **Node.js & Express.js**
- **MongoDB** (Mongoose ORM)
- **Socket.io** (WebSockets)
- **Google Gemini API** (AI Copilot Integration)
- **JWT** (JSON Web Tokens for Authentication)
- **Bcrypt.js** (Password Hashing)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas URI)
- Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/BalajiPatil1207/CyberSentinel_AI.git
   cd CyberSentinel_AI
   ```

2. **Backend Setup:**
   ```bash
   cd Backend
   npm install
   ```
   Create a `.env` file in the `Backend` directory and add your credentials:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   GEMINI_API_KEY=your_gemini_api_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bashcd 
   cd ../Frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the application:**
   Open your browser and navigate to `http://localhost:5173`.

## 🔒 Security
This platform is designed for enterprise security management and awareness. Ensure that default admin credentials are changed upon deployment.

## 📄 License
This project is proprietary and engineered by Balaji Patil. 
CyberSentinel AI © 2026. All Rights Reserved.

---
*For business inquiries or support, please contact via GitHub or the integrated platform contact widget.*
