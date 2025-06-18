import React, { useState } from "react";
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
  Box,
  MenuItem,
  Tooltip,
} from "@mui/material";
import { AllLeads } from "../../../features/admin/leadManagement/leadManagementTypes";
import { formatDate } from "../../../utils/FormateDate";
import { useNavigate } from "react-router-dom";

interface LeadTableProps {
  data: AllLeads[];
}

const LeadTable: React.FC<LeadTableProps> = ({ data }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortOrder, setSortOrder] = useState("Newest First");
  const navigate = useNavigate();

  const handleNavigation = (row: AllLeads) => {
    // console.log(row)
    navigate(`/admin/leadmanagement/${row._id}`);
  };

  // Handle page change
  const handleChangePage = (_event: any, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle sorting change
  const handleSortChange = (event: any) => {
    setSortOrder(event.target.value);
    setPage(0);
  };

  // Sort data based on the selected order
  const sortedData = [...data].sort((a, b) => {
    if (sortOrder === "Oldest First") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          // gap:1
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bolder",mb:1 }}>
          Lead Management
        </Typography>

        <Select
          value={sortOrder}
          onChange={handleSortChange}
          displayEmpty
          sx={{mb:1, float: "right" }}
        >
          <MenuItem value="Newest First">Newest First</MenuItem>
          <MenuItem value="Oldest First">Oldest First</MenuItem>
        </Select>
      </Box>

      {/* Desktop Table View */}
      <Box display={{ xs: "none", md: "block" }}>
        <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  "Name",
                  "Email",
                  "Phone Number",
                  "Submission Date",
                  "Priority",
                  "Action",
                ].map((header) => (
                  <TableCell key={header} sx={{ color: "#8D8883" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((lead, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {lead.fullName.first + lead.fullName.last}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {lead.email}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {lead.phone}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      {formatDate(lead.createdAt)}
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Typography
                        sx={{
                          color:
                            lead?.additionalInfo?.priority === "HIGH"
                              ? "red"
                              : lead?.additionalInfo?.priority === "MEDIUM"
                              ? "orange"
                              : "green",
                        }}
                      >
                        {lead?.additionalInfo?.priority
                          ?.toLowerCase()
                          .replace(/^./, (c: any) => c.toUpperCase())}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ borderBottom: "none" }}>
                      <Button
                        sx={{ color: "black", textTransform: "none" }}
                        onClick={() => handleNavigation(lead)}
                      >
                        View &gt;
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={sortedData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </Box>

      {/* Mobile Card View */}
      <Box display={{ xs: "block", md: "none" }}>
        {sortedData
          .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
          .map((lead, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                my: 2,
                border: "1px solid black",
                borderRadius: "12px",
              }}
            >
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>Name</Typography>
                <Typography>
                  {lead.fullName.first + lead.fullName.last}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>Email</Typography>
                <Typography>
                  <Tooltip title={lead.email}>
                    <Box
                      component="span"
                      sx={{
                        maxWidth: 150,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "inline-block",
                      }}
                    >
                      {lead.email}
                    </Box>
                  </Tooltip>
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>Phone</Typography>
                <Typography>{lead.phone}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>Submission Date</Typography>
                <Typography>{formatDate(lead.createdAt)}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography fontWeight={600}>Priority</Typography>
                <Typography
                  sx={{
                    color:
                      lead?.additionalInfo?.priority === "HIGH"
                        ? "red"
                        : lead?.additionalInfo?.priority === "MEDIUM"
                        ? "orange"
                        : "green",
                  }}
                >
                  {lead?.additionalInfo?.priority
                    ?.toLowerCase()
                    .replace(/^./, (c: any) => c.toUpperCase())}
                </Typography>
              </Box>
              <Button
                variant="outlined"
                fullWidth
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: "10px",
                  color: "black",
                  borderColor: "black",
                }}
                onClick={() => handleNavigation(lead)}
              >
                View &gt;
              </Button>
            </Paper>
          ))}
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
};

export default LeadTable;
