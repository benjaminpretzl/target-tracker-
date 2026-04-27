'use client'

import { useRouter } from 'next/navigation'

export default function DeleteTaskButton({ taskId, projectId }: { taskId: number; projectId: number }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Delete this task?')) return
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' })
    router.push(`/projects/${projectId}`)
  }

  return (
    <button
      onClick={handleDelete}
      className="text-sm text-red-500 hover:text-red-700 transition-colors shrink-0"
    >
      Delete task
    </button>
  )
}
