import { Suspense } from 'react';
import ProductsClient from '@/components/ProductsClient';

export default function Page() {
  return (
    <Suspense fallback={<p className="text-center py-10">Cargando productos...</p>}>
      <ProductsClient />
    </Suspense>
  );
}
