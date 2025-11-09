// app/books/page.tsx
import BooksClient from "./BooksClient";

export const revalidate = 300; // ✅ ISR cada 5 min (opcional)

async function getCatalogs(): Promise<{
    authors: { id: string; name: string }[];
    genres: string[];
}> {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? "";

    const [authorsRes, booksRes] = await Promise.all([
        fetch(`${base}/api/authors`, { next: { revalidate: 300 } }),
        fetch(`${base}/api/books`, { next: { revalidate: 300 } }),
    ]);

    if (!authorsRes.ok || !booksRes.ok) {
        throw new Error("Error al cargar catálogos");
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
}

export default async function BooksPage() {
    const { authors, genres } = await getCatalogs();

    return (
        <BooksClient initialAuthors={authors} initialGenres={genres} />
    );
}
