"use client";

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const navLinks = [
    { href: '/news', label: 'News' },
    { href: '/events', label: 'Events' },
    { href: '/videos', label: 'Videos' },
    { href: '/easy-reads', label: 'Easy Reads' },
    { href: '/workshops', label: 'Workshops' },
  ];

  return (
    <div className="relative max-w-7xl mx-auto z-50">
      <nav className="glass-nav relative shadow-[0_10px_30px_rgba(0,0,0,0.05),_inset_0_-1px_2px_rgba(255,255,255,0.2)]" aria-label="Main Navigation">
        <div className="px-6 py-4 flex items-center justify-between z-20 relative">
          <Link href="/" className="text-2xl font-black tracking-tighter text-teal-600 hover:text-teal-800 transition-colors focus-visible:outline-teal-500 rounded-md px-2 py-1">
            PossAbilities
          </Link>

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
