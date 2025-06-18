import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
} from "@mui/material";

// Sample log data
const logs = [
  { task: "Created new task", timestamp: "2025-06-17 10:00 AM" },
  { task: "Updated profile", timestamp: "2025-06-17 11:15 AM" },
  { task: "Deleted task", timestamp: "2025-06-17 12:30 PM" },
];

const LogsComponent: React.FC = () => {
  return (
    <Box p={{xs:1,md:2}}>
         <TableContainer component={Paper} sx={{boxShadow:"none"}}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><Typography sx={{fontSize:"16px",fontWeight:600}}>Task</Typography></TableCell>
              <TableCell><Typography sx={{fontSize:"16px",fontWeight:600}}>Timestamp</Typography></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, index) => (
              <TableRow key={index} sx={{ borderBottom: "none" }}>
                <TableCell>{log.task}</TableCell>
                <TableCell>{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LogsComponent;
