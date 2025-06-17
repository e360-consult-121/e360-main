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
  useMediaQuery,
  useTheme,
  Tooltip,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

const TableComponent: React.FC<any> = ({ data, stepsData }) => {
  const { type } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();

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

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderCardView = (row: any, index: number) => (
    <Box
      key={index}
      sx={{
        minWidth: "290px",
        border: "1px solid black",
        borderRadius: "15px",
        padding: 2,
        mb: 2,
        background: "#fff",
      }}
    >
      <Typography sx={{mb:1}}>
        <strong>Case ID:</strong> {row?.nanoVisaApplicationId}
      </Typography>
      <Typography sx={{mb:1}}>
        <strong>Name:</strong>{" "}
        {row.leadId
          ? row?.leadId?.fullName?.first + " " + row?.leadId?.fullName?.last
          : row?.userId?.name}
      </Typography>
      <Typography sx={{ display: "flex", gap: 1,mb:1 }}>
        <strong>Email:</strong>
        <Tooltip title={row.leadId ? row?.leadId?.email : row?.userId?.email}>
          <Box
            component="span"
            sx={{
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
            }}
          >
            {row.leadId ? row?.leadId?.email : row?.userId?.email}
          </Box>
        </Tooltip>
      </Typography>
      <Typography sx={{mb:1}}>
        <strong>Phone:</strong>{" "}
        {row.leadId ? row?.leadId?.phone : row?.userId?.phone}
      </Typography>
      <Typography
        sx={{ display: "flex", gap: 1,color: row.status === "Passport Delivered" ? "green" : "black",mb:1 }}
      >
        <strong>Status:</strong>
        <Tooltip title={row?.status}>
          <Box
            component="span"
            sx={{
               color:
                          row?.status === "COMPLETED"
                            ? "green"
                            : "black",
              maxWidth: 200,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "inline-block",
              fontWeight:row?.status === "COMPLETED"?600:0
            }}
          >
            {row?.status}
          </Box>
        </Tooltip>
      </Typography>
      {/* <Divider sx={{ my: 1 }} /> */}
      <Box>
        <Button
          onClick={() => handleNavigation(row)}
           variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: "10px",
                  color: "black",
                  borderColor: "black",
                }}
        >
          View &gt;
        </Button>
      </Box>
    </Box>
  );

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
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
          sx={{ mb: 2, minWidth: 150 }}
        >
          <MenuItem value="All">All</MenuItem>
          {stepsData.map((step: string, index: number) => (
            <MenuItem key={index} value={step}>
              {step}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {isMobile ? (
        <>
          {filteredData.length === 0 ? (
            <Typography textAlign="center">
              No applications going on right now.
            </Typography>
          ) : (
            paginatedData.map((row: any, index: number) =>
              renderCardView(row, index)
            )
          )}
        </>
      ) : (
        <TableContainer sx={{ overflowX: "auto" }}>
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
                    sx={{ color: "#8D8883" }}
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
                paginatedData.map((row: any, index: any) => (
                  <TableRow key={index} sx={{ borderBottom: "none" }}>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row?.nanoVisaApplicationId}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.leadId
                        ? row?.leadId?.fullName?.first +
                          " " +
                          row?.leadId?.fullName?.last
                        : row?.userId?.name}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.leadId ? row?.leadId?.email : row?.userId?.email}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {row.leadId ? row?.leadId?.phone : row?.userId?.phone}
                    </TableCell>
                    <TableCell
                      sx={{
                        borderBottom: "none",
                        color:
                          row?.status === "COMPLETED"
                            ? "green"
                            : "black",
                             fontWeight:row?.status === "COMPLETED"?600:0
                      }}
                    >
                      {row?.status}
                    </TableCell>
                    <TableCell align="right" sx={{ borderBottom: "none" }}>
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
      )}

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
