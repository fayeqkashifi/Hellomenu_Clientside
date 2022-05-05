import axios from "axios";

function Search(props) {
  const { setFetchData, url, defaultUrl, id } = props;
  let cancelToken;

  const searchItem = async (e) => {
    if (e.target.value === "") {
      const res = await axios.get(`${defaultUrl}`);
      setFetchData(res.data.fetchData.data);
    } else {
      if (cancelToken) {
        cancelToken.cancel("Operations cancelled due to new request");
      }
      cancelToken = axios.CancelToken.source();
      let results;
      try {
        results = await axios.post(
          `${url}`,
          { id: id, name: e.target.value },
          {
            cancelToken: cancelToken.token,
          }
        );
        if (results !== undefined) {
          if (results.data.status === 200) {
            setFetchData(results.data.fetchData);
          } else if (results.data.status === 404) {
            setFetchData(results.data.fetchData);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <input
      className="form-control"
      placeholder="Search...!"
      onChange={searchItem}
    />
  );
}

export default Search;
