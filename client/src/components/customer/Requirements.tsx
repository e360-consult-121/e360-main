import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import UploadComponent from "./UploadComponent";
import UploadModal from "./UploadModal";
import { useState } from "react";
import BankDetails from "./BankDetails";
import MedicalDetails from "./MedicalDetails";
import TradeDetails from "./TradeDetails";
import AdminStepSource from "./AdminStepSource";

const Requirements = ({
  phase,
  requirementData,
  stepType
}: {
  phase: string;
  requirementData: any;
  stepType: string;
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  if (stepType === "GENERAL") {
    return (
      <div className="flex flex-col mt-24 overflow-y-auto h-72 custom-scrollbar">
        {phase === "IN_PROGRESS" ? (
          <>
            <p className="text-neutrals-950 text-sm font-semibold">Documents</p>
            {requirementData.map((data: any) => (
              <div key={data.visaApplicationReqStatusId} className="mt-4">
                <UploadComponent d={data} phase={phase} />
              </div>
            ))}
          </>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell><Typography variant="body2" fontWeight={600}>Documents</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600}>Status</Typography></TableCell>
                    <TableCell><Typography variant="body2" fontWeight={600}>Remarks</Typography></TableCell>
                    <TableCell sx={{ textAlign: "center" }}><Typography variant="body2" fontWeight={600}>Action</Typography></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {requirementData.map((data: any) => (
                    <TableRow key={data.fileName}>
                      <TableCell>
                        <UploadComponent d={data} phase={phase} />
                      </TableCell>
                      <TableCell>
                        {data.reqStatus === "VERIFIED" ? (
                          <Typography sx={{ color: "#65AE64", fontSize: "14px" }}>• Approved</Typography>
                        ) : data.reqStatus === "UPLOADED" ? (
                          <Typography sx={{ color: "#8D8982", fontSize: "14px" }}>• Pending</Typography>
                        ) : data.reqStatus === "RE_UPLOAD" || data.reqStatus === "NOT_UPLOADED" ? (
                          <Typography sx={{ color: "#F54236", fontSize: "14px" }}>• Needs Re-Upload</Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {data.reason && (
                          <Typography variant="caption" color="black" sx={{ fontSize: "14px" }}>
                            {data.reason}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "end" }}>
                          {(data.reqStatus === "RE_UPLOAD" || data.reqStatus === "NOT_UPLOADED") && (
                            <button
                              className="bg-transparent border border-neutrals-400 py-1 px-3 text-neutrals-400 text-sm rounded-xl cursor-pointer"
                              onClick={() => setIsUploadModalOpen(true)}
                            >
                              Re-Upload
                            </button>
                          )}
                          <button className="bg-[#F6C328] py-1 px-3 text-neutrals-950 text-sm rounded-xl cursor-pointer ml-auto">
                            Preview
                          </button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <UploadModal
              isUploadModalOpen={isUploadModalOpen}
              setIsUploadModalOpen={setIsUploadModalOpen}
            />
          </>
        )}
      </div>
    );
  }

  else if(stepType === "BANK" ){
    return <div className="flex flex-col mt-6 overflow-y-auto custom-scrollbar ">
        {phase === "IN_PROGRESS" ? (
          <div className="mt-20">
          <BankDetails/>
          </div>
        ):(
          <>
          <AdminStepSource 
          label="Processing"
          date="13 Feb 2025, 12:30 P.M."
          status="in_progress"
          />
          </>
        )
        }
      
      </div>;
  }
  else if(stepType === "MEDICAL" ){
    return <div className="flex flex-col mt-6 overflow-y-auto custom-scrollbar">
        {phase === "IN_PROGRESS" ? (
          <>
          <MedicalDetails/>
          </>
        ):(
          <>
          </>
        )

        }
      
      </div>;
  }
  else if(stepType === "TRADE_NAME" ){
    return <div className="flex flex-col mt-6 overflow-y-auto custom-scrollbar">
        {phase === "IN_PROGRESS" ? (
          <>
          <TradeDetails/>
          </>
        ):(
          <>
          </>
        )

        }
      
      </div>;
  }

  
};

export default Requirements;
