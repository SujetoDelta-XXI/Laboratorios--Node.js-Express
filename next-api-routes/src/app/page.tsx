"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();

  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ------------------------------------------------------------------
  // Load authors
  // ------------------------------------------------------------------
  async function loadAuthors() {
    setLoading(true);
    const res = await fetch("/api/authors");
    const json = await res.json();
    setAuthors(json || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  // ------------------------------------------------------------------
  // Create Author
  // ------------------------------------------------------------------
  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      email: { value: string };
      bio: { value: string };
      nationality: { value: string };
      birthYear: { value: string };
    };

    const body = {
      name: form.name.value,
      email: form.email.value,
      bio: form.bio.value || null,
      nationality: form.nationality.value || null,
      birthYear: form.birthYear.value || null,
    };

    const res = await fetch("/api/authors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      form.reset();
      loadAuthors();
    } else {
      alert("Error al crear autor");
    }
  }


  // ------------------------------------------------------------------
  // Delete Author
  // ------------------------------------------------------------------
  async function onDelete(id: string) {
    if (!confirm("¿Eliminar autor?")) return;

    const res = await fetch(`/api/authors/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadAuthors();
    } else {
      alert("No se pudo eliminar");
    }
  }

  // ---- Simple stats
  const totalAuthors = authors.length;
  const totalBooks = authors.reduce(
    (acc: number, a: any) => acc + (a._count?.books ?? a.books?.length ?? 0),
    0
  );

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Biblioteca</h1>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-4">
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Autores</div>
          <div className="text-3xl font-semibold">{totalAuthors}</div>
        </div>
        <div className="p-4 border rounded">
          <div className="text-sm text-gray-500">Libros (aprox.)</div>
          <div className="text-3xl font-semibold">{totalBooks}</div>
        </div>
        <div className="p-4 border rounded flex items-end">
          <Link href="/books" className="px-3 py-2 bg-gray-900 text-white rounded">
            Ir a búsqueda de libros
          </Link>
        </div>
      </section>

      {/* CREATE */}
      <section className="grid md:grid-cols-2 gap-6">
        <form onSubmit={onCreate} className="space-y-2 p-4 border rounded-lg">
          <h2 className="font-semibold text-lg">Crear autor</h2>

          <input name="name" placeholder="Nombre" className="border p-2 w-full" required />
          <input name="email" placeholder="Email" className="border p-2 w-full" required />
          <input name="bio" placeholder="Bio" className="border p-2 w-full" />

          <div className="grid grid-cols-2 gap-2">
            <input
              name="nationality"
              placeholder="Nacionalidad"
              className="border p-2 w-full"
            />
            <input
              name="birthYear"
              placeholder="Año nacimiento"
              className="border p-2 w-full"
            />
          </div>

          <button className="px-3 py-2 bg-blue-600 text-white rounded">
            Crear
          </button>
        </form>

        {/* LIST */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Autores</h2>

          {loading && <div>Cargando…</div>}

          <div className="space-y-3">
            {authors.map((a: any) => (
              <div
                key={a.id}
                className="border p-3 rounded flex items-center justify-between"
              >
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-sm text-gray-500">{a.email}</div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/authors/${a.id}`}
                    className="px-2 py-1 rounded bg-emerald-600 text-white"
                  >
                    Ver detalle
                  </Link>

                  <button
                    onClick={() => onDelete(a.id)}
                    className="px-2 py-1 rounded bg-red-600 text-white"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
