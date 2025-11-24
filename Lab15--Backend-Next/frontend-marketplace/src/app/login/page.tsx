"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
console.log('API_URL', API_URL);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/auth/me`, { credentials: 'include' });
        if (res.ok) {
          const ct = res.headers.get('content-type') || '';
          if (ct.includes('application/json')) {
            const data = await res.json();
            if (data && data.user) router.push('/');
          } else {
            console.warn('/auth/me returned non-json response, skipping redirect', ct);
          }
        }
      } catch (err) {}
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        console.error('Login: unexpected content-type', ct, text);
        return setError('Respuesta inesperada del servidor');
      }

      const data = await res.json();

      if (!res.ok) return setError(data.error || 'Error en login');

      if (data.user && data.user.role) {
        localStorage.setItem('role', data.user.role);
        window.dispatchEvent(new CustomEvent('authChanged', { detail: { role: data.user.role } }));
      }

      router.refresh();
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Error en servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6 text-black">Iniciar sesión</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-black">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ingrese su email"
            className="w-full px-3 py-2 border rounded text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-black">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingrese su contraseña"
            className="w-full px-3 py-2 border rounded text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {error && (
          <div className="text-red-600 font-medium">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gray-900 text-white py-2 rounded hover:bg-black transition"
        >
          Ingresar
        </button>
      </form>
    </div>
  );
}
