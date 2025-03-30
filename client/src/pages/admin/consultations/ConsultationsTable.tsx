import React, { useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Typography, 
  TablePagination, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import { ConsultationType } from "./Consultations";



interface TableProps {
  data: ConsultationType[];
  onJoinNow: (consultation: ConsultationType) => void;
  onReschedule: (consultation: ConsultationType) => void;
}

const ConsultationsTable: React.FC<TableProps> = ({ data, onJoinNow, onReschedule }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");

  const handleChangePage = (_event: unknown, newPage: number) => setPage(newPage);
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  // Filtering Data
  const filteredData = statusFilter === "All" ? data : data.filter(item => item.status === statusFilter);

  return (
    <Paper sx={{ padding: 2 }}>
      {/* Filter Section */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginBottom: "10px" }}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Status</InputLabel>
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} label="Status">
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Case ID", "Name", "Consultation Date", "Status", "Action"].map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold", color: "#8D8883" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((consultation, index) => (
              <TableRow key={index}>
                <TableCell>{consultation.caseId}</TableCell>
                <TableCell>{consultation.name}</TableCell>
                <TableCell>{consultation.consultationDate}</TableCell>
                <TableCell>
                  <Typography 
                    sx={{ color: consultation.status === "Cancelled" ? "red" : consultation.status === "Confirmed" ? "orange" : "green" }}
                  >
                    {consultation.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  {consultation.status === "Cancelled" ? (
                    <Button sx={{ color: "gray", textTransform: "none" }} onClick={() => onReschedule(consultation)}>
                      Reschedule
                    </Button>
                  ) : consultation.status === "Confirmed" ? (
                    <Button sx={{ backgroundColor: "#FFC107", color: "black", textTransform: "none" }} onClick={() => onJoinNow(consultation)}>
                      Join Now
                    </Button>
                  ) : null}
                  <Button sx={{ color: "blue", textTransform: "none", marginLeft: "10px" }}>View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 15]}
        component="div"
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default ConsultationsTable;
