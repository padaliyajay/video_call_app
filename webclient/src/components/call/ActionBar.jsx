import { IconButton } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { StopIcon } from "@heroicons/react/24/solid";
import { AudioActionButton } from "@/components/call/AudioActionButton";
import { VideoActionButton } from "@/components/call/VideoActionButton";

export function ActionBar() {
  const navigate = useNavigate();

  const onHangup = () => {
    navigate("/");
  };

  return (
    <div className="flex p-4 gap-4">
      <AudioActionButton />
      <VideoActionButton />

      <IconButton
        onClick={onHangup}
        color="red"
        size="lg"
        className="rounded-full"
      >
        <StopIcon className="w-6 h-6" />
      </IconButton>
    </div>
  );
}
