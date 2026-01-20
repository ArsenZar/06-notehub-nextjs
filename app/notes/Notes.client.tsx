'use client';

import { useState } from "react";
import { fetchNotes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useDebouncedCallback } from "use-debounce";
import Modal from "@/components/Modal/Modal";
import css from "./page.module.css";
import SearchBox from "@/components/SearchBox/SearchBox";
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";


export default function NotesClient() {

    const [page, setPage] = useState(1);
    const [search, setSearch] = useState<string | undefined>();
    const [input, setInput] = useState<string | undefined>("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    }
    const closeModal = () => {
        setIsModalOpen(false);
    }

    const { data, isLoading, isFetching, isError } = useQuery({
        queryKey: ["notes", page, search],
        queryFn: () => fetchNotes(page, search),
        placeholderData: prev => prev
    });

    const notes = data?.notes;
    const totalPages = data?.totalPages ?? 0;

    const enterInput = useDebouncedCallback((value: string) => {
        setSearch(value.trim() || undefined);
        setPage(1);
    }, 300);

    return (
        <>
            <div className={css.app}>
                <header className={css.toolbar}>
                    <SearchBox value={input} enterInput={enterInput} setInput={setInput} />
                    {totalPages > 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage} />}
                    <button className={css.button} onClick={openModal}>Create note +</button>
                </header>
            </div>

            {(isLoading || isFetching) && <p className={css.loading}>Loading...</p>}
            {isError && <p>Error...</p>}

            {notes && notes?.length > 0 && <NoteList notes={notes} />}

            {isModalOpen && <Modal onClose={closeModal} setPage={setPage} />}
        </>
    );
}
