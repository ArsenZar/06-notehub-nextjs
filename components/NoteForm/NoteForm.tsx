import css from "./NoteForm.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote, editNote } from "@/lib/api";
import type { Note } from "@/types/note";
import { useEffect } from "react";

interface NoteFormProps {
    onClose: () => void;
    setPage: (num: number) => void;
    editingNote?: Note;
}

export default function NoteForm({ onClose, setPage, editingNote }: NoteFormProps) {

    useEffect(() => {
        console.log(editingNote);
    }, [editingNote]);

    const queryClient = useQueryClient();

    const mutationCreate = useMutation({
        mutationFn: createNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
            setPage(1);
        },
    });

    const mutationEdit = useMutation({
        mutationFn: editNote,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["notes"] });
            onClose();
        },
    });


    const NoteSchema = Yup.object({
        title: Yup.string()
            .min(3, "Min 3 chars")
            .max(50, "Max 50 chars")
            .required("Required"),

        content: Yup.string()
            .max(500, "Max 500 chars"),

        tag: Yup.mixed<'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping'>()
            .oneOf(["Todo", "Work", "Personal", "Meeting", "Shopping"])
            .required("Required"),
    });


    return (
        <Formik
            initialValues={{ title: editingNote?.title || "", content: editingNote?.content || "", tag: editingNote?.tag || "Todo" }}
            validationSchema={NoteSchema}
            onSubmit={
                (values, actions) => {
                    if (editingNote) {
                        mutationEdit.mutate({ id: editingNote.id, ...values });
                    } else {
                        mutationCreate.mutate(values);
                    }

                    actions.resetForm();
                }
            }
        >
            <Form className={css.form} >
                <div className={css.formGroup}>
                    <label htmlFor="title">Title</label>
                    <Field id="title" type="text" name="title" className={css.input} />
                    <ErrorMessage name="title">
                        {msg => <span className={css.error}>{msg}</span>}
                    </ErrorMessage>
                </div>

                <div className={css.formGroup}>
                    <label htmlFor="content">Content</label>
                    <Field
                        as="textarea"
                        id="content"
                        name="content"
                        rows={8}
                        className={css.textarea}
                    />
                    <ErrorMessage name="content">
                        {msg => <span className={css.error}>{msg}</span>}
                    </ErrorMessage>

                </div>

                <div className={css.formGroup}>
                    <label htmlFor="tag">Tag</label>
                    <Field as="select" id="tag" name="tag" className={css.select}>
                        <option value="Todo">Todo</option>
                        <option value="Work">Work</option>
                        <option value="Personal">Personal</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Shopping">Shopping</option>
                    </Field>
                    <ErrorMessage name="tag">
                        {msg => <span className={css.error}>{msg}</span>}
                    </ErrorMessage>
                </div>

                <div className={css.actions}>
                    <button
                        type="button"
                        className={css.cancelButton}
                        onClick={() => onClose()}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className={css.submitButton}
                        disabled={mutationCreate.isPending || mutationEdit.isPending}
                    >
                        {mutationCreate.isPending ? "Creating..." : (editingNote ? "Save changes" : "Create note")}
                    </button>

                </div>
            </Form >
        </Formik>
    )
}