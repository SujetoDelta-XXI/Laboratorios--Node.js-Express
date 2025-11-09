"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import CreateBookForm from "./createBookForm";

type Props = {
  initialAuthors: { id: string; name: string }[];
  initialGenres: string[];
};

export default function BooksClient({ initialAuthors, initialGenres }: Props) {
  const [q, setQ] = useState("");
  const [genre, setGenre] = useState("");
  const [authorId, setAuthorId] = useState("");

  const [sortBy, setSortBy] = useState<"title" | "publishedYear" | "createdAt">(
    "createdAt"
  );
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [pagination, setPagination] = useState<any>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  async function runSearch() {
    setLoading(true);

    const params = new URLSearchParams();
    if (q) params.set("search", q);
    if (genre) params.set("genre", genre);
    if (authorId) params.set("authorId", authorId);

    params.set("page", String(page));
    params.set("limit", String(limit));
    params.set("sortBy", sortBy);
    params.set("order", order);

    const endpoint = `/api/books/search?${params.toString()}`;
    const res = await fetch(endpoint, { cache: "no-store" });
    const json = await res.json();

    setData(json.data || []);
    setPagination(json.pagination ?? {});
    setLoading(false);
  }

  useEffect(() => {
    runSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q, genre, authorId, sortBy, order, page, limit]);

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Búsqueda de Libros</h1>

      {/* 📝 Formulario de creación */}
      <section className="border rounded p-4 bg-gray-50">
        <CreateBookForm authors={initialAuthors} onSuccess={runSearch} />
      </section>

      {/* 🔎 Filtros */}
      <section className="grid md:grid-cols-4 gap-3">
        <input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Buscar por título…"
          className="border p-2 rounded"
        />

        <select
          value={genre}
          onChange={(e) => {
            setPage(1);
            setGenre(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">Todos los géneros</option>
          {initialGenres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          value={authorId}
          onChange={(e) => {
            setPage(1);
            setAuthorId(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">Todos los autores</option>
          {initialAuthors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="border p-2 rounded w-full"
          >
            <option value="createdAt">Creación</option>
            <option value="title">Título</option>
            <option value="publishedYear">Año</option>
          </select>

          <select
            value={order}
            onChange={(e) => setOrder(e.target.value as any)}
            className="border p-2 rounded w-full"
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </section>

      {/* 🔹 Límite + total */}
      <section className="flex items-center gap-3">
        <label className="text-sm">Límite</label>
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(parseInt(e.target.value));
          }}
          className="border p-1 rounded"
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <div className="text-sm text-gray-600">
          {loading ? "Cargando…" : `Total: ${pagination.total ?? 0}`}
        </div>
      </section>

      {/* 📚 Lista */}
      <section className="space-y-2">
        {data.map((b: any) => (
          <div
            key={b.id}
            className="border rounded p-3 flex items-center justify-between"
          >
            <div>
              <div className="font-medium">
                {b.title}{" "}
                <span className="text-gray-500">
                  ({b.publishedYear ?? "—"})
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {b.genre ?? "Sin género"} • {b.author?.name ?? ""}
              </div>
            </div>

            <div className="flex gap-2">
              <Link
                href={`/authors/${b.author?.id}`}
                className="px-2 py-1 bg-emerald-600 text-white rounded"
              >
                Autor
              </Link>
            </div>
          </div>
        ))}

        {!loading && data.length === 0 && (
          <div className="text-sm text-gray-600">Sin resultados</div>
        )}
      </section>

      {/* 🔄 Paginación */}
      <section className="flex items-center gap-2">
        <button
          disabled={!pagination.hasPrev}
          onClick={() => setPage((p) => p - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Anterior
        </button>

        <div className="text-sm">
          Página {pagination.page ?? page} / {pagination.totalPages ?? 1}
        </div>

        <button
          disabled={!pagination.hasNext}
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Siguiente
        </button>
      </section>
    </main>
  );
}
