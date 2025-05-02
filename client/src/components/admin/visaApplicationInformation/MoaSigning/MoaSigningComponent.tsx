import {
  useFetchMoaInfoQuery,
  useUploadMoaMutation,
} from "../../../../features/admin/visaApplication/additional/dubaiApis";
import DocumentUpload from "../../../DocumentUpload";

const MoaSigningComponent = ({ stepStatusId }: { stepStatusId: string }) => {
  const { data, refetch } = useFetchMoaInfoQuery({ stepStatusId });
  const [uploadMoa, { isLoading: isUploadMoaLoading }] = useUploadMoaMutation();

  const handleUploadMoa = async (file: File) => {
    try {
      await uploadMoa({ stepStatusId, file }).unwrap();
      await refetch();
      alert("Upload successful");
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div>
      <>
        <DocumentUpload
          fileName="MOA Document"
          fileSize="12 MB"
          fileType="PDF"
          value={data?.data?.moaDocument}
          isLoading={isUploadMoaLoading}
          uploadFunction={handleUploadMoa}
        />

        {data?.data?.moaStatus === "MOA_Uploaded" && (<p className="p-4">Waiting for user to upload signature...</p>)}
        {data?.data?.moaStatus === "Sig_Uploaded" && (
          <div className="p-4 border-2 border-gray-200 w-fit rounded-2xl overflow-hidden">
            <iframe src={data?.data?.signatureFile}></iframe>
          </div>
        )}
      </>
    </div>
  );
};

export default MoaSigningComponent;
