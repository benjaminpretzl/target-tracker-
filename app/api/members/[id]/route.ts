import { db } from '@/db/db'
import { NextRequest } from 'next/server'

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await db.execute({ sql: 'DELETE FROM team_members WHERE id = ?', args: [id] })
  return new Response(null, { status: 204 })
}
