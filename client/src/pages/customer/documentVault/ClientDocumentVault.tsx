import { useParams } from "react-router-dom";
import { Typography, CircularProgress, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { VaultDocsResponse } from "../../../features/customer/documentVault/doumentVaultTypes";
import DocumentVaultAccordion from "../../../components/DocumentVaultAccordion";
import { useFetchVaultDocsQuery } from "../../../features/common/commonApi";
import CategoryDocumentsAccordion from "../../../components/CategoryWiseDocumentsAccordion";

const ClientDocumentVault = () => {
  const { visaApplicationId } = useParams<{ visaApplicationId: string }>();

  const [categoryData, setCategoryData] = useState([]);
  const { data, isLoading, isError } =
    useFetchVaultDocsQuery(visaApplicationId);

  const [vaultDocs, setVaultDocs] = useState<
    VaultDocsResponse["result"] | null
  >(null);
  // console.log(data);
  useEffect(() => {
    if (data?.result) {
      setVaultDocs(data.result);
      setCategoryData(data.categoryWiseDocs);
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
      <Typography
        sx={{
          fontSize: "28px",
          fontWeight: "bold",
          // mx:5,
          mb: 5,
        }}
      >
        Document Vault
      </Typography>
      <div className="px-2">
        {vaultDocs.adminUploaded && (
          <DocumentVaultAccordion
            title="Admin Uploaded"
            stepsData={vaultDocs.adminUploaded}
            source="Client"
          />
        )}
        {vaultDocs.userUploaded && (
          <DocumentVaultAccordion
            title="User Uploaded"
            stepsData={vaultDocs.userUploaded}
            source="Client"
          />
        )}
        {categoryData && (
          <CategoryDocumentsAccordion
            categoryWiseDocs={categoryData}
            source="Client"
          />
        )}
      </div>
    </Box>
  );
};

export default ClientDocumentVault;
