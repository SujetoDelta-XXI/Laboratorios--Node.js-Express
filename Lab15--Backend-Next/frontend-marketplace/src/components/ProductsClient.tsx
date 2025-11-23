'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function ProductsClient() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get('categoryId') || undefined;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{ id: number; nombre: string }[]>([]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [categoryId]);

  const fetchProducts = async () => {
    const url = categoryId
      ? `${API_URL}/products?categoryId=${categoryId}`
      : `${API_URL}/products`;

    const res = await fetch(url, { cache: 'no-store' });
    const data: ApiResponse<Product[]> = await res.json();

    if (data.success) setProducts(data.data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`, { cache: 'no-store' });
    const data: ApiResponse<{ id: number; nombre: string }[]> = await res.json();

    if (data.success) setCategories(data.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 text-black">Productos</h1>

      {/* FILTRO POR CATEGORÍAS */}
      <div className="mb-6 flex gap-4 flex-wrap">
        <Link
          href="/"
          className={`px-3 py-1 rounded ${
            !categoryId ? 'bg-black text-white' : 'bg-gray-200 text-black'
          }`}
        >
          Todas
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?categoryId=${cat.id}`}
            className={`px-3 py-1 rounded ${
              categoryId === String(cat.id)
                ? 'bg-black text-white'
                : 'bg-gray-200 text-black'
            }`}
          >
            {cat.nombre}
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="text-gray-500">No hay productos disponibles</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition"
          >
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.nombre}
                className="w-full h-48 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded mb-4 flex items-center justify-center text-sm text-gray-400">
                Sin imagen
              </div>
            )}

            <h2 className="font-semibold text-lg text-black">
              {product.nombre}
            </h2>

            <p className="mt-1 text-base font-bold text-black">
              S/. {product.precio}
            </p>

            {product.Category && (
              <p className="mt-2 text-sm text-gray-600">
                Categoría: {product.Category.nombre}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
