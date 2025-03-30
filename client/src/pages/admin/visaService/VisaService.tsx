import { Box } from "@mui/material";
import TableComponent from "./TableComponent";

const sampleData = [
  {
    CaseID: "E360-DXB-001",
    name: "Chijioke Nkem",
    email: "dwest@baker.info",
    phone: "713 199 1975",
    status: "Documents Uploaded",
  },
  {
    CaseID: "E360-DXB-002",
    name: "Gang Chae",
    email: "allenmegan@gmail.com",
    phone: "274 007 0594",
    status: "Investment Documents Uploaded",
  },
  {
    CaseID: "E360-DXB-003",
    name: "Danielle Everett",
    email: "uforbes@mora-green.net",
    phone: "270 412 3546",
    status: "Pending Investment",
  },
  {
    CaseID: "E360-DXB-004",
    name: "Rashid Afaf",
    email: "gutierrezlarry@hotmail.com",
    phone: "696 904 4161",
    status: "Pending Investment",
  },
  {
    CaseID: "E360-DXB-005",
    name: "Jomo Gathoni",
    email: "jsmith@mckinney.com",
    phone: "594 361 0994",
    status: "Passport Delivered",
  },
  {
    CaseID: "E360-DXB-006",
    name: "Tristan Wesley",
    email: "bfields@gmail.com",
    phone: "284 164 6260",
    status: "Pending Investment",
  },
];

const VisaService = () => {
  return (
    <Box 
    sx={{
        px:4
    }}
    >
      <TableComponent data={sampleData} />
    </Box>
  );
};

export default VisaService;
