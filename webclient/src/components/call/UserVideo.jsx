import PropTypes from "prop-types";
import { useMedia } from "@/providers/MediaProvider";
import { usePeer } from "@/providers/PeerProvider";
import { VideoPlayer } from "@/components/call/VideoPlayer";
import { UserIcon } from "@heroicons/react/24/solid";

UserVideo.propTypes = {
  remote: PropTypes.bool,
  className: PropTypes.string,
};

export function UserVideo({ remote = false, className = "" }) {
  const { videoStream: myVideoStream } = useMedia();
  const { remoteStream, connectionState, shareVideoStatus } = usePeer();

  if (remote && !remoteStream) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        <UserIcon className="h-1/3 w-1/3 text-gray-400" />
        <p className="text-center">{connectionState}</p>
      </div>
    );
  }

  if (!remote && !shareVideoStatus) {
    return null;
  }

  return (
    <VideoPlayer
      stream={remote ? remoteStream : myVideoStream}
      className={className}
    />
  );
}
