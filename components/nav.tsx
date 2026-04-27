import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="border-b border-gray-200 bg-white px-6 py-3 flex items-center gap-6">
      <Link href="/" className="font-semibold text-gray-900 tracking-tight">
        Tracker
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
          Projects
        </Link>
        <Link href="/team" className="text-gray-600 hover:text-gray-900 transition-colors">
          Team
        </Link>
      </div>
    </nav>
  )
}
