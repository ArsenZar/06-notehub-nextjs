// notes/page.tsx

import { getNotes } from "@/lib/api";
import NoteList from "@/components/NoteList/NoteList";

const Notes = async () => {
    const response = await getNotes();
    console.log(response);

    return (
        <section>
            <h1>Notes List</h1>
            {response?.notes?.length > 0 && <NoteList notes={response.notes} />}
        </section>
    );
}

export default Notes;
