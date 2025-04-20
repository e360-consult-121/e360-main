import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import Map from "../../../../assets/Admin/Map.png";
import { RevenueDataTypes } from "../dashboardTypes";

const RevenueCard = ({ data }: { data: RevenueDataTypes[] }) => {
  const maxRevenue = Math.max(...data.map((item) => item.totalRevenue), 1); 

  return (
    <Card
      sx={{
        boxShadow: "none",
        bgcolor: "#FEFDEB",
        borderRadius: "15px",
        minWidth: "300px",
        p: 0,
      }}
    >
      <CardContent>
        <Typography sx={{ fontWeight: "bold", fontSize: "18px",mb:5 }}>
          Revenue by Location
        </Typography>
        <img src={Map} alt="Map" />
        <Stack sx={{ mt: 2, gap: "16px" }}>
          {data.map((item) => (
            <Box key={item.visaType}>
              <Stack direction="row" justifyContent={"space-between"}>
                <Typography fontSize={"12px"}>{item.visaType}</Typography>
                <Typography fontSize={"12px"}>
                  ${Math.round(item.totalRevenue / 1000)}K
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                value={(item.totalRevenue / maxRevenue) * 100}
              />
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RevenueCard;
