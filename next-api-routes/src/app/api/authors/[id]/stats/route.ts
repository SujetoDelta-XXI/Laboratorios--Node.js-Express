import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authorId = (await params).id;

    // Obtener todos los libros del autor
    const books = await prisma.book.findMany({
      where: { authorId },
      orderBy: { publishedYear: "asc" }, // para identificar firstBook más fácil
      select: {
        id: true,
        title: true,
        pages: true,
        genre: true,
        publishedYear: true,
      },
    });

    if (!books || books.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron libros para este autor" },
        { status: 404 }
      );
    }

    // Total de libros
    const totalBooks = books.length;

    // Primer libro (ordenado asc por publishedYear)
    const firstBook = {
      title: books[0].title,
      year: books[0].publishedYear,
    };

    // Último libro
    const latestBookData = books[books.length - 1];
    const latestBook = {
      title: latestBookData.title,
      year: latestBookData.publishedYear,
    };

    // Promedio de páginas
    const averagePages = Math.round(
      books.reduce((acc, b) => acc + (b.pages ?? 0), 0) / totalBooks
    );

    // Lista de géneros únicos
    const genres = [...new Set(books.map((b) => b.genre).filter(Boolean))];

    // Libro con más páginas
    const longestBookData = books.reduce((max, b) =>
      (b.pages ?? 0) > (max.pages ?? 0) ? b : max
    );
    const longestBook = {
      title: longestBookData.title,
      pages: longestBookData.pages,
    };

    // Libro con menos páginas
    const shortestBookData = books.reduce((min, b) =>
      (b.pages ?? 0) < (min.pages ?? 0) ? b : min
    );
    const shortestBook = {
      title: shortestBookData.title,
      pages: shortestBookData.pages,
    };

    // Obtener nombre del autor
    const author = await prisma.author.findUnique({
      where: { id: authorId },
      select: {
        name: true,
      },
    });

    return NextResponse.json({
      authorId,
      authorName: author?.name ?? null,
      totalBooks,
      firstBook,
      latestBook,
      averagePages,
      genres,
      longestBook,
      shortestBook,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al obtener estadísticas del autor" },
      { status: 500 }
    );
  }
}
