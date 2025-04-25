import { Box } from "@mui/material";
import DocumentComponent from "../../../../components/admin/visaApplicationInformation/General/DocumentComponent";
import { RequirementTypes } from "../visaAppicationInformationTypes";
import BankAccountOpening from "../../../../components/admin/visaApplicationInformation/BankAccountOpening/BankAccountOpening";
import AIMAStatusComponent from "../../../../components/admin/visaApplicationInformation/AIMA Appointment/AIMAStatusComponent";
import AdminDocumentUpload from "../../../../components/admin/visaApplicationInformation/General/AdminDocumentUpload";
import MedicalAppointment from "../../../../components/admin/visaApplicationInformation/Medical/MedicalAppointment";
import InvestmentOptions from "../../../../components/admin/visaApplicationInformation/InvestmentOptions";


type RequirementListProps = {
  requirements: RequirementTypes[];
  onMarkAsVerified: any;
  onNeedsReUpload: any;
  stepSource: string;
  stepType: string;
  refetch:()=> void;
};

const RequirementList = ({
  requirements,
  onMarkAsVerified,
  onNeedsReUpload,
  stepSource,
  stepType,
  refetch,
}: RequirementListProps) => {
  const renderDocuments = () => {
    if (stepSource === "ADMIN") {
      if (stepType === "GENERAL") {
        return<>
        <AdminDocumentUpload
        fileName="test"
        fileType="test"
        fileSize={"12MB"}
        reqStatus={"UPLOADED"}
        value=""
        reqStatusId=""
        refetch={refetch}
        />
        </>
      } else if (stepType === "BANK") {
        return <>
        <BankAccountOpening/>
        </>
      } else if (stepType === "TRADE_NAME") {
        return <></>;
      } else if (stepType === "MEDICAL") {
        return<>
        <MedicalAppointment/>
        </>
      }
      else if(stepType === "AIMA_APPOINTEMENT"){
        return <>
        <AIMAStatusComponent/>
        </>
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
        {/* <InvestmentOptions/> */}
        </>
      } else if (stepType === "BANK") {
        return 
      } else if (stepType === "TRADE_NAME") {
        return;
      } else if (stepType === "MEDICAL") {
        return;
      }
    }
    return null;
  };

  return <Box>{renderDocuments()}</Box>;
};

export default RequirementList;
