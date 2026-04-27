'use client'

import Link from 'next/link'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import type { TaskWithAssignee } from '@/lib/types'
import { priorityClasses, priorityLabel, formatDate, isOverdue, initials } from '@/lib/utils'

export default function TaskCard({
  task,
  projectId,
}: {
  task: TaskWithAssignee
  projectId: number
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? { transform: CSS.Translate.toString(transform), opacity: isDragging ? 0.5 : 1 }
    : undefined

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <Link
          href={`/projects/${projectId}/task/${task.id}`}
          className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          {task.title}
        </Link>
        <div
          {...listeners}
          className="text-gray-300 hover:text-gray-500 cursor-grab active:cursor-grabbing p-0.5 shrink-0"
          title="Drag to move"
        >
          ⠿
        </div>
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityClasses(task.priority)}`}>
          {priorityLabel(task.priority)}
        </span>

        {task.due_date && (
          <span className={`text-xs ${isOverdue(task.due_date) ? 'text-red-500 font-medium' : 'text-gray-400'}`}>
            {formatDate(task.due_date)}
          </span>
        )}

        {task.assignee_name && (
          <span
            className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-semibold ml-auto"
            title={task.assignee_name}
          >
            {initials(task.assignee_name)}
          </span>
        )}
      </div>
    </div>
  )
}
