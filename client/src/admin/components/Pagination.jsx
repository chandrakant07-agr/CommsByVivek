import ReactPaginate from "react-paginate";
import styles from "./styles/Pagination.module.css";
import {
    MdOutlineKeyboardDoubleArrowLeft,
    MdOutlineKeyboardDoubleArrowRight
} from "react-icons/md";

const Pagination = ({
    pageCount, currentPage, itemsPerPage, totalItems, setCurrentPage
}) => {
    return (
        <div className={styles.pagination}>
            <div className={styles.totalPages}>
                {`Showing ${((currentPage - 1) * itemsPerPage) + 1} 
                    to ${Math.min(currentPage * itemsPerPage,
                    totalItems)} of ${totalItems} results`}
            </div>

            <ReactPaginate
                previousLabel={<MdOutlineKeyboardDoubleArrowLeft />}
                nextLabel={<MdOutlineKeyboardDoubleArrowRight />}
                breakLabel="..."
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={(data) => {
                    setCurrentPage(data.selected + 1);
                }}
                containerClassName={styles.paginationContainer}
                pageClassName={styles.pageItem}
                pageLinkClassName={styles.pageLink}
                previousClassName={styles.prevItem}
                previousLinkClassName={styles.prevLink}
                nextClassName={styles.nextItem}
                nextLinkClassName={styles.nextLink}
                // breakClassName={}
                breakLinkClassName={styles.ellipsis}
                activeClassName={styles.activePage}
                disabledLinkClassName={styles.disabledLink}
                forcePage={currentPage - 1} // To keep the selected page in sync
            />
        </div>
    )
}

export default Pagination;