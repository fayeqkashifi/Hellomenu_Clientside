import React, { Fragment, useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { base_url, port } from "../../../Consts";
import { CSmartTable } from "@coreui/react-pro";
import { useRouteMatch } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import EditIcon from "@mui/icons-material/Edit";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
const Product = (props) => {
  const { path, url } = useRouteMatch();

  // for localization
  const { t } = useTranslation();
  // const subMenuId = atob(props.match.params.id)
  const branchId = props.history.location.state.id;

  // delete section
  const deleteProduct = (e, id) => {
    e.preventDefault();
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/DeleteProducts/${id}`).then((res) => {
          if (res.data.status === 200) {
            setCheck(!check);
            swal("Success", res.data.message, "success");
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };
  // delete End
  //for retriving data using laravel API
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  useEffect(() => {
    axios.get(`/api/GetProducts/${branchId}`).then((res) => {
      if (res.data.status === 200) {
        setFetchData(res.data.fetchData);
        // console.log(res.data.fetchData);
      }
      setLoading(false);
    });
  }, [check]);

  const columns = [
    {
      key: "image",
    },
    {
      key: "ProductName",
    },
    {
      key: "Description",
    },
    {
      key: "price",
    },
    {
      key: "stock",
    },
    {
      key: "ingredients",
    },
    {
      key: "extras",
    },
    {
      key: "recommendations",
    },
    {
      key: "CategoryName",
    },
    {
      key: "SubCategoryName",
    },
    {
      key: "actions",
    },
  ];
  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = (
      <CSmartTable
        activePage={1}
        cleaner
        // clickableRows
        columns={columns}
        // columnFilter
        columnSorter
        footer
        items={fetchData}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        scopedColumns={{
          ingredients: (item) => {
            return (
              <td>
                <div className="row m-3">
                  {JSON.parse(item.ingredients)?.map((item, i) => {
                    return (
                      <Stack
                        direction="row"
                        className="m-1"
                        spacing={1}
                        key={i}
                      >
                        <Chip
                          label={item.label}
                          // color="primary"
                          variant="outlined"
                        />
                      </Stack>
                    );
                  })}
                </div>
              </td>
            );
          },
          extras: (item) => {
            return (
              <td>
                <div className="row m-3">
                  {JSON.parse(item.extras)?.map((item, i) => {
                    return (
                      <Stack
                        direction="row"
                        className="m-1"
                        spacing={1}
                        key={i}
                      >
                        <Chip
                          label={item.label + "( +" + item.price + ".00" + " )"}
                          // color="primary"
                          variant="outlined"
                        />
                      </Stack>
                    );
                  })}
                </div>
              </td>
            );
          },
          recommendations: (item) => {
            return (
              <td>
                <div className="row m-3">
                  {JSON.parse(item.recommendations)?.map((item, i) => {
                    return (
                      <Stack
                        direction="row"
                        className="m-1"
                        spacing={1}
                        key={i}
                      >
                        <Chip
                          label={item.label}
                          // color="primary"
                          variant="outlined"
                        />
                      </Stack>
                    );
                  })}
                </div>
              </td>
            );
          },
          image: (item) => {
            return (
              <td>
                <img
                  src={`http://${base_url}:${port}/images/products/${item.image}`}
                  className="img-thumbnail"
                  alt=""
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "contain",
                  }}
                />
              </td>
            );
          },
          actions: (item) => {
            return (
              <td style={{ width: "20%" }}>
                <Link
                  to={{
                    pathname: `${url}/variants`,
                    id: item.id,
                    ProductName: item.ProductName,
                    state: { id: item.id },
                  }}
                >
                  <Tooltip title="Variants">
                    <IconButton>
                      <AutoAwesomeMotionIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Link>
                <Link
                  to={{
                    pathname: `${url}/edit-product`,
                    state: { id: branchId, productId: item.id },
                  }}
                  // onClick={(e) => fetchProduct(e, item.id)}
                >
                  <Tooltip title="Edit">
                    <IconButton>
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Link>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={(e) => deleteProduct(e, item.id)}
                >
                  <Tooltip title="Delete">
                    <IconButton>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              </td>
            );
          },
        }}
        // selectable
        // sorterValue={{ column: 'name', state: 'asc' }}
        tableFilter
        // tableHeadProps={{
        //   color: "primary",
        // }}
        tableProps={{
          striped: true,
          hover: true,
        }}
      />
    );
  }

  return (
    <>
      <Fragment>
        <div style={{ overflowX: "scroll" }}>
          <div className="float-right">
            <Link
              className="btn btn-primary mb-2 mr-2"
              to={{
                pathname: `${url}/add-product`,
                state: { id: branchId },
              }}
            >
              {t("add_product")}
            </Link>
          </div>

          {viewProducts_HTMLTABLE}
        </div>
      </Fragment>
    </>
  );
};

export default Product;
