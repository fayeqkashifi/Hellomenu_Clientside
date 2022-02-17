import React, { Fragment } from "react";

import { useTranslation } from "react-i18next";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Button } from "react-bootstrap";

const Localization = (props) => {
  const { t } = useTranslation();
 
  return (
    <Formik
    // initialValues={initialValues}
    // validationSchema={validationSchema}
    // onSubmit={save}
    >
      {({ errors, status, touched }) => (
        <Form>
          <div className="form-group">
            <label> {t("company_discription")}</label>
            <Field
              name="companyDiscription"
              type="text"
              className={"form-control"}
              placeholder="Best Digital Menu in world..."
            />
          </div>
          <div className="form-group">
            <label> {t("logo")}</label>
            <Field
              name="file"
              type="file"
              className={"form-control"}
              placeholder="Best Digital Menu in world..."
            />
          </div>
          <div className="form-group">
            <label> {t("social_links")}</label>
          </div>
          <div className="row">
            <div className="col-6">
              <div className="form-group">
                <label> {t("facebook")}</label>
                <Field
                  name="facebook"
                  type="text"
                  className={"form-control"}
                  placeholder={t("facebook") + " link here..."}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label> {t("instagram")}</label>
                <Field
                  name="instagram"
                  type="text"
                  className={"form-control"}
                  placeholder={t("instagram") + " link here..."}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label> {t("youtube")}</label>
                <Field
                  name="youtube"
                  type="text"
                  className={"form-control"}
                  placeholder={t("youtube") + " link here..."}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label> {t("tiktok")}</label>
                <Field
                  name="tiktok"
                  type="text"
                  className={"form-control"}
                  placeholder={t("tiktok") + " link here..."}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label> {t("email")}</label>
                <Field
                  name="email"
                  type="text"
                  className={"form-control"}
                  placeholder={t("email")}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="form-group">
                <label> {t("whatsapp")}</label>
                <Field
                  name="whatsapp"
                  type="text"
                  className={"form-control"}
                  placeholder={t("whatsapp") + " Number..."}
                />
              </div>
            </div>
          </div>
          <div className="text-center">
            <Button variant="success" type="submit">
              {t("save")}{" "}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Localization;
