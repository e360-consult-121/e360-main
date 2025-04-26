import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import UploadModal from "../../../UploadModal";

interface FileDataType {
  fileName: string;
  fileType?: string;
  fileSize?: string;
  reqStatus?: string;
  phase?: string;
  value:string;
  reqStatusId:string
  refetch:()=>void
}

const AdminDocumentUpload = ({
  fileName,
  fileType,
  fileSize,
  reqStatus,
//   phase,
  value,
  reqStatusId,
  refetch
}: FileDataType) => {

  // console.log(reqStatusId)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);

  return (
    <div className="w-full flex items-center justify-between border-b border-neutrals-50 p-3">
      <UploadModal
        isUploadModalOpen={isUploadModalOpen}
        setIsUploadModalOpen={setIsUploadModalOpen}
        reqStatusId={reqStatusId}
        refetch={refetch}
      />

      {/* Left portion */}
      <div className="flex items-center space-x-5">
        <div
          className={`${
            reqStatus === "UPLOADED" || reqStatus === "VERIFIED"
              ? "bg-golden-yellow-100 text-neutrals-950"
              : "bg-neutrals-200 text-white"
          }   p-3 rounded-xl`}
        >
          <Icon
            icon={`${
              reqStatus === "UPLOADED"
                ? "icon-park-outline:done-all"
                : "icon-park-outline:upload"
            }`}
            width="24"
            height="24"
          />
        </div>

        <div className="flex flex-col space-y-1">
          <h1 className="text-neutrals-950 text-sm font-semibold">
            {fileName}
          </h1>
          <div className="flex space-x-3 text-neutrals-400 text-xs">
            <p>File Format: {fileType}</p>
            <p>Max. File Size: {fileSize}</p>
          </div>
        </div>
      </div>

      {/* Right portion */}
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept="image/png, application/pdf"
          className="hidden"
        />
          <>
            {reqStatus === "UPLOADED" || reqStatus === "VERIFIED" ? (
              <>
                <button
                  className="bg-transparent border border-neutrals-400 py-1 px-3 text-neutrals-400 text-sm rounded-xl cursor-pointer"
                  onClick={() => setIsUploadModalOpen(true)}
                >
                  Re-Upload
                </button>

                <a href={value} target="_blank">
                <button className="bg-golden-yellow-400 py-1 px-3 text-neutrals-950 text-sm rounded-xl cursor-pointer">
                  Preview
                </button>
                </a>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsUploadModalOpen(true);
                }}
                className="bg-neutrals-500 py-1 px-3 text-neutrals-50 text-sm rounded-xl cursor-pointer"
              >
                Upload File 
              </button>
            )}
          </>
      </div>
    </div>
  );
};

export default AdminDocumentUpload;
