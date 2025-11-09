import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'


/* ======================================
   GET — Obtener todos los libros
   ====================================== */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const genre = searchParams.get('genre')
    const authorId = searchParams.get('authorId')

    const books = await prisma.book.findMany({
      where: {
        ...(genre && { genre }),
        ...(authorId && { authorId }),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener libros' },
      { status: 500 }
    )
  }
}


/* ======================================
   POST — Crear un nuevo libro
   ====================================== */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      isbn,
      publishedYear,
      genre,
      pages,
      authorId
    } = body

    // Validaciones
    if (!title || !authorId) {
      return NextResponse.json(
        { error: 'Título y autor son requeridos' },
        { status: 400 }
      )
    }

    if (title.length < 3) {
      return NextResponse.json(
        { error: 'El título debe tener al menos 3 caracteres' },
        { status: 400 }
      )
    }

    if (pages && pages < 1) {
      return NextResponse.json(
        { error: 'El número de páginas debe ser mayor a 0' },
        { status: 400 }
      )
    }

    // Validar que el autor existe
    const authorExists = await prisma.author.findUnique({
      where: { id: authorId }
    })

    if (!authorExists) {
      return NextResponse.json(
        { error: 'El autor especificado no existe' },
        { status: 404 }
      )
    }

    // Crear libro
    const book = await prisma.book.create({
      data: {
        title,
        description,
        isbn,
        publishedYear: publishedYear ? parseInt(publishedYear) : null,
        genre,
        pages: pages ? parseInt(pages) : null,
        authorId,
      },
      include: {
        author: true,
      },
    })

    return NextResponse.json(book, { status: 201 })

  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'El ISBN ya existe' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Error al crear libro' },
      { status: 500 }
    )
  }
}
