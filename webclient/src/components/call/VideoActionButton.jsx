import { IconButton } from "@material-tailwind/react";
import { VideoCameraIcon } from "@heroicons/react/24/solid";
import { useMedia } from "@/providers/MediaProvider";
import { usePeer } from "@/providers/PeerProvider";
import { VideoPlayer } from "@/components/call/VideoPlayer";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import React from "react";

export function VideoActionButton() {
  const {
    videoStream,
    startVideoStream,
    stopVideoStream,
    videoDevices,
    videoInputDeviceId,
    changeVideoInputDevice,
  } = useMedia();
  const {
    shareVideoStatus,
    startVideoShare,
    updateVideoShare,
    stopVideoShare,
  } = usePeer();
  const [showVideoSettingDialog, setShowVideoSettingDialog] =
    React.useState(false);

  const handleShowVideoSettingDialog = React.useCallback(() => {
    setShowVideoSettingDialog((prev) => {
      // Start stream when video settings dialog is opened
      if (!prev && !shareVideoStatus) {
        startVideoStream();
      }

      // Stop stream when video settings dialog is closed and video is not shared
      if (prev && !shareVideoStatus) {
        stopVideoStream();
      }

      return !prev;
    });
  }, [startVideoStream, stopVideoStream, shareVideoStatus]);

  const onStartShareVideo = React.useCallback(
    (stream) => {
      startVideoShare(stream);
      setShowVideoSettingDialog(false);
    },
    [startVideoShare, setShowVideoSettingDialog]
  );

  const onStopShareVideo = React.useCallback(() => {
    stopVideoShare();
    stopVideoStream();
    setShowVideoSettingDialog(false);
  }, [stopVideoShare, setShowVideoSettingDialog, stopVideoStream]);

  // Update video stream
  React.useEffect(() => {
    if (videoStream && shareVideoStatus) {
      updateVideoShare(videoStream);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoStream, shareVideoStatus]);

  return (
    <>
      <IconButton
        onClick={handleShowVideoSettingDialog}
        color={shareVideoStatus ? "red" : "green"}
        size="lg"
        className="rounded-full"
      >
        <VideoCameraIcon className="w-6 h-6" />
      </IconButton>
      <Dialog
        size="lg"
        open={showVideoSettingDialog}
        handler={handleShowVideoSettingDialog}
      >
        <DialogHeader>Video settings</DialogHeader>
        <DialogBody>
          <div className="grid grid-cols-3 gap-6">
            <VideoPlayer stream={videoStream} className="aspect-video" />
            <div className="col-span-2">
              <label className="block mb-2 font-semibold">Select camera</label>
              <select
                value={videoInputDeviceId || ""}
                onChange={(e) => changeVideoInputDevice(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {videoDevices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button color="black" variant="outlined" onClick={handleShowVideoSettingDialog}>
            Close
          </Button>
          <Button
            color={shareVideoStatus ? "red" : "green"}
            onClick={() =>
              shareVideoStatus
                ? onStopShareVideo()
                : onStartShareVideo(videoStream)
            }
          >
            {shareVideoStatus ? "Stop share" : "Start share"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
