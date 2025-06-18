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
import { RecentUpdatesTypes } from "../dashboardTypes";
import { useNavigate } from "react-router-dom";

const RecentUpdates = ({ data }: { data: RecentUpdatesTypes[] }) => {
  const navigate = useNavigate();

  return (
    <Card
      sx={{
        bgcolor: "#F6F5F5",
        width: "100%",
        borderRadius: "15px",
        boxShadow: "none",
        overflowX: "auto",
      }}
    >
      <CardContent>
        <Typography
          sx={{
            fontWeight: "bold",
            fontSize: "18px",
            mb: 2,
            textAlign: { xs: "left", sm: "left" },
          }}
        >
          Recent Updates
        </Typography>

        {/* Responsive wrapper for horizontal scroll on mobile */}
        <div style={{ overflowX: "auto" }}>
          <Table
            size="small"
            sx={{
              minWidth: "280px",
              tableLayout: "auto",
              "& th, & td": {
                whiteSpace: "nowrap",
              },
            }}
          >
            <TableHead>
              <TableRow>
                {["CaseID", "Name", "Status", "Action"].map((header) => (
                  <TableCell
                    key={header}
                    sx={{ color: "#8D8883", fontWeight: "bold" }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((id) => (
                <TableRow key={id.caseId?.nanoVisaApplicationId}>
                  <TableCell>{id.caseId?.nanoVisaApplicationId}</TableCell>
                  <TableCell>{id.name}</TableCell>
                  <TableCell>{id.status}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() =>
                        navigate(`/admin/application/${id.caseId._id}`, {
                          state: { row: { ...id, leadId: id.caseId?.leadId } },
                        })
                      }
                      size="small"
                      sx={{
                        textTransform: "none",
                        color: "#000",
                        fontWeight: 500,
                      }}
                    >
                      View &gt;
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUpdates;
