import { useParams } from "react-router-dom";
import { Spinner } from "@material-tailwind/react";
import { MediaProvider } from "@/providers/MediaProvider";
import { usePeer, PeerProvider } from "@/providers/PeerProvider";
import { UserVideo } from "@/components/call/UserVideo";
import { UserAudio } from "@/components/call/UserAudio";
import { Chat } from "@/components/call/Chat";
import { ActionBar } from "@/components/call/ActionBar";

function CallPage() {
  const { socket } = usePeer();

  if (!socket) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Spinner color="blue" size="xl" />
      </div>
    );
  }

  return (
    <div className="lg:grid grid-cols-4">
      <div className="col-span-1 h-screen hidden lg:flex flex-col">
        <UserVideo className="aspect-video flex-grow-0 h-auto" />
        <Chat />
      </div>
      <div className="col-span-3 bg-gray-800 text-white h-screen relative">
        <UserVideo remote={true} />
        <UserAudio />
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
          <ActionBar />
        </div>
        <UserVideo className="fixed bottom-3 right-3 aspect-video lg:hidden w-32 h-32 rounded-md" />
      </div>
    </div>
  );
}

export default function CallPageWithProvider() {
  const { dialedCode } = useParams();

  return (
    <MediaProvider>
      <PeerProvider dialedCode={dialedCode}>
        <CallPage />
      </PeerProvider>
    </MediaProvider>
  );
}
