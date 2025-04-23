import { Box, Typography, Button, Paper } from "@mui/material";
import { Icon } from "@iconify/react/dist/iconify.js";

const DocumentComponent = ({
  fileName,
  fileType,
  fileSize,
  status
}: {
  fileName: string;
  fileType: string;
  fileSize: string;
  status: string;
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #eee"
      }}
    >
      <Box display="flex" alignItems="center" gap={3}>
        <div
                  className={`${
                    status === "UPLOADED"
                      ? "bg-golden-yellow-100 text-neutrals-950"
                      : "bg-neutrals-200 text-white"
                  }   p-3 rounded-xl`}
                >
                  <Icon
                    icon={`${
                      status === "UPLOADED"
                        ? "icon-park-outline:done-all"
                        : "icon-park-outline:upload"
                    }`}
                    width="24"
                    height="24"
                  />
                </div>
        <Box>
          <Typography sx={{fontSize:"14px"}} fontWeight={600}>{fileName}</Typography>
          <Typography color="text.secondary" sx={{fontSize:"12px"}}>
            File Format: {fileType} &nbsp;&nbsp; File Size: {fileSize}
          </Typography>
        </Box>
      </Box>

      <Box display="flex" gap={1}>
        <Button size="small" 
        variant="outlined"
        sx={{
          textTransform:"none",
          borderColor:"#282827",
          color:"#282827",
          borderRadius:"12px"
        }}>
          Preview
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ 
            textTransform:"none",
            color: "#64AF64", 
            borderColor: "#64AF64", 
            borderRadius:"12px"
          }}
        >
          Mark as Verified
        </Button>
        <Button
          variant="outlined"
          size="small"
          sx={{ 
            textTransform:"none",
            color: "red", borderColor: "red",
            borderRadius:"12px" 
          }}
        >
          Needs Re-Upload
        </Button>
      </Box>
    </Paper>
  );
};

export default DocumentComponent;
