import { Box } from "@mui/material";
import DocumentComponent from "./DocumentComponent";

const RequirementList = ({ requirements }: { requirements: any[] }) => {
    return (
        <Box>
          {requirements.map((req) => (
            <DocumentComponent
              key={req.visaApplicationReqStatusId}
              fileName={req.fileName}
              fileType={req.fileType}
              fileSize={req.fileSize}
              status={req.status}
            />
          ))}
        </Box>
      );
}

export default RequirementList