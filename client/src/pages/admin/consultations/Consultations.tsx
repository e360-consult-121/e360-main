import { Box } from "@mui/material";
import ConsultationsTable from "./ConsultationsTable";

export interface ConsultationType {
    caseId: string;
    name: string;
    consultationDate: string;
    status: "Cancelled" | "Confirmed" | "Completed";
  }

const dummyData:ConsultationType[] = [
  { caseId: "E360-DXB-001", name: "Chijioke Nkem", consultationDate: "12 Mar 2025, 10:00 AM", status: "Cancelled" },
  { caseId: "E360-DXB-002", name: "Gang Chae", consultationDate: "12 Mar 2025, 10:00 AM", status: "Confirmed" },
  { caseId: "E360-DXB-003", name: "Danielle Everett", consultationDate: "12 Mar 2025, 10:00 AM", status: "Confirmed" },
  { caseId: "E360-DXB-004", name: "Rashid Afaf", consultationDate: "12 Mar 2025, 10:00 AM", status: "Confirmed" },
  { caseId: "E360-DXB-005", name: "Jomo Gathoni", consultationDate: "12 Mar 2025, 10:00 AM", status: "Confirmed" },
  { caseId: "E360-DXB-006", name: "Tristan Wesley", consultationDate: "12 Mar 2025, 11:00 AM", status: "Confirmed" },
  { caseId: "E360-DXB-007", name: "Hiroshi Kei", consultationDate: "3 April 2025, 11:30 AM", status: "Confirmed" },
  { caseId: "E360-DXB-008", name: "Akili Vitu", consultationDate: "12 Mar 2025, 12:00 PM", status: "Confirmed" },
  { caseId: "E360-DXB-009", name: "Tristan Gavin", consultationDate: "12 Mar 2025, 2:00 PM", status: "Confirmed" },
  { caseId: "E360-DXB-010", name: "Kaylee Adam", consultationDate: "12 Mar 2025, 3:00 PM", status: "Completed" },
  { caseId: "E360-DXB-011", name: "Cooper Noah", consultationDate: "12 Mar 2025, 3:00 PM", status: "Completed" },
];

const Consultations = () => {
  const handleJoinNow = (consultation: any) => {
    alert(`Joining consultation for ${consultation.name}`);
  };

  const handleReschedule = (consultation: any) => {
    alert(`Rescheduling consultation for ${consultation.name}`);
  };

  return (
    <Box 
    sx={{
      px:4
    }}>
      <ConsultationsTable data={dummyData} onJoinNow={handleJoinNow} onReschedule={handleReschedule} />
    </Box>
  );
};

export default Consultations;
