import { IconButton, Drawer } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { Icon } from "@iconify/react";
import { useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md")); // true on < md

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
        <IconButton>
          <FileUploadIcon sx={{ color: "black" }} />
        </IconButton>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Drawer */}
      {isMobile ? (
        <Drawer
          anchor="right"
          open={chatVisible}
          onClose={() => setChatVisible(false)}
          PaperProps={{
            sx: {
              transition: "transform 0.4s ease-in-out !important",
              width: "100%",
              maxWidth: "100vw",
              borderTopLeftRadius: "24px",
              borderBottomLeftRadius: "24px",
            },
          }}
        >
          {panelContent}
        </Drawer>
      ) : (
        // Desktop Panel
        <div
          className={`hidden md:flex flex-col w-1/3 h-full transition-transform duration-500 rounded-3xl ${
            chatVisible ? "translate-x-0" : "translate-x-full"
          } bg-white shadow-lg`}
        >
          {panelContent}
        </div>
      )}
    </>
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
