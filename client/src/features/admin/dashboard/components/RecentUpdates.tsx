import { Button, Card, CardContent, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { RecentUpdatesTypes } from "../dashboardTypes"

const RecentUpdates = ({data}:{data:RecentUpdatesTypes[]}) => {
  return (
    <Card
    sx={{
      bgcolor: "#F6F5F5",
      ml: 2,
      width: "100%",
      borderRadius: "15px",
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
              {["CaseID", "Name", "Status", "Action"].map(
                (header) => (
                  <TableCell key={header} sx={{ color: "#8D8883" }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
        <TableBody>
          {data.map((id) => (
            <TableRow key={id.caseId}>
              <TableCell>{id.caseId}</TableCell>
              <TableCell>{id.name}</TableCell>
              <TableCell>{id.status}</TableCell>
              <TableCell>
                <Button
                  size="small"
                  sx={{ textTransform: "none", color: "black" }}
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
  )
}

export default RecentUpdates