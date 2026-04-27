import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  db.prepare('DELETE FROM team_members WHERE id = ?').run(id)
  return new Response(null, { status: 204 })
}
