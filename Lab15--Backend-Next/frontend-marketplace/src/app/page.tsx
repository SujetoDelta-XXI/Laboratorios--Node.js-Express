'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function Page() {
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

    const res = await fetch(url);
    const data: ApiResponse<Product[]> = await res.json();
    if (data.success) setProducts(data.data);
  };

  const fetchCategories = async () => {
    const res = await fetch(`${API_URL}/categories`);
    const data: ApiResponse<{ id: number; nombre: string }[]> = await res.json();
    if (data.success) setCategories(data.data);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6">Productos</h1>

      <div className="mb-6 flex gap-3 flex-wrap">
        <Link
          href="/"
          className={!categoryId ? 'font-bold text-blue-600' : ''}
        >
          Todas
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/?categoryId=${cat.id}`}
            className={
              categoryId === String(cat.id)
                ? 'font-bold text-blue-600'
                : ''
            }
          >
            {cat.nombre}
          </Link>
        ))}
      </div>

      {products.length === 0 && <p>No hay productos disponibles</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold">{product.nombre}</h2>
            <p>S/. {product.precio}</p>

            {product.Category && (
              <p className="text-sm text-gray-500">
                Categoría: {product.Category.nombre}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
