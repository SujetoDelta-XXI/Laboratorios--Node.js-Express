# Dashboard de Gestión de Proyectos

## Descripción
Dashboard completo desarrollado con Next.js 16, React 19, TypeScript y shadcn/ui para la gestión de proyectos, equipos y tareas.

## Características Implementadas

### 🎨 Tema Personalizado
- Cambio de tema de colores de azul/slate a verde/esmeralda
- Paleta de colores actualizada en `src/app/globals.css`
- Soporte para modo claro y oscuro

### 📦 Componentes shadcn/ui Implementados

1. **Spinner** - Indicador de carga para simular peticiones al backend
2. **Alert** - Validaciones de formularios y mensajes de error/éxito
3. **Calendar** - Selector de fechas para cumpleaños y deadlines
4. **Pagination** - Paginación en la tabla de tareas (5 items por página)
5. **Popover** - Contenedor para el calendario

### 🗂️ Módulos Implementados

#### 1. Proyectos
- ✅ Crear proyectos con formulario completo
- ✅ Campo para asignar miembros del equipo (checkbox múltiple)
- ✅ Ver detalles del proyecto en modal
- ✅ Eliminar proyectos con confirmación
- ✅ Validaciones con Alert
- ✅ Spinner durante la creación

**Campos del Proyecto:**
- Nombre (requerido)
- Descripción
- Categoría (requerido)
- Prioridad (requerido)
- Estado
- Progreso
- Miembros del equipo (múltiple selección)

#### 2. Equipo
CRUD completo de miembros del equipo

**Campos:**
- userId (generado automáticamente)
- role (Frontend, Backend, Designer, etc.)
- name (requerido)
- email (requerido, validado)
- position (Junior, Mid-Level, Senior, Lead, Manager)
- birthdate (selector de calendario)
- phone
- projectId (asignación a proyecto)
- isActive (switch)

**Funcionalidades:**
- ✅ Crear miembro
- ✅ Editar miembro
- ✅ Eliminar miembro (con confirmación)
- ✅ Validaciones con Alert
- ✅ Spinner durante operaciones
- ✅ Calendar para fecha de nacimiento

#### 3. Tareas
CRUD completo de tareas con paginación

**Campos:**
- description (requerido)
- projectId (requerido)
- status (Pendiente, En progreso, Completado)
- priority (Baja, Media, Alta, Urgente)
- userId (asignado a miembro activo)
- deadline (selector de calendario, requerido)

**Funcionalidades:**
- ✅ Crear tarea
- ✅ Editar tarea
- ✅ Eliminar tarea (con confirmación)
- ✅ Paginación (5 tareas por página)
- ✅ Validaciones con Alert
- ✅ Spinner durante operaciones
- ✅ Calendar para deadline
- ✅ Badges de colores para estado y prioridad

#### 4. Configuración
Formulario de configuración con simulación de guardado

**Campos:**
- theme (Claro, Oscuro, Sistema)
- language (Español, English, Français, Deutsch)
- timezone (UTC-5, UTC-6, UTC-3, etc.)
- notifications (Switch)
- emailNotifications (Switch)
- autoSave (Switch)

**Funcionalidades:**
- ✅ Guardar configuración
- ✅ Restablecer valores
- ✅ Validaciones con Alert
- ✅ Spinner durante guardado
- ✅ Mensaje de éxito

#### 5. Resumen
Dashboard con métricas actualizadas en tiempo real

**Métricas:**
- Total de proyectos (calculado dinámicamente)
- Tareas completadas (calculado dinámicamente)
- Progreso general (porcentaje de tareas completadas)
- Miembros activos (calculado dinámicamente)

**Características:**
- ✅ Métricas actualizadas automáticamente
- ✅ Cards con iconos
- ✅ Actividad reciente
- ✅ Diseño responsive

## 🗄️ Gestión de Datos

### Store en Memoria
Archivo: `src/lib/store.ts`

Sistema de gestión de datos en memoria con:
- Datos iniciales precargados
- CRUD completo para proyectos, miembros y tareas
- Gestión de configuración
- Cálculo de métricas en tiempo real

### Interfaces TypeScript
```typescript
interface Project {
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

interface TeamMember {
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

interface Task {
  id: string
  description: string
  projectId: string
  status: string
  priority: string
  userId: string
  deadline: string
}

interface Settings {
  theme: string
  notifications: boolean
  language: string
  timezone: string
  emailNotifications: boolean
  autoSave: boolean
}
```

## 🎯 Simulación de Backend

Todas las operaciones simulan peticiones al backend con:
- Delays de 800ms - 1500ms usando `setTimeout`
- Spinner visible durante la operación
- Mensajes de error/éxito con Alert
- Actualización automática de la UI

## 📁 Estructura de Archivos

```
src/
├── app/
│   ├── dashboard/
│   │   └── page.tsx          # Página principal del dashboard
│   ├── globals.css            # Estilos globales y tema
│   └── layout.tsx
├── components/
│   ├── ui/                    # Componentes shadcn/ui
│   │   ├── alert.tsx
│   │   ├── calendar.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── spinner.tsx
│   │   └── ...
│   ├── ProjectForm.tsx        # Formulario de proyectos
│   ├── ProjectDetails.tsx     # Modal de detalles
│   ├── TeamManager.tsx        # CRUD de equipo
│   ├── TaskManager.tsx        # CRUD de tareas
│   └── SettingsForm.tsx       # Formulario de configuración
└── lib/
    ├── store.ts               # Store de datos en memoria
    └── utils.ts
```

## 🚀 Comandos

```bash
# Desarrollo
npm run dev

# Compilar
npm run build

# Producción
npm start

# Linting
npm run lint
```

## 📦 Dependencias Principales

- Next.js 16.0.1
- React 19.2.0
- TypeScript 5
- Tailwind CSS 4
- shadcn/ui
- Radix UI
- Lucide React (iconos)
- date-fns (manejo de fechas)
- react-day-picker (calendario)
- react-hook-form + zod (formularios)

## ✨ Características Destacadas

1. **Validaciones Completas**: Todos los formularios tienen validaciones con mensajes claros
2. **UX Mejorada**: Spinners, confirmaciones, mensajes de éxito/error
3. **Responsive**: Diseño adaptable a diferentes tamaños de pantalla
4. **Accesibilidad**: Componentes accesibles de Radix UI
5. **TypeScript**: Tipado completo en todo el proyecto
6. **Datos Relacionados**: Proyectos vinculados con miembros y tareas
7. **Métricas en Tiempo Real**: Dashboard actualizado automáticamente
8. **Paginación**: Tabla de tareas con navegación por páginas

## 🎨 Paleta de Colores

El tema ha sido cambiado de azul/slate a verde/esmeralda:
- Primary: Verde esmeralda (oklch(0.55 0.18 165))
- Background: Verde muy claro (oklch(0.99 0.005 160))
- Gradiente de fondo: from-emerald-50 to-teal-50

## 📝 Notas de Implementación

- Todos los IDs se generan con `Date.now().toString()`
- Las fechas se manejan con date-fns y formato ISO (yyyy-MM-dd)
- Los datos persisten solo en memoria (se pierden al recargar)
- Todas las operaciones son síncronas pero simulan async con delays
- Los componentes son client-side ("use client")
