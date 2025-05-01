import {
  Button,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AllLeads } from "../../leadManagement/leadManagementTypes";
import { formatDate } from "../../../../utils/FormateDate";
import { useNavigate } from "react-router-dom";

interface LeadTableProps {
  data: AllLeads[];
}

const RecentLeadManagement: React.FC<LeadTableProps> = ({ data }) => {
  // console.log(leadData)
  const navigate = useNavigate();

  const handleNavigation = (row: AllLeads) => {
    // console.log(row)
    navigate(`/admin/leadmanagement/${row._id}`);
  };
  return (
    <Card
      sx={{
        boxShadow: "none",
        bgcolor: "#F6F5F5",
        ml: 2,
        width: "90%",
        borderRadius: "15px",
      }}
    >
      <CardContent>
        <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
          Lead Management
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {["Name", "Email", "Submission Date", "Priority", "Action"].map(
                (header) => (
                  <TableCell key={header} sx={{ color: "#8D8883" }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((lead: any, index: any) => (
              <TableRow key={index}>
                <TableCell sx={{ borderBottom: "none" }}>
                  {lead.fullName.first + lead.fullName.last}
                </TableCell>
                <TableCell sx={{ borderBottom: "none" }}>
                  {lead.email}
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
      </CardContent>
    </Card>
  );
};

export default RecentLeadManagement;
