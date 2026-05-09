"use client";

import { useUser } from "./UserProvider";
import { GlassCard } from "./GlassCard";

export function BirthdayBanner() {
  const { user } = useUser();

  if (!user || !user.dateOfBirth) return null;

  const today = new Date();
  const dob = new Date(user.dateOfBirth);

  const isBirthday =
    today.getDate() === dob.getDate() &&
    today.getMonth() === dob.getMonth();

  if (!isBirthday) return null;

  return (
    <GlassCard className="bg-gradient-to-r from-pink-400/80 to-purple-500/80 text-white text-center py-8 mb-8 border-none shadow-xl transform hover:scale-[1.02] transition-transform duration-300">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-2" aria-live="polite">
        🎉 Happy Birthday, {user.name}! 🎂
      </h1>
      <p className="text-xl md:text-2xl font-semibold opacity-90">
        We hope you have an amazing day!
      </p>
    </GlassCard>
  );
}
