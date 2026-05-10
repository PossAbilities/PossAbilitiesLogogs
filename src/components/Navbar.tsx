"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Mic, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Web Speech API
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    SpeechRecognition: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    webkitSpeechRecognition: any;
  }
}

export default function Navbar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  // Voice Search States
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<{message: string, type: 'success' | 'error' | 'info'} | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/news', label: 'News' },
    { href: '/events', label: 'Events' },
    { href: '/videos', label: 'Videos' },
    { href: '/easy-reads', label: 'Easy Reads' },
    { href: '/workshops', label: 'Workshops' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const clearFeedback = () => {
      setTimeout(() => setVoiceFeedback(null), 4000);
    };

    const handleVoiceCommand = (command: string) => {
      let matched = false;
      if (command.includes('news')) {
        router.push('/news');
        setVoiceFeedback({ message: "Navigating to News", type: 'success' });
        matched = true;
      } else if (command.includes('video')) {
        router.push('/videos');
        setVoiceFeedback({ message: "Navigating to Videos", type: 'success' });
        matched = true;
      } else if (command.includes('read') || command.includes('easy')) {
        router.push('/easy-reads');
        setVoiceFeedback({ message: "Navigating to Easy Reads", type: 'success' });
        matched = true;
      } else if (command.includes('event')) {
        router.push('/events');
        setVoiceFeedback({ message: "Navigating to Events", type: 'success' });
        matched = true;
      } else if (command.includes('help')) {
        setVoiceFeedback({ message: "For help, please check the links at the bottom of the page.", type: 'info' });
        matched = true;
      } else if (command.includes('workshop')) {
        router.push('/workshops');
        setVoiceFeedback({ message: "Navigating to Workshops", type: 'success' });
        matched = true;
      }

      if (!matched) {
        setVoiceFeedback({ message: `Heard: "${command}". I don't know that command.`, type: 'error' });
      }

      clearFeedback();
    };

    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setVoiceFeedback({ message: "Listening... say 'news', 'video', 'read', or 'events'", type: 'info' });
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase();
          handleVoiceCommand(transcript);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error);
          setIsListening(false);
          if (event.error !== 'no-speech') {
            setVoiceFeedback({ message: "Sorry, I didn't catch that. Please try again.", type: 'error' });
            clearFeedback();
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
  }, [router]);

  const toggleVoiceSearch = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
        setVoiceFeedback(null);
      } else {
        try {
          recognitionRef.current.start();
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setVoiceFeedback({ message: "Voice search is not supported in this browser.", type: 'error' });
      setTimeout(() => setVoiceFeedback(null), 4000);
    }
  };

  return (
    <div className="relative max-w-7xl mx-auto z-50">
      {/* Active Listening Overlay & Feedback Toast */}
      <AnimatePresence>
        {voiceFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 left-1/2 -translate-x-1/2 z-[100] px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3
              ${voiceFeedback.type === 'success' ? 'bg-green-100/90 border-green-200 text-green-800' : ''}
              ${voiceFeedback.type === 'error' ? 'bg-red-100/90 border-red-200 text-red-800' : ''}
              ${voiceFeedback.type === 'info' ? 'bg-blue-100/90 border-blue-200 text-blue-800' : ''}
            `}
          >
            {voiceFeedback.type === 'success' && <CheckCircle size={24} className="text-green-600" />}
            {voiceFeedback.type === 'error' && <AlertCircle size={24} className="text-red-600" />}
            {voiceFeedback.type === 'info' && (
              isListening ? (
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <Mic size={20} className="relative text-blue-600" />
                </div>
              ) : (
                <Info size={24} className="text-blue-600" />
              )
            )}
            <span className="text-lg font-bold">{voiceFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="glass-nav relative shadow-[0_10px_30px_rgba(0,0,0,0.05),_inset_0_-1px_2px_rgba(255,255,255,0.2)]" aria-label="Main Navigation">
        <div className="px-6 py-4 flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-2xl font-black tracking-tighter text-teal-600 hover:text-teal-800 transition-colors focus-visible:outline-teal-500 rounded-md px-2 py-1">
              PossAbilities
            </Link>

            {/* Voice Search Trigger */}
            <button
              onClick={toggleVoiceSearch}
              className={`relative p-3 rounded-full transition-all duration-300 shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 group
                ${isListening
                  ? 'bg-teal-500 text-white shadow-[0_0_20px_rgba(20,184,166,0.6)]'
                  : 'bg-white/50 text-slate-700 hover:bg-white/80 hover:text-teal-600 border border-white/40'
                }
              `}
              aria-label={isListening ? "Stop listening" : "Start voice search"}
              aria-pressed={isListening}
            >
              {isListening && (
                <span className="absolute inset-0 rounded-full animate-ping bg-teal-400 opacity-40"></span>
              )}
              <Mic size={22} className={isListening ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'} />
            </button>
          </div>

          {/* Desktop Menu */}
          <ul className="hidden md:flex flex-wrap items-center gap-2 lg:gap-6 text-lg font-bold">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-slate-800 hover:text-teal-600 transition-colors focus-visible:outline-teal-500 rounded-full px-4 py-2 hover:bg-white/20">
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/admin" className="text-purple-600 hover:text-purple-800 transition-colors focus-visible:outline-purple-500 rounded-full px-4 py-2 hover:bg-purple-100/20">
                Admin
              </Link>
            </li>
          </ul>

          {/* Mobile Hamburger Toggle */}
          <button
            className="md:hidden p-2 text-slate-800 rounded-full hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 transition-colors"
            onClick={toggleMenu}
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown - Placed outside glass-nav to avoid WebKit backdrop-filter & border-radius glitches */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-0 left-0 right-0 pt-20 pb-6 bg-white/90 backdrop-blur-2xl shadow-2xl rounded-b-2xl z-10 border-b border-white/20"
          >
            <div className="flex flex-col px-8">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="py-4 border-b border-slate-200/50 flex justify-end"
                >
                  <Link
                    href={link.href}
                    className="text-2xl font-bold text-[#142A4A] hover:text-teal-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2, delay: navLinks.length * 0.05 }}
                className="py-4 flex justify-end"
              >
                <Link
                  href="/admin"
                  className="text-2xl font-bold text-purple-600 hover:text-purple-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
