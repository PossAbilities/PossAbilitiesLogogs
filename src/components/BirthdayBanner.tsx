"use client";

import { useUser } from "./UserProvider";
import { GlassCard } from "./GlassCard";
import { useState, useSyncExternalStore, useCallback } from "react";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function BirthdayBanner() {
  const { user } = useUser();

  const subscribe = useCallback(() => () => {}, []);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  const isDismissed = useSyncExternalStore(
    subscribe,
    () => {
      if (user) {
        const today = new Date().toISOString().split('T')[0];
        return !!localStorage.getItem(`birthdayDismissed_${user.id}_${today}`);
      }
      return false;
    },
    () => false
  );

  const [localDismissed, setLocalDismissed] = useState(false);
  const finalDismissed = isDismissed || localDismissed;

  const handleDismiss = () => {
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`birthdayDismissed_${user.id}_${today}`, 'true');
      setLocalDismissed(true);
    }
  };

  if (!mounted || !user || !user.dateOfBirth) return null;

  const today = new Date();
  const dob = new Date(user.dateOfBirth);

  const isBirthday =
    today.getDate() === dob.getDate() &&
    today.getMonth() === dob.getMonth();

  if (!isBirthday) return null;

  return (
    <AnimatePresence>
      {!finalDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, height: 0, marginBottom: 0, overflow: 'hidden' }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <GlassCard className="bg-gradient-to-r from-pink-400/80 to-purple-500/80 text-white text-center py-8 mb-8 border-none shadow-xl transform hover:scale-[1.02] transition-transform duration-300 relative">
            <button
              onClick={handleDismiss}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Dismiss birthday banner"
            >
              <X size={24} className="text-white" />
            </button>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2" aria-live="polite">
              🎉 Happy Birthday, {user.name}! 🎂
            </h1>
            <p className="text-xl md:text-2xl font-semibold opacity-90">
              We hope you have an amazing day!
            </p>
          </GlassCard>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
