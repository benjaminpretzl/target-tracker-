import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET() {
  const result = await db.execute('SELECT * FROM projects ORDER BY created_at DESC')
  return Response.json(result.rows)
}

export async function POST(req: NextRequest) {
  const { name, description } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 })
  const result = await db.execute({
    sql: 'INSERT INTO projects (name, description) VALUES (?, ?)',
    args: [name.trim(), description?.trim() || null],
  })
  const row = await db.execute({
    sql: 'SELECT * FROM projects WHERE id = ?',
    args: [result.lastInsertRowid!],
  })
  return Response.json(row.rows[0], { status: 201 })
}
