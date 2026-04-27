'use client'

import { useState } from 'react'
import { DndContext, DragEndEvent, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import type { Status, TaskWithAssignee, TeamMember } from '@/lib/types'
import Column from './column'
import CreateTaskDialog from './create-task-dialog'

const STATUSES: Status[] = ['backlog', 'in_progress', 'done']

export default function Board({
  initialTasks,
  projectId,
  members,
}: {
  initialTasks: TaskWithAssignee[]
  projectId: number
  members: TeamMember[]
}) {
  const [tasks, setTasks] = useState<TaskWithAssignee[]>(initialTasks)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogStatus, setDialogStatus] = useState<Status>('backlog')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function openAddTask(status: Status) {
    setDialogStatus(status)
    setDialogOpen(true)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over) return
    const newStatus = over.id as Status
    const task = tasks.find((t) => t.id === active.id)
    if (!task || task.status === newStatus) return

    setTasks((prev) => prev.map((t) => (t.id === active.id ? { ...t, status: newStatus } : t)))
    await fetch(`/api/tasks/${active.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
  }

  function handleTaskCreated(task: unknown) {
    setTasks((prev) => [...prev, task as TaskWithAssignee])
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {STATUSES.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={tasks.filter((t) => t.status === status && t.parent_task_id === null)}
              projectId={projectId}
              onAddTask={openAddTask}
            />
          ))}
        </div>
      </DndContext>

      <CreateTaskDialog
        open={dialogOpen}
        initialStatus={dialogStatus}
        projectId={projectId}
        members={members}
        onClose={() => setDialogOpen(false)}
        onCreated={handleTaskCreated}
      />
    </>
  )
}
