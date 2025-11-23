"use client";

import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setRole(localStorage.getItem('role'));
  }, []);

  const handleLogout = () => {
    // call backend to clear cookie then clear role
    fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' }).finally(() => {
      localStorage.removeItem('role');
      router.push('/login');
    });
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-semibold text-gray-900">
            Productos
          </Link>

          <div className="flex gap-6 items-center">
            <Link href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
              Productos
            </Link>
            <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
              Admin
            </Link>
            {role ? (
              <button onClick={handleLogout} className="text-gray-600 hover:text-gray-900">Cerrar sesión</button>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-gray-900">Ingresar</Link>
                <Link href="/register" className="text-gray-600 hover:text-gray-900">Registrar</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
