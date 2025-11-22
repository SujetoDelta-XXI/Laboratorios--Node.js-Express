"use client";

import { useState } from 'react';
import Link from 'next/link';
import { personalInfo } from '@/lib/data';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-gray-900 font-display">
            {personalInfo.name}
          </Link>

          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
            aria-label="Abrir menú"
            aria-expanded={open ? 'true' : 'false'}
            onClick={() => setOpen((s) => !s)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
            </svg>
          </button>

          <ul
            className={`
              ${open ? 'flex flex-col absolute top-full left-0 right-0 bg-white shadow-md p-4 z-40' : 'hidden'}
              md:flex md:gap-6 md:items-center md:static md:p-0 md:shadow-none
            `}
          >
            <li>
              <Link href="/" className="text-gray-700 hover:text-blue-600 transition block" onClick={() => setOpen(false)}>
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition block" onClick={() => setOpen(false)}>
                Proyectos
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 transition block" onClick={() => setOpen(false)}>
                Sobre Mí
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 transition block" onClick={() => setOpen(false)}>
                Contacto
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
