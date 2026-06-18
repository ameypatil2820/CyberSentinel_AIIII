import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white selection:bg-brand-cyan/30">
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
          <div className="w-24"></div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 pt-32 pb-24">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-white">Terms of Service</h1>
        <p className="text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using CyberSentinel AI ("the Platform"), you agree to comply with and be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p>
              CyberSentinel AI provides AI-powered cybersecurity tools, including but not limited to Malware Sandboxing, Phishing Detection, and Vulnerability Scanning. The service is provided "as is" and is intended to assist IT and Security teams in threat mitigation.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. User Responsibilities</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>You must provide accurate information when creating an account.</li>
              <li>You are responsible for maintaining the confidentiality of your credentials.</li>
              <li>You agree NOT to use the platform to develop, test, or distribute malicious software for illegal purposes.</li>
              <li>You agree NOT to reverse-engineer, decompile, or attempt to extract the source code of the platform.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitation of Liability</h2>
            <p>
              While CyberSentinel AI strives for high accuracy, cybersecurity is an ever-evolving field. We do not guarantee that the platform will detect 100% of all threats, zero-days, or phishing attempts. CyberSentinel AI shall not be held liable for any data breaches, financial losses, or system compromises that occur while using our service. The platform is an advisory tool, and final security decisions rest with your organization.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Termination</h2>
            <p>
              We reserve the right to suspend or terminate your account at any time, with or without cause, specifically if we suspect you are using the platform to facilitate cyberattacks or violating these terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Contact Information</h2>
            <p>
              For any questions regarding these Terms, please contact us at <strong>baalajipatil3252@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
