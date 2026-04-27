import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET() {
  const result = await db.execute('SELECT * FROM team_members ORDER BY name ASC')
  return Response.json(result.rows)
}

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 })
  const result = await db.execute({
    sql: 'INSERT INTO team_members (name) VALUES (?)',
    args: [name.trim()],
  })
  const row = await db.execute({
    sql: 'SELECT * FROM team_members WHERE id = ?',
    args: [result.lastInsertRowid!],
  })
  return Response.json(row.rows[0], { status: 201 })
}
