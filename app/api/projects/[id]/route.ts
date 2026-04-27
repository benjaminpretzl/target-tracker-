import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] })
  if (!result.rows[0]) return Response.json({ error: 'Not found' }, { status: 404 })
  return Response.json(result.rows[0])
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { name, description } = await req.json()
  await db.execute({
    sql: 'UPDATE projects SET name = COALESCE(?, name), description = COALESCE(?, description) WHERE id = ?',
    args: [name?.trim() || null, description?.trim() ?? null, id],
  })
  const result = await db.execute({ sql: 'SELECT * FROM projects WHERE id = ?', args: [id] })
  return Response.json(result.rows[0])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.execute({ sql: 'DELETE FROM projects WHERE id = ?', args: [id] })
  return new Response(null, { status: 204 })
}
