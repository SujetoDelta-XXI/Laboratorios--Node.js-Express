import Link from "next/link";
import DeleteBookButton from "./DeleteBookButton";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

async function getBook(id: string) {
  try {
    const book = await prisma.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!book) throw new Error("Libro no encontrado");

    return book;
  } catch (error) {
    console.error('Error loading book:', error);
    throw error;
  }
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const book = await getBook(id);

  return (
    <main className="p-6 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{book.title}</h1>
        <div className="flex gap-2">
          <Link 
            href="/books" 
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Volver a Libros
          </Link>
          <Link 
            href="/" 
            className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
          >
            Ir a Home
          </Link>
        </div>
      </div>

      {/* Información principal */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Autor</h2>
            <Link 
              href={`/authors/${book.author.id}`}
              className="text-lg text-blue-600 hover:text-blue-800 font-medium"
            >
              {book.author.name}
            </Link>
          </div>

          {book.publishedYear && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Año de Publicación</h2>
              <p className="text-lg">{book.publishedYear}</p>
            </div>
          )}

          {book.genre && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Género</h2>
              <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                {book.genre}
              </span>
            </div>
          )}

          {book.pages && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Páginas</h2>
              <p className="text-lg">{book.pages}</p>
            </div>
          )}

          {book.isbn && (
            <div>
              <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">ISBN</h2>
              <p className="text-lg font-mono">{book.isbn}</p>
            </div>
          )}
        </div>

        {book.description && (
          <div className="pt-4 border-t border-gray-200">
            <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Descripción</h2>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>
        )}
      </div>

      {/* Metadatos */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h2 className="text-sm font-semibold text-gray-500 uppercase mb-3">Información del Sistema</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-600">Creado:</span>{" "}
            <span className="text-gray-900">{new Date(book.createdAt).toLocaleDateString('es-ES')}</span>
          </div>
          <div>
            <span className="text-gray-600">Última actualización:</span>{" "}
            <span className="text-gray-900">{new Date(book.updatedAt).toLocaleDateString('es-ES')}</span>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex justify-end">
        <DeleteBookButton bookId={book.id} bookTitle={book.title} />
      </div>
    </main>
  );
}
