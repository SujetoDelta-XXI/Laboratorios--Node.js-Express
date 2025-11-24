"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ApiResponse } from '@/types/product';
import { Category } from '@/types/category';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    CategoryId: '',
    imageUrl: '',
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    (async () => {
      const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
      if (role !== 'ADMIN') {
        // try to refresh role from server (/auth/me)
        try {
          const token = localStorage.getItem('token');
          if (!token) { router.push('/login'); return; }
          const res = await fetch(`${API_URL}/auth/me`, { headers: { Authorization: `Bearer ${token}` } });
          if (res.ok) {
            const d = await res.json();
            if (d.user && d.user.role) {
              localStorage.setItem('role', d.user.role);
              if (d.user.role !== 'ADMIN') {
                router.push('/login');
                return;
              }
            } else {
              router.push('/login');
              return;
            }
          } else {
            router.push('/login');
            return;
          }
        } catch (err) {
          router.push('/login');
          return;
        }
      }
      await fetchProducts();
      await fetchCategories();
    })();
  }, []);

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryForm, setCategoryForm] = useState({ nombre: '' });
  const [categoryEditingId, setCategoryEditingId] = useState<number | null>(null);

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers: Record<string, string> | undefined = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await fetch(`${API_URL}/products`, headers ? { headers } : undefined);
      const data: ApiResponse<Product[]> = await res.json();
      if (data && data.success) setProducts(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const data: ApiResponse<Category[]> = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error('Error al obtener categorías:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editingId
      ? `${API_URL}/products/${editingId}`
      : `${API_URL}/products`;

    const method = editingId ? 'PUT' : 'POST';

    try {
      const token = localStorage.getItem('token');
      const headersObj: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headersObj['Authorization'] = `Bearer ${token}`;
      const res = await fetch(url, {
        method,
        headers: headersObj,
        body: JSON.stringify({
          nombre: formData.nombre,
          precio: parseFloat(formData.precio),
          descripcion: formData.descripcion || undefined,
          imageUrl: formData.imageUrl || undefined,
          CategoryId: formData.CategoryId ? parseInt(formData.CategoryId) : undefined,
        }),
      });

      if (res.ok) {
        setFormData({ nombre: '', precio: '', descripcion: '', CategoryId: '', imageUrl: '' });
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({
      nombre: product.nombre,
      precio: product.precio.toString(),
      descripcion: product.descripcion || '',
      CategoryId: product.CategoryId ? product.CategoryId.toString() : '',
      imageUrl: product.imageUrl || '',
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Estás seguro?')) return;

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) fetchProducts();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ nombre: '', precio: '', descripcion: '', CategoryId: '', imageUrl: '' });
    setEditingId(null);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.nombre) return;

    try {
      const url = categoryEditingId ? `${API_URL}/categories/${categoryEditingId}` : `${API_URL}/categories`;
      const method = categoryEditingId ? 'PUT' : 'POST';

      const token = localStorage.getItem('token');
      const headersObj: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) headersObj['Authorization'] = `Bearer ${token}`;
      const res = await fetch(url, {
        method,
        headers: headersObj,
        body: JSON.stringify({ nombre: categoryForm.nombre }),
      });

      if (res.ok) {
        setCategoryForm({ nombre: '' });
        setCategoryEditingId(null);
        fetchCategories();
      }
    } catch (error) {
      console.error('Error al crear/actualizar categoría:', error);
    }
  };

  const handleCategoryEdit = (cat: Category) => {
    setCategoryForm({ nombre: cat.nombre });
    setCategoryEditingId(cat.id);
  };

  const handleCategoryCancel = () => {
    setCategoryForm({ nombre: '' });
    setCategoryEditingId(null);
  };

  const handleCategoryDelete = async (id: number) => {
    try {
      // obtener cantidad de productos asociados para advertir al usuario
      const resProducts = await fetch(`${API_URL}/products?categoryId=${id}`);
      const data = await resProducts.json();
      const count = Array.isArray(data.data) ? data.data.length : 0;

      const ok = confirm(`Se eliminarán ${count} producto(s) asociados a esta categoría. ¿Deseas continuar?`);
      if (!ok) return;

      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE', headers: token ? { Authorization: `Bearer ${token}` } : {} });
      if (res.ok) {
        fetchCategories();
        fetchProducts();
      }
    } catch (error) {
      console.error('Error al eliminar categoría:', error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center text-gray-500">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Administración de Productos
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{categoryEditingId ? 'Editar Categoría' : 'Crear Categoría'}</h2>
            <form onSubmit={handleCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  value={categoryForm.nombre}
                  onChange={(e) => setCategoryForm({ nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex-1 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors">{categoryEditingId ? 'Actualizar' : 'Crear'}</button>
                {categoryEditingId && (
                  <button type="button" onClick={handleCategoryCancel} className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600">Cancelar</button>
                )}
              </div>
            </form>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? 'Editar Producto' : 'Crear Producto'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  required
                  value={formData.nombre}
                  onChange={(e) =>
                    setFormData({ ...formData, nombre: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.precio}
                  onChange={(e) =>
                    setFormData({ ...formData, precio: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Imagen (URL)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.descripcion}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      descripcion: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría (opcional)
                </label>
                <select
                  value={formData.CategoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, CategoryId: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-900"
                >
                  <option value="">-- Sin categoría --</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-gray-900 text-white py-2 rounded-md hover:bg-gray-800 transition-colors"
                >
                  {editingId ? 'Actualizar' : 'Crear'}
                </button>

                {editingId && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-gray-600"
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Imagen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Precio
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.nombre} className="w-16 h-16 object-cover rounded" />
                      ) : (
                        <div className="w-16 h-16 bg-gray-100 flex items-center justify-center text-xs text-gray-400">No imagen</div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {product.nombre}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      S/. {product.precio}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => handleEdit(product)}
                        className="text-gray-600 hover:text-gray-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Categorías</h3>
            </div>
            <div className="p-6">
              {categories.length === 0 ? (
                <div className="text-sm text-gray-500">No hay categorías</div>
              ) : (
                <table className="min-w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {categories.map((cat) => (
                      <tr key={cat.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{cat.nombre}</td>
                        <td className="px-6 py-4 text-sm text-right">
                          <button onClick={() => handleCategoryEdit(cat)} className="text-gray-600 hover:text-gray-900 mr-4">Editar</button>
                          <button onClick={() => handleCategoryDelete(cat.id)} className="text-red-600 hover:text-red-800">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
