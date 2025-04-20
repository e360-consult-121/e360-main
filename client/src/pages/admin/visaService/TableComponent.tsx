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

interface TableData {
  CaseID: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

interface Props {
  data: TableData[];
}

const TableComponent: React.FC<Props> = ({ data }) => {
  const {type} = useParams()
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [statusFilter, setStatusFilter] = useState("All");

  const navigate = useNavigate();


  const handleNavigation = (row: TableData) => {
    // console.log(row)
    navigate(`/admin/dominica/${row.CaseID}`, { state: { row } });
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
      : data.filter((row) => row.status === statusFilter);

  return (
    <Paper sx={{ p: 2, boxShadow: "none" }}>
      
      <Box 
      sx={{
        display:"flex",
        justifyContent:"space-between",
        alignItems:"center"
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
        <MenuItem value="Documents Uploaded">Documents Uploaded</MenuItem>
        <MenuItem value="Investment Documents Uploaded">
          Investment Documents Uploaded
        </MenuItem>
        <MenuItem value="Pending Investment">Pending Investment</MenuItem>
        <MenuItem value="Passport Delivered">Passport Delivered</MenuItem>
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
                    color:"#8D8883"
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <TableRow key={index} 
                sx={{
                  borderBottom:"none"
                }}
                >
                  <TableCell sx={{ borderBottom: "none" }}>{row.CaseID}</TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>{row.name}</TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>{row.email}</TableCell>
                  <TableCell sx={{ borderBottom: "none" }}>{row.phone}</TableCell>
                  <TableCell
                    sx={{
                      borderBottom: "none",
                      color:
                        row.status === "Passport Delivered" ? "green" : "black",
                    }}
                  >
                    {row.status}
                  </TableCell>
                  <TableCell align="right" 
                  sx={{ 
                    borderBottom: "none",
                    cursor: "pointer" 
                    }}>
                    <Button
                    onClick={()=>handleNavigation(row)}
                    sx={{textTransform:"none"}}
                    >View &gt;</Button>
                  </TableCell>
                </TableRow>
              ))}
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
