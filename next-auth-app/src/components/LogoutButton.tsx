'use client';

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/signin' })}
      className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-red-500 transition"
    >
      Cerrar Sesión
    </button>
  );
}
