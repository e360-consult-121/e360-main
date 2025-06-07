import { Icon } from "@iconify/react";
import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  TextField,
} from "@mui/material";

interface ChatMessageProps {
  messageId: string;
  sender: string;
  message?: string;
  timeOfMsg: string;
  fileName?: string;
  fileUrl?: string;
  handleMoveToVault: (
    messageId: string,
    documentName: string,
    category: string
  ) => void;
}

const ChatMessage = ({
  messageId,
  sender,
  message,
  timeOfMsg,
  fileName,
  fileUrl,
  handleMoveToVault,
}: ChatMessageProps) => {
  const isUser = sender === "user";
  const isImage = fileUrl?.match(/\.(jpeg|jpg|png|gif)$/i);

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [documentName, setDocumentName] = useState("");

  const handleMoveClick = () => {
    if (messageId && documentName && selectedOption) {
      handleMoveToVault(messageId, documentName, selectedOption);
      setOpenDialog(false);
      setSelectedOption("");
    }
  };

  return (
    <>
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl text-sm mt-2 relative ${
            isUser
              ? "bg-golden-yellow-300 text-black rounded-br-none"
              : "bg-gray-200 text-black rounded-bl-none"
          }`}
        >
          {fileUrl && (
            <>
              <div className="flex justify-end mb-1">
                <button
                  onClick={() => setOpenDialog(true)}
                  className="flex items-center gap-2 bg-zinc-500 text-white px-3 py-1.5 rounded-md shadow-sm text-sm transition hover:cursor-pointer"
                >
                  <Icon icon="lucide:folder-plus" width="18" height="18" />
                </button>
              </div>

              <div className="flex items-center mb-2">
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {isImage ? (
                    <img
                      src={fileUrl}
                      alt={fileName}
                      className="rounded-lg max-h-30 object-cover hover:shadow-md"
                    />
                  ) : (
                    <div className="flex justify-center items-center space-x-2 bg-white p-2 rounded-lg shadow-sm hover:shadow-md w-[220px]">
                      <Icon
                        icon="vscode-icons:file-type-pdf2"
                        width="40px"
                        height="40px"
                      />
                    </div>
                  )}
                </a>
              </div>

              <span
                className="text-md text-black flex justify-end mr-5 truncate max-w-[200px] overflow-hidden whitespace-nowrap"
                title={fileName}
              >
                {fileName}
              </span>
            </>
          )}

          {message && <p className="mb-1">{message}</p>}

          <span className="px-1 absolute bottom-0 right-0 text-[8px] text-black">
            {timeOfMsg}
          </span>
        </div>
      </div>

      {/* MUI Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle align="center" sx={{ fontWeight:"bold"}}>Move to Vault</DialogTitle>
        <DialogContent>
          <Typography
            variant="body2"
            gutterBottom
            sx={{
              mb: 3,
              maxWidth: "100%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            Document: <strong>{fileName}</strong>
          </Typography>
          <TextField
            label="Document Name"
            value={documentName}
            onChange={(e) => setDocumentName(e.target.value)}
            fullWidth
            required
          />

          <FormControl fullWidth size="small" sx={{ mt: 2 }}>
            <InputLabel>Select Vault</InputLabel>
            <Select
              value={selectedOption}
              label="Select Vault"
              onChange={(e) => setSelectedOption(e.target.value)}
            >
              <MenuItem value="testing">testing</MenuItem>
              <MenuItem value="vaultB">Vault B</MenuItem>
              <MenuItem value="vaultC">Vault C</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button onClick={() => setOpenDialog(false)} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleMoveClick}
            color="primary"
            disabled={!selectedOption}
            variant="contained"
            sx={{
              borderRadius: "20px",
            }}
          >
            Move
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ChatMessage;
