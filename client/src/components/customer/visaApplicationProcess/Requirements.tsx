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
import { useState } from "react";
import MedicalDetails from "./Medical/MedicalDetails";
import TradeDetails from "./TradeName/TradeDetails";
import { canProceedToNextStep } from "../../../pages/customer/dashboard/VisaApplicationProcess";
import UploadComponent from "./UploadComponent";
import UploadModal from "../../UploadModal";
import ProcessComponent from "./ProcessComponent";
import DocumentsSubmittedMobile from "./DocumentsSubmittedMobile";

const Requirements = ({
  phase,
  requirementData,
  stepType,
  stepStatus,
  refetch,
  onSubmit,
}: {
  phase: string;
  requirementData: any;
  stepType: string;
  stepStatus: string;
  refetch: () => void;
  onSubmit: () => void;
}) => {
  const [reqStatusId, setReqStatusId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  if (stepType === "GENERAL") {
    return (
      <>
        <div className="flex flex-col mt-10 md:mt-24 overflow-y-auto md:h-72 custom-scrollbar">
          {phase === "IN_PROGRESS" ? (
            <>
              <p className="text-[#282827] text-[18px] font-bold">Documents</p>
              {requirementData.map((data: any) => (
                <div key={data.reqStatusId} className="mt-4">
                  <UploadComponent d={data} phase={phase} refetch={refetch} />
                </div>
              ))}
            </>
          ) : (
            <>
              <div className="hidden md:block">
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell width="50%">
                          <Typography variant="body2" fontWeight={600}>
                            Documents
                          </Typography>
                        </TableCell>
                        <TableCell width="15%">
                          <Typography variant="body2" fontWeight={600}>
                            Status
                          </Typography>
                        </TableCell>
                        <TableCell width="25%">
                          <Typography variant="body2" fontWeight={600}>
                            Remarks
                          </Typography>
                        </TableCell>
                        <TableCell width="30%" sx={{ textAlign: "center" }}>
                          <Typography variant="body2" fontWeight={600}>
                            Action
                          </Typography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {requirementData.map((data: any) => (
                        <TableRow key={data.fileName}>
                          <TableCell>
                            <UploadComponent
                              d={data}
                              phase={phase}
                              refetch={refetch}
                            />
                          </TableCell>
                          <TableCell>
                            {data.reqStatus === "VERIFIED" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: "#65AE64",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    color: "#65AE64",
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Approved
                                </Typography>
                              </Box>
                            ) : data.reqStatus === "UPLOADED" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: "#8D8982",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    color: "#8D8982",
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Pending
                                </Typography>
                              </Box>
                            ) : data.reqStatus === "RE_UPLOAD" ||
                              data.reqStatus === "NOT_UPLOADED" ? (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: "#F54236",
                                  }}
                                />
                                <Typography
                                  sx={{
                                    color: "#F54236",
                                    fontSize: "14px",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  Needs Re-Upload
                                </Typography>
                              </Box>
                            ) : null}
                          </TableCell>

                          <TableCell>
                            {data.reason && (
                              <Typography
                                variant="caption"
                                color="black"
                                sx={{ fontSize: "14px" }}
                              >
                                {data.reason}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Box
                              sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 1,
                              }}
                            >
                              {(data.reqStatus === "RE_UPLOAD" ||
                                data.reqStatus === "NOT_UPLOADED") && (
                                <button
                                  className="bg-transparent border border-neutrals-400 py-1 px-3 text-neutrals-400 text-sm rounded-xl cursor-pointer whitespace-nowrap"
                                  onClick={() => {
                                    setReqStatusId(data.reqStatusId);
                                    setIsUploadModalOpen(true);
                                  }}
                                >
                                  Re-Upload
                                </button>
                              )}
                              <button className="bg-[#F6C328] py-1 px-3 text-neutrals-950 text-sm rounded-xl cursor-pointer whitespace-nowrap">
                                Preview
                              </button>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                {reqStatusId && (
                  <UploadModal
                    isUploadModalOpen={isUploadModalOpen}
                    setIsUploadModalOpen={setIsUploadModalOpen}
                    reqStatusId={reqStatusId}
                    refetch={refetch}
                  />
                )}
              </div>
              <div className="md:hidden">
                <p className="font-bold text-[18px] text-black flex items-start mb-2">
                  Documents
                </p>
                {requirementData.map((d: any) => (
                  <DocumentsSubmittedMobile
                    reqStatusId={d.reqStatusId}
                    fileName={d.question}
                    fileSize="12MB"
                    fileType={d.requirementType}
                    reqStatus={d.reqStatus}
                    phase={phase}
                    value={d.value}
                    refetch={refetch}
                    reason={d.reason}
                  />
                ))}
              </div>
            </>
          )}
        </div>
        <div className="flex justify-center md:justify-start mx-2 mt-10 md:mt-6">
          {stepStatus !== "SUBMITTED" && (
            <button
              onClick={onSubmit}
              className={`px-10 py-2 rounded-4xl ${
                canProceedToNextStep(requirementData)
                  ? "bg-[#F6C328] text-black cursor-pointer"
                  : "bg-[#E4E3E3] text-[#7F7E7D] cursor-not-allowed"
              }`}
              disabled={!canProceedToNextStep(requirementData)}
            >
              Submit Documents
            </button>
          )}
        </div>
      </>
    );
  } else if (stepType === "MEDICAL") {
    return (
      <div className="flex flex-col mt-6 overflow-y-auto custom-scrollbar">
        {phase === "IN_PROGRESS" ? (
          <>
            <MedicalDetails />
          </>
        ) : (
          <>
            {/* Processing component */}
            <ProcessComponent
              label="Processing"
              date="13 Feb 2025, 12:30 P.M."
              status="in_progress"
            />
          </>
        )}
      </div>
    );
  } else if (stepType === "TRADE_NAME") {
    return (
      <div className="flex flex-col mt-6 overflow-y-auto custom-scrollbar">
        {phase === "IN_PROGRESS" ? (
          <>
            <TradeDetails />
          </>
        ) : (
          <>
            {/* Processing component */}
            <ProcessComponent
              label="Processing"
              date="13 Feb 2025, 12:30 P.M."
              status="in_progress"
            />
          </>
        )}
      </div>
    );
  }
};

export default Requirements;
