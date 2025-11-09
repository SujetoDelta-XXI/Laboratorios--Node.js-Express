// app/books/page.tsx
import BooksClient from "./BooksClient";
import { prisma } from "@/lib/prisma";

export const revalidate = 300; // ✅ ISR cada 5 min (opcional)
export const dynamic = 'force-dynamic'; // Forzar renderizado dinámico

async function getCatalogs(): Promise<{
    authors: { id: string; name: string }[];
    genres: string[];
}> {
    try {
        const [authors, books] = await Promise.all([
            prisma.author.findMany({
                select: {
                    id: true,
                    name: true,
                },
                orderBy: { name: 'asc' }
            }),
            prisma.book.findMany({
                select: {
                    genre: true,
                },
                where: {
                    genre: { not: null }
                }
            })
        ]);

        const genres: string[] = Array.from(
            new Set(
                books
                    .map((b) => b.genre as string | null)
                    .filter((g: string | null): g is string => Boolean(g))
            )
        ).sort();

        return {
            authors,
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
