import React from "react";
import HeaderWizard from "./HeaderWizard";
import { Link } from "react-router-dom";

const Menu = () => {
  return (
    <>
      <HeaderWizard
        first="done active"
        second="done active"
        thrid="done active"
        fourth="editable active"
      />
      <div className="row justify-content-center">
        <div className="col-md-5">
          <div className="authincation-content">
            <div className="row no-gutters">
              <div className="col-xl-12">
                <div className="auth-form">
                  <h3 className="text-center">Congratulations!</h3>
                  <p className="text-center">
                    {" "}
                    Let’s set up your menu, remember you can manage it anytime.
                  </p>

                  <div className="form-group text-right">
                    <Link
                      to={`/dashboard`}
                      className="btn-primary"
                      style={{
                        padding: "5px 20px 5px 20px",
                        borderRadius: "10px",
                      }}
                    >
                      Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu;
