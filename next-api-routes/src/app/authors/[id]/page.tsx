// app/authors/[id]/page.tsx
import AddBook from "./AddBook";
import EditAuthor from "./EditAuthor";

export const revalidate = 60; // ISR

async function getAuthor(id: string) {
  const [detailRes, statsRes] = await Promise.all([
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/${id}`, {
      next: { revalidate: 60 },
    }),
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/authors/${id}/stats`, {
      next: { revalidate: 60 },
    }),
  ]);

  if (!detailRes.ok) throw new Error("Autor no encontrado");

  return {
    detail: await detailRes.json(),
    stats: statsRes.ok ? await statsRes.json() : null,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { detail, stats } = await getAuthor(params.id);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">{detail.name}</h1>

      <section className="space-y-4">
        <AddBook authorId={detail.id} />
        <EditAuthor author={detail} />
      </section>

      {/* Statistics Section */}
      {stats ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Estadísticas</h2>
          
          {/* Main Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total de Libros</p>
              <p className="text-2xl font-bold text-blue-600">{stats.totalBooks}</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Promedio de Páginas</p>
              <p className="text-2xl font-bold text-green-600">{stats.averagePages}</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Primer Libro</p>
              <p className="text-sm font-semibold text-purple-600">{stats.firstBook.title}</p>
              <p className="text-xs text-gray-500">({stats.firstBook.year})</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Último Libro</p>
              <p className="text-sm font-semibold text-orange-600">{stats.latestBook.title}</p>
              <p className="text-xs text-gray-500">({stats.latestBook.year})</p>
            </div>
          </div>

          {/* Genres */}
          {stats.genres && stats.genres.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Géneros</p>
              <div className="flex flex-wrap gap-2">
                {stats.genres.map((genre: string) => (
                  <span
                    key={genre}
                    className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Longest and Shortest Books */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Libro Más Largo</p>
              <p className="text-lg font-semibold text-amber-700">{stats.longestBook.title}</p>
              <p className="text-sm text-gray-500">{stats.longestBook.pages} páginas</p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Libro Más Corto</p>
              <p className="text-lg font-semibold text-teal-700">{stats.shortestBook.title}</p>
              <p className="text-sm text-gray-500">{stats.shortestBook.pages} páginas</p>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
          <p className="text-yellow-800">
            Este autor aún no tiene libros registrados. Agrega el primer libro para ver las estadísticas.
          </p>
        </section>
      )}

      {/* Books List */}
      {detail.books && detail.books.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Libros del Autor</h2>
          <div className="space-y-2">
            {detail.books.map((book: any) => (
              <div
                key={book.id}
                className="bg-white border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow"
              >
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
                {book.description && (
                  <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
