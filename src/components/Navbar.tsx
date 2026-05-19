"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Menu, X, Mic, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types for Web Speech API

interface SpeechRecognitionEvent {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: { new (): SpeechRecognition } | undefined;
    webkitSpeechRecognition: { new (): SpeechRecognition } | undefined;
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

  const recognitionRef = useRef<SpeechRecognition | null>(null);

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
      } else if (command.includes('event')) {
        router.push('/events');
        setVoiceFeedback({ message: "Navigating to Events", type: 'success' });
        matched = true;
      } else if (command.includes('video')) {
        router.push('/videos');
        setVoiceFeedback({ message: "Navigating to Videos", type: 'success' });
        matched = true;
      } else if (command.includes('easy read') || command.includes('read')) {
        router.push('/easy-reads');
        setVoiceFeedback({ message: "Navigating to Easy Reads", type: 'success' });
        matched = true;
      } else if (command.includes('workshop')) {
        router.push('/workshops');
        setVoiceFeedback({ message: "Navigating to Workshops", type: 'success' });
        matched = true;
      } else if (command.includes('home')) {
        router.push('/');
        setVoiceFeedback({ message: "Navigating to Home", type: 'success' });
        matched = true;
      } else {
        setVoiceFeedback({ message: `I heard "${command}", but I didn't understand. Try saying "News", "Events", or "Videos".`, type: 'error' });
      }

      if (matched) clearFeedback();
      else setTimeout(() => setVoiceFeedback(null), 6000);
    };

    if (typeof window !== 'undefined' && ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) return;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setVoiceFeedback({ message: "Listening... Say a page name like 'News' or 'Events'", type: 'info' });
      };

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(transcript);
      };

      recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        if (event.error !== 'no-speech') {
            setVoiceFeedback({ message: `Error listening. Please try clicking the button again. (${event.error})`, type: 'error' });
            setTimeout(() => setVoiceFeedback(null), 4000);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Only clear info messages on end, let success/error messages persist a bit longer
        setVoiceFeedback((prev) => prev?.type === 'info' ? null : prev);
      };
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }

    return () => {
        if(recognitionRef.current) {
            recognitionRef.current.abort();
        }
    }
  }, [router]);

  const toggleVoiceSearch = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      if (recognitionRef.current) {
          recognitionRef.current.start();
      } else {
          setVoiceFeedback({ message: "Voice search is not supported in your browser.", type: 'error' });
          setTimeout(() => setVoiceFeedback(null), 4000);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-3 md:px-6 mt-4">

      {/* Voice Feedback Toast */}
      <AnimatePresence>
        {voiceFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className={`fixed top-24 left-1/2 z-50 px-6 py-4 rounded-2xl shadow-xl flex items-center gap-3 border backdrop-blur-md
              ${voiceFeedback.type === 'success' ? 'bg-teal-50/95 border-teal-200 text-teal-800' :
                voiceFeedback.type === 'error' ? 'bg-red-50/95 border-red-200 text-red-800' :
                'bg-blue-50/95 border-blue-200 text-blue-800'}`}
          >
            {voiceFeedback.type === 'success' && <CheckCircle className="text-teal-500 w-6 h-6" />}
            {voiceFeedback.type === 'error' && <AlertCircle className="text-red-500 w-6 h-6" />}
            {voiceFeedback.type === 'info' && (
              <div className="relative flex h-6 w-6">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-6 w-6 bg-blue-500 items-center justify-center">
                    <Info className="text-white w-4 h-4" />
                </span>
              </div>
            )}
            <span className="text-lg font-bold">{voiceFeedback.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <nav className="glass-nav relative shadow-[0_10px_30px_rgba(0,0,0,0.05),_inset_0_-1px_2px_rgba(255,255,255,0.2)]" aria-label="Main Navigation">
        <div className="px-6 py-4 flex items-center justify-between z-20 relative">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 px-2 py-1 rounded-md focus-visible:outline-teal-500">
              <img src="/logo-v3.png" alt="PossAbilities Logo" className="h-6 w-auto object-contain" />
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="nav-link px-4 py-2 text-lg font-medium text-slate-700 rounded-xl transition-all duration-200 hover:text-teal-700 hover:bg-white/60 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 hover:scale-105 hover:shadow-sm"
              >
                {link.label}
              </Link>
            ))}

            <Link
              href="/admin"
              className="ml-4 px-5 py-2.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-1 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400"
            >
              Admin
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-3 text-slate-700 bg-white/50 border border-white/40 rounded-xl hover:bg-white/80 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-400 transition-colors shadow-sm"
              aria-expanded={isOpen}
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-white/80 backdrop-blur-xl border-t border-white/40 rounded-b-3xl relative z-10 shadow-inner"
            >
              <div className="px-4 py-6 space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 text-xl font-bold text-slate-700 rounded-2xl hover:bg-teal-50 hover:text-teal-700 transition-colors active:bg-teal-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="pt-4 mt-2 border-t border-slate-200/50">
                   <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block px-6 py-4 text-xl font-bold text-center text-white bg-gradient-to-r from-teal-500 to-emerald-500 rounded-2xl shadow-md active:scale-95 transition-transform"
                  >
                    Admin Area
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
