"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/lib/toast";
import { useState } from "react";

export default function EditAuthor({ author }: { author: any }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function onSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = e.currentTarget as HTMLFormElement & {
      name: { value: string };
      email: { value: string };
      bio: { value: string };
      nationality: { value: string };
      birthYear: { value: string };
    };

    // Validación
    const validationErrors: Record<string, string> = {};
    
    if (!form.name.value.trim()) {
      validationErrors.name = "El nombre es requerido";
    }
    
    if (!form.email.value.trim()) {
      validationErrors.email = "El email es requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.value)) {
      validationErrors.email = "Email inválido";
    }
    
    if (form.birthYear.value && (isNaN(Number(form.birthYear.value)) || Number(form.birthYear.value) < 1000 || Number(form.birthYear.value) > new Date().getFullYear())) {
      validationErrors.birthYear = "Año inválido";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
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

    const res = await fetch(`/api/authors/${author.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      router.refresh();
      showToast("Autor actualizado exitosamente", "success");
    } else {
      showToast("Error al actualizar autor", "error");
    }
  }

  return (
    <form onSubmit={onSave} className="p-4 border rounded space-y-2">
      <h2 className="font-semibold text-lg">Editar autor</h2>

      <div>
        <input 
          name="name" 
          defaultValue={author.name} 
          placeholder="Nombre"
          className={`border p-2 w-full ${errors.name ? 'border-red-500' : ''}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      <div>
        <input 
          name="email" 
          defaultValue={author.email} 
          type="email"
          placeholder="Email"
          className={`border p-2 w-full ${errors.email ? 'border-red-500' : ''}`}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
      </div>

      <input 
        name="bio" 
        defaultValue={author.bio ?? ""} 
        placeholder="Bio"
        className="border p-2 w-full" 
      />

      <div className="grid grid-cols-2 gap-2">
        <input 
          name="nationality" 
          defaultValue={author.nationality ?? ""} 
          placeholder="Nacionalidad"
          className="border p-2" 
        />
        <div>
          <input 
            name="birthYear" 
            defaultValue={author.birthYear ?? ""} 
            type="number"
            placeholder="Año nacimiento"
            className={`border p-2 w-full ${errors.birthYear ? 'border-red-500' : ''}`}
          />
          {errors.birthYear && <p className="text-red-500 text-sm mt-1">{errors.birthYear}</p>}
        </div>
      </div>

      <button type="submit" className="px-3 py-2 bg-blue-600 text-white rounded">
        Guardar cambios
      </button>
    </form>
  );
}
