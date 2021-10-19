import React from "react";

import EventCalendar from "./EventCalendar";

import PageTitle from "../../../layouts/PageTitle";

const Calendar = () => {
   return (
		<div className="h-80">
			<PageTitle headingPara="Your business dashboard template" motherMenu="App" activeMenu="Calerdar" /> 
            <EventCalendar />     
		</div>
	);
};

export default Calendar;
