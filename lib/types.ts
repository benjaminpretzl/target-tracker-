export type Status = 'backlog' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Project {
  id: number
  name: string
  description: string | null
  created_at: string
}

export interface TeamMember {
  id: number
  name: string
  created_at: string
}

export interface Task {
  id: number
  title: string
  description: string | null
  status: Status
  priority: Priority
  due_date: string | null
  project_id: number
  parent_task_id: number | null
  assignee_id: number | null
  created_at: string
  updated_at: string
}

export interface TaskWithAssignee extends Task {
  assignee_name: string | null
}
