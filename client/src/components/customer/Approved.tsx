import { Button } from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const Approved = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Verified Icon Container */}
      <div className="rounded-full border-[20px] border-golden-yellow-50 w-fit">
        <div className="rounded-full border-[15px] border-[#FEFCEA]">
          <div className="text-neutrals-50 bg-[#FAE081] p-8 rounded-full">
          <DoneAllIcon sx={{ color: "black", fontSize: 100 }} />
          </div>
        </div>
      </div>

      {/* Verified Message */}
      <p className="mt-4 text-lg">Your documents have been Verified.</p>

      {/* Continue Button */}
      <Button
        variant="outlined"
        sx={{
          borderColor:"black", 
          my: 5,
          color:"black",
          borderRadius:"15px",
          textTransform:"none",
          px:6,
          py:1
         }}
      >
        Continue
      </Button>
    </div>
  );
};

export default Approved;
