import  { useState } from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControlLabel, TextField, Typography } from "@mui/material";
import LoadingGif from "../../../../assets/customer/Rightt.gif"

const TradeNameApproved = ({ onContinue }:{onContinue: () => void }) => {
  const [open, setOpen] = useState(false);
  const [tradeName, setTradeName] = useState("");
  const [altName1, setAltName1] = useState("");
  const [altName2, setAltName2] = useState("");
  const [reason, setReason] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setTradeName("");
    setAltName1("");
    setAltName2("");
    setReason("");

    setOpen(false);
  };

  const handleSubmit = () => {
    console.log({
      tradeName,
      altName1,
      altName2,
      reason
    });
    // api to change trade name
    handleClose();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Verified Icon Container */}
      <div className="rounded-full border-[20px] border-golden-yellow-50 w-fit">
        <div className="rounded-full border-[15px] border-[#FEFCEA]">
          <div className="text-neutrals-50 bg-[#FAE081] rounded-full">
          <img
          className="w-[90px] h-[90px]"
          src={LoadingGif}
          />
          </div>
        </div>
      </div>

      {/* Verified Message */}

      <p className="mt-4 text-lg">Trade name Approved.</p>
      {/* Request is approved */}
      {/* <p className="mt-4 text-lg text-[#6FB46F] font-bold">Trade Name Change Approved.</p> */}
      {/* Request is rejected */}
      {/* <p className="mt-4 text-lg text-[#F44336] font-bold">Trade Name Change Rejected.</p> */}
      <p className="mt-4 text-[20px] font-bold">Trade name : ABC Traders</p>

      <FormControlLabel
        control={
          <Checkbox
            sx={{
              color: "black",
              "&.Mui-checked": {
                color: "black",
              },
            }}
          />
        }
        label="I confirm this trade name for my business."
      />

      {/* Continue Button */}
      <Button
        onClick={onContinue}
        sx={{
          backgroundColor: "#F6C328",
          my: 1,
          color: "black",
          borderRadius: "15px",
          textTransform: "none",
          px: 6,
          py: 1,
        }}
      >
        Confirm & Proceed
      </Button>

      {/* Request Change Trigger */}
      <p className="my-5">
        Is this trade name different from what you expected?{" "}
        <span
          className="font-bold text-[#F6C328] cursor-pointer"
          onClick={handleOpen}
        >
          Request change
        </span>
      </p>

      {/* Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle align="center" 
        sx={{
          fontWeight:"bold",
          fontSize:"24px"

        }}>Request Trade Name Change</DialogTitle>
        <DialogContent>
        <Typography align="center"
        sx={{
          fontSize:"16px"
        }}
        >Submit your new trade name request. Our team will review availability and update your trade license accordingly.</Typography> 
        <Box width="100%" maxWidth={500}>
        <Typography mb={1}>Trade Name*</Typography>
        <TextField
          fullWidth
          placeholder="Enter Trade Name"
          variant="outlined"
          value={tradeName}
          onChange={(e) => setTradeName(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: '#F7F5F4',
            borderRadius: 1, 
            borderColor:"#0F1EF"
          }}
        />

        <Typography mb={1}>Alternate Trade Name 1*</Typography>
        <TextField
          fullWidth
          placeholder="Enter New Trade Name"
          variant="outlined"
          value={altName1}
          onChange={(e) => setAltName1(e.target.value)}
          sx={{
            mb: 3,
            backgroundColor: '#F7F5F4',
            borderRadius: 1,
            borderColor:"#0F1EF"
          }}
        />

        <Typography mb={1}>Alternate Trade Name 2*</Typography>
        <TextField
          fullWidth
          placeholder="Enter New Trade Name"
          variant="outlined"
          value={altName2}
          onChange={(e) => setAltName2(e.target.value)}
          sx={{
            mb: 4,
            backgroundColor: '#F7F5F4',
            borderRadius: 1,
            borderColor:"#0F1EF"
          }}
        />
        <Typography mb={1} sx={{fontWeight:"bold"}}>Reason for change</Typography>
        <TextField
          fullWidth
          placeholder="You can provide a reason for change."
          variant="outlined"
          value={altName2}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            mb: 4,
            backgroundColor: '#F7F5F4',
            borderRadius: 1,
            borderColor:"#0F1EF"
          }}
        />

      </Box>
        </DialogContent>
        <DialogActions sx={{
          display:"flex",
          justifyContent:"center"
        }}>
          <Button onClick={handleClose} sx={{  backgroundColor: "#F6C328",
          color: "black",
          borderRadius: "15px",
          textTransform: "none",
          px: 6,
          py: 1, }}>
            Request Change
          </Button>
          <Button variant="outlined" onClick={handleSubmit} 
          sx={{  borderRadius: "15px",color: "black" , textTransform:"none" ,borderColor:"black",px: 6,
            py: 1,}}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default TradeNameApproved;
