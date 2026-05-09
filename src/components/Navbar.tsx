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
    <nav className="glass-nav relative max-w-7xl mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.05),_inset_0_-1px_2px_rgba(255,255,255,0.2)]" aria-label="Main Navigation">
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

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white/40 backdrop-blur-3xl border border-white/40 shadow-2xl rounded-2xl overflow-hidden z-50"
          >
            <ul className="flex flex-col p-4 divide-y divide-white/20">
              {navLinks.map((link, index) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  className="py-3"
                >
                  <Link
                    href={link.href}
                    className="block text-xl font-bold text-slate-800 hover:text-teal-600 transition-colors px-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, delay: navLinks.length * 0.05 }}
                className="py-3"
              >
                <Link
                  href="/admin"
                  className="block text-xl font-bold text-purple-600 hover:text-purple-800 transition-colors px-2"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </motion.li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
