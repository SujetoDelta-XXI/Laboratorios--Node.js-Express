"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", image: "" });
  const [error, setError] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error en el registro');
        setSubmitting(false);
        return;
      }

      // Auto-login after registration using credentials provider
      const signInResult = await fetch('/api/auth/callback/credentials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ email: form.email, password: form.password })
      });

      // If auto-login via credentials callback isn't available, redirect to signin.
      if (signInResult && signInResult.ok) {
        router.push('/dashboard');
      } else {
        router.push('/signin');
      }
    } catch (err: any) {
      setError(err?.message || 'Error al registrar');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 w-96 shadow rounded-lg"
      >
        <h1 className="text-xl mb-4 font-bold text-center text-black">Crear cuenta</h1>

        {error && <p className="text-red-600 text-center mb-2">{error}</p>}

        <input
          className="w-full border p-2 mb-3 text-black"
          placeholder="Nombre"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 mb-3 text-black"
          placeholder="URL de la imagen (opcional)"
          type="url"
          onChange={(e) => setForm({ ...form, image: e.target.value })}
        />

        <input
          className="w-full border p-2 mb-3 text-black"
          placeholder="Correo electrónico"
          type="email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />

        <input
          className="w-full border p-2 mb-4 text-black"
          placeholder="Contraseña"
          type="password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />

        <button className="w-full bg-black text-white p-2 rounded hover:bg-gray-800">
          Crear cuenta
        </button>

        <p className="text-center text-sm mt-4">
          ¿Ya tienes cuenta?{" "}
          <a href="/signin" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </form>
    </div>
  );
}
