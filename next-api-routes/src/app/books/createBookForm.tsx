"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateBookFormProps = {
  authors: any[];
  onSuccess?: () => void;
};

export default function CreateBookForm({ authors, onSuccess }: CreateBookFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [authorId, setAuthorId] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, authorId }),
    });

    if (res.ok) {
      setTitle("");
      setAuthorId("");
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }
    } else alert("Error al crear libro");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <h2 className="font-semibold">Crear libro</h2>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Título"
        className="border p-2 w-full"
      />

      <select
        value={authorId}
        onChange={(e) => setAuthorId(e.target.value)}
        className="border p-2 w-full"
      >
        <option value="">Seleccione autor</option>
        {authors.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
      </select>

      <button className="px-3 py-2 bg-blue-600 text-white rounded">
        Crear
      </button>
    </form>
  );
}
