"use client";

import { useRouter } from "next/navigation";

export default function EditAuthor({ author }: { author: any }) {
  const router = useRouter();

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
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

    await fetch(`/api/authors/${author.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    router.refresh();
  }

  return (
    <form onSubmit={onSave} className="p-4 border rounded space-y-2">
      <h2 className="font-semibold text-lg">Editar autor</h2>

      <input name="name" defaultValue={author.name} className="border p-2 w-full" />
      <input name="email" defaultValue={author.email} className="border p-2 w-full" />
      <input name="bio" defaultValue={author.bio ?? ""} className="border p-2 w-full" />

      <div className="grid grid-cols-2 gap-2">
        <input name="nationality" defaultValue={author.nationality ?? ""} className="border p-2" />
        <input name="birthYear" defaultValue={author.birthYear ?? ""} className="border p-2" />
      </div>

      <button className="px-3 py-2 bg-blue-600 text-white rounded">
        Guardar cambios
      </button>
    </form>
  );
}
