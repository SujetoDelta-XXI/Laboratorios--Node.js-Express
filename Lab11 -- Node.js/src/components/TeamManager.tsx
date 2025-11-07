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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { dataStore, TeamMember } from "@/lib/store"
import { AlertCircle, Calendar as CalendarIcon, Pencil, Trash2, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface TeamManagerProps {
  onUpdate?: () => void
}

export function TeamManager({ onUpdate }: TeamManagerProps) {
  const [members, setMembers] = useState(dataStore.getTeamMembers())
  const [open, setOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [birthdate, setBirthdate] = useState<Date>()
  const [formData, setFormData] = useState({
    userId: "",
    role: "",
    name: "",
    email: "",
    position: "",
    birthdate: "",
    phone: "",
    projectId: "none",
    isActive: true,
  })

  const projects = dataStore.getProjects()

  const resetForm = () => {
    setFormData({
      userId: "",
      role: "",
      name: "",
      email: "",
      position: "",
      birthdate: "",
      phone: "",
      projectId: "none",
      isActive: true,
    })
    setBirthdate(undefined)
    setEditingMember(null)
    setError("")
  }

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member)
    setFormData({
      ...member,
      projectId: member.projectId || "none"
    })
    setBirthdate(member.birthdate ? new Date(member.birthdate) : undefined)
    setOpen(true)
  }

  const handleDelete = async (userId: string) => {
    if (!confirm("¿Estás seguro de eliminar este miembro?")) return
    
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    
    dataStore.deleteTeamMember(userId)
    setMembers(dataStore.getTeamMembers())
    setLoading(false)
    onUpdate?.()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validaciones
    if (!formData.name.trim()) {
      setError("El nombre es requerido")
      return
    }
    if (!formData.email.trim() || !formData.email.includes("@")) {
      setError("Email válido es requerido")
      return
    }
    if (!formData.role) {
      setError("El rol es requerido")
      return
    }
    if (!formData.position) {
      setError("La posición es requerida")
      return
    }

    const dataToSave = {
      ...formData,
      birthdate: birthdate ? format(birthdate, "yyyy-MM-dd") : "",
      userId: editingMember ? editingMember.userId : Date.now().toString(),
      projectId: formData.projectId === "none" ? "" : formData.projectId,
    }

    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))

    try {
      if (editingMember) {
        dataStore.updateTeamMember(editingMember.userId, dataToSave)
      } else {
        dataStore.createTeamMember(dataToSave as TeamMember)
      }
      setMembers(dataStore.getTeamMembers())
      setOpen(false)
      resetForm()
      onUpdate?.()
    } catch (err) {
      setError("Error al guardar el miembro")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Miembros del Equipo</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona los miembros de tu equipo y sus roles
          </p>
        </div>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen)
          if (!isOpen) resetForm()
        }}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Agregar Miembro
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>
                  {editingMember ? "Editar Miembro" : "Agregar Nuevo Miembro"}
                </DialogTitle>
                <DialogDescription>
                  Completa la información del miembro del equipo
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
                  <Label htmlFor="name">
                    Nombre Completo <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="role">
                      Rol <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) => setFormData({ ...formData, role: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
                        <SelectItem value="Backend Developer">Backend Developer</SelectItem>
                        <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
                        <SelectItem value="UI/UX Designer">UI/UX Designer</SelectItem>
                        <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                        <SelectItem value="Project Manager">Project Manager</SelectItem>
                        <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="position">
                      Posición <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.position}
                      onValueChange={(value) => setFormData({ ...formData, position: value })}
                      disabled={loading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona posición" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Junior">Junior</SelectItem>
                        <SelectItem value="Mid-Level">Mid-Level</SelectItem>
                        <SelectItem value="Senior">Senior</SelectItem>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Fecha de Nacimiento</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                        disabled={loading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthdate ? format(birthdate, "PPP", { locale: es }) : "Selecciona una fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={birthdate}
                        onSelect={setBirthdate}
                        captionLayout="dropdown"
                        fromYear={1950}
                        toYear={2010}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="projectId">Proyecto Asignado</Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un proyecto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sin asignar</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                    disabled={loading}
                  />
                  <Label htmlFor="isActive">Miembro Activo</Label>
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
                    editingMember ? "Actualizar" : "Crear Miembro"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        {members.map((member) => (
          <div key={member.userId} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-4">
              <Avatar>
                <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.role}</p>
                <p className="text-xs text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={member.isActive ? "default" : "secondary"}>
                {member.isActive ? "Activo" : "Inactivo"}
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(member)}
                disabled={loading}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(member.userId)}
                disabled={loading}
              >
                {loading ? <Spinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
