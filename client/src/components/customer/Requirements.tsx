import { Button, Chip, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import FileUploadComp from "./FileUploadComp"

const Requirements = ({phase}:{phase:string}) => {
  return (
    <div className="flex flex-col mt-6 overflow-y-auto h-56 custom-scrollbar">
     {phase === "IN_PROGRESS" ? (
      <>
      <p className="text-neutrals-950 text-sm font-semibold">Documents</p>
    <FileUploadComp 
    fileName={"Biometric Page of Passport"}
    fileType={"PNG"}
    fileSize={"12MB"}
    />
    </>
    )
    :
    <div>
      <TableContainer component={Paper}
      sx={{
        boxShadow:"none"
      }}
      >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><Typography variant="body2" fontWeight={600}>Documents</Typography></TableCell>
            <TableCell><Typography variant="body2" fontWeight={600}>Status</Typography></TableCell>
            <TableCell><Typography variant="body2" fontWeight={600}>Remarks</Typography></TableCell>
            <TableCell><Typography variant="body2" fontWeight={600}>Action</Typography></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell>
            <FileUploadComp 
            fileName={"Biometric Page of Passport"}
            fileType={"PNG"}
            fileSize={"12MB"}
            />
            </TableCell>
            <TableCell>
              {/* {document.status === "Approved" && <Chip icon={<CheckCircleIcon color="success" />} label="Approved" color="success" />}
              {document.status === "Pending" && <Chip label="Pending" color="warning" />}
              {document.status === "Needs Re-Upload" && (
                <Chip icon={<ErrorIcon color="error" />} label="Needs Re-Upload" color="error" />
              )} */}
            </TableCell>
            <TableCell>
              {/* {document.remarks && <Typography variant="caption" color="error">{document.remarks}</Typography>} */}
            </TableCell>
            <TableCell>
              <Button variant="contained" color="warning" size="small">Preview</Button>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
    </div> 
    
    
    }
  </div>
  )
}

export default Requirements