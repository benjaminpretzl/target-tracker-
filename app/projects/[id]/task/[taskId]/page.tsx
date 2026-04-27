import { db } from '@/db/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Project, TaskWithAssignee, TeamMember } from '@/lib/types'
import TaskForm from '@/components/task/task-form'
import SubtaskList from '@/components/task/subtask-list'
import DeleteTaskButton from '@/components/task/delete-task-button'

export const dynamic = 'force-dynamic'

export default async function TaskPage({
  params,
}: {
  params: Promise<{ id: string; taskId: string }>
}) {
  const { id, taskId } = await params

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined
  if (!project) notFound()

  const task = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.id = ? AND t.project_id = ?`,
    )
    .get(taskId, id) as TaskWithAssignee | undefined
  if (!task) notFound()

  const subtasks = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.parent_task_id = ? ORDER BY t.created_at ASC`,
    )
    .all(taskId) as TaskWithAssignee[]

  const members = db.prepare('SELECT * FROM team_members ORDER BY name ASC').all() as TeamMember[]

  const parentTask = task.parent_task_id
    ? (db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.parent_task_id) as TaskWithAssignee | undefined)
    : null

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-gray-900 transition-colors">Projects</Link>
        <span>/</span>
        <Link href={`/projects/${id}`} className="hover:text-gray-900 transition-colors">{project.name}</Link>
        {parentTask && (
          <>
            <span>/</span>
            <Link
              href={`/projects/${id}/task/${parentTask.id}`}
              className="hover:text-gray-900 transition-colors"
            >
              {parentTask.title}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-gray-900 font-medium">{task.title}</span>
      </div>

      <div className="flex items-start justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{task.title}</h1>
        <DeleteTaskButton taskId={task.id} projectId={project.id} />
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
        <TaskForm task={task} members={members} />
      </div>

      {task.parent_task_id === null && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <SubtaskList
            subtasks={subtasks}
            parentTaskId={task.id}
            projectId={project.id}
            members={members}
          />
        </div>
      )}
    </div>
  )
}
