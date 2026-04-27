import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET() {
  const members = db.prepare('SELECT * FROM team_members ORDER BY name ASC').all()
  return Response.json(members)
}

export async function POST(req: NextRequest) {
  const { name } = await req.json()
  if (!name?.trim()) return Response.json({ error: 'Name required' }, { status: 400 })
  const result = db.prepare('INSERT INTO team_members (name) VALUES (?)').run(name.trim())
  const member = db.prepare('SELECT * FROM team_members WHERE id = ?').get(result.lastInsertRowid)
  return Response.json(member, { status: 201 })
}
