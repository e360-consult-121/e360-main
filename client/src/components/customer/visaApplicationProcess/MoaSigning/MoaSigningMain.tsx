import { useEffect } from "react";
import { useFetchMoaInfoQuery, useUploadSignatureMutation } from "../../../../features/admin/visaApplication/additional/dubaiApis";
import ProcessComponent from "../ProcessComponent";
import SignatureUpload from "./SignatureUpload";

const MoaSigningMain = ({
  stepStatusId,
  onContinue,
}: {
  stepStatusId: string;
  onContinue: () => void;
}) => {
  const { data, refetch } = useFetchMoaInfoQuery({ stepStatusId });
  const [uploadSignature,{isLoading:isUploadSignatureLoading}] = useUploadSignatureMutation();
  useEffect(() => {
    console.log("data", data);
  }, [data]);

  const handleUploadMoa = async (file: File) => {
    try {
      await uploadSignature({ stepStatusId, file }).unwrap();
      await refetch();
      alert("Upload successful");
    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  if (data?.data === null || data?.data?.moaStatus === "Sig_Uploaded") {
    return <ProcessComponent date="" label="Processing" status="" />;
  }
  else if(data?.data?.moaStatus === "MOA_Uploaded") {
    return <SignatureUpload moaDocument={data?.data?.moaDocument} isLoading={isUploadSignatureLoading} signatureDocument={data?.data?.signatureFile} uploadSignature={handleUploadMoa}/>
  }
  

  return <div></div>;
};

export default MoaSigningMain;
