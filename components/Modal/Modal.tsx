import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import NoteForm from "../NoteForm/NoteForm";
import { useEffect } from "react";
import type { Note } from "../../types/note";

interface ModalProps{
    onClose: () => void;
    setPage: (num: number) => void;
    editingNote?: Note;
}

export default function Modal({ onClose, setPage, editingNote }: ModalProps) {

    const closeClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        const escBtn = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener("keydown", escBtn);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", escBtn);
            document.body.style.overflow = "";
        }
    }, [onClose]);

    return createPortal(
        <div className={css.backdrop} role="dialog" aria-modal="true" onClick={closeClick}>
            <div className={ css.modal}>
                <NoteForm onClose={onClose} setPage={setPage} editingNote={editingNote} />
            </div>
        </div>,
    document.body
    )
}