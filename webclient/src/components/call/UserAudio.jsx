import { usePeer } from "@/providers/PeerProvider";

export function UserAudio() {
  const { remoteStream } = usePeer();

  if (!remoteStream) {
    return null;
  }

  return (
    <audio
      ref={(el) => {
        if (el) {
          el.srcObject = remoteStream;
        }
      }}
      controls={false}
      autoPlay
    ></audio>
  );
}
