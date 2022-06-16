import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { base_url, port } from "../../../../../../Consts";
import { TemplateContext } from "../../TemplateContext";
import { addItemWithdoutDetails } from "../../Functionality";
export default function Wishlist() {
  const { style, cart, products, setCart } = useContext(TemplateContext);

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const dataLoad = async () => {
    try {
      const data = JSON.parse(localStorage.getItem("wishlist")) || [];
      if (data.length !== 0) {
        const formData = new FormData();
        data.map((item) => {
          formData.append("arrayId[]", item);
        });

        const result = await axios.post(`/api/getProductsData`, formData);
        if (result.data.status === 200) {
          setFetchData(result.data.fetchData);
          setLoading(false);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);
  const addItem = (id) => {
    addItemWithdoutDetails(id, cart, products).then((data) => {
      if (data === "") {
        // setAlerts(true, "warning", locale?.please_select_product_variantion);
      } else {
        setCart(data);
        deleteItem(id);
      }
    });
  };
  const deleteItem = (id) => {
    setFetchData(fetchData.filter((item) => item.id != id));
    const checkData = JSON.parse(localStorage.getItem("wishlist")) || [];
    const data = checkData.filter((item) => item != id);
    localStorage.setItem("wishlist", JSON.stringify(data));
  };
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="spinner-border " role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {fetchData.length !== 0 ? (
          fetchData.map((item, i) => {
            return (
              <div className="card" key={item.id}>
                <div className="card-body row ">
                  <div className="col-xl-3 col-lg-3 col-sm-6 ">
                    <img
                      src={`http://${base_url}:${port}/images/products/${
                        JSON.parse(item.image)[0]
                      }`}
                      alt={item.ProductName}
                      style={{
                        height: "100px",
                        width: "70%",
                        borderRadius: "10px",
                        objectFit: "contain",
                      }}
                    />
                  </div>
                  <div className="col-xl-3 col-lg-3 col-sm-6 d-flex align-items-center justify-content-center">
                    <h3 className="mt-2"> {item.ProductName}</h3>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-sm-6 d-flex align-items-center justify-content-center">
                    <button
                      className={`btn btn-sm mr-2 `}
                      onClick={() => addItem(item.id)}
                      style={style?.buttonStyle}
                    >
                      Add To Cart
                      {/* {locale?.add_to_cart} */}
                    </button>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-sm-6 d-flex align-items-center justify-content-center">
                    <button
                      className={`btn btn-sm mr-2 `}
                      onClick={() => deleteItem(item.id)}
                      style={style?.buttonStyle}
                    >
                      Delete
                      {/* {locale?.add_to_cart} */}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12 text-center">
            No Item Found
          </div>
        )}{" "}
      </div>
    );
  }
}
