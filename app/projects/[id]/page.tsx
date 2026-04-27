import { db } from '@/db/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Project, TaskWithAssignee, TeamMember } from '@/lib/types'
import Board from '@/components/kanban/board'
import DeleteProjectButton from '@/components/delete-project-button'

export const dynamic = 'force-dynamic'

export default async function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id) as Project | undefined
  if (!project) notFound()

  const tasks = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.project_id = ? ORDER BY t.created_at ASC`,
    )
    .all(id) as TaskWithAssignee[]

  const members = db.prepare('SELECT * FROM team_members ORDER BY name ASC').all() as TeamMember[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-gray-900 transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">{project.name}</span>
        </div>
        <DeleteProjectButton projectId={project.id} />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-1">{project.name}</h1>
      {project.description && (
        <p className="text-gray-500 text-sm mb-6">{project.description}</p>
      )}

      <Board initialTasks={tasks} projectId={project.id} members={members} />
    </div>
  )
}
