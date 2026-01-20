import type { Note } from "@/types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "@/lib/api";
import css from "./NoteList.module.css";
import { useState } from "react";

interface NoteListProps {
    notes: Note[];
    openModal: () => void;
    setEditingNote: (note: Note) => void;
}

export default function NoteList({ notes, openModal, setEditingNote }: NoteListProps) {

    const [deletedId, setDeletedId] = useState<string | null>(null);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: deleteNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            setDeletedId(null);
        },
    });

    const editModal = (note: Note) => {
        openModal();
        setEditingNote(note);
    };

    return (
        <ul className={css.list}>
            {
                notes?.map((note) => (
                    <li onClick={() => { editModal(note) }} className={css.listItem} key={note.id}>
                        <h2 className={css.title}>{note.title}</h2>
                        <p className={css.content}>{note.content}</p>
                        <div className={css.footer}>
                            <span className={css.tag}>{note.tag}</span>
                            <button className={css.button} onClick={(e) => {
                                e.stopPropagation();
                                setDeletedId(note.id);
                                mutation.mutate(note.id);
                            }}
                            >
                                {deletedId === note.id ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </li>
                ))
            }
        </ul>
    )
}