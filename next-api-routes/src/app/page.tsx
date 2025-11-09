"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/lib/toast";
import { AuthorCardSkeleton, StatCardSkeleton } from "@/components/Skeleton";

export default function Page() {
  const router = useRouter();
  const { showToast } = useToast();

  const [authors, setAuthors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function loadAuthors() {
    setLoading(true);
    try {
      const res = await fetch("/api/authors");
      if (res.ok) {
        const json = await res.json();
        setAuthors(Array.isArray(json) ? json : []);
      } else {
        console.error('Error loading authors:', res.status);
        setAuthors([]);
        showToast("Error al cargar autores", "error");
      }
    } catch (error) {
      console.error('Error loading authors:', error);
      setAuthors([]);
      showToast("Error de conexión", "error");
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAuthors();
  }, []);

  // Create Author
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  async function onCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormErrors({});

    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      email: { value: string };
      bio: { value: string };
      nationality: { value: string };
      birthYear: { value: string };
    };

    // Validación
    const errors: Record<string, string> = {};
    
    if (!form.name.value.trim()) {
      errors.name = "El nombre es requerido";
    }
    
    if (!form.email.value.trim()) {
      errors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
      errors.email = "Email inválido";
    }
    
    if (form.birthYear.value && (isNaN(Number(form.birthYear.value)) || Number(form.birthYear.value) < 1000 || Number(form.birthYear.value) > new Date().getFullYear())) {
      errors.birthYear = "Año inválido";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      showToast("Por favor corrige los errores del formulario", "error");
      return;
    }

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
      showToast("Autor creado exitosamente", "success");
    } else {
      showToast("Error al crear autor", "error");
    }
  }

  // Delete Author
  async function onDelete(id: string, authorName: string) {
    if (!confirm(`¿Eliminar autor "${authorName}"? Esto también eliminará todos sus libros.`)) return;

    const res = await fetch(`/api/authors/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      loadAuthors();
      showToast("Autor y sus libros eliminados exitosamente", "success");
    } else {
      showToast("No se pudo eliminar", "error");
    }
  }

  // ---- Simple stats
  const totalAuthors = Array.isArray(authors) ? authors.length : 0;
  const totalBooks = Array.isArray(authors) ? authors.reduce(
    (acc: number, a: any) => acc + (a._count?.books ?? a.books?.length ?? 0),
    0
  ) : 0;

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Dashboard Biblioteca</h1>

      {/* Stats */}
      <section className="grid md:grid-cols-3 gap-4">
        {loading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
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
          </>
        )}
      </section>

      {/* CREATE */}
      <section className="grid md:grid-cols-2 gap-6">
        <form onSubmit={onCreate} className="space-y-2 p-4 border rounded-lg">
          <h2 className="font-semibold text-lg">Crear autor</h2>

          <div>
            <input 
              name="name" 
              placeholder="Nombre" 
              className={`border p-2 w-full ${formErrors.name ? 'border-red-500' : ''}`}
              required 
            />
            {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
          </div>

          <div>
            <input 
              name="email" 
              placeholder="Email" 
              type="email"
              className={`border p-2 w-full ${formErrors.email ? 'border-red-500' : ''}`}
              required 
            />
            {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
          </div>

          <input name="bio" placeholder="Bio" className="border p-2 w-full" />

          <div className="grid grid-cols-2 gap-2">
            <input
              name="nationality"
              placeholder="Nacionalidad"
              className="border p-2 w-full"
            />
            <div>
              <input
                name="birthYear"
                placeholder="Año nacimiento"
                type="number"
                className={`border p-2 w-full ${formErrors.birthYear ? 'border-red-500' : ''}`}
              />
              {formErrors.birthYear && <p className="text-red-500 text-sm mt-1">{formErrors.birthYear}</p>}
            </div>
          </div>

          <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
            Crear
          </button>
        </form>

        {/* LIST */}
        <div className="p-4 border rounded-lg">
          <h2 className="font-semibold text-lg mb-3">Autores</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <AuthorCardSkeleton key={i} />
              ))}
            </div>
          ) : (
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
                      type="button"
                      onClick={() => onDelete(a.id, a.name)}
                      className="px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
