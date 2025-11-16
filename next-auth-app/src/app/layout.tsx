import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
// Use a plain <img> for avatars to avoid next/image host validation during dev
import Avatar from "@/components/Avatar";
import Provider from "@/components/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Next Auth App",
  description: "My Next Auth App",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  console.log("SESSION:", session);

  const fallbackAvatar = "data:image/svg+xml;utf8," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><rect width="100%" height="100%" fill="#e5e7eb" rx="6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#9ca3af" font-size="10">User</text></svg>'
  );

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <nav className="w-full bg-black shadow-sm text-white">
          <div className="mx-auto px-4 py-4 flex items-center justify-between">
            
            {/* LOGO */}
            <Link href="/" className="text-xl font-semibold text-white">
              MyAuthApp
            </Link>

            {/* NAV LINKS */}
            <ul className="flex items-center justify-center gap-6 text-sm text-white">

              {session?.user && (
                <li>
                  <Link href="/dashboard" className="text-white hover:text-gray-300">
                    Dashboard
                  </Link>
                </li>
              )}

              {session?.user && (
                <li>
                  <Link href="/profile" className="text-white hover:text-gray-300">
                    Profile
                  </Link>
                </li>
              )}

              {/* Logout Button */}
              {session?.user && (
                <li>
                  <LogoutButton />
                </li>
              )}

              {/* Avatar */}
                    {session?.user?.image ? (
                      <li>
                        <Avatar src={session.user.image} alt="Profile" width={40} height={40} className="rounded-full mr-2" />
                      </li>
                    ) : (
                      <li>
                        <Avatar src={null} alt="Profile" width={40} height={40} className="rounded-full mr-2" />
                      </li>
                    )}
            </ul>
          </div>
        </nav>

        {/* PROVIDER CLIENT SIDE */}
        <Provider>
          <main>{children}</main>
        </Provider>
      </body>
    </html>
  );
}
