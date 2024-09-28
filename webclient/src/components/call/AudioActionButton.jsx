import { IconButton } from "@material-tailwind/react";
import { MicrophoneIcon } from "@heroicons/react/24/solid";
import { useMedia } from "@/providers/MediaProvider";
import { usePeer } from "@/providers/PeerProvider";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import React from "react";

export function AudioActionButton() {
  const {
    audioStream,
    startAudioStream,
    stopAudioStream,
    audioDevices,
    audioInputDeviceId,
    changeAudioInputDevice,
  } = useMedia();
  const {
    shareAudioStatus,
    startAudioShare,
    updateAudioShare,
    stopAudioShare,
  } = usePeer();
  const [showAudioSettingDialog, setShowAudioSettingDialog] =
    React.useState(false);

  const handleShowAudioSettingDialog = React.useCallback(() => {
    setShowAudioSettingDialog((prev) => {
      // Start stream when audio settings dialog is opened
      if (!prev && !shareAudioStatus) {
        startAudioStream();
      }

      // Stop stream when audio settings dialog is closed and audio is not shared
      if (prev && !shareAudioStatus) {
        stopAudioStream();
      }

      return !prev;
    });
  }, [startAudioStream, stopAudioStream, shareAudioStatus]);

  const onStartShareAudio = React.useCallback(
    (stream) => {
      startAudioShare(stream);
      setShowAudioSettingDialog(false);
    },
    [startAudioShare, setShowAudioSettingDialog]
  );

  const onStopShareAudio = React.useCallback(() => {
    stopAudioShare();
    stopAudioStream();
    setShowAudioSettingDialog(false);
  }, [stopAudioShare, setShowAudioSettingDialog, stopAudioStream]);

  // Update audio stream
  React.useEffect(() => {
    if (audioStream && shareAudioStatus) {
      updateAudioShare(audioStream);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioStream, shareAudioStatus]);

  return (
    <>
      <IconButton
        onClick={handleShowAudioSettingDialog}
        color={shareAudioStatus ? "red" : "green"}
        size="lg"
        className="rounded-full"
      >
        <MicrophoneIcon className="w-6 h-6" />
      </IconButton>
      <Dialog
        size="sm"
        open={showAudioSettingDialog}
        handler={handleShowAudioSettingDialog}
      >
        <DialogHeader>Audio settings</DialogHeader>
        <DialogBody>
          <label className="block mb-2 font-semibold">
            Select audio device
          </label>
          <select
            value={audioInputDeviceId || ""}
            onChange={(e) => changeAudioInputDevice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            {audioDevices.map((device) => (
              <option key={device.deviceId} value={device.deviceId}>
                {device.label}
              </option>
            ))}
          </select>
        </DialogBody>
        <DialogFooter className="flex gap-3">
          <Button color="black" variant="outlined" onClick={handleShowAudioSettingDialog}>
            Close
          </Button>
          <Button
            color={shareAudioStatus ? "red" : "green"}
            onClick={() =>
              shareAudioStatus
                ? onStopShareAudio()
                : onStartShareAudio(audioStream)
            }
          >
            {shareAudioStatus ? "Stop share" : "Start share"}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}
