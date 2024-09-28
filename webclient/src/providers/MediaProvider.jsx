/* eslint-disable react-refresh/only-export-components */
import React from "react";

const MediaContext = React.createContext();

function useMedia() {
  return React.useContext(MediaContext);
}

function MediaProvider(props) {
  const [videoStream, setVideoStream] = React.useState(null);
  const [audioStream, setAudioStream] = React.useState(null);
  const [videoDevices, setVideoDevices] = React.useState([]);
  const [audioDevices, setAudioDevices] = React.useState([]);
  const [audioInputDeviceId, setAudioInputDeviceId] = React.useState(null);
  const [videoInputDeviceId, setVideoInputDeviceId] = React.useState(null);


  // Start video stream
  const startVideoStream = React.useCallback(
    async (constraints = null) => {
      videoStream && videoStream.getTracks().forEach((track) => track.stop());

      if (!constraints && videoInputDeviceId) {
        constraints = { deviceId: videoInputDeviceId };
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: constraints || true,
      });

      setVideoStream(newStream);
    },
    [videoStream, videoInputDeviceId]
  );

  // Start audio stream
  const startAudioStream = React.useCallback(
    async (constraints = null) => {
      audioStream && audioStream.getTracks().forEach((track) => track.stop());

      if (!constraints && audioInputDeviceId) {
        constraints = { deviceId: audioInputDeviceId };
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        audio: constraints || true,
      });

      setAudioStream(newStream);
    },
    [audioStream, audioInputDeviceId]
  );

  // Stop video stream
  const stopVideoStream = React.useCallback(async () => {
    videoStream &&
      videoStream.getVideoTracks().forEach((track) => track.stop());
    setVideoStream(null);
  }, [videoStream]);

  // Stop audio stream
  const stopAudioStream = React.useCallback(async () => {
    audioStream &&
      audioStream.getAudioTracks().forEach((track) => track.stop());
      setAudioStream(null);
  }, [audioStream]);

  // Stop stream
  const stopStream = React.useCallback(async () => {
    stopVideoStream();
    stopAudioStream();
  }, [stopVideoStream, stopAudioStream]);

  // Change video input device
  const changeVideoInputDevice = React.useCallback((deviceId) => {
    setVideoInputDeviceId(deviceId);
    startVideoStream({ deviceId });
  }, [startVideoStream]);

  // Change audio input device
  const changeAudioInputDevice = React.useCallback((deviceId) => {
    setAudioInputDeviceId(deviceId);
    startAudioStream({ deviceId });
  }, [startAudioStream]);

  // get list of connected video devices
  React.useEffect(() => {
    if (!videoStream) return;

    const loadDevices = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        setVideoDevices(videoDevices);
      });
    };

    loadDevices();
    navigator.mediaDevices.addEventListener("devicechange", loadDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", loadDevices);
    };
  }, [videoStream]);

  // get list of connected audio devices
  React.useEffect(() => {
    if (!audioStream) return;

    const loadDevices = () => {
      navigator.mediaDevices.enumerateDevices().then((devices) => {
        const audioDevices = devices.filter(
          (device) => device.kind === "audioinput"
        );

        setAudioDevices(audioDevices);
      });
    };

    loadDevices();
    navigator.mediaDevices.addEventListener("devicechange", loadDevices);
    return () => {
      navigator.mediaDevices.removeEventListener("devicechange", loadDevices);
    };
  }, [audioStream]);

  // Cleanup
  React.useEffect(() => {
    return () => {
      stopStream();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Provide the media context
  const value = {
    videoStream,
    audioStream,

    videoDevices,
    audioDevices,

    audioInputDeviceId,
    changeAudioInputDevice,
    videoInputDeviceId,
    changeVideoInputDevice,

    startVideoStream,
    startAudioStream,
    stopStream,
    stopVideoStream,
    stopAudioStream,
  };

  return <MediaContext.Provider value={value} {...props} />;
}

export { useMedia, MediaProvider };
