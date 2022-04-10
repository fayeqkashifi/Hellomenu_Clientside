import React, { useState, useEffect } from "react";

import axios from "axios";
import "react-phone-input-2/lib/style.css";
import { CSmartTable } from "@coreui/react-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import Swal from "sweetalert2";
import { Link, useRouteMatch } from "react-router-dom";
import { checkPermission } from "../../Permissions";
// import { localization as t } from "../../Localization";
import ScrollContainer from "react-indiana-drag-scroll";
import CustomAlert from "../../CustomAlert";

const RoleList = (props) => {
  const { check, setCheck, nodes } = props;

  const { url } = useRouteMatch();
  const [roles, setRoles] = useState([]);
  const dataLoad = async () => {
    try {
      axios
        .get("/api/getRoles")
        .then((res) => {
          setRoles(res.data.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
    return () => {
      setRoles([]);
      setCheck(!check);
    };
  }, [check]);
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
  const columns = [
    {
      key: "roleName",
    },
    {
      key: "roleDiscription",
    },
    // {
    //   key: "permissions",
    // },
    {
      key: "actions",
    },
  ];
  // delete section
  const deleteRole = (id) => {
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
          .delete(`/api/deleteRole/${id}`)
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

  return (
    <>
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
      <CSmartTable
        activePage={1}
        cleaner
        columns={columns}
        columnSorter
        items={roles}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        tableFilter
        scopedColumns={{
          actions: (item) => {
            return (
              <td>
                {checkPermission("roles-edit") && (
                  <Link
                    to={{
                      pathname: `${url}/edit-role`,
                      state: {
                        id: item.id,
                        nodes: nodes,
                      },
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Link>
                )}
                {checkPermission("roles-delete") && (
                  <Tooltip title="Delete">
                    <IconButton onClick={() => deleteRole(item.id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </td>
            );
          },
        }}
        tableProps={{
          striped: true,
          hover: true,
        }}
      />
    </>
  );
};

export default RoleList;
