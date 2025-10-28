import ReactPaginate from "react-paginate";
import styles from "./styles/Pagination.module.css";

const Pagination = ({ pageCount, currentPage, setCurrentPage }) => {
    return (
        <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            breakLabel="..."
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={(data) => {
                setCurrentPage(data.selected + 1);
            }}
            containerClassName={"d-flex a-center"}
            pageClassName={styles.pageItem}
            pageLinkClassName={styles.pageLink}
            // previousClassName={styles.prevItem}
            previousLinkClassName={styles.prevLink}
            nextClassName="ml-3"
            nextLinkClassName={styles.nextLink}
            // breakClassName={}
            breakLinkClassName={styles.ellipsis}
            activeClassName={styles.activePage}
            disabledLinkClassName={styles.disabledLink}
            forcePage={currentPage - 1} // To keep the selected page in sync
        />
    )
}

export default Pagination;