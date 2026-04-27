import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const task = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.id = ?`,
    )
    .get(id)
  if (!task) return Response.json({ error: 'Not found' }, { status: 404 })

  const subtasks = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.parent_task_id = ? ORDER BY t.created_at ASC`,
    )
    .all(id)

  return Response.json({ ...task as object, subtasks })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'assignee_id'] as const
  const updates: string[] = []
  const values: unknown[] = []

  for (const key of allowed) {
    if (key in body) {
      updates.push(`${key} = ?`)
      values.push(body[key] ?? null)
    }
  }

  if (updates.length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })

  updates.push("updated_at = datetime('now')")
  values.push(id)

  db.prepare(`UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`).run(...values)

  const task = db
    .prepare(
      `SELECT t.*, m.name AS assignee_name
       FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
       WHERE t.id = ?`,
    )
    .get(id)

  return Response.json(task)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  db.prepare('DELETE FROM tasks WHERE id = ?').run(id)
  return new Response(null, { status: 204 })
}
