import { Box } from "@mui/material";
import DocumentComponent from "../../../../components/admin/visaApplicationInformation/General/DocumentComponent";
import { RequirementTypes } from "../visaAppicationInformationTypes";
import BankAccountOpening from "../../../../components/admin/visaApplicationInformation/BankAccountOpening/BankAccountOpening";
import AIMAStatusComponent from "../../../../components/admin/visaApplicationInformation/AIMA Appointment/AIMAStatusComponent";
import AdminDocumentUpload from "../../../../components/admin/visaApplicationInformation/General/AdminDocumentUpload";
import MedicalAppointment from "../../../../components/admin/visaApplicationInformation/Medical/MedicalAppointment";
import InvestmentOptions from "../../../../components/admin/visaApplicationInformation/InvestmentOptions";
import PassportDeliveryDetails from "../../../../components/admin/visaApplicationInformation/PassportDeliveryDetails";
import TradeDetailsComponent from "../../../../components/admin/visaApplicationInformation/Trade/TradeDetailsComponent";

//dummyclientData on stepType === DGDELIVERY
const clientDetails={
  name: "John Doe",
  email: "test@gmail.com",
  phone: "123",
  address: "21 Bakers Street",
  cityCountry: "Pune",
  postalCode:"123"
};


type RequirementListProps = {
  requirements: RequirementTypes[];
  onMarkAsVerified: any;
  onNeedsReUpload: any;
  stepSource: string;
  stepData:any;
  visaApplicationId: string;
  stepType: string;
  refetch:()=> void;
  stepStatusId:string
};

const RequirementList = ({
  requirements,
  onMarkAsVerified,
  onNeedsReUpload,
  stepSource,
  stepData,
  stepType,
  visaApplicationId,
  refetch,
  stepStatusId
}: RequirementListProps) => {

  const renderDocuments = () => {
    if (stepSource === "ADMIN") {
      if (stepType === "GENERAL") {
        return<>
        {requirements.map((req) => (
          <AdminDocumentUpload
            key={req.reqStatusId}
            fileName={req.question}
            fileType={req.requirementType}
            fileSize={"12MB"} 
            reqStatus={req.reqStatus}
            value={req.value || ""}
            reqStatusId={req.reqStatusId}
            refetch={refetch}
          />
        ))}
        </>
      } else if (stepType === "BANK") {
        return <>
        <BankAccountOpening visaApplicationId={visaApplicationId} requirements={requirements}/>
        </>
      } else if (stepType === "TRADE_NAME") {
        return <>
        <TradeDetailsComponent/>        
        </>;
      } else if (stepType === "MEDICAL") {
        return<>
        <MedicalAppointment/>
        </>
      }
      else if(stepType === "AIMA"){
        return <>
        <AIMAStatusComponent stepData={stepData}/>
        </>
      }
      else if(stepType === "DGDELIVERY"){
        return <>
        <PassportDeliveryDetails
        clientDetails={clientDetails}
        stepStatusId={stepStatusId}
        refetch={refetch}
        />
        </>
      }
      else if (stepType === "EMPTY"){
        return<></>
      }
    } else if (stepSource === "USER") {
      if (stepType === "GENERAL") {
        return <>
        {requirements.map((req) => (
          <DocumentComponent
            key={req.reqStatusId}
            reqStatusId={req.reqStatusId}
            fileName={req.question}
            fileType={req.requirementType}
            fileSize={"12MB"}
            status={req.reqStatus}
            value={req.value || ""}
            onNeedsReUpload={onNeedsReUpload}
            onMarkAsVerified={onMarkAsVerified}
          />
        ))}
        {/* <PassportDeliveryDetails clientDetails={dummyClientDetails} /> */}
        
        </>
      } else if (stepType === "BANK") {
        return 
      } else if (stepType === "TRADE_NAME") {
        return;
      } else if (stepType === "MEDICAL") {
        return;
      }
    }

    else{
      if(stepType === "DGINVESTMENT"){
        return <>
          <InvestmentOptions
          stepStatusId={stepStatusId}
          stepData={stepData}
          refetch={refetch}
        />
        </>
      }
    }
    return null;
  };

  return <Box>{renderDocuments()}</Box>;
};

export default RequirementList;
