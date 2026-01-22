import {
    QueryClient,
    HydrationBoundary,
    dehydrate
} from "@tanstack/react-query";
import { fetchNotes } from "@/lib/api";
import NotesClient from "./Notes.client";

export default async function NotesPage() {
    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({
        queryKey: ["notes", 1, undefined],
        queryFn: () => fetchNotes(1, undefined),
    });

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <NotesClient />
        </HydrationBoundary>
    );
}
