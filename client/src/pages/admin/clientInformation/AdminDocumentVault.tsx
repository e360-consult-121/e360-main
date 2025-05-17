import { useParams } from "react-router-dom";
import { useFetchVaultDocsQuery } from "../../../features/customer/documentVault/documentVaultApi";
import { useEffect, useState } from "react";
import { VaultDocsResponse } from "../../../features/customer/documentVault/doumentVaultTypes";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { DocumentVaultAccordion } from "../../../components/DocumentVaultAccordion";

const AdminDocumentVault = () => {
  const { visatype } = useParams();
  const visaApplicationId = visatype;
  const { data, isLoading, isError } =
    useFetchVaultDocsQuery(visaApplicationId);

  const [vaultDocs, setVaultDocs] = useState<
    VaultDocsResponse["result"] | null
  >(null);
  console.log(data);
  useEffect(() => {
    if (data?.result) {
      setVaultDocs(data.result);
    }
  }, [data]);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-full mt-[70%] md:mt-0">
        {" "}
        <CircularProgress />
      </div>
    );
  if (isError || !vaultDocs)
    return <Typography sx={{ m: 5 }}>Failed to load documents.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <div className="flex justify-end">
        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            color: "black",
            borderRadius: "20px",
            boxShadow: "none",
          }}
        >
          Upload Document
        </Button>
      </div>
      <div className="px-2">
        {vaultDocs.adminUploaded &&
          DocumentVaultAccordion("Admin Uploaded", vaultDocs.adminUploaded)}
        {vaultDocs.userUploaded &&
          DocumentVaultAccordion("User Uploaded", vaultDocs.userUploaded)}
      </div>
    </Box>
  );
};

export default AdminDocumentVault;
