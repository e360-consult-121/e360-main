import { Box } from "@mui/material";
import StepItem from "./StepItem";
import RequirementList from "./RequirementList";


const steps:any = [
  "Uploaded Documents",
  "Due Diligence & Application Submission",
  "Investment & Government Processing",
  "Approval & Passport Issuance",
  "Upload Passport",
  "Passport Delivery"
];

const currentStepData:any = {
  stepIndex: 0,
  requirements: [
    {
      visaApplicationReqStatusId: 101,
      question: "Upload your passport scan",
      requirementType: "IMAGE",
      required: true,
      status: "RE_UPLOAD",
      remarks: "The uploaded file is blurry, please re-upload.",
      value: "https://s3.amazonaws.com/example-bucket/passport.png",
      fileName: "Passport.png",
      fileType: "PNG",
      fileSize: "1.2MB"
    },
    {
      visaApplicationReqStatusId: 102,
      question: "Provide your birth certificate",
      requirementType: "PDF",
      required: true,
      status: "VERIFIED",
      remarks: "Verified successfully",
      value: "https://s3.amazonaws.com/example-bucket/birth_certificate.pdf",
      fileName: "Birth Certificate.pdf",
      fileType: "PDF",
      fileSize: "12MB"
    },
    {
      visaApplicationReqStatusId: 103,
      question: "Upload national ID or driver’s license",
      requirementType: "PDF",
      required: true,
      status: "NOT_UPLOADED",
      remarks: "Awaiting document upload",
      value: null,
      fileName: "National ID.pdf",
      fileType: "PDF",
      fileSize: "11MB"
    },
    {
      visaApplicationReqStatusId: 104,
      question: "Upload proof of financial stability",
      requirementType: "PDF",
      required: true,
      status: "NOT_UPLOADED",
      remarks: "Pending verification",
      value: "https://s3.amazonaws.com/example-bucket/financial_statement.pdf",
      fileName: "Financial_Stability.pdf",
      fileType: "PDF",
      fileSize: "8MB"
    },
    {
      visaApplicationReqStatusId: 105,
      question: "Provide police clearance certificate",
      requirementType: "PDF",
      required: false,
      status: "VERIFIED",
      remarks: "Optional document, verified",
      value: "https://s3.amazonaws.com/example-bucket/police_clearance.pdf",
      fileName: "Police Clearance.pdf",
      fileType: "PDF",
      fileSize: "9MB"
    }
  ]
};
const ApplicationProcess = () => {
    const handleApprove = () => {
        console.log("Approved");
      };
    
      const handleReject = () => {
        console.log("Rejected");
      };
  return (
    <Box 
    sx={{
      mt:2
    }}
    >
      {steps.map((step:any, index:any) => {
        const isActive = index === currentStepData.stepIndex;
        return (
          <StepItem
            key={index}
            step={step}
            index={index}
            isActive={isActive}
            showRequirements={
              isActive ? (
                <RequirementList requirements={currentStepData.requirements} />
              ) : null
            }
            onApprove={handleApprove}
            onReject={handleReject}
          />
        );
      })}
    </Box>
  )
}

export default ApplicationProcess