'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { TaskWithAssignee, TeamMember } from '@/lib/types'
import { priorityClasses, priorityLabel, initials } from '@/lib/utils'

export default function SubtaskList({
  subtasks,
  parentTaskId,
  projectId,
  members,
}: {
  subtasks: TaskWithAssignee[]
  parentTaskId: number
  projectId: number
  members: TeamMember[]
}) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [title, setTitle] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        project_id: projectId,
        parent_task_id: parentTaskId,
        assignee_id: assigneeId ? parseInt(assigneeId) : null,
      }),
    })
    setLoading(false)
    setTitle('')
    setAssigneeId('')
    setAdding(false)
    router.refresh()
  }

  async function deleteSubtask(id: number) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-700 mb-3">Sub-tasks</h2>

      {subtasks.length > 0 && (
        <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg bg-white mb-3">
          {subtasks.map((st) => (
            <li key={st.id} className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span
                  className={`inline-block w-2 h-2 rounded-full shrink-0 ${
                    st.status === 'done' ? 'bg-green-400' :
                    st.status === 'in_progress' ? 'bg-blue-400' : 'bg-gray-300'
                  }`}
                />
                <Link
                  href={`/projects/${projectId}/task/${st.id}`}
                  className="text-sm text-gray-900 hover:text-blue-600 transition-colors truncate"
                >
                  {st.title}
                </Link>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium shrink-0 ${priorityClasses(st.priority)}`}>
                  {priorityLabel(st.priority)}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {st.assignee_name && (
                  <span
                    className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold"
                    title={st.assignee_name}
                  >
                    {initials(st.assignee_name)}
                  </span>
                )}
                <button
                  onClick={() => deleteSubtask(st.id)}
                  className="text-xs text-red-400 hover:text-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {adding ? (
        <form onSubmit={handleAdd} className="flex gap-2 items-end">
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sub-task title"
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          {members.length > 0 && (
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Unassigned</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>
          )}
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setAdding(false); setTitle('') }}
            className="text-sm text-gray-500 hover:text-gray-800 px-2 py-2 transition-colors"
          >
            Cancel
          </button>
        </form>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          + Add sub-task
        </button>
      )}
    </div>
  )
}
