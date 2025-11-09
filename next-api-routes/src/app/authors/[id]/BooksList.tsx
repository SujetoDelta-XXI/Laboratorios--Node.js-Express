"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/lib/toast";

type Book = {
  id: string;
  title: string;
  publishedYear?: number;
  genre?: string;
  pages?: number;
  description?: string;
};

export default function BooksList({ books }: { books: Book[] }) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleDeleteBook(bookId: string, bookTitle: string) {
    if (!confirm(`¿Estás seguro de eliminar "${bookTitle}"?`)) return;

    const res = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      showToast("Libro eliminado exitosamente", "success");
      router.refresh();
    } else {
      showToast("Error al eliminar libro", "error");
    }
  }

  if (books.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Libros del Autor</h2>
      <div className="space-y-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="border border-gray-200 p-4 rounded-lg"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{book.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2 text-sm text-gray-600">
                  {book.publishedYear && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      Año: {book.publishedYear}
                    </span>
                  )}
                  {book.genre && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {book.genre}
                    </span>
                  )}
                  {book.pages && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {book.pages} páginas
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 ml-4">
                <Link
                  href={`/books/${book.id}`}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                >
                  Detalle
                </Link>
                <button
                  type="button"
                  onClick={() => handleDeleteBook(book.id, book.title)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
