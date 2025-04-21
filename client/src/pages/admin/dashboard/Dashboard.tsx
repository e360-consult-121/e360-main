import {
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  LinearProgress,
  Paper,
  TableContainer,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import Map from "../../../assets/Admin/Map.png";

// Stats Card Component
const StatsCard = ({
  title,
  value,
  change,
  bgcolor,
}: {
  title: string;
  value: string;
  change: string;
  bgcolor: string;
}) => (
  <Card
    sx={{
      p: 2,
      textAlign: "center",
      bgcolor,
      boxShadow: "none",
      borderRadius: "15px",
    }}
  >
    <Typography
      sx={{
        fontWeight: "600",
        fontSize: "14px",
        display: "flex",
        justifyContent: "start",
      }}
    >
      {title}
    </Typography>
    <Box
      sx={{
        mt: 1,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Typography sx={{ fontWeight: "700", fontSize: "28px" }}>
        {value}
      </Typography>
      <Typography variant="caption" fontSize={"12px"}>
        {change}
      </Typography>
    </Box>
  </Card>
);

// Revenue by Location Component
const RevenueByLocation = () => (
  <Card
    sx={{
      boxShadow: "none",
      bgcolor: "#FEFDEB",
      borderRadius: "15px",
      minWidth: "300px",
      p: 3,
    }}
  >
    <CardContent>
      <Typography
        sx={{
          fontWeight: "bold",
          fontSize: "18px",
          // my:2
        }}
      >
        Revenue by Location
      </Typography>
      <img src={Map} />
      <Stack sx={{ mt: 2,gap:"16px" }}>
        {[
          { country: "Dominica", revenue: "$72K" },
          { country: "Granada", revenue: "$39K" },
          { country: "Portugal", revenue: "$25K" },
          { country: "Dubai", revenue: "$61K" },
        ].map((item) => (
          <Box>
            <Stack direction="row" justifyContent={"space-between"} key={item.country}>
              <Typography fontSize={"12px"}>{item.country}</Typography>
              <Typography fontSize={"12px"}>{item.revenue}</Typography>
            </Stack>
            <LinearProgress
              variant="determinate"
              value={Number(item.revenue)}
            />
          </Box>
        ))}
      </Stack>
    </CardContent>
  </Card>
);

// Recent Updates Component
const RecentUpdates = () => (
  <Card
    sx={{
      bgcolor: "#F6F5F5",
      ml: 2,
      width: "100%",
      borderRadius: "15px",
      p: 3,
      boxShadow: "none",
    }}
  >
    <CardContent>
      <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
        Recent Updates
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Case ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {["E360-DXB-001", "E360-DXB-002", "E360-DXB-003"].map((id, index) => (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell>Person {index + 1}</TableCell>
              <TableCell>Processing</TableCell>
              <TableCell>
                <Button
                  size="small"
                  color="success"
                  sx={{ textTransform: "none" }}
                >
                  Approve
                </Button>
                <Button
                  size="small"
                  color="error"
                  sx={{ textTransform: "none" }}
                >
                  Reject
                </Button>
                <Button
                  size="small"
                  sx={{ textTransform: "none", color: "black" }}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

interface Consultation {
  name: string;
  date: string;
}

const consultations: Consultation[] = [
  { name: "Chijioke Nkem", date: "12 Mar 2025, 10 AM" },
  { name: "Gang Chae", date: "12 Mar 2025, 10 AM" },
];

// Scheduled Consultations
const ScheduledConsultations = () => (
  <Paper
    sx={{
      width: "380px",
      p: 3,
      borderRadius: "15px",
      boxShadow: "none",
      bgcolor: "#F6F5F5",
    }}
  >
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography sx={{ fontWeight: "bold", fontSize: "18px" }}>
        Scheduled Consultations
      </Typography>
      {/* <Link href="#" underline="hover" fontSize="14px" fontWeight={500} color="primary">View All</Link> */}
    </Box>

    {/* Table */}
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Consultation date</TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {consultations.map((consultation, index) => (
            <TableRow key={index}>
              <TableCell>{consultation.name}</TableCell>
              <TableCell>{consultation.date}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#EAB308",
                    color: "black",
                    minWidth: "max-content",
                    borderRadius: 5,
                    textTransform: "none",
                  }}
                >
                  Join Now
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  </Paper>
);

interface LeadManagement {
  CaseID: string;
  name: string;
  email: string;
  submissiondate: string;
  priority: string;
}

const leadData: LeadManagement[] = [
  {
    CaseID: "E360-DXB-001",
    name: "Chijioke Nkem",
    email: "email@gmail.com",
    submissiondate: "12 Mar 2025",
    priority: "High",
  },
  {
    CaseID: "E360-DXB-002",
    name: "Gang Chae",
    email: "gangchae@gmail.com",
    submissiondate: "14 Mar 2025",
    priority: "Medium",
  },
  {
    CaseID: "E360-DXB-003",
    name: "Danielle Everett",
    email: "danielle.e@example.com",
    submissiondate: "15 Mar 2025",
    priority: "Low",
  },
  {
    CaseID: "E360-DXB-004",
    name: "Rashid Afaf",
    email: "rashid.afaf@example.com",
    submissiondate: "16 Mar 2025",
    priority: "High",
  },
];

// Lead Management Component
const LeadManagement = () => (
  <Card
    sx={{
      boxShadow: "none",
      bgcolor: "#F6F5F5",
      ml: 2,
      width: "100%",
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
            <TableCell>Case ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell>Submission date</TableCell>
            <TableCell>Priority</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {leadData.map((id) => (
            <TableRow key={id.CaseID}>
              <TableCell>{id.CaseID}</TableCell>
              <TableCell>{id.name}</TableCell>
              <TableCell>{id.email}</TableCell>
              <TableCell>{id.submissiondate}</TableCell>
              <TableCell>{id.priority}</TableCell>
              <TableCell>
                <Button size="small" sx={{color:"#000"}}>View</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

// Main Dashboard Component
const Dashboard = () => {
  return (
    <>
      <Box
        sx={{
          display: "grid",
          gap: 1,
          px: 5,
          my: 3,
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        }}
      >
        <StatsCard
          title="New Leads This Month"
          value="721K"
          change=""
          bgcolor="#F6F5F5"
        />
        <StatsCard
          title="Lead Conversion Rate"
          value="65%"
          change=""
          bgcolor="#FEFDEB"
        />
        <StatsCard
          title="Pending Applications"
          value="1,156"
          change=""
          bgcolor="#F6F5F5"
        />
        <StatsCard
          title="Completed Applications"
          value="239K"
          change=""
          bgcolor="#FEFDEB"
        />
      </Box>
      <Box
        sx={{
          my: 2,
          display: "flex",
          px: 5,
          // alignItems:"center"
        }}
      >
        <RevenueByLocation />
        <RecentUpdates />
      </Box>
      <Box
        sx={{
          my: 3,
          display: "flex",
          px: 5,
          // alignItems:"center"
        }}
      >
        <ScheduledConsultations />
        <LeadManagement />
      </Box>
    </>
  );
};

export default Dashboard;
