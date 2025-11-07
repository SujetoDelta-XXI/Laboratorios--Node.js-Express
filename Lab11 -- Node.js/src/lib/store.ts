// Store en memoria para gestionar datos del dashboard

export interface Project {
  id: string
  name: string
  description: string
  category: string
  priority: string
  status: string
  progress: number
  teamMembers: string[]
  createdAt: Date
}

export interface TeamMember {
  userId: string
  role: string
  name: string
  email: string
  position: string
  birthdate: string
  phone: string
  projectId: string
  isActive: boolean
}

export interface Task {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  deadline: string
}

export interface Settings {
  theme: string
  notifications: boolean
  language: string
  timezone: string
  emailNotifications: boolean
  autoSave: boolean
}

class DataStore {
  private projects: Project[] = []
  private teamMembers: TeamMember[] = []
  private tasks: Task[] = []
  private settings: Settings = {
    theme: 'light',
    notifications: true,
    language: 'es',
    timezone: 'UTC-5',
    emailNotifications: true,
    autoSave: true,
  }

  constructor() {
    this.initializeData()
  }

  private initializeData() {
    // Proyectos iniciales
    this.projects = [
      {
        id: '1',
        name: 'E-commerce Platform',
        description: 'Plataforma de comercio electrónico con Next.js',
        category: 'web',
        priority: 'high',
        status: 'En progreso',
        progress: 65,
        teamMembers: ['1', '2'],
        createdAt: new Date('2024-10-01'),
      },
      {
        id: '2',
        name: 'Mobile App',
        description: 'Aplicación móvil con React Native',
        category: 'mobile',
        priority: 'medium',
        status: 'En revisión',
        progress: 90,
        teamMembers: ['3'],
        createdAt: new Date('2024-09-15'),
      },
      {
        id: '3',
        name: 'Dashboard Analytics',
        description: 'Panel de análisis con visualizaciones',
        category: 'web',
        priority: 'low',
        status: 'Planificado',
        progress: 20,
        teamMembers: ['4'],
        createdAt: new Date('2024-11-01'),
      },
    ]

    // Miembros del equipo iniciales
    this.teamMembers = [
      {
        userId: '1',
        role: 'Frontend Developer',
        name: 'María García',
        email: 'maria@example.com',
        position: 'Senior Developer',
        birthdate: '1990-05-15',
        phone: '+1234567890',
        projectId: '1',
        isActive: true,
      },
      {
        userId: '2',
        role: 'Backend Developer',
        name: 'Juan Pérez',
        email: 'juan@example.com',
        position: 'Lead Developer',
        birthdate: '1988-03-20',
        phone: '+1234567891',
        projectId: '1',
        isActive: true,
      },
      {
        userId: '3',
        role: 'UI/UX Designer',
        name: 'Ana López',
        email: 'ana@example.com',
        position: 'Designer',
        birthdate: '1992-07-10',
        phone: '+1234567892',
        projectId: '2',
        isActive: false,
      },
      {
        userId: '4',
        role: 'DevOps Engineer',
        name: 'Carlos Ruiz',
        email: 'carlos@example.com',
        position: 'DevOps Lead',
        birthdate: '1985-11-25',
        phone: '+1234567893',
        projectId: '3',
        isActive: true,
      },
    ]

    // Tareas iniciales
    this.tasks = [
      {
        id: '1',
        description: 'Implementar autenticación',
        projectId: '1',
        status: 'En progreso',
        priority: 'Alta',
        userId: '1',
        deadline: '2025-11-15',
      },
      {
        id: '2',
        description: 'Diseñar pantalla de perfil',
        projectId: '2',
        status: 'Pendiente',
        priority: 'Media',
        userId: '3',
        deadline: '2025-11-20',
      },
      {
        id: '3',
        description: 'Configurar CI/CD',
        projectId: '3',
        status: 'Completado',
        priority: 'Alta',
        userId: '4',
        deadline: '2025-11-10',
      },
      {
        id: '4',
        description: 'Optimizar queries SQL',
        projectId: '1',
        status: 'En progreso',
        priority: 'Urgente',
        userId: '2',
        deadline: '2025-11-12',
      },
    ]
  }

  // CRUD Proyectos
  getProjects() {
    return [...this.projects]
  }

  getProject(id: string) {
    return this.projects.find(p => p.id === id)
  }

  createProject(project: Omit<Project, 'id' | 'createdAt'>) {
    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    this.projects.push(newProject)
    return newProject
  }

  updateProject(id: string, updates: Partial<Project>) {
    const index = this.projects.findIndex(p => p.id === id)
    if (index !== -1) {
      this.projects[index] = { ...this.projects[index], ...updates }
      return this.projects[index]
    }
    return null
  }

  deleteProject(id: string) {
    const index = this.projects.findIndex(p => p.id === id)
    if (index !== -1) {
      this.projects.splice(index, 1)
      return true
    }
    return false
  }

  // CRUD Miembros del Equipo
  getTeamMembers() {
    return [...this.teamMembers]
  }

  getTeamMember(userId: string) {
    return this.teamMembers.find(m => m.userId === userId)
  }

  createTeamMember(member: TeamMember) {
    this.teamMembers.push(member)
    return member
  }

  updateTeamMember(userId: string, updates: Partial<TeamMember>) {
    const index = this.teamMembers.findIndex(m => m.userId === userId)
    if (index !== -1) {
      this.teamMembers[index] = { ...this.teamMembers[index], ...updates }
      return this.teamMembers[index]
    }
    return null
  }

  deleteTeamMember(userId: string) {
    const index = this.teamMembers.findIndex(m => m.userId === userId)
    if (index !== -1) {
      this.teamMembers.splice(index, 1)
      return true
    }
    return false
  }

  // CRUD Tareas
  getTasks() {
    return [...this.tasks]
  }

  getTask(id: string) {
    return this.tasks.find(t => t.id === id)
  }

  createTask(task: Omit<Task, 'id'>) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
    }
    this.tasks.push(newTask)
    return newTask
  }

  updateTask(id: string, updates: Partial<Task>) {
    const index = this.tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      this.tasks[index] = { ...this.tasks[index], ...updates }
      return this.tasks[index]
    }
    return null
  }

  deleteTask(id: string) {
    const index = this.tasks.findIndex(t => t.id === id)
    if (index !== -1) {
      this.tasks.splice(index, 1)
      return true
    }
    return false
  }

  // Configuración
  getSettings() {
    return { ...this.settings }
  }

  updateSettings(updates: Partial<Settings>) {
    this.settings = { ...this.settings, ...updates }
    return this.settings
  }

  // Métricas
  getMetrics() {
    return {
      totalProjects: this.projects.length,
      completedTasks: this.tasks.filter(t => t.status === 'Completado').length,
      totalTasks: this.tasks.length,
      activeMembers: this.teamMembers.filter(m => m.isActive).length,
      totalMembers: this.teamMembers.length,
    }
  }
}

export const dataStore = new DataStore()
