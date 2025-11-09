// app/books/page.tsx
import BooksClient from "./BooksClient";

export const revalidate = 300; // ✅ ISR cada 5 min (opcional)
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

async function getCatalogs(): Promise<{
    authors: { id: string; name: string }[];
    genres: string[];
}> {
    try {
        const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

        const [authorsRes, booksRes] = await Promise.all([
            fetch(`${base}/api/authors`, { 
                next: { revalidate: 300 },
                cache: 'no-store'
            }),
            fetch(`${base}/api/books`, { 
                next: { revalidate: 300 },
                cache: 'no-store'
            }),
        ]);

        if (!authorsRes.ok || !booksRes.ok) {
            return { authors: [], genres: [] };
        }

        const authorsData = await authorsRes.json();
        const booksData = await booksRes.json();

        const genres: string[] = Array.from(
            new Set(
                booksData
                    .map((b: any) => b.genre as string | null)
                    .filter((g: string | null): g is string => Boolean(g))
            )
        );

        return {
            authors: authorsData.map((a: any) => ({
                id: a.id,
                name: a.name,
            })),
            genres,
        };
    } catch (error) {
        console.error('Error loading catalogs:', error);
        return { authors: [], genres: [] };
    }
}

export default async function BooksPage() {
    const { authors, genres } = await getCatalogs();

    return (
        <BooksClient initialAuthors={authors} initialGenres={genres} />
    );
}
