import ReactPaginate from "react-paginate";
import { useEffect, useState } from "react";
import axios from "axios";
import { localization as t } from "../Localization";

function Paginate(props) {
  const { setFetchData, url, fetchData } = props;
  const [pageCount, setpageCount] = useState(0);
  const [total, setTotal] = useState(0);
  const getComments = async () => {
    try {
      const res = await axios({
        method: "GET",
        url: `${url}`,
        cancelToken: source.token,
      });
      if (res != undefined) {
        // setFetchData(res.data.fetchData.data);
        setpageCount(res.data.fetchData.last_page);
        setTotal(res.data.fetchData.total);
      }
    } catch (err) {
      if (axios.isCancel(err)) {
        console.log("cancelled");
      } else {
        throw err;
      }
    }
    // const res = await axios.get(`${url}`, cancelToken: source.token);
  };
  let source = axios.CancelToken.source();

  useEffect(() => {
    if (source) {
      source.cancel("Operations cancelled due to new request");
    }
    source = axios.CancelToken.source();
    getComments();
    return () => {
      source.cancel();
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
