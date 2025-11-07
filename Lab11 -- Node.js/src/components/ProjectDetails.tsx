"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Project } from "@/lib/store"
import { dataStore } from "@/lib/store"

interface ProjectDetailsProps {
  project: Project
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProjectDetails({ project, open, onOpenChange }: ProjectDetailsProps) {
  const teamMembers = dataStore.getTeamMembers().filter(m => 
    project.teamMembers.includes(m.userId)
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{project.name}</DialogTitle>
          <DialogDescription>{project.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Categoría</p>
              <p className="text-sm capitalize">{project.category}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Prioridad</p>
              <Badge variant={
                project.priority === 'urgent' ? 'destructive' :
                project.priority === 'high' ? 'default' :
                project.priority === 'medium' ? 'secondary' : 'outline'
              }>
                {project.priority === 'urgent' ? 'Urgente' :
                 project.priority === 'high' ? 'Alta' :
                 project.priority === 'medium' ? 'Media' : 'Baja'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Estado</p>
              <Badge variant="outline">{project.status}</Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Progreso</p>
              <p className="text-sm">{project.progress}%</p>
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Progreso del Proyecto</p>
            <div className="w-full bg-secondary h-3 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground mb-3">Miembros del Equipo</p>
            {teamMembers.length === 0 ? (
              <p className="text-sm text-muted-foreground">No hay miembros asignados</p>
            ) : (
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.userId} className="flex items-center gap-3 p-2 border rounded-md">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.position}</p>
                    </div>
                    <Badge variant={member.isActive ? "default" : "secondary"} className="text-xs">
                      {member.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">Fecha de Creación</p>
            <p className="text-sm">{new Date(project.createdAt).toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
