import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-brand-cyan/30">
      {/* Navbar Minimal */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800">
        <div className="flex items-center px-8 py-4 max-w-7xl mx-auto">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
          <div className="mx-auto flex items-center gap-2">
            <Shield className="text-brand-cyan w-6 h-6" />
            <span className="text-xl font-bold tracking-tight text-white">CyberSentinel<span className="text-brand-cyan">.AI</span></span>
          </div>
          <div className="w-24"></div> {/* Spacer to center logo */}
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-white">Privacy Policy</h1>
        <p className="text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              At CyberSentinel AI, we prioritize your privacy. We collect the following types of information:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, role, and organization details when you register.</li>
              <li><strong>Security Data:</strong> Files, URLs, and emails submitted for heuristic scanning and analysis.</li>
              <li><strong>Usage Data:</strong> Information on how you interact with our platform (e.g., login times, features used).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Data</h2>
            <p className="mb-4">The data collected is strictly used for the following purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide, maintain, and improve our cybersecurity scanning services.</li>
              <li>To detect, prevent, and address technical issues or malicious threats.</li>
              <li>To communicate with you regarding security alerts, updates, or account matters.</li>
              <li>To train our AI models (only using anonymized and aggregated threat data).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Data Security & Storage</h2>
            <p>
              All submitted files and data are processed in isolated sandboxes. Once the analysis is complete, malicious files are securely hashed and logged for threat intelligence, while clean files are immediately purged from our servers. We employ industry-standard AES-256 encryption for data at rest and TLS 1.3 for data in transit.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Sharing of Information</h2>
            <p>
              We do not sell your personal information. We may share anonymized threat indicators (e.g., malware hashes) with global security organizations to improve internet safety. We may disclose your data if required by law or to protect the rights and safety of CyberSentinel AI and its users.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
            <p>
              Depending on your location (e.g., GDPR, CCPA), you have the right to access, correct, delete, or restrict processing of your personal data. You can request data deletion by contacting us at <strong>baalajipatil3252@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
