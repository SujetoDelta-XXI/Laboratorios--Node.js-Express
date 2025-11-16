import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-gray-900 font-bold mb-4">
            Dashboard
          </h1>
          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Bienvenido, <span className="font-semibold">{session?.user?.name}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}