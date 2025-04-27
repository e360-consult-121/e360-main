import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AllConsultationsTypes } from "../../consultations/consultationTypes";
import dayjs from "dayjs";

interface TableProps {
  data: AllConsultationsTypes[] | undefined;
}

const RecentConsultations: React.FC<TableProps> = ({ data }) => (
  <Paper
    sx={{
      width: "413px",
      p: 2,
      borderRadius: "15px",
      boxShadow: "none",
      bgcolor: "#F6F5F5",
        // overflowX:"hidden"
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center"
    sx={{
        mb:2
    }}
    >
      <Typography sx={{ fontWeight: "bold", fontSize: "18px"}}>
        Scheduled Consultations
      </Typography>
      {/* <Link href="#" underline="hover" fontSize="14px" fontWeight={500} color="primary">View All</Link> */}
    </Box>

    {/* Table */}
    <TableContainer
    sx={{
        overflowX:"hidden"
    }}
    >
  <Table>
    <TableHead>
      <TableRow>
        {["Name", "Date & Time", "Action"].map((header) => (
          <TableCell
            key={header}
            sx={{ color: "#8D8883" }}
          >
            {header}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>

    <TableBody>
  {data && data.length > 0 ? (
    data.map((consultation: any, index: any) => (
      <TableRow key={index}>
        <TableCell sx={{ borderBottom: "none", fontSize: "13px" }}>
          {consultation.name}
        </TableCell>

        <TableCell sx={{ borderBottom: "none", whiteSpace: "nowrap", fontSize: "13px" }}>
          {dayjs(consultation.startTime).format("D MMM  h:mm A")}
        </TableCell>

        <TableCell sx={{ borderBottom: "none" }}>
          {consultation.status === "CANCELLED" ? null : consultation.status === "SCHEDULED" ? (
            <Box sx={{ display: "flex", gap: "3px" }}>
              <a href={consultation?.rescheduleUrl} target="_blank">
                <Button
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: "0.7rem",
                    padding: "8px 5px",
                    minWidth: "auto",
                    lineHeight: 1.2,
                    textTransform: "none",
                    borderColor: "black",
                    borderRadius: "12px",
                    color: "black",
                  }}
                >
                  Reschedule
                </Button>
              </a>
              <a href={consultation?.joinUrl} target="_blank">
                <Button
                  size="small"
                  sx={{
                    fontSize: "0.7rem",
                    padding: "9px 7px",
                    minWidth: "auto",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                    backgroundColor: "#F6C328",
                    color: "black",
                    textTransform: "none",
                    borderRadius: "12px",
                  }}
                >
                  Join Now
                </Button>
              </a>
            </Box>
          ) : null}
        </TableCell>
      </TableRow>
    ))
  ) : (
    <TableRow>
      <TableCell colSpan={3} align="center" sx={{ fontSize: "14px", color: "#999", py: 2 }}>
        No recent consultations
      </TableCell>
    </TableRow>
  )}
</TableBody>

  </Table>
</TableContainer>

  </Paper>
);

export default RecentConsultations;
