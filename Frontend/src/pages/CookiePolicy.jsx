import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';

export function CookiePolicy() {
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
        <h1 className="text-4xl md:text-5xl font-extrabold mb-8 text-white">Cookie Policy</h1>
        <p className="text-slate-400 mb-12">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-12 text-slate-300 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. What are Cookies?</h2>
            <p>
              Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the owners of the site.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Cookies</h2>
            <p className="mb-4">CyberSentinel AI uses cookies primarily for essential platform operations and security. We use the following types of cookies:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Essential Cookies:</strong> These are required for the operation of our platform. They include cookies that enable you to log into secure areas like your Dashboard (e.g., JWT Authentication tokens stored in HTTP-only cookies).</li>
              <li><strong>Security Cookies:</strong> We use cookies to detect malicious activity, prevent CSRF (Cross-Site Request Forgery) attacks, and authenticate user sessions safely.</li>
              <li><strong>Preferences Cookies:</strong> These are used to recognize you when you return to our website and remember your settings (like dark mode).</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Third-Party Cookies</h2>
            <p>
              Since we are a cybersecurity platform, we strictly limit third-party tracking. We do NOT use third-party advertising cookies or sell your browsing data to advertisers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Managing Cookies</h2>
            <p>
              You can set your browser to refuse all or some browser cookies, or to alert you when websites set or access cookies. However, if you disable or refuse cookies, please note that some parts of the CyberSentinel AI dashboard will become inaccessible or not function properly, as authentication relies on them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Contact Us</h2>
            <p>
              If you have any questions about our use of cookies, please contact us at <strong>baalajipatil3252@gmail.com</strong>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
