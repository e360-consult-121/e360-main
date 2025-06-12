import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const TableComponent: React.FC<any> = ({ data, stepsData }) => {
  const { type } = useParams();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

  console.log(data);

  const handleNavigation = (row: any) => {
    const newRow = {
      ...row,
      leadId: row.leadId._id,
    };
    navigate(`/admin/application/${row._id}`, { state: { row: newRow } });
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const filteredData =
  statusFilter === "All"
    ? data
    : data.filter((row: any) => {
        const stepName = stepsData[row.currentStep - 1];
        return stepName === statusFilter;
      });

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {type && (
          <Typography variant="h6" sx={{ fontWeight: "bolder", mb: 2 }}>
            {type.charAt(0).toUpperCase() + type.slice(1)} Passport
          </Typography>
        )}

        <Select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          displayEmpty
          sx={{ mb: 2, float: "right" }}
        >
          <MenuItem value="All">All</MenuItem>
          {stepsData.map((step: string, index: number) => (
            <MenuItem key={index} value={step}>
              {step}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                "Case ID",
                "Name",
                "E-mail",
                "Phone Number",
                "Status",
                "View",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  align={header === "View" ? "right" : "left"}
                  sx={{
                    color: "#8D8883",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No applications going on right now.
                </TableCell>
              </TableRow>
            ) : (
              filteredData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row: any, index: any) => (
                  <TableRow key={index} sx={{ borderBottom: "none" }}>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row?.nanoVisaApplicationId}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.leadId !== null ? row?.leadId?.fullName?.first +
                        " " +
                        row?.leadId?.fullName?.last : row?.userId?.name}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.leadId !== null ? row?.leadId?.email : row.userId.email}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.leadId !== null ? row?.leadId?.phone : row?.userId.phone}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          row.status === "Passport Delivered"
                            ? "green"
                            : "black",
                      }}
                    >
                      {row?.status}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ borderBottom: "none", cursor: "pointer" }}
                    >
                      <Button
                        onClick={() => handleNavigation(row)}
                        sx={{ color: "black", textTransform: "none" }}
                      >
                        View &gt;
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredData.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={handleChangePage}
        rowsPerPageOptions={[5, 10, 15]}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default TableComponent;
