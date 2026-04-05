import React from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect, useLayoutEffect } from 'react';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowUpRight, 
  Code, 
  GraduationCap, 
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  Briefcase,
  User,
  Menu,
  X
} from 'lucide-react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Link, 
  useParams, 
  useLocation,
  useNavigate
} from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, EDUCATION, PERSONAL_INFO } from './constants';
import { Project } from './types';
import { FloatingGraphics, Starburst, CDIcon, PixelBox } from './components/Y2KGraphics';

gsap.registerPlugin(ScrollTrigger);

// --- Scroll Management ---

const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // Delay slightly to allow page transition/render
        setTimeout(() => {
          const offset = 0;
          const bodyRect = document.body.getBoundingClientRect().top;
          const elementRect = element.getBoundingClientRect().top;
          const elementPosition = elementRect - bodyRect;
          const offsetPosition = elementPosition - offset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }, 100);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname, hash]);

  return null;
};

// --- Components ---

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string }>({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    if (!formData.name.trim()) return 'Name is required';
    if (!formData.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Invalid email format';
    if (!formData.message.trim()) return 'Message is required';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      setStatus({ type: 'error', message: error });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus({ type: 'success', message: data.message });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus({ type: 'error', message: data.error || 'Something went wrong' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-12">
      <PixelBox className="bg-zinc-900/30 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="name" className="text-meta text-cyan-400">NAME</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-black/50 border border-white/10 p-2.5 rounded-lg focus:border-cyan-400 outline-none transition-colors text-sm"
              placeholder="YOUR NAME"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="email" className="text-meta text-purple-400">EMAIL</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="bg-black/50 border border-white/10 p-2.5 rounded-lg focus:border-purple-400 outline-none transition-colors text-sm"
              placeholder="YOUR@EMAIL.COM"
            />
          </div>
          <div className="flex flex-col gap-1.5 text-left">
            <label htmlFor="message" className="text-meta text-pink-400">MESSAGE</label>
            <textarea
              id="message"
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-black/50 border border-white/10 p-2.5 rounded-lg focus:border-pink-400 outline-none transition-colors resize-none text-sm"
              placeholder="TELL ME ABOUT YOUR PROJECT..."
            />
          </div>
          
          {status.type && (
            <div className={`p-3 rounded-lg text-[10px] font-orbitron tracking-widest ${status.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/50' : 'bg-red-500/20 text-red-400 border border-red-500/50'}`}>
              {status.message.toUpperCase()}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-white text-black font-orbitron font-black tracking-[0.2em] text-xs rounded-xl transition-all duration-300 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
          </button>
        </form>
      </PixelBox>
    </div>
  );
};

const SectionHeader = ({ title, subtitle, number }: { title: string, subtitle: string, number: string }) => (
  <div className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-white/10 pb-12">
    <div className="flex flex-col gap-4">
      <span className="text-meta">{number} / SECTION</span>
      <h2 className="text-display text-5xl md:text-8xl">{title}</h2>
    </div>
    <p className="text-meta max-w-[200px] text-right mt-8 md:mt-0">{subtitle}</p>
  </div>
);

const ProjectCard = ({ project, index }: any) => {
  const p = project as Project;
  const i = index as number;
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      className="group relative overflow-hidden bg-zinc-900/40 border border-white/10 flex flex-col rounded-[2rem] backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-500 min-w-[280px] md:min-w-[350px] snap-start"
    >
      <div className="p-3">
        <div className="aspect-[4/3] relative overflow-hidden rounded-[1.5rem]">
          <img 
            src={p.image} 
            alt={p.title} 
            className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500"></div>
          
          {/* Scanlines on image */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]"></div>
        </div>
      </div>

      <div className="px-6 pb-6 pt-2 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-[10px] font-orbitron text-zinc-500 uppercase tracking-[0.2em]">{p.tags[0]}</span>
          </div>
          <h3 className="text-display text-2xl group-hover:text-cyan-400 transition-colors">{p.title}</h3>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <div className="h-1.5 w-12 bg-white/5 rounded-full" />
            <div className="h-1.5 w-6 bg-white/5 rounded-full" />
          </div>
          <Link 
            to={`/project/${p.id}`}
            className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

// --- Layout & Windmill ---

const navItems = [
  { id: 'home', icon: HomeIcon, label: 'HOME', path: '/', hash: '' },
  { id: 'projects', icon: Briefcase, label: 'WORKS', path: '/', hash: '#projects' },
  { id: 'about', icon: User, label: 'IDENTITY', path: '/', hash: '#about' },
  { id: 'contact', icon: Mail, label: 'CONTACT', path: '/', hash: '#contact' }
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const containerRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const gridY1 = useTransform(smoothProgress, [0, 1], [0, -150]);
  const gridY2 = useTransform(smoothProgress, [0, 1], [0, -300]);
  const gridRotate = useTransform(smoothProgress, [0, 1], [0, 5]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    // Precise scroll detection for active section
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const sections = ['home', 'projects', 'about', 'contact'];
      const viewportCenter = window.scrollY + window.innerHeight / 2;
      
      let currentSection = 'home';
      let minDistance = Infinity;

      sections.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const elementCenter = window.scrollY + rect.top + rect.height / 2;
          const distance = Math.abs(viewportCenter - elementCenter);
          
          if (distance < minDistance) {
            minDistance = distance;
            currentSection = id;
          }
        }
      });

      // Special case for home (if at top)
      if (window.scrollY < 100) {
        currentSection = 'home';
      }
      // Special case for contact (if at bottom)
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        currentSection = 'contact';
      }

      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [activeSection]);

  const cursorX = useSpring(mousePos.x, { stiffness: 500, damping: 50 });
  const cursorY = useSpring(mousePos.y, { stiffness: 500, damping: 50 });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Windmill rotation tied to scroll progress
      gsap.to("#pin-windmill-svg", {
        rotateZ: 3600, // Increased rotation for more "spin"
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom bottom",
          scrub: 0.5,
        }
      });

      // Pinning logic for the windmill
      ScrollTrigger.create({
        trigger: "#pin-windmill",
        start: "center center",
        endTrigger: "body",
        end: "bottom bottom",
        pin: true,
        pinSpacing: false,
      });
    }, containerRef);

    return () => ctx.revert();
  }, [location.pathname]);

  return (
    <div ref={containerRef} className="bg-black text-white selection:bg-cyan-500 selection:text-black relative">
      <div className="noise-overlay"></div>
      <div className="scanlines"></div>

      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div style={{ y: gridY1, rotate: gridRotate }} className="absolute -inset-[20%] grid-lines opacity-[0.15]" />
        <motion.div 
          style={{ 
            y: gridY2, 
            rotate: gridRotate,
            backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '250px 250px'
          }}
          className="absolute -inset-[20%]"
        />
      </div>

      <FloatingGraphics />

      {/* Vertical Sidebar Navigation (Desktop) */}
      <nav className="fixed left-10 top-1/2 -translate-y-1/2 z-[100] hidden md:flex flex-col gap-4">
        {navItems.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <div key={item.id} className="group relative flex items-center">
              <Link 
                to={item.hash ? `${item.path}${item.hash}` : item.path}
                onClick={() => {
                  if (location.pathname === item.path && (!item.hash || location.hash === item.hash)) {
                    const id = item.hash.replace('#', '') || 'home';
                    const element = document.getElementById(id);
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    } else {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }
                }}
                className={`w-12 h-12 backdrop-blur-md border rounded-xl flex items-center justify-center transition-all duration-500 shadow-xl relative ${
                  isActive 
                    ? 'text-black border-transparent' 
                    : 'bg-white/5 border-white/10 text-white hover:bg-cyan-400/20 hover:text-cyan-400 hover:border-cyan-400/50'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="nav-active-bg"
                    className="absolute inset-0 bg-cyan-400 rounded-xl shadow-[0_0_25px_rgba(0,242,255,0.6)] z-0"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-5 h-5 z-10 transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              </Link>
              
              {/* Hover Label */}
              <div className={`absolute left-full ml-4 px-3 py-1 bg-white text-black text-[10px] font-bold tracking-widest rounded transition-all duration-500 whitespace-nowrap pointer-events-none ${
                isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'
              }`}>
                {item.label}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Mobile Vertical Bar Trigger */}
      <div className="fixed left-0 top-0 bottom-0 w-4 z-[110] md:hidden flex items-center">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="h-32 w-full bg-cyan-400/20 backdrop-blur-md border-r border-cyan-400/30 flex items-center justify-center group hover:bg-cyan-400/40 transition-all rounded-r-lg"
        >
          <div className="w-0.5 h-12 bg-cyan-400 group-hover:h-16 transition-all" />
        </button>
      </div>

      {/* Mobile Sidebar Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[120] md:hidden"
            />
            
            {/* Sidebar */}
            <motion.nav 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[45vw] bg-zinc-950/95 backdrop-blur-xl border-r border-white/10 z-[130] md:hidden p-4 flex flex-col"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-2">
                  <div className="text-cyan-400 w-3 h-3"><Starburst /></div>
                  <span className="text-display text-[10px] tracking-widest">NAV</span>
                </div>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {navItems.map((item) => (
                  <Link 
                    key={item.id}
                    to={item.hash ? `${item.path}${item.hash}` : item.path}
                    onClick={() => {
                      setIsMenuOpen(false);
                      if (location.pathname === item.path && (!item.hash || location.hash === item.hash)) {
                        const id = item.hash.replace('#', '') || 'home';
                        const element = document.getElementById(id);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }
                      }
                    }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-all">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-display text-lg tracking-tighter group-hover:text-cyan-400 transition-colors">{item.label}</span>
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-white/10">
                <div className="flex flex-col gap-2">
                  <span className="text-[8px] font-orbitron opacity-50">SOCIALS</span>
                  <div className="flex gap-3">
                    <a href="#" className="text-zinc-500 hover:text-cyan-400"><Github className="w-4 h-4" /></a>
                    <a href="#" className="text-zinc-500 hover:text-cyan-400"><Linkedin className="w-4 h-4" /></a>
                    <a href="#" className="text-zinc-500 hover:text-cyan-400"><Mail className="w-4 h-4" /></a>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Top Header Logo & Menu Toggle */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-6 md:px-12 py-8 flex justify-between items-center pointer-events-none">
        <Link to="/" className="flex items-center gap-3 group pointer-events-auto">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }} 
            className="text-cyan-400 w-5 h-5 group-hover:text-white transition-colors"
          >
            <Starburst />
          </motion.div>
          <span className="text-display text-lg tracking-widest group-hover:text-cyan-400 transition-colors">ORBIT.25</span>
        </Link>
        
        <div className="flex items-center gap-4 pointer-events-auto">
          <a 
            href="mailto:harshitsinhchauhan250@gmail.com"
            className="hidden md:block px-6 py-2 bg-white text-black text-[10px] font-bold tracking-widest rounded-full hover:bg-cyan-400 transition-colors"
          >
            START A PROJECT
          </a>
        </div>
      </header>

      <main>{children}</main>

      <div className="fixed bottom-8 right-8 z-[150] pointer-events-none">
        <div id="pin-windmill" className="w-16 h-16 flex flex-col items-center justify-center gap-2">
          <div id="pin-windmill-svg" className="w-10 h-10 text-cyan-400 drop-shadow-[0_0_10px_rgba(0,242,255,0.5)]">
            <Starburst className="w-full h-full" />
          </div>
          <span className="text-[7px] font-orbitron text-white/30 tracking-widest">ORBIT.PROGRESS</span>
        </div>
      </div>

      <motion.div 
        className="fixed top-0 left-0 w-8 h-8 bg-cyan-400 rounded-full mix-blend-difference pointer-events-none z-[200] hidden md:block"
        style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
      />
    </div>
  );
};

// --- Pages ---

const Home = () => {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, -100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="home" className="min-h-screen flex flex-col justify-center pt-40 pb-24 px-8 md:pl-32 md:pr-12 relative overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] left-[5%] text-cyan-400/10 w-64 h-64 pointer-events-none"
        >
          <Starburst />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.1, 0, 0.2, 0.1] }}
          transition={{ duration: 4, repeat: Infinity, times: [0, 0.1, 0.2, 0.3, 1] }}
          className="absolute top-[20%] right-[10%] text-[15vw] font-black text-white/5 pointer-events-none select-none whitespace-nowrap"
          style={{ writingMode: 'vertical-rl' }}
        >
          {PERSONAL_INFO.name}
        </motion.div>
        
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10">
          <div className="flex flex-col md:flex-row items-baseline gap-4 mb-4 py-4 relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="absolute -top-12 left-0 text-meta text-cyan-400/50 border-l border-cyan-400/30 pl-4 py-1"
            >
              <span className="text-[10px] block opacity-50">IDENTITY_V1.0</span>
              <span className="font-black tracking-[0.2em]">{PERSONAL_INFO.name}</span>
            </motion.div>
            <motion.span 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8 }} 
              className="text-meta block"
            >
              EST. 2024
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.1 }} 
              className="text-display text-[clamp(3rem,12vw,10rem)] leading-[0.85] tracking-tighter"
            >
              CREATIVE
            </motion.h1>
          </div>
          <div className="flex flex-col md:flex-row items-baseline gap-4 md:ml-[5vw] py-4 relative">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, delay: 0.2 }} 
              className="text-display text-[clamp(3rem,12vw,10rem)] leading-[0.85] tracking-tighter text-cyan-400 drop-shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              DEVELOPER
            </motion.h1>
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.5, type: "spring" }} className="absolute -top-4 -right-8 text-pink-500 w-12 h-12 hidden md:block"><Starburst /></motion.div>
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1 }} className="text-meta max-w-[200px] hidden md:block">BASED IN THE DIGITAL VOID, CRAFTING IMMERSIVE EXPERIENCES.</motion.span>
          </div>
        </motion.div>
      </section>

      <section id="projects" className="py-40 border-t border-white/5 relative">
        <div className="px-8 md:px-32 flex justify-between items-end">
          <div className="flex-1">
            <SectionHeader number="01" title="WORKS" subtitle="A SELECTION OF PROJECTS THAT DEFINE MY CRAFT AND VISION." />
          </div>
          <div className="flex gap-4 mb-12 ml-8">
            <button 
              onClick={() => scroll('left')}
              className="w-14 h-14 rounded-xl border-2 border-white/10 bg-zinc-900/50 flex items-center justify-center hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300 group active:scale-95"
            >
              <ChevronLeft className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={() => scroll('right')}
              className="w-14 h-14 rounded-xl border-2 border-white/10 bg-zinc-900/50 flex items-center justify-center hover:bg-cyan-400 hover:text-black hover:border-cyan-400 transition-all duration-300 group active:scale-95"
            >
              <ChevronRight className="w-8 h-8 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
        <div 
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory gap-8 px-8 md:px-32 pb-12 no-scrollbar"
        >
          {PROJECTS.map((project, idx) => <ProjectCard key={project.id} project={project} index={idx} />)}
        </div>
      </section>

      <section id="featured-visual" className="py-24 px-8 md:px-32 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="w-full aspect-[21/9] md:aspect-[16/6] rounded-3xl overflow-hidden relative group"
        >
          <img 
            src="https://picsum.photos/seed/cyber-green-glitch/1920/1080" 
            alt="Cyber Green Glitch Visual" 
            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-1000"></div>
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none"></div>
        </motion.div>
      </section>

      <section id="about" className="py-40 px-8 md:px-32 relative">
        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none -translate-y-1/2"><CDIcon className="w-full h-full" /></div>
        <SectionHeader number="02" title="IDENTITY" subtitle="THE PERSON BEHIND THE PIXELS AND THE CODE." />
        <div className="mb-12">
          <h3 className="text-display text-4xl md:text-6xl text-white/90">{PERSONAL_INFO.name}</h3>
          <div className="w-24 h-1 bg-cyan-400 mt-4"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 relative z-10">
          <div className="lg:col-span-7 flex flex-col gap-12">
            <PixelBox className="bg-zinc-900/50 backdrop-blur-sm"><p className="text-base font-light leading-tight text-zinc-400">{PERSONAL_INFO.bio}</p></PixelBox>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-12 border-t border-white/10">
              <div className="flex flex-col gap-4"><span className="text-meta text-cyan-400">WHEREABOUTS</span><p className="text-base">{PERSONAL_INFO.location}</p></div>
              <div className="flex flex-col gap-4"><span className="text-meta text-purple-400">CURRENT STATUS</span><p className="text-base">{PERSONAL_INFO.status}</p></div>
            </div>
            <div className="flex flex-wrap gap-4">{PERSONAL_INFO.interests.map(interest => <span key={interest} className="text-meta border border-white/10 px-4 py-2 rounded-full hover:bg-white hover:text-black transition-all cursor-default">{interest}</span>)}</div>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-16">
            <div className="flex flex-col gap-8"><span className="text-meta opacity-50">EDUCATION</span><div className="flex flex-col gap-12">{EDUCATION.map((edu) => <div key={edu.id} className="flex flex-col gap-2"><span className="text-meta text-cyan-400">{edu.period}</span><h4 className="text-display text-xl">{edu.institution}</h4><p className="text-zinc-500 text-sm">{edu.degree}</p></div>)}</div></div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-40 px-8 md:px-32 border-t border-white/10">
        <div className="flex flex-col items-center text-center">
          <span className="text-meta mb-8">READY TO START A PROJECT?</span>
          <h2 className="text-display text-[10vw] md:text-[8vw] mb-4">GET IN TOUCH</h2>
          <a href="mailto:harshitsinhchauhan250@gmail.com" className="text-meta hover:text-cyan-400 transition-colors">harshitsinhchauhan250@gmail.com</a>
          
          <ContactForm />

          <div className="grid grid-cols-1 md:grid-cols-3 w-full mt-32 gap-8 text-center md:text-left">
            <div className="flex flex-col gap-2"><span className="text-meta">SOCIALS</span><div className="flex flex-col gap-1"><a href="#" className="text-sm hover:text-cyan-400">GITHUB</a><a href="#" className="text-sm hover:text-cyan-400">INSTAGRAM</a><a href="#" className="text-sm hover:text-cyan-400">LINKEDIN</a><a href="#" className="text-sm hover:text-cyan-400">DISCORD</a></div></div>
            <div className="flex flex-col gap-2"><span className="text-meta">LOCATION</span><span className="text-sm">MUMBAI, MAHARASHTRA, INDIA</span></div>
            <div className="flex flex-col gap-2 items-center md:items-end"><span className="text-meta">BACK TO TOP</span><button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="p-4 border border-white/10 rounded-full hover:bg-white hover:text-black transition-all"><ArrowUpRight className="w-6 h-6" /></button></div>
          </div>
        </div>
      </section>
    </>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);

  if (!project) return <div className="h-screen flex items-center justify-center">Project not found</div>;

  return (
    <div className="pt-40 pb-24 px-8 md:px-32">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-meta hover:text-cyan-400 mb-12">
        <ChevronLeft className="w-4 h-4" /> BACK TO WORKS
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="flex flex-col gap-12">
          <h1 className="text-display text-6xl md:text-8xl">{project.title}</h1>
          <p className="text-xl text-zinc-400 leading-relaxed">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.tags.map(tag => <span key={tag} className="text-xs font-orbitron border border-white/20 px-4 py-1 rounded-full">{tag}</span>)}
          </div>
          <div className="flex flex-col gap-8 pt-12 border-t border-white/10">
            <div>
              <span className="text-meta text-cyan-400 block mb-4">TECHNOLOGIES</span>
              <p className="text-zinc-300">{project.technologies}</p>
            </div>
            <div>
              <span className="text-meta text-purple-400 block mb-4">CHALLENGES</span>
              <p className="text-zinc-300">{project.challenges}</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <PixelBox>
            <img src={project.image} alt={project.title} className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700" />
          </PixelBox>
          <a href={project.link} className="flex items-center justify-center p-8 bg-white text-black text-display text-2xl hover:bg-cyan-400 transition-colors">
            VIEW LIVE PROJECT <ArrowUpRight className="ml-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <ScrollToHash />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}
