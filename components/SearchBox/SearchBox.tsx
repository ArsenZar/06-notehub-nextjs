import css from "./SearchBox.module.css";

interface SearchBoxProps{
    value: string | undefined;
    enterInput: (value: string) => void;
    setInput: (value: string) => void;
}
export default function SearchBox({ value, enterInput, setInput }: SearchBoxProps) {

    return (
        <input
            className={css.input}
            type="text"
            placeholder="Search notes"
            value={value}
            onChange={(e) => {
                setInput(e.target.value);
                enterInput(e.target.value);
            }}
        />

    )
    
}