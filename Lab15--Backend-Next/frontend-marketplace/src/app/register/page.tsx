"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function RegisterPage() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error || 'Error en registro');
      // Don't store token (httpOnly cookie). Store role for UI
      if (data.user && data.user.role) localStorage.setItem('role', data.user.role);
      router.push('/');
    } catch (err) {
      console.error(err);
      setError('Error en servidor');
    }
  };

  return (
    <div className="max-w-md mx-auto py-16">
      <h1 className="text-2xl font-bold mb-6">Registro</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Nombre</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 border rounded" />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div>
          <button className="w-full bg-gray-900 text-white py-2 rounded">Crear cuenta</button>
        </div>
      </form>
    </div>
  );
}
