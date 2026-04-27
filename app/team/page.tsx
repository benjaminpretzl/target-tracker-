import { db } from '@/db/db'
import type { TeamMember } from '@/lib/types'
import MemberList from '@/components/team/member-list'
import AddMemberForm from '@/components/team/add-member-form'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const result = await db.execute('SELECT * FROM team_members ORDER BY name ASC')
  const members = result.rows as unknown as TeamMember[]

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Team</h1>
      <div className="mb-6">
        <AddMemberForm />
      </div>
      <MemberList members={members} />
    </div>
  )
}
