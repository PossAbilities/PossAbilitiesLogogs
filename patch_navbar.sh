#!/bin/bash
sed -i 's|<Link href="/" className="text-2xl font-black tracking-tighter text-teal-600 hover:text-teal-800 transition-colors focus-visible:outline-teal-500 rounded-md px-2 py-1">|<Link href="/" className="flex items-center gap-2 px-2 py-1">\n              <img src="/logo-v3.png" alt="PossAbilities Logo" className="h-8 w-auto object-contain" />|g' /app/src/components/Navbar.tsx

sed -i 's|PossAbilities|{/* PossAbilities */}|g' /app/src/components/Navbar.tsx
