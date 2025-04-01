import React, { useState } from "react";
import { 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
  Paper, Button, Typography, TablePagination 
} from "@mui/material";
import { Lead } from "./LeadManagement";

interface LeadTableProps {
  data: Lead[];
  onApprove: (lead: Lead) => void;
  onReject: (lead: Lead) => void;
}

const LeadTable: React.FC<LeadTableProps> = ({ data, onApprove, onReject }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default to 5 rows per page

  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {["Case ID", "Name", "Email", "Phone Number", "Submission Date", "Priority", "Action"].map((header) => (
              <TableCell key={header} sx={{ color: "#8D8883" }}>
                {header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((lead, index) => (
            <TableRow key={index}>
              <TableCell>{lead.caseId}</TableCell>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.submissionDate}</TableCell>
              <TableCell>
                <Typography 
                  sx={{ color: lead.priority === "High" ? "red" : lead.priority === "Medium" ? "orange" : "green" }}
                >
                  {lead.priority}
                </Typography>
              </TableCell>
              <TableCell>
                <Button sx={{ color: "green", textTransform: "none" }} onClick={() => onApprove(lead)}>Approve</Button>
                <Button sx={{ color: "red", textTransform: "none" }} onClick={() => onReject(lead)}>Reject</Button>
                <Button sx={{ color: "blue", textTransform: "none" }}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </TableContainer>
  );
};

export default LeadTable;
