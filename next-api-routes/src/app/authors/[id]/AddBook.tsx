"use client";

import { useRouter } from "next/navigation";

export default function AddBook({ authorId }: { authorId: string }) {
  const router = useRouter();

  const add = async () => {
    const title = prompt("Título:");
    if (!title) return;

    const res = await fetch("/api/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, authorId }),
    });

    if (res.ok) router.refresh();
    else alert("Error creando libro");
  };

  return (
    <button onClick={add} className="px-3 py-2 bg-indigo-600 text-white rounded">
      Agregar libro
    </button>
  );
}
