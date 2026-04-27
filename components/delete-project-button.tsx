'use client'

import { useRouter } from 'next/navigation'

export default function DeleteProjectButton({ projectId }: { projectId: number }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this project and all its tasks?')) return
    await fetch(`/api/projects/${projectId}`, { method: 'DELETE' })
    router.push('/')
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500 hover:text-red-700 transition-colors"
    >
      Delete project
    </button>
  )
}
