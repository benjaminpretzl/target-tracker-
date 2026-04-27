import { db } from '@/db/db'
import type { Project } from '@/lib/types'
import ProjectCard from '@/components/project-card'
import CreateProjectDialog from '@/components/create-project-dialog'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  const projects = db.prepare('SELECT * FROM projects ORDER BY created_at DESC').all() as Project[]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No projects yet</p>
          <p className="text-sm mt-1">Create your first project to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} project={p} />
          ))}
        </div>
      )}
    </div>
  )
}
