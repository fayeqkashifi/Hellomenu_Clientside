import React, { useState, useEffect } from "react";

import axios from "axios";
import "react-phone-input-2/lib/style.css";
import { CSmartTable } from "@coreui/react-pro";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { Link, useRouteMatch } from "react-router-dom";
import { checkPermission } from "../../Permissions";
import { localization as t } from "../../Localization";

const RoleList = (props) => {
  const { check, setCheck, nodes } = props;

  const { url } = useRouteMatch();
  const [roles, setRoles] = useState([]);
  const dataLoad = async () => {
    try {
      axios.get("/api/getRoles").then((res) => {
        setRoles(res.data.data);
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();
  }, [check]);

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
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this imaginary file!",
      icon: "warning",
      buttons: [t("cancel"), t("confirm")],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios.delete(`/api/deleteRole/${id}`).then((res) => {
          if (res.data.status === 200) {
            setCheck(!check);
            // swal("Success", res.data.message, "success");
          } else if (res.data.status === 404) {
            swal("Error", res.data.message, "error");
          }
        });
      } else {
        swal("Your Data is safe now!");
      }
    });
  };

  return (
    <>
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
