import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Avatar from '@/components/Avatar';
// Use plain <img> for profile image to avoid Next Image host validation in dev

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl text-gray-900 font-bold mb-4">
            Profile
          </h1>

          <div className="mb-6">
            <p className="text-gray-700 mb-2">
              Name: <span className="font-semibold">{session?.user?.name}</span>
            </p>
            <p className="text-gray-700 mb-2">
              Email: <span className="font-semibold">{session?.user?.email}</span>
            </p>

            {session?.user?.image ? (
              <div>
                <p className="text-gray-700 mb-2">Image Profile:</p>
                <Avatar src={session.user.image} alt="Profile" width={100} height={100} className="w-16 h-16 rounded-full mt-4 object-cover" />
              </div>
            ) : null}
          </div>

        </div>
      </div>
    </div>
  );
}
