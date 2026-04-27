import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const { title, description, status, priority, due_date, project_id, parent_task_id, assignee_id } =
    await req.json()

  if (!title?.trim()) return Response.json({ error: 'Title required' }, { status: 400 })
  if (!project_id) return Response.json({ error: 'project_id required' }, { status: 400 })

  const result = db
    .prepare(
      `INSERT INTO tasks (title, description, status, priority, due_date, project_id, parent_task_id, assignee_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .run(
      title.trim(),
      description?.trim() || null,
      status ?? 'backlog',
      priority ?? 'medium',
      due_date || null,
      project_id,
      parent_task_id ?? null,
      assignee_id ?? null,
    )

  const task = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.id = ?`,
    )
    .get(result.lastInsertRowid)

  return Response.json(task, { status: 201 })
}
