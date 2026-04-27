import { db } from '@/db/db'
import { InValue } from '@libsql/client'
import { NextRequest } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const taskResult = await db.execute({
    sql: `SELECT t.*, m.name AS assignee_name
          FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
          WHERE t.id = ?`,
    args: [id],
  })
  if (!taskResult.rows[0]) return Response.json({ error: 'Not found' }, { status: 404 })

  const subtasksResult = await db.execute({
    sql: `SELECT t.*, m.name AS assignee_name
          FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
          WHERE t.parent_task_id = ? ORDER BY t.created_at ASC`,
    args: [id],
  })

  return Response.json({ ...taskResult.rows[0], subtasks: subtasksResult.rows })
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()

  const allowed = ['title', 'description', 'status', 'priority', 'due_date', 'assignee_id'] as const
  const setClauses: string[] = []
  const args: InValue[] = []

  for (const key of allowed) {
    if (key in body) {
      setClauses.push(`${key} = ?`)
      args.push((body[key] ?? null) as InValue)
    }
  }

  if (setClauses.length === 0) return Response.json({ error: 'Nothing to update' }, { status: 400 })

  setClauses.push("updated_at = datetime('now')")
  args.push(id)

  await db.execute({ sql: `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = ?`, args })

  const result = await db.execute({
    sql: `SELECT t.*, m.name AS assignee_name
          FROM tasks t LEFT JOIN team_members m ON t.assignee_id = m.id
          WHERE t.id = ?`,
    args: [id],
  })

  return Response.json(result.rows[0])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.execute({ sql: 'DELETE FROM tasks WHERE id = ?', args: [id] })
  return new Response(null, { status: 204 })
}
