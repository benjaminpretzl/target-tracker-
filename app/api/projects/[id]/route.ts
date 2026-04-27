import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
  if (!project) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(project)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, description } = await req.json()
  db.prepare('UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?').run(
    name?.trim() || null,
    description?.trim() ?? undefined,
    id,
  )
  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id)
  return Response.json(project)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  db.prepare('DELETE FROM projects WHERE id = ?').run(id)
  return new Response(null, { status: 204 })
}
