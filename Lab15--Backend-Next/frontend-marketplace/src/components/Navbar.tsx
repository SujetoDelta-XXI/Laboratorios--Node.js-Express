"use client";

import Link from 'next/link';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // prefer server-side cookie -> call /auth/me to refresh role, fallback to localStorage
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setRole(localStorage.getItem('role'));
          return;
        }
        const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const d = await res.json();
          if (d.user && d.user.role) {
            setRole(d.user.role);
            localStorage.setItem('role', d.user.role);
            return;
          }
        }
      } catch (err) {
        // ignore
      }
      // fallback
      setRole(localStorage.getItem('role'));
    };
    fetchMe();

    // listen for auth changes from other parts of the app (login/register/logout)
    const onAuthChanged = (e: any) => {
      try {
        const newRole = e && e.detail && e.detail.role ? e.detail.role : null;
        setRole(newRole);
        if (newRole) localStorage.setItem('role', newRole); else localStorage.removeItem('role');
      } catch (err) {
        setRole(localStorage.getItem('role'));
      }
    };
    window.addEventListener('authChanged', onAuthChanged as EventListener);
    return () => window.removeEventListener('authChanged', onAuthChanged as EventListener);
  }, []);

  const handleLogout = () => {
    // call backend to clear cookie then clear role
    (async () => {
      // No server-side cookie to clear: remove token locally
      setRole(null);
      localStorage.removeItem('role');
      localStorage.removeItem('token');
      try { window.dispatchEvent(new CustomEvent('authChanged', { detail: { role: null } })); } catch(e){}
      try { router.refresh(); } catch(e) {}
      router.push('/login');
    })();
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
            {role === 'ADMIN' && (
              <Link href="/admin" className="text-gray-600 hover:text-gray-900 transition-colors">
                Admin
              </Link>
            )}
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
