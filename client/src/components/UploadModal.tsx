import { Modal } from "@mui/material";
import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { useUploadDocumentMutation } from "../features/common/commonApi";


interface UploadModalProps {
  isUploadModalOpen: boolean;
  setIsUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reqStatusId: string;
  refetch:()=> void 
}

const UploadModal = ({
  isUploadModalOpen,
  setIsUploadModalOpen,
  reqStatusId,
  refetch
}: UploadModalProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // const test = true;
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    try {
      // console.log(file)
      await uploadDocument({ reqStatusId, file }).unwrap();
      alert("Document uploaded successfully!");
      setIsUploadModalOpen(false);
      refetch()
    } catch (err: any) {
      alert(err?.data?.error || "Upload failed try again");
    }
  };
  
    return (
      <Modal open={isUploadModalOpen}>
        <div
          className="w-full h-full flex justify-center items-center"
          onClick={() => {
            setIsUploadModalOpen(false);
          }}
        >
          <div
            className="w-[65%] h-[80%] bg-neutrals-50 rounded-xl flex flex-col items-center p-7"
            onClick={(e) => e.stopPropagation()}
          >
            {isLoading  ? (
              <div className="w-full h-full flex flex-col justify-center items-center">
                <p className="text-neutrals-950 text-2xl font-bold mb-10">
                  Uploading your Document
                </p>
    
                <div className="rounded-full border-[20px] border-golden-yellow-50">
                  <div className="rounded-full border-[15px] border-golden-yellow-300">
                    <div className="bg-golden-yellow-400 p-4 rounded-full">
                      <Icon icon="material-symbols:upload" width={32} height={32} className="text-neutrals-50" />
                    </div>
                  </div>
                </div>
    
                <div className="mt-10 text-start">
                  <p className="text-sm font-semibold text-neutrals-950">{selectedFileName}</p>
                  <p className="text-xs text-neutrals-500">File Format: PNG &nbsp;&nbsp; File Size: 6MB</p>
                  <div className="mt-4 w-96 h-1.5 bg-[#F6C328] rounded-full overflow-hidden">
                    <div className="bg-[#FEF6D7] h-full w-full animate-pulse" />
                  </div>
                </div>
              </div>
            ) : (
              // Default UI (browse and drag-drop)
              <>
                <p className="text-neutrals-950 text-2xl font-bold mt-20">Upload your Document</p>
                <div className="w-full mt-20 flex flex-col items-center">
                  <div className="rounded-full border-[20px] border-golden-yellow-50 cursor-pointer w-fit">
                    <div className="rounded-full border-[15px] border-golden-yellow-300">
                      <div className="text-neutrals-50 bg-golden-yellow-400 p-2 rounded-full">
                        <Icon icon={"icon-park-outline:plus"} width={24} height={24} />
                      </div>
                    </div>
                  </div>
    
                  <div className="flex flex-col items-center text-neutrals-950 space-y-3 mt-4">
                    {/* <p>Drag & Drop your file here</p> */}
                    {/* <p>or</p> */}
                    <div className="flex flex-col items-center space-y-2">
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-golden-yellow-400 py-2 px-4 text-neutrals-950 rounded-xl cursor-pointer"
                      >
                        Click to Browse
                      </button>
                      <p className="text-neutrals-400 text-xs">(PDF, JPG, PNG – Max 12MB)</p>
                      {selectedFileName && (
                        <p className="text-sm text-neutrals-950 mt-2">
                          Selected: {selectedFileName}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <input
                  type="file"
                  accept="application/pdf,image/jpeg,image/png"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </>
            )}
          </div>
        </div>
      </Modal>
    );
};

export default UploadModal;
