import { Button } from "@mui/material";
import LoadingGif from "../../../assets/customer/Rightt.gif"
const Approved = ({stepSource,requirementData, onContinue ,currentStepName}:{stepSource?:string,requirementData?:any,onContinue: () => void,currentStepName:string }) => {

  const document=stepSource==="ADMIN" ? requirementData[0]?.value :null

  return (
    <div className="flex flex-col items-center justify-center text-center mt-24">
      {/* Verified Icon Container */}
      <div className="rounded-full border-[20px] border-golden-yellow-50 w-fit">
        <div className="rounded-full border-[15px] border-[#FEFCEA]">
          <div className="text-neutrals-50 bg-[#FAE081] rounded-full">
          <img
          className="w-[100px] h-[100px]"
          src={LoadingGif}
          />
          </div>
        </div>
      </div>

      {/* Verified Message */}
      <p className="mt-4 text-lg">{currentStepName} - Approved</p>
      {document&& <Button variant="contained" sx={{textTransform:"none",borderRadius:"20px"}} onClick={()=>window.open(document)}>Download</Button>}

      {/* Continue Button */}
      <Button
      onClick={onContinue}
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
