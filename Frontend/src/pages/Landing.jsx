/*
 Author: Balaji Patil
 GitHub: github.com/BalajiPatil1207
*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Activity, Bot, Zap, Globe, ChevronRight, Phone, MessageCircle, Server, Eye, TrendingUp, ShieldCheck, Mail, MapPin, Menu, X } from 'lucide-react';

export function Landing() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <Bot className="w-8 h-8 text-brand-cyan" />,
      title: 'AI Security Copilot',
      description: 'Powered by Google Gemini to analyze threats, answer security queries, and provide mitigation strategies instantly.'
    },
    {
      icon: <Activity className="w-8 h-8 text-blue-500" />,
      title: 'Malware Sandbox',
      description: 'Upload suspicious binaries and scripts to a secure heuristics engine that detects dangerous code patterns.'
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-500" />,
      title: 'Phishing Detection',
      description: 'Scan emails and URLs using AI NLP to determine scam likelihood and protect your employees from social engineering.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Vulnerability Scanner',
      description: 'Track and patch active CVEs across your infrastructure with real-time SOC2 compliance tracking.'
    }
  ];

  const roadmap = [
    {
      title: 'Automated Incident Remediation',
      desc: 'Auto-patching vulnerabilities and auto-blocking malicious IP addresses at the firewall level without human intervention.',
      icon: <Server className="w-6 h-6 text-brand-cyan" />
    },
    {
      title: 'Advanced Dark Web Monitoring',
      desc: 'Scanning underground forums for leaked company credentials and proprietary data to alert before a breach occurs.',
      icon: <Eye className="w-6 h-6 text-purple-400" />
    },
    {
      title: 'Cloud Security Posture (CSPM)',
      desc: 'Direct integrations with AWS, Azure, and GCP to find misconfigurations in enterprise cloud infrastructure.',
      icon: <Globe className="w-6 h-6 text-blue-400" />
    },
    {
      title: 'Endpoint Mobile Security',
      desc: 'Deploying lightweight security agents on employee smartphones to prevent corporate data leaks (MDM).',
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />
    }
  ];

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden selection:bg-brand-cyan/30">

      {/* Background Animated Elements */}
      <div className="fixed inset-0 z-0 flex justify-center items-center pointer-events-none opacity-40 mix-blend-screen">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-cyan/30 rounded-full blur-[120px] blob-animate"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-purple-600/20 rounded-full blur-[100px] blob-animate animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] blob-animate animation-delay-4000"></div>
      </div>

      {/* Grid Pattern */}
      <div className="fixed inset-0 z-0 bg-grid-white bg-[length:40px_40px] bg-grid-white-fade opacity-10 pointer-events-none"></div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f172a]/80 backdrop-blur-md border-b border-slate-800 transition-all">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-slate-300 hover:text-white cursor-pointer relative z-50"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-cyan to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <Shield className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white hidden sm:block">CyberSentinel<span className="text-brand-cyan">.AI</span></span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#home" className="hover:text-brand-cyan transition-colors cursor-pointer">Home</a>
            <a href="#about" className="hover:text-brand-cyan transition-colors cursor-pointer">About</a>
            <a href="#features" className="hover:text-brand-cyan transition-colors cursor-pointer">Features</a>
            <a href="#roadmap" className="hover:text-brand-cyan transition-colors cursor-pointer">Roadmap</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 rounded-lg bg-brand-cyan text-brand-darker font-semibold text-sm hover:bg-[#00d0dd] transition-all shadow-[0_0_15px_rgba(0,240,255,0.4)] hover:shadow-[0_0_25px_rgba(0,240,255,0.6)] transform hover:-translate-y-0.5 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden absolute top-full left-0 w-full bg-[#0f172a]/95 backdrop-blur-xl border-b border-slate-800 overflow-hidden shadow-2xl"
            >
              <div className="flex flex-col px-8 py-6 space-y-4">
                <a href="#home" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-slate-300 hover:text-brand-cyan font-medium cursor-pointer py-2">Home</a>
                <a href="#about" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-slate-300 hover:text-brand-cyan font-medium cursor-pointer py-2">About</a>
                <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-slate-300 hover:text-brand-cyan font-medium cursor-pointer py-2">Features</a>
                <a href="#roadmap" onClick={() => setMobileMenuOpen(false)} className="block w-full text-left text-slate-300 hover:text-brand-cyan font-medium cursor-pointer py-2">Roadmap</a>
                <div className="h-px bg-slate-800 w-full my-2"></div>
                <button onClick={() => navigate('/login')} className="text-center w-full px-5 py-4 rounded-xl bg-brand-cyan text-brand-darker font-bold text-sm shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer mt-2">Get Started</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <div className="pt-24"></div>

      {/* Home Hero Section */}
      <main id="home" className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-32 flex flex-col items-center text-center min-h-[80vh] justify-center">

        {/* Floating Cyber Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          {[...Array(20)].map((_, i) => {
            const Icon = [Shield, Lock, Server, Activity, Bot, Zap][i % 6];
            return (
              <motion.div
                key={i}
                className="absolute text-slate-400"
                initial={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  scale: Math.random() * 0.5 + 0.5,
                  opacity: Math.random() * 0.3 + 0.1
                }}
                animate={{
                  y: [0, Math.random() * -150 - 50],
                  x: [0, (Math.random() - 0.5) * 100],
                  rotate: [0, Math.random() * 360],
                  opacity: [0.1, Math.random() * 0.2 + 0.2, 0.1]
                }}
                transition={{
                  duration: Math.random() * 15 + 10,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Icon className="w-6 h-6 md:w-8 md:h-8" />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-md"
        >
          <Zap className="w-4 h-4 text-brand-cyan" />
          <span className="text-sm font-medium text-slate-300">Next-Gen Enterprise Security Platform</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-tight max-w-5xl"
        >
          Secure your infrastructure with{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-blue-500">
            Intelligent Automation
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed"
        >
          CyberSentinel AI combines Gemini-powered heuristics with real-time threat monitoring to proactively hunt and mitigate cyber threats before they breach your perimeter.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-4 rounded-xl bg-brand-cyan text-brand-darker font-bold text-lg hover:bg-[#00d0dd] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_35px_rgba(0,240,255,0.6)] flex items-center gap-2 group cursor-pointer"
          >
            Enter Dashboard
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <a
            href="#about"
            className="px-8 py-4 rounded-xl bg-slate-800/80 text-white font-semibold text-lg hover:bg-slate-700 transition-all border border-slate-700 backdrop-blur-md cursor-pointer inline-block"
          >
            Explore Platform
          </a>
        </motion.div>
      </main>

      {/* About Section */}
      <section id="about" className="relative z-10 py-24 bg-slate-900/50 border-t border-slate-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col lg:flex-row items-center gap-16"
          >
            <div className="flex-1 space-y-6">
              <h2 className="text-sm font-bold text-brand-cyan tracking-widest uppercase">About CyberSentinel</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                The AI-Powered Brain of Your Security Operations
              </h3>
              <p className="text-slate-400 text-lg leading-relaxed">
                Traditional security measures are no longer enough to stop modern, sophisticated cyber attacks. CyberSentinel AI acts as an autonomous Security Operations Center (SOC) that never sleeps.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed">
                By integrating Google Gemini's advanced LLM capabilities, our platform doesn't just block threats—it understands them, explains them to your team, and learns from them to prevent future breaches.
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan"><ShieldCheck className="w-4 h-4" /></div>
                  Zero-Day Threat Detection
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan"><ShieldCheck className="w-4 h-4" /></div>
                  Real-time Heuristic Analysis
                </li>
                <li className="flex items-center gap-3 text-slate-300">
                  <div className="w-6 h-6 rounded-full bg-brand-cyan/20 flex items-center justify-center text-brand-cyan"><ShieldCheck className="w-4 h-4" /></div>
                  Automated SOC2 Auditing
                </li>
              </ul>
            </div>
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-cyan to-purple-600 rounded-3xl blur-[60px] opacity-30"></div>
              <img
                src="/images/cyber_about.png"
                alt="AI Cyber Brain"
                className="relative z-10 w-full rounded-3xl border border-slate-700/50 shadow-2xl object-cover transform hover:scale-[1.02] transition-transform duration-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="relative z-10 py-24 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-brand-cyan tracking-widest uppercase mb-2">Core Features</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Complete Security Lifecycle</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">From proactive hunting to automated mitigation, our platform equips your SOC team with enterprise-grade capabilities.</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
            <div className="flex-1 relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-brand-cyan rounded-3xl blur-[60px] opacity-20"></div>
              <img
                src="/images/cyber_features.png"
                alt="Dashboard UI"
                className="relative z-10 w-full rounded-3xl border border-slate-700/50 shadow-2xl object-cover transform hover:-rotate-1 hover:scale-[1.02] transition-all duration-500"
              />
            </div>
            <div className="flex-1 order-1 lg:order-2">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                {features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    variants={fadeIn}
                    className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6 hover:bg-slate-800/80 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,0,0,0.5)] group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-slate-900/80 flex items-center justify-center mb-4 border border-slate-700 group-hover:border-slate-600 transition-colors">
                      {feature.icon}
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap / Future Plans Section */}
      <section id="roadmap" className="relative z-10 py-24 bg-slate-900/80 border-t border-slate-800/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-purple-400 tracking-widest uppercase mb-2">Future Vision</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">Development Roadmap</h3>
            <p className="text-slate-400 max-w-2xl mx-auto">We are continuously evolving. Here are the upcoming breakthrough features planned for CyberSentinel AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>

            {roadmap.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pt-8 h-full flex flex-col"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-800 border-2 border-brand-cyan flex items-center justify-center z-10 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
                  <div className="w-2 h-2 rounded-full bg-brand-cyan"></div>
                </div>
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 text-center mt-6 hover:bg-slate-800 transition-colors flex-1 flex flex-col items-center">
                  <div className="flex justify-center mb-4">{plan.icon}</div>
                  <h4 className="text-lg font-bold text-white mb-3">{plan.title}</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">{plan.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mega Footer */}
      <footer className="relative z-10 pt-20 pb-10 border-t border-slate-800 bg-[#0a0f1e]">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-6">
                <Shield className="text-brand-cyan w-6 h-6" />
                <span className="text-xl font-bold tracking-tight text-white">CyberSentinel<span className="text-brand-cyan">.AI</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Next-generation enterprise security platform powered by Artificial Intelligence. Protecting digital perimeters 24/7.
              </p>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Product</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection('features')} className="hover:text-brand-cyan transition-colors cursor-pointer">Features</button></li>
                <li><button onClick={() => scrollToSection('about')} className="hover:text-brand-cyan transition-colors cursor-pointer">About Us</button></li>
                <li><button onClick={() => scrollToSection('roadmap')} className="hover:text-brand-cyan transition-colors cursor-pointer">Roadmap</button></li>
                <li><a href="#" className="hover:text-brand-cyan transition-colors cursor-pointer">Pricing (Coming Soon)</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Resources</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><span className="hover:text-brand-cyan transition-colors cursor-text">Documentation</span></li>
                <li><span className="hover:text-brand-cyan transition-colors cursor-text">API Reference</span></li>
                <li><span className="hover:text-brand-cyan transition-colors cursor-text">Security Blog</span></li>
                <li><span className="hover:text-brand-cyan transition-colors cursor-text">SOC2 Compliance Report</span></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-bold mb-6">Contact</h4>
              <ul className="space-y-4 text-sm text-slate-400">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-cyan shrink-0" />
                  <span>Pune, Maharashtra, India</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-brand-cyan shrink-0" />
                  <a href="mailto:balajipatil3252@gmail.com" className="hover:text-white transition-colors cursor-pointer">balajipatil3252@gmail.com</a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-cyan shrink-0" />
                  <a href="tel:+917498586267" className="hover:text-white transition-colors cursor-pointer">+91 7498586267</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2">
              <span>CyberSentinel AI © {new Date().getFullYear()}</span>
              <span className="hidden sm:inline">-</span>
              <span>Engineered by <span className="text-white font-medium">Amey Patil</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              <button onClick={() => navigate('/privacy-policy')} className="hover:text-white transition-colors cursor-pointer">Privacy Policy</button>
              <button onClick={() => navigate('/terms-of-service')} className="hover:text-white transition-colors cursor-pointer">Terms of Service</button>
              <button onClick={() => navigate('/cookie-policy')} className="hover:text-white transition-colors cursor-pointer">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Fixed Floating Contact Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <AnimatePresence>
          {showContact && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-16 right-0 mb-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col origin-bottom-right"
            >
              <a
                href="tel:+917498586267"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors border-b border-slate-700/50 text-white"
              >
                <Phone className="w-4 h-4 text-brand-cyan" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">Call Now</span>
                  <span className="text-xs text-slate-400">+91 7498586267</span>
                </div>
              </a>
              <a
                href="https://wa.me/917498586267"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-700 transition-colors text-white"
              >
                <MessageCircle className="w-4 h-4 text-green-400" />
                <div className="flex flex-col">
                  <span className="font-medium text-sm">WhatsApp</span>
                  <span className="text-xs text-slate-400">Message me</span>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowContact(!showContact)}
          className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {showContact ? <ChevronRight className="w-6 h-6 rotate-90" /> : <MessageCircle className="w-7 h-7" />}
        </button>
      </div>

    </div>
  );
}
