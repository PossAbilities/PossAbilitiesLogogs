import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass-nav px-8 py-4 flex items-center justify-between max-w-7xl mx-auto shadow-[0_10px_30px_rgba(0,0,0,0.05),_inset_0_-1px_2px_rgba(255,255,255,0.2)]" aria-label="Main Navigation">
      <Link href="/" className="text-2xl font-black tracking-tighter text-teal-600 hover:text-teal-800 transition-colors focus-visible:outline-teal-500 rounded-md px-2 py-1">
        PossAbilities
      </Link>
      <ul className="flex flex-wrap items-center gap-2 md:gap-6 text-lg font-bold">
        <li><Link href="/news" className="hover:text-teal-600 transition-colors focus-visible:outline-teal-500 rounded-full px-4 py-2 hover:bg-white/20">News</Link></li>
        <li><Link href="/events" className="hover:text-teal-600 transition-colors focus-visible:outline-teal-500 rounded-full px-4 py-2 hover:bg-white/20">Events</Link></li>
        <li><Link href="/videos" className="hover:text-teal-600 transition-colors focus-visible:outline-teal-500 rounded-full px-4 py-2 hover:bg-white/20">Videos</Link></li>
        <li><Link href="/easy-reads" className="hover:text-teal-600 transition-colors focus-visible:outline-teal-500 rounded-full px-4 py-2 hover:bg-white/20">Easy Reads</Link></li>
        <li><Link href="/workshops" className="hover:text-teal-600 transition-colors focus-visible:outline-teal-500 rounded-full px-4 py-2 hover:bg-white/20">Workshops</Link></li>
        <li><Link href="/admin" className="text-purple-600 hover:text-purple-800 transition-colors focus-visible:outline-purple-500 rounded-full px-4 py-2 hover:bg-purple-100/20">Admin</Link></li>
      </ul>
    </nav>
  );
}
