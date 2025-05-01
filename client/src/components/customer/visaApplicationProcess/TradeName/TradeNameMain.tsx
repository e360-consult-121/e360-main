import React from "react";
import ProcessComponent from "../ProcessComponent";
import InitialPreferencesForm from "./InitialPreferencesForm";
import TradeNameApproved from "./TradeNameApproved";

const data = {
  status: "APPROVED",
};

const TradeNameMain = () => {
  if (data.status === "SUBMITTED") {
    return <ProcessComponent date="" label="Processing" status="" />;
  }
  if (data.status === "IN_PROGRESS") {
    return <InitialPreferencesForm />;
  }
  if(data.status === "APPROVED") {
    return <TradeNameApproved onContinue={()=>null}/>
  }
  
  return <div></div>;
};

export default TradeNameMain;
