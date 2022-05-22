import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ShowCards from "../Common/ShowCards";
import SideBar from "../Common/SideBar";
import Header from "../Common/Header";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import Statusbar from "../Common/Statusbar";
import { TemplateContext } from "../TemplateContext";

export default function SecondMain(props) {
  const { style } = useContext(TemplateContext);
  const [changeState, setChangeState] = useState(true);

  return (
    <div style={style?.background}>
      <Header search={true} setChangeState={setChangeState} />
      <div style={style?.sidebarMainDiv}>
        <div className="container">
          <Statusbar />
        </div>
        <Card style={style?.sidebarCard}>
          <SideBar />
        </Card>
        <Grid
          container
          spacing={2}
          style={{
            minHeight: "80vh",
            maxWidth: "90%",
            marginLeft: "10%",
          }}
        >
          <ScrollContainer className="scroll-container row align-items-center justify-content-center">
            <Toolbar>
              <ShowCards />
            </Toolbar>
          </ScrollContainer>
        </Grid>
      </div>
    </div>
  );
}
