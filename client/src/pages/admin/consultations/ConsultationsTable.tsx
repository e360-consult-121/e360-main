import React, { useState } from "react";
import dayjs from "dayjs"; 
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
} from "@mui/material";
import { ConsultationType } from "./Consultations";

interface TableProps {
  data: ConsultationType[];
  onJoinNow: (consultation: ConsultationType) => void;
  onReschedule: (consultation: ConsultationType) => void;
}

const ConsultationsTable: React.FC<TableProps> = ({
  data,
  onJoinNow,
  onReschedule,
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");

  const today = dayjs().format("YYYY-MM-DD");
  const yesterday = dayjs().subtract(1, "day").format("YYYY-MM-DD");

  const handleChangePage = (_event: unknown, newPage: number) =>
    setPage(newPage);
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDateFilterChange = (event: any) => {
    setDateFilter(event.target.value);
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  // Filtering Data
  const filteredData = data
    .filter((item) => {
      if (statusFilter === "All") return true;
      return item.status === statusFilter;
    })
    .filter((item) => {
      const consultationDate = dayjs(item.consultationDate).format("YYYY-MM-DD");
      if (dateFilter === "All") return true;
      if (dateFilter === "Today") return consultationDate === today;
      if (dateFilter === "Yesterday") return consultationDate === yesterday;
      return false;
    });

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      {/* Filter Section */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: "bolder", mb: 2 }}>
          Scheduled Consultations
        </Typography>

        <Box sx={{ display: "flex", gap: 5 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Date</InputLabel>
            <Select value={dateFilter} onChange={handleDateFilterChange} label="Date">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Today">Today</MenuItem>
              <MenuItem value="Yesterday">Yesterday</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusFilter} onChange={handleStatusFilterChange} label="Status">
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Confirmed">Confirmed</MenuItem>
              <MenuItem value="Cancelled">Cancelled</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

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
                <TableCell sx={{ borderBottom: "none" }}>{consultation.caseId}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>{consultation.name}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>{dayjs(consultation.consultationDate).format("YYYY-MM-DD")}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  <Typography
                    sx={{
                      color:
                        consultation.status === "Cancelled"
                          ? "red"
                          : consultation.status === "Confirmed"
                          ? "orange"
                          : "green",
                    }}
                  >
                    {consultation.status}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
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
