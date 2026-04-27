'use client'

import { useDroppable } from '@dnd-kit/core'
import type { Status, TaskWithAssignee } from '@/lib/types'
import TaskCard from './task-card'

const COLUMN_LABELS: Record<Status, string> = {
  backlog: 'Backlog',
  in_progress: 'In Progress',
  done: 'Done',
}

const COLUMN_COLORS: Record<Status, string> = {
  backlog: 'bg-gray-100 text-gray-600',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
}

export default function Column({
  status,
  tasks,
  projectId,
  onAddTask,
}: {
  status: Status
  tasks: TaskWithAssignee[]
  projectId: number
  onAddTask: (status: Status) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex flex-col w-72 shrink-0">
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${COLUMN_COLORS[status]}`}>
          {COLUMN_LABELS[status]}
        </span>
        <span className="text-xs text-gray-400 font-medium">{tasks.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`flex flex-col gap-2 min-h-32 p-2 rounded-xl transition-colors ${
          isOver ? 'bg-blue-50 ring-2 ring-blue-200' : 'bg-gray-100'
        }`}
      >
        {tasks.map((t) => (
          <TaskCard key={t.id} task={t} projectId={projectId} />
        ))}
      </div>

      <button
        onClick={() => onAddTask(status)}
        className="mt-2 text-sm text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg px-2 py-1.5 text-left transition-colors"
      >
        + Add task
      </button>
    </div>
  )
}
