import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET() {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all()
  return Response.json(projects)
}

export async function POST(req: NextRequest) {
  const { name, description } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 })
  const result = db
    .prepare('INSERT INTO projects (name, description) VALUES (?, ?)')
    .run(name.trim(), description?.trim() || null)
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid)
  return Response.json(project, { status: 201 })
}
