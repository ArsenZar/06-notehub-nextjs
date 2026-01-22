// lib/api.ts

import axios from "axios";
import type { Note, CreateNote } from "@/types/note";

const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

interface FetchNotesResponse {
    notes: Note[];
    totalPages: number;
}

export const api = axios.create({
    baseURL: "https://notehub-public.goit.study/api",
    headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    },
});

export const getSingleNote = async (id: string) => {
    const res = await api.get<Note>(`/notes/${id}`);
    return res.data;
};



export type NoteListResponse = {
    notes: Note[];
    total: number;
};

export const getNotes = async () => {
    const res = await axios.get<NoteListResponse>("/notes");
    return res.data;
};

export const editNote = async ({ id, title, content, tag }: Note): Promise<Note> => {
    const res = await axios.patch<Note>(
        `https://notehub-public.goit.study/api/notes/${id}`,
        {
            title: title,
            content: content,
            tag: tag
        },
        {
            headers: {
                Authorization: `Bearer ${myKey}`,
            },
        }
    );

    return res.data;
};

export const createNote = async (note: CreateNote): Promise<Note> => {
    const res = await axios.post<Note>(
        "https://notehub-public.goit.study/api/notes",
        note,
        {
            headers: {
                Authorization: `Bearer ${myKey}`,
            },
        }
    );

    return res.data;
};

export const deleteNote = async (noteId: Note["id"]): Promise<Note> => {
    const res = await axios.delete<Note>(
        `https://notehub-public.goit.study/api/notes/${noteId}`,

        {
            headers: {
                Authorization: `Bearer ${myKey}`,
            },
        }
    );

    return res.data;
};

export async function fetchNotes(page: number, search?: string): Promise<FetchNotesResponse> {

    const option = {
        params: {
            search,
            page,
            perPage: 12
        },
        headers: {
            Authorization: `Bearer ${myKey}`
        }
    }

    const res = await axios.get<FetchNotesResponse>('https://notehub-public.goit.study/api/notes', option);

    return res.data;
}