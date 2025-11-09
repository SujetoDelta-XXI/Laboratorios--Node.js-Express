"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";

export default function DeleteBookButton({ bookId, bookTitle }: { bookId: string; bookTitle: string }) {
  const router = useRouter();
  const { showToast } = useToast();

  async function handleDelete() {
    if (!confirm(`¿Estás seguro de eliminar "${bookTitle}"?`)) return;

    const res = await fetch(`/api/books/${bookId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      showToast("Libro eliminado exitosamente", "success");
      router.push("/books");
    } else {
      showToast("Error al eliminar libro", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
    >
      Eliminar Libro
    </button>
  );
}
