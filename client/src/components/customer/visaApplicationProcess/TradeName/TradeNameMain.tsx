import ProcessComponent from "../ProcessComponent";
import InitialPreferencesForm from "./InitialPreferencesForm";
import TradeNameApproved from "./TradeNameApproved";
import { useFetchTradeInfoQuery } from "../../../../features/admin/visaApplication/additional/dubaiApis";
import { useEffect } from "react";

const data = {
  status: "APPROVED",
};

const TradeNameMain = ({stepStatusId}:{stepStatusId:string}) => {

  const {data,isLoading}=useFetchTradeInfoQuery({stepStatusId})
  
  useEffect(()=>{
    console.log("data",data)
  },[data])

  if (data?.data === null) {
    return <InitialPreferencesForm stepStatusId={stepStatusId}/>;
  }
  if (data?.status === "IN_PROGRESS") {
    return <ProcessComponent date="" label="Processing" status="" />;
  }
  if(data?.status === "APPROVED") {
    return <TradeNameApproved onContinue={()=>null}/>
  }
  
  return <div></div>;
};

export default TradeNameMain;
