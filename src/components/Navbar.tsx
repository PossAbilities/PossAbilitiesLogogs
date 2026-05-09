import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="glass-nav px-6 py-4 flex items-center justify-between" aria-label="Main Navigation">
      <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-800 transition-colors focus-visible:outline-blue-500 rounded-md px-2 py-1">
        PossAbilities
      </Link>
      <ul className="flex items-center gap-6 text-lg font-semibold">
        <li><Link href="/news" className="hover:text-blue-600 transition-colors focus-visible:outline-blue-500 rounded-md px-2 py-1">News</Link></li>
        <li><Link href="/events" className="hover:text-blue-600 transition-colors focus-visible:outline-blue-500 rounded-md px-2 py-1">Events</Link></li>
        <li><Link href="/videos" className="hover:text-blue-600 transition-colors focus-visible:outline-blue-500 rounded-md px-2 py-1">Videos</Link></li>
        <li><Link href="/easy-reads" className="hover:text-blue-600 transition-colors focus-visible:outline-blue-500 rounded-md px-2 py-1">Easy Reads</Link></li>
        <li><Link href="/workshops" className="hover:text-blue-600 transition-colors focus-visible:outline-blue-500 rounded-md px-2 py-1">Workshops</Link></li>
        <li><Link href="/admin" className="text-purple-600 hover:text-purple-800 transition-colors focus-visible:outline-purple-500 rounded-md px-2 py-1">Admin</Link></li>
      </ul>
    </nav>
  );
}
