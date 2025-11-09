// app/authors/[id]/page.tsx
import Link from "next/link";
import EditAuthor from "./EditAuthor";
import BooksList from "./BooksList";

export const revalidate = 60; // ISR
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

async function getAuthor(id: string) {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const [detailRes, statsRes] = await Promise.all([
      fetch(`${base}/api/authors/${id}`, {
        next: { revalidate: 60 },
        cache: 'no-store'
      }),
      fetch(`${base}/api/authors/${id}/stats`, {
        next: { revalidate: 60 },
        cache: 'no-store'
      }),
    ]);

    if (!detailRes.ok) throw new Error("Autor no encontrado");

    return {
      detail: await detailRes.json(),
      stats: statsRes.ok ? await statsRes.json() : null,
    };
  } catch (error) {
    console.error('Error loading author:', error);
    throw error;
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { detail, stats } = await getAuthor(id);

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{detail.name}</h1>
        <Link 
          href="/" 
          className="px-4 py-2 bg-gray-900 text-white rounded hover:bg-gray-800"
        >
          Ir a Home
        </Link>
      </div>

      <section className="space-y-4">
        <EditAuthor author={detail} />
      </section>
      
      {stats ? (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Estadísticas</h2>
          
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

      <BooksList books={detail.books || []} />
    </main>
  );
}
