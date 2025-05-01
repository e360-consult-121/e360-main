import { Icon } from "@iconify/react";
import { WHATSAPP_URL } from "../../utils/staticLinks";

const Chatbot = () => {

  const handleClick = () => {
    window.open(WHATSAPP_URL, "_blank"); 
  };

  return (
    <div onClick={handleClick} className="absolute w-fit h-fit bottom-5 right-5 px-4 py-4 bg-golden-yellow-200 rounded-full cursor-pointer text-neutrals-950 z-50">
      <Icon icon={"icon-park-outline:wechat"} width={"24px"} height={"24px"} />
    </div>
  );
};

export default Chatbot;
