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
import { AllConsultationsTypes } from "../../../features/admin/consultations/consultationTypes";

interface TableProps {
  data: AllConsultationsTypes[] | undefined;
  onJoinNow?: (consultation: AllConsultationsTypes) => void;
  onReschedule?: (consultation: AllConsultationsTypes) => void;
}

const ConsultationsTable: React.FC<TableProps> = ({
  data,
  // onJoinNow,
  // onReschedule,
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

  const filteredData = data
    ?.filter((item) => {
      if (statusFilter === "All") return true;
      return item.status === statusFilter;
    })
    .filter((item) => {
      const consultationDate = dayjs(item?.startTime).format("YYYY-MM-DD");
      if (dateFilter === "All") return true;
      if (dateFilter === "Today") return consultationDate === today;
      if (dateFilter === "Yesterday") return consultationDate === yesterday;
      return false;
    }) || [];

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      {/* Filters */}
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
              <MenuItem value="SCHEDULED">Scheduled</MenuItem>
              <MenuItem value="COMPLETED">Completed</MenuItem>
              <MenuItem value="CANCELLED">Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Table */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {["Name", "Date & Time", "Status", "Action"].map((header) => (
                <TableCell key={header} sx={{ color: "#8D8883" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((consultation) => (
              <TableRow key={consultation._id}>
                {/* <TableCell sx={{ borderBottom: "none" }}>{consultation._id}</TableCell> */}
                <TableCell sx={{ borderBottom: "none" }}>{consultation.name}</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {dayjs(consultation.startTime).format("MMM D, YYYY h:mm A")}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  <Typography
                    sx={{
                      color:
                        consultation.status === "CANCELLED"
                          ? "#F54337"
                          : consultation.status === "SCHEDULED"
                          ? "#F6C328"
                          : "#64AF64",
                    }}
                  >
                    {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1).toLowerCase()}
                  </Typography>
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {consultation.status === "CANCELLED" ? (
                   <></>
                  ) : consultation.status === "SCHEDULED" ? (
                    <Box
                    sx={{
                      display:"flex",
                      gap:2
                    }}
                    >
                    <a href={consultation?.rescheduleUrl} target="_blank">
                    <Button variant="outlined" sx={{ textTransform: "none",borderColor:"black",borderRadius:"15px",color:"black" }}>
                      Reschedule
                    </Button>
                    </a>
                    <a href={consultation?.joinUrl} target="_blank">
                    <Button
                      sx={{ backgroundColor: "#F6C328", color: "black", textTransform: "none",borderRadius:"15px" }}
                    >
                      Join Now
                    </Button>
                    </a>
                    </Box>
                  ) : null}
                  {/* <Button
                    sx={{ color: "black", textTransform: "none", marginLeft: "10px" }}
                    href={consultation.calendlyEventUrl}
                    target="_blank"
                  >
                    View &gt;
                  </Button> */}
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
