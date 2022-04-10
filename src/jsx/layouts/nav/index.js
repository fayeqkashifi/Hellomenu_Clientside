import React, { Fragment, useState } from "react";
import SideBar from "./SideBar";
import NavHader from "./NavHader";
import Header from "./Header";

const KokiNav = ({ title }) => {
  const [toggle, setToggle] = useState("");
  const onClick = (name) => setToggle(toggle === name ? "" : name);
  const [check, setCheck] = useState([]);

  return (
    <Fragment>
      <NavHader />
      <SideBar />
      <Header
        setCheck={setCheck}
        check={check}
        onActivity={() => onClick("activity")}
        onNotification={() => onClick("notification")}
        onProfile={() => onClick("profile")}
        toggle={toggle}
        title={title}
      />
    </Fragment>
  );
};

export default KokiNav;
