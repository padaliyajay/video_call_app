import React from "react";
import { IconButton } from "@material-tailwind/react";
import { Input } from "@/components/ui/Input";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";
import { MessageCard } from "@/components/card/MessageCard";
import { usePeer } from "@/providers/PeerProvider";

export function Chat() {
  const { socket } = usePeer();
  const [message, setMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);

  React.useEffect(() => {
    if (!socket) return;

    const handleMessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "message") {
        setMessages((prev) => [...prev, data.data]);
      }
    };

    socket.addEventListener("message", handleMessage);

    return () => {
      socket.removeEventListener("message", handleMessage);
    };
  }, [socket]);

  const sendMessage = () => {
    socket.send(
      JSON.stringify({
        type: "message",
        data: message,
      })
    );
    setMessage("");
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex-auto flex flex-col gap-2 overflow-y-auto">
        {messages.map((message, i) => (
          <MessageCard
            key={i}
            text={message.text}
            is_you={message.is_you}
            className={message.is_you ? "self-end" : "self-start"}
          />
        ))}
      </div>
      <div className="flex flex-shrink-0">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-auto"
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
        />
        <IconButton
          color="blue"
          onClick={sendMessage}
          disabled={!message}
          className="ml-2 flex-shrink-0"
        >
          <PaperAirplaneIcon className="h-4 w-4" />
        </IconButton>
      </div>
    </div>
  );
}
