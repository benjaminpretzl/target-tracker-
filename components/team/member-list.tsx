'use client'

import { useRouter } from 'next/navigation'
import type { TeamMember } from '@/lib/types'
import { initials } from '@/lib/utils'

export default function MemberList({ members }: { members: TeamMember[] }) {
  const router = useRouter()

  async function remove(id: number) {
    await fetch(`/api/members/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  if (members.length === 0) {
    return <p className="text-gray-400 text-sm py-8 text-center">No team members yet.</p>
  }

  return (
    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white">
      {members.map((m) => (
        <li key={m.id} className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold">
              {initials(m.name)}
            </span>
            <span className="text-sm font-medium text-gray-900">{m.name}</span>
          </div>
          <button
            onClick={() => remove(m.id)}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  )
}
