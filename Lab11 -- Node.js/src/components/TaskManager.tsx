"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/spinner"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { dataStore, Task } from "@/lib/store"
import { AlertCircle, Calendar as CalendarIcon, Pencil, Plus, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TaskManagerProps {
  onUpdate?: () => void
}

const ITEMS_PER_PAGE = 5

export function TaskManager({ onUpdate }: TaskManagerProps) {
  const [tasks, setTasks] = useState(dataStore.getTasks())
  const [currentPage, setCurrentPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [deadline, setDeadline] = useState<Date>()
  const [formData, setFormData] = useState({
    description: "",
    projectId: "",
    status: "Pendiente",
    priority: "Media",
    userId: "",
  })

  const projects = dataStore.getProjects()
  const teamMembers = dataStore.getTeamMembers()

  // Paginación
  const totalPages = Math.ceil(tasks.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentTasks = tasks.slice(startIndex, endIndex)

  const resetForm = () => {
    setFormData({
      description: "",
      projectId: "",
      status: "Pendiente",
      priority: "Media",
      userId: "",
    })
    setDeadline(undefined)
    setEditingTask(null)
    setError("")
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setFormData({
      description: task.description,
      projectId: task.projectId,
      status: task.status,
      priority: task.priority,
      userId: task.userId,
    })
    setDeadline(task.deadline ? new Date(task.deadline) : undefined)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar esta tarea?")) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    dataStore.deleteTask(id)
    setTasks(dataStore.getTasks())
    setLoading(false)
    onUpdate?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (!formData.description.trim()) {
      setError("La descripción es requerida")
      return
    }
    if (!formData.projectId) {
      setError("Debes seleccionar un proyecto")
      return
    }
    if (!formData.userId) {
      setError("Debes asignar la tarea a un miembro")
      return
    }
    if (!deadline) {
      setError("Debes seleccionar una fecha límite")
      return
    }

    const dataToSave = {
      description: formData.description,
      projectId: formData.projectId,
      status: formData.status,
      priority: formData.priority,
      userId: formData.userId,
      deadline: format(deadline, "yyyy-MM-dd"),
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))

    try {
      if (editingTask) {
        dataStore.updateTask(editingTask.id, dataToSave)
      } else {
        dataStore.createTask(dataToSave)
      }
      setTasks(dataStore.getTasks())
      setOpen(false)
      resetForm()
      onUpdate?.()
    } catch (err) {
      setError("Error al guardar la tarea")
    } finally {
      setLoading(false)
    }
  }

  const statusVariant = (status: string) => {
    switch (status) {
      case "Completado":
        return "default"
      case "En progreso":
        return "secondary"
      case "Pendiente":
        return "outline"
      default:
        return "outline"
    }
  }

  const priorityVariant = (priority: string) => {
    switch (priority) {
      case "Urgente":
        return "destructive"
      case "Alta":
        return "default"
      case "Media":
        return "secondary"
      case "Baja":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Tareas</h3>
          <p className="text-sm text-muted-foreground">
            Administra todas las tareas de tus proyectos
          </p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nueva Tarea
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingTask ? "Editar Tarea" : "Crear Nueva Tarea"}
                </DialogTitle>
                <DialogDescription>
                  Completa la información de la tarea
                </DialogDescription>
              </DialogHeader>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="description">
                    Descripción <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                    placeholder="Describe la tarea..."
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectId">
                    Proyecto <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                        <SelectItem value="En progreso">En progreso</SelectItem>
                        <SelectItem value="Completado">Completado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="priority">Prioridad</Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) => setFormData({ ...formData, priority: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Baja">Baja</SelectItem>
                        <SelectItem value="Media">Media</SelectItem>
                        <SelectItem value="Alta">Alta</SelectItem>
                        <SelectItem value="Urgente">Urgente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="userId">
                    Asignado a <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.userId}
                    onValueChange={(value) => setFormData({ ...formData, userId: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un miembro" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.filter(m => m.isActive).map((member) => (
                        <SelectItem key={member.userId} value={member.userId}>
                          {member.name} - {member.role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-2">
                  <Label>
                    Fecha Límite <span className="text-red-500">*</span>
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {deadline ? format(deadline, "PPP", { locale: es }) : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={deadline}
                        onSelect={setDeadline}
                        captionLayout="dropdown"
                        fromYear={2024}
                        toYear={2030}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Guardando...
                    </>
                  ) : (
                    editingTask ? "Actualizar" : "Crear Tarea"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="border rounded-lg">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="p-3 text-left text-sm font-medium">Tarea</th>
                <th className="p-3 text-left text-sm font-medium">Proyecto</th>
                <th className="p-3 text-left text-sm font-medium">Estado</th>
                <th className="p-3 text-left text-sm font-medium">Prioridad</th>
                <th className="p-3 text-left text-sm font-medium">Asignado</th>
                <th className="p-3 text-left text-sm font-medium">Fecha Límite</th>
                <th className="p-3 text-right text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentTasks.map((task) => {
                const project = projects.find(p => p.id === task.projectId)
                const assignee = teamMembers.find(m => m.userId === task.userId)
                
                return (
                  <tr key={task.id} className="border-b last:border-0">
                    <td className="p-3 text-sm">{task.description}</td>
                    <td className="p-3 text-sm">{project?.name || "N/A"}</td>
                    <td className="p-3">
                      <Badge variant={statusVariant(task.status)}>{task.status}</Badge>
                    </td>
                    <td className="p-3">
                      <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
                    </td>
                    <td className="p-3 text-sm">{assignee?.name || "N/A"}</td>
                    <td className="p-3 text-sm">{task.deadline}</td>
                    <td className="p-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(task)}
                          disabled={loading}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(task.id)}
                          disabled={loading}
                        >
                          {loading ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
