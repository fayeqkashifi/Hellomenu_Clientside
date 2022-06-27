import React, { useContext, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import ShowCards from "../Common/ShowCards";
import SideBar from "../Common/Layout/SideBar";
import Header from "../Common/Layout/Header";
import ScrollContainer from "react-indiana-drag-scroll";
import Toolbar from "@mui/material/Toolbar";
import Statusbar from "../Common/Story/Statusbar";
import { TemplateContext } from "../TemplateContext";

export default function Home(props) {
  const { style } = useContext(TemplateContext);
  const [changeState, setChangeState] = useState(true);

  return (
    <div style={style?.background}>
      <Header search={true} setChangeState={setChangeState} />
      <div style={style?.sidebarMainDiv}>
        <div style={style?.container}>
          <Statusbar />
        </div>
        <Card style={style?.sidebarCard}>
          <SideBar />
        </Card>
        <Grid
          container
          spacing={2}
          style={style?.showCartStyle}
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
