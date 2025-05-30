import React, { useRef } from "react";
import { IconButton, Drawer } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Icon } from "@iconify/react";

const dummyMessages = [
  { sender: "admin", message: "Hello! How can I assist you today?" },
  { sender: "user", message: "I need help with my visa application." },
  { sender: "admin", message: "Sure, I can help you with that." },
];

interface ChatbotPanelProps {
  chatVisible: boolean;
  setChatVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChatbotPanel = ({ chatVisible, setChatVisible }: ChatbotPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Uploaded file:", file);
      // Handle file upload logic here (e.g., send to backend)
    }
  };

  const panelContent = (
    <div className="flex flex-col h-full w-full md:w-[400px] rounded-3xl bg-white shadow-lg">
      {/* Chat Header */}
      <div className="p-4 flex justify-between items-center bg-golden-yellow-200 rounded-t-3xl">
        <p className="flex font-semibold text-neutrals-950 gap-2">
          <Icon icon="icon-park-outline:wechat" width="24px" height="24px" />
          Chat Support
        </p>
        <button
          onClick={() => setChatVisible(false)}
          className="text-xl cursor-pointer hover:scale-105 duration-100 hover:font-extrabold"
        >
          ✖
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {dummyMessages.map((msg, index) => (
          <ChatMessage key={index} sender={msg.sender} message={msg.message} />
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t flex items-center gap-2">
        <input
          type="text"
          placeholder="Type your message..."
          className="flex-1 px-3 py-2 border border-gray-400 rounded-2xl focus:outline-none"
        />
        <IconButton>
          <SendIcon sx={{ color: "black" }} />
        </IconButton>
        <IconButton onClick={handleFileUploadClick}>
          <FileUploadIcon sx={{ color: "black" }} />
        </IconButton>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.png,.jpeg,.jpg"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );

  return (
    <Drawer
      anchor="right"
      open={chatVisible}
      onClose={() => setChatVisible(false)}
      PaperProps={{
        sx: {
          transition: "transform 0.4s ease-in-out !important",
          width: {
            xs: "100%",
            sm: "100%",
            md: "400px",
          },
          borderTopLeftRadius: "24px",
          borderBottomLeftRadius: "24px",
        },
      }}
    >
      {panelContent}
    </Drawer>
  );
};

export default ChatbotPanel;

interface ChatMessageProps {
  sender: string;
  message: string;
}

const ChatMessage = ({ sender, message }: ChatMessageProps) => {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs md:max-w-sm px-4 py-2 rounded-xl text-sm ${
          isUser
            ? "bg-golden-yellow-300 text-black rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        {message}
      </div>
    </div>
  );
};
