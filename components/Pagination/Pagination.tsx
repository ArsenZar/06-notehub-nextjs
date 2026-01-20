import css from "./Pagination.module.css";
import ReactPaginate from "react-paginate";

interface PaginationProps{
    totalPages: number;
    page: number;
    setPage: (num: number) => void;
}

export default function Pagination({ totalPages, page, setPage }: PaginationProps) {

    return (
        <ReactPaginate
            className={css.pagination}
            pageCount={totalPages}
            onPageChange={({ selected }) => setPage(selected + 1)}
            forcePage={page - 1}
            activeClassName={css.selected}
            nextLabel="→"
            previousLabel="←"
        />
    )
}