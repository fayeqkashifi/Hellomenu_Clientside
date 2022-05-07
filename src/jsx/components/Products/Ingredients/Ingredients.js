import React, { Fragment, useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import axios from "axios";
import Swal from "sweetalert2";
import CustomAlert from "../../CustomAlert";
import { checkPermission } from "../../Permissions";
import { localization as t } from "../../Localization";
import AddIngredient from "./Add";
import EditIngredient from "./Edit";
import { MDBDataTable } from "mdbreact";

const Ingredients = () => {
  const [modalCentered, setModalCentered] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    severity: "success",
    message: "",
  });
  const setAlerts = (open, severity, message) => {
    setAlert({
      open: open,
      severity: severity,
      message: message,
    });
  };

  const [editmodalCentered, setEditModalCentered] = useState(false);
  const [edit, setEdit] = useState([]);

  // fetch
  const fetch = (e, id) => {
    e.preventDefault();
    axios
      .get(`/api/editIngredient/${id}`)
      .then((res) => {
        if (res.data.status === 200) {
          setEdit(res.data.item);
          setEditModalCentered(true);
        } else if (res.data.status === 404) {
          setAlerts(true, "error", res.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
        // return Promise.reject(error);
      });
  };
  // update

  // delete Start
  const deleteIngredient = (e, id) => {
    e.preventDefault();
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/api/deleteIngredient/${id}`)
          .then((res) => {
            if (res.data.status === 200) {
              setAlerts(true, "success", res.data.message);
            } else if (res.data.status === 404) {
              setAlerts(true, "error", res.data.message);
            }
            setCheck(!check);
          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        setAlerts(true, "info", "Your Data is safe now!");
      }
    });
  };
  // delete End

  //retriving data using laravel API for show
  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [check, setCheck] = useState(true);
  const dataLoad = () => {
    try {
      axios.get(`/api/getIngredient`).then((result) => {
        if (result.data.status === 200) {
          setFetchData(result.data.fetchData.data);
          setLoading(false);
        } else {
          throw Error("Due to an error, the data cannot be retrieved.");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    // dataLoad();
    return () => {
      setFetchData([]);
      setLoading(true);
    };
  }, []);
  useEffect(() => {
    dataLoad();
  }, [check]);

  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    const userAttributes = [];
    fetchData.map((item) => {
      userAttributes.push({
        name: item.name,
        actions: (
          <div
            className="input-group"
            style={{
              display: "table" /* Instead of display:block */,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {checkPermission("ingredients-edit") && (
              <button
                type="button"
                onClick={(e) => fetch(e, item.id)}
                className="btn btn-outline-info btn-sm"
              >
                {t("edit")}
              </button>
            )}
            &nbsp;
            {checkPermission("ingredients-delete") && (
              <button
                type="button"
                onClick={(e) => deleteIngredient(e, item.id)}
                className="btn btn-outline-danger btn-sm"
              >
                {t("delete")}
              </button>
            )}
          </div>
        ),
      });
    });
    const data = {
      columns: [
        { label: t("name"), field: "name", sort: "asc" },
        { label: t("actions"), field: "actions", sort: "asc" },
      ],
      rows: userAttributes,
    };
    viewProducts_HTMLTABLE = (
      <div className="row">
        <div className="col-xl-12">
          <div className="display mb-4 dataTablesCard text-center">
            <MDBDataTable striped small data={data} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      {alert.open ? (
        <CustomAlert
          open={alert.open}
          severity={alert.severity}
          message={alert.message}
          setAlert={setAlert}
        />
      ) : (
        ""
      )}

      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-header border-0">
              <div>
                <h4 className="card-title mb-2">{t("ingredients")}</h4>
              </div>
              <div>
                <div className="input-group">
                  {checkPermission("ingredients-create") && (
                    <Button
                      variant="primary"
                      type="button"
                      className="mb-2 mr-2"
                      onClick={() => setModalCentered(true)}
                    >
                      {t("add")}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {viewProducts_HTMLTABLE}
      <AddIngredient
        setAlerts={setAlerts}
        setCheck={setCheck}
        check={check}
        modalCentered={modalCentered}
        setModalCentered={setModalCentered}
      />
      <EditIngredient
        edit={edit}
        setAlerts={setAlerts}
        setCheck={setCheck}
        check={check}
        editmodalCentered={editmodalCentered}
        setEditModalCentered={setEditModalCentered}
      />
    </Fragment>
  );
};
export default Ingredients;
