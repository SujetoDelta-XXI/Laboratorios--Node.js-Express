"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/lib/toast";

type CreateBookFormProps = {
  authors: any[];
  onSuccess?: () => void;
};

export default function CreateBookForm({ authors, onSuccess }: CreateBookFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isbn: "",
    publishedYear: "",
    genre: "",
    pages: "",
    authorId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    // Validación
    const validationErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      validationErrors.title = "El título es requerido";
    }
    
    if (!formData.description.trim()) {
      validationErrors.description = "La descripción es requerida";
    }
    
    if (!formData.isbn.trim()) {
      validationErrors.isbn = "El ISBN es requerido";
    }
    
    if (!formData.publishedYear) {
      validationErrors.publishedYear = "El año de publicación es requerido";
    } else {
      const year = Number(formData.publishedYear);
      if (isNaN(year) || year < 1000 || year > new Date().getFullYear()) {
        validationErrors.publishedYear = "Año inválido";
      }
    }
    
    if (!formData.genre.trim()) {
      validationErrors.genre = "El género es requerido";
    }
    
    if (!formData.pages) {
      validationErrors.pages = "El número de páginas es requerido";
    } else {
      const pages = Number(formData.pages);
      if (isNaN(pages) || pages < 1) {
        validationErrors.pages = "Número de páginas inválido";
      }
    }
    
    if (!formData.authorId) {
      validationErrors.authorId = "Debes seleccionar un autor";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast("Por favor completa todos los campos correctamente", "error");
      return;
    }

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: formData.title,
        description: formData.description,
        isbn: formData.isbn,
        publishedYear: Number(formData.publishedYear),
        genre: formData.genre,
        pages: Number(formData.pages),
        authorId: formData.authorId,
      }),
    });

    if (res.ok) {
      setFormData({
        title: "",
        description: "",
        isbn: "",
        publishedYear: "",
        genre: "",
        pages: "",
        authorId: "",
      });
      router.refresh();
      showToast("Libro creado exitosamente", "success");
      if (onSuccess) {
        onSuccess();
      }
    } else {
      showToast("Error al crear libro", "error");
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3 p-4 border rounded-lg">
      <h2 className="font-semibold text-lg">Crear libro</h2>

      <div>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Título"
          className={`border p-2 w-full rounded ${errors.title ? 'border-red-500' : ''}`}
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      <div>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción"
          rows={3}
          className={`border p-2 w-full rounded ${errors.description ? 'border-red-500' : ''}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            placeholder="ISBN"
            className={`border p-2 w-full rounded ${errors.isbn ? 'border-red-500' : ''}`}
          />
          {errors.isbn && <p className="text-red-500 text-sm mt-1">{errors.isbn}</p>}
        </div>

        <div>
          <input
            name="publishedYear"
            type="number"
            value={formData.publishedYear}
            onChange={handleChange}
            placeholder="Año de publicación"
            className={`border p-2 w-full rounded ${errors.publishedYear ? 'border-red-500' : ''}`}
          />
          {errors.publishedYear && <p className="text-red-500 text-sm mt-1">{errors.publishedYear}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            name="genre"
            value={formData.genre}
            onChange={handleChange}
            placeholder="Género"
            className={`border p-2 w-full rounded ${errors.genre ? 'border-red-500' : ''}`}
          />
          {errors.genre && <p className="text-red-500 text-sm mt-1">{errors.genre}</p>}
        </div>

        <div>
          <input
            name="pages"
            type="number"
            value={formData.pages}
            onChange={handleChange}
            placeholder="Número de páginas"
            className={`border p-2 w-full rounded ${errors.pages ? 'border-red-500' : ''}`}
          />
          {errors.pages && <p className="text-red-500 text-sm mt-1">{errors.pages}</p>}
        </div>
      </div>

      <div>
        <select
          name="authorId"
          value={formData.authorId}
          onChange={handleChange}
          className={`border p-2 w-full rounded ${errors.authorId ? 'border-red-500' : ''}`}
          aria-label="Seleccionar autor"
        >
          <option value="">Seleccione autor</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>
        {errors.authorId && <p className="text-red-500 text-sm mt-1">{errors.authorId}</p>}
      </div>

      <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
        Crear libro
      </button>
    </form>
  );
}
