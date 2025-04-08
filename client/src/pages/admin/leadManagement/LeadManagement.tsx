import { Box } from "@mui/material";
import LeadTable from "./LeadTable";

// Define types for props
export interface Lead {
    caseId: string;
    name: string;
    email: string;
    phone: string;
    submissionDate: string;
    priority: "High" | "Medium" | "Low";
  }

const LeadManagement: React.FC = () => {
    
    const leadData: Lead[] = [
      { caseId: "E360-DXB-001", name: "Chijioke Nkem", email: "dwest@baker.info", phone: "713 199 1975", submissionDate: "28-02-2025", priority: "Low" },
      { caseId: "E360-DXB-002", name: "Gang Chae", email: "allenmegan@gmail.com", phone: "274 007 0594", submissionDate: "02-03-2025", priority: "Medium" },
      { caseId: "E360-DXB-003", name: "Danielle Everett", email: "uforbes@rmora-green.net", phone: "270 412 3546", submissionDate: "02-03-2025", priority: "High" },
      { caseId: "E360-DXB-004", name: "Rashid Afaf", email: "gutierrezlarry@hotmail.com", phone: "696 904 4161", submissionDate: "03-03-2025", priority: "Medium" },
      { caseId: "E360-DXB-005", name: "Jomo Gathoni", email: "jsmith@mckinney.com", phone: "594 361 0994", submissionDate: "04-03-2025", priority: "High" },
      { caseId: "E360-DXB-005", name: "Jomo Gathoni", email: "jsmith@mckinney.com", phone: "594 361 0994", submissionDate: "04-03-2025", priority: "High" },
      { caseId: "E360-DXB-005", name: "Jomo Gathoni", email: "jsmith@mckinney.com", phone: "594 361 0994", submissionDate: "04-03-2025", priority: "High" }
    ];
  
    const handleApprove = (lead: Lead) => {
      console.log(lead);
    };
  
    const handleReject = (lead: Lead) => {
      console.log(lead);
    };
  
    return (
      <Box sx={{
        px:4
      }}>
        <LeadTable data={leadData} onApprove={handleApprove} onReject={handleReject} />
      </Box>
    );
  };
  
  export default LeadManagement;