import React, { useState, useEffect } from "react";

import { useTranslation } from "react-i18next";

import axios from "axios";

const Locale = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
 
  const dataLoad = async () => {
    try {
      const result = await axios.get("/api/getLocale");
    //   if (result.data.status === 200) {
          console.log(result.data);
        setLoading(false);
    //   }
     
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    dataLoad();

    return () => {
      setLoading(true);
    };
  }, []);
 
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div
          className="spinner-border "
          role="status"
          style={{ color: "#5373e3" }}
        >
          <span className="sr-only">{t("loading")}</span>
        </div>
      </div>
    );
  } else {
    return (
      
        <div>
            test
      </div>
    );
  }
};

export default Locale;
