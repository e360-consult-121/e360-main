import ProcessComponent from "../ProcessComponent";
import InitialPreferencesForm from "./InitialPreferencesForm";
import TradeNameApproved from "./TradeNameApproved";
import { useFetchTradeInfoQuery } from "../../../../features/admin/visaApplication/additional/dubaiApis";
import { useEffect } from "react";


const TradeNameMain = ({stepStatusId,stepData,onContinue}:{stepStatusId:string,stepData:any,onContinue:()=>void}) => {

  const {data,refetch}=useFetchTradeInfoQuery({stepStatusId})
  
  useEffect(()=>{
    console.log("data",data)
  },[data])


  if (data?.data === null) {
    return <InitialPreferencesForm stepStatusId={stepStatusId} refetch={refetch}/>;
  }
  if (["ChangeReq_Sent","TradeNames_Uploaded"].includes(data?.data?.status)) {
    return <ProcessComponent date="" label="Processing" status="" message={stepData.inProcessMessage || ""} />;
  }
  if(["ChangeReq_Approved","ChangeReq_Rejected","TradeName_Assigned"].includes(data?.data?.status)) {
    return <TradeNameApproved stepStatusId={stepStatusId} data={data} onContinue={onContinue} refetch={refetch}/>
  }
  
  return <div></div>;
};

export default TradeNameMain;
