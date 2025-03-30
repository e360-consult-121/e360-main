import { Icon } from "@iconify/react/dist/iconify.js";
import { Modal } from "@mui/material";
import { useRef, useState } from "react";

type FileUploadComp = {
  fileName:string,
  fileType:string,
  fileSize:string
}


const FileUploadComp: React.FC<FileUploadComp> = ({fileName,fileType,fileSize}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [isUploaded, setIsUploaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full flex items-center justify-between border-b border-neutrals-50 p-3">
      <Modal open={isUploadModalOpen}>
        <div
          className="w-full h-full flex justify-center items-center"
          onClick={() => {
            setIsUploadModalOpen(false);
          }}
        >
          <div
            className="w-[65%] h-[80%] bg-neutrals-50 rounded-xl flex flex-col items-center p-7"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p className="text-neutrals-950 text-2xl font-bold">
              Upload your Document
            </p>

            <div className="w-full mt-20 flex flex-col items-center">
              {/* Upload button logo */}
              <div className="rounded-full border-[20px] border-golden-yellow-50 cursor-pointer w-fit">
                <div className="rounded-full border-[15px] border-golden-yellow-300">
                  <div className="text-neutrals-50 bg-golden-yellow-400 p-2 rounded-full">
                    <Icon
                      icon={"icon-park-outline:plus"}
                      width={"24"}
                      height={"24"}
                    />
                  </div>
                </div>
              </div>

              {/* Upload buttons */}
              <div className="flex flex-col items-center text-neutrals-950 space-y-3 mt-4">
                <p>Drag & Drop your file here</p>
                <p>or</p>

                <div className="flex flex-col items-center space-y-2">
                  <button
                    onClick={() => {
                      const fileInputElement = fileInputRef.current;
                      fileInputElement?.click();
                    }}
                    className="bg-golden-yellow-400 py-2 px-4 text-neutrals-950 rounded-xl cursor-pointer"
                  >
                    Click to Browse
                  </button>

                  <p className="text-neutrals-400 text-xs">
                    (PDF, JPG, PNG – Max 12MB)
                  </p>
                </div>
              </div>

              {/* Uploading progress bar */}
              {/* <div className="flex flex-col mt-7 justify-between w-[70%] space-y-2"> */}
              {/* Top portion */}
              {/* <div className="flex items-center justify-between">
                  <div className="flex flex-col space-x-1">
                    <p className="text-neutrals-950 text-sm font-semibold">
                      Passport
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-neutrals-400">
                      <p>File Format: PNG</p>
                      <p>File Size: 12MB</p>
                    </div>
                  </div>

                  <div className="p-2 border-2 border-neutrals-950 text-neutrals-950 rounded-md">
                    <Icon
                      icon="icon-park-outline:close-one"
                      width="24"
                      height="24"
                    />
                  </div>
                </div> */}

              {/* Progress bar */}
              {/* <div className="w-full h-[7px] bg-golden-yellow-100 rounded-full">
                  <div className="h-full w-[50%] bg-golden-yellow-400 rounded-full"></div>
              </div> */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </Modal>

      {/* Left portion */}
      <div className="flex items-center space-x-5">
        <div
          className={`${
            isUploaded
              ? "bg-golden-yellow-100 text-neutrals-950"
              : "bg-neutrals-200 text-white"
          }   p-3 rounded-xl`}
        >
          <Icon
            icon={`${
              isUploaded
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
          ref={fileInputRef}
          type="file"
          accept="image/png, application/pdf"
          className="hidden"
        />

        {isUploaded ? (
          <>
            <button className="bg-transparent border border-neutrals-400 py-1 px-3 text-neutrals-400 text-sm rounded-xl cursor-pointer">
              Re-Upload
            </button>

            <button className="bg-golden-yellow-400 py-1 px-3 text-neutrals-950 text-sm rounded-xl cursor-pointer">
              Preview
            </button>
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
      </div>
    </div>
  );
};

export default FileUploadComp;
