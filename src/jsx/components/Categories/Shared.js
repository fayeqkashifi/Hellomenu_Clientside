import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { CBreadcrumb } from "@coreui/react";

const Shared = (props) => {
  // for localization
  const { t } = useTranslation();
  // ID
  const id = props.history.location.state.id;
  const sub_id = props.history.location.state.sub_id;

  const [fetchData, setFetchData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await axios.get(`/api/GetSharedCatBranches/${sub_id}`);
        if (result.status === 200) {
          setFetchData(result.data);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  var viewProducts_HTMLTABLE = "";
  if (loading) {
    return (
      <div className="spinner-border text-primary " role="status">
        <span className="sr-only">{t("loading")}</span>
      </div>
    );
  } else {
    viewProducts_HTMLTABLE = (
      <div className="row">
        <div className="col-xl-12 col-xxl-12 col-lg-12 col-sm-12">
          <div className="card">
            <div className="card-body p-0">
              <div className="table-responsive ">
                <table className="table  ">
                  <thead>
                    <tr className="card-title">
                      <th>{t("branch_name")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fetchData.map((item, i) => {
                      return (
                        <tr key={item.id}>
                          <td>{item.BrancheName}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Fragment>
      <CBreadcrumb style={{ "--cui-breadcrumb-divider": "'>'" }}>
        <Link
          to={{
            pathname: `/branches/show`,
            state: { id: id },
          }}
          className="font-weight-bold"
        >
          {t("back_to_categories")}
        </Link>
      </CBreadcrumb>

      {viewProducts_HTMLTABLE}
    </Fragment>
  );
};

export default Shared;
