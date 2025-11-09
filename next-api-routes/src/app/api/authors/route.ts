import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET — Obtener todos los autores
export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      include: {
        books: true,
        _count: {
          select: { books: true },
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(authors)
  } catch (error: any) {
    console.error('Error fetching authors:', error)
    return NextResponse.json(
      { 
        error: 'Error al obtener autores',
        message: error.message || 'Database connection failed'
      },
      { status: 500 }
    )
  }
}


// POST — Crear un nuevo autor
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, bio, nationality, birthYear } = body

    // Validación básica
    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      )
    }

    const author = await prisma.author.create({
      data: {
        name,
        email,
        bio,
        nationality,
        birthYear: birthYear ? parseInt(birthYear) : null,
      },
      include: {
        books: true,
      },
    })

    return NextResponse.json(author, { status: 201 })

  } catch (error: any) {
    // Prisma error de email único
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 409 }
      )
    }

    console.log(error)
    return NextResponse.json(
      { error: 'Error al crear autor' },
      { status: 500 }
    )
  }
}
