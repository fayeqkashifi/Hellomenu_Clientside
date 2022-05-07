import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import { localization as t } from "../Localization";

function Paginate(props) {
  const { setFetchData, url, fetchData } = props;
  const [pageCount, setpageCount] = useState(0);
  const [total, setTotal] = useState(0);
  useEffect(() => {
    const getComments = async () => {
      const res = await axios.get(`${url}`);
      // setFetchData(res.data.fetchData.data);
      setpageCount(res.data.fetchData.last_page);
      setTotal(res.data.fetchData.total);
    };
    getComments();
    return () => {
      // setFetchData([]);
      // setpageCount(0);
      // setTotal(0);
    };
  }, [fetchData]);

  const fetchComments = async (currentPage) => {
    const res = await axios.get(`${url}?page=${currentPage}`);
    setpageCount(res.data.fetchData.last_page);
    setTotal(res.data.fetchData.total);
    return res.data.fetchData.data;
  };
  const handlePageClick = async (data) => {
    let currentPage = data.selected + 1;
    const commentsFormServer = await fetchComments(currentPage);
    setFetchData(commentsFormServer);
  };
  return (
    <div className="d-flex justify-content-between">
      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination justify-content-left"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousClassName={"page-item"}
        previousLinkClassName={"page-link"}
        nextClassName={"page-item"}
        nextLinkClassName={"page-link"}
        breakClassName={"page-item"}
        breakLinkClassName={"page-link"}
        activeClassName={"active"}
      />
      <label className="mb-1">
        <small>
          {t("total")} {t("rows")}({fetchData.length}/{total})
        </small>
      </label>
    </div>
  );
}

export default Paginate;
