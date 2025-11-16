"use client";

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { useEffect } from 'react';
import { useState } from 'react';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If user is already authenticated, redirect to dashboard immediately.
  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard');
    }
  }, [status, router]);

  const handleGoogleSignin = async () => {
    await signIn('google', {
      callbackUrl: '/dashboard',
    });
  }

  const handleGithubSignin = async () => {
    await signIn('github', {
      callbackUrl: '/dashboard',
    });
  }

  // While loading session, render nothing (avoid flash). If authenticated,
  // the effect will redirect. Only render the sign-in UI when unauthenticated.
  if (status === 'loading' || status === 'authenticated') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">
          Iniciar sesión
        </h1>

        <div className="flex flex-col gap-3">
          <button
            onClick={handleGoogleSignin}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGoogle />
            Continue with Google
          </button>

          <button
            onClick={handleGithubSignin}
            className="w-full bg-gray-800 text-white py-2 px-4 rounded hover:bg-black transition flex items-center justify-center gap-2"
          >
            <FaGithub />
            Continue with GitHub
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3 text-black">O inicia sesión con correo</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = new FormData(e.currentTarget as HTMLFormElement);
              const email = String(form.get('email') || '').trim();
              const password = String(form.get('password') || '');

              // Use NextAuth's full redirect behavior so the server has the
              // session cookie available when rendering server components.
              await signIn('credentials', {
                callbackUrl: '/dashboard',
                email,
                password,
              } as any);
            }}
          >
            <input
              name="email"
              type="email"
              placeholder="Correo electrónico"
              className="w-full border p-2 mb-2 text-black"
              required
            />
            <input
              name="password"
              type="password"
              placeholder="Contraseña"
              className="w-full border p-2 mb-3 text-black"
              required
            />
            <button className="w-full bg-blue-600 text-white p-2 rounded">
              Iniciar sesión con credenciales
            </button>
          </form>
        </div>
        <p className="text-center text-sm mt-4 text-black">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Crear cuenta
          </a>
        </p>
      </div>
    </div>
  );
}
