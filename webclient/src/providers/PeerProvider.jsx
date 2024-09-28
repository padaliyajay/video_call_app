/* eslint-disable react-refresh/only-export-components */
import PropTypes from "prop-types";
import React from "react";
import { useSocket } from "@/hooks";

const PeerContext = React.createContext();

function usePeer() {
  return React.useContext(PeerContext);
}

PeerProvider.propTypes = {
  children: PropTypes.node.isRequired,
  dialedCode: PropTypes.string.isRequired,
};

function PeerProvider({ dialedCode, children }) {
  const socket = useSocket(`/call/${dialedCode}`);

  const [remoteStream, setRemoteStream] = React.useState(null);

  const [shareVideoStatus, setShareVideoStatus] = React.useState(false);
  const [shareAudioStatus, setShareAudioStatus] = React.useState(false);

  const [connectionState, setConnectionState] = React.useState(null);
  const [peerConnection, setPeerConnection] = React.useState(null);

  // Start video share
  const startVideoShare = React.useCallback(
    (stream) => {
      setShareVideoStatus(true);

      if (peerConnection && stream) {
        stream.getVideoTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      }
    },
    [peerConnection]
  );

  // Update video stream
  const updateVideoShare = React.useCallback(
    (stream) => {
      if (peerConnection && stream) {
        try {
          stream.getVideoTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [peerConnection]
  );

  // Stop video share
  const stopVideoShare = React.useCallback(() => {
    setShareVideoStatus(false);

    if (peerConnection) {
      peerConnection
        .getSenders()
        .filter((sender) => sender.track?.kind == "video")
        .forEach((sender) => {
          peerConnection.removeTrack(sender);
        });
    }
  }, [peerConnection]);

  // Start audio share
  const startAudioShare = React.useCallback(
    (stream) => {
      setShareAudioStatus(true);

      if (peerConnection && stream) {
        stream.getAudioTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });
      }
    },
    [peerConnection]
  );

  // Update audio stream
  const updateAudioShare = React.useCallback(
    (stream) => {
      if (peerConnection && stream) {
        try {
          stream.getAudioTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });
        } catch (error) {
          console.error(error);
        }
      }
    },
    [peerConnection]
  );

  // Stop audio share
  const stopAudioShare = React.useCallback(() => {
    setShareAudioStatus(false);

    if (peerConnection) {
      peerConnection
        .getSenders()
        .filter((sender) => sender.track?.kind == "audio")
        .forEach((sender) => {
          peerConnection.removeTrack(sender);
        });
    }
  }, [peerConnection]);

  // Create peer connection
  React.useEffect(() => {
    if (!socket) return;

    const peer = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    
    peer.addEventListener("icecandidate", (event) => {
      if (event.candidate) {
        socket.send(
          JSON.stringify({ type: "ice.candidate", data: event.candidate })
        );
      }
    });

    peer.addEventListener("track", async (event) => {
      const [stream] = event.streams;

      setRemoteStream((prev) => {
        if (prev) {
          prev.getTracks().forEach((track) => {
            stream.addTrack(track);
          });
        }
        
        return stream;
      });
    });

    peer.addEventListener("negotiationneeded", () => {
      peer
        .createOffer()
        .then(() => peer.setLocalDescription())
        .then(() =>
          socket.send(
            JSON.stringify({
              type: "offer",
              data: peer.localDescription,
            })
          )
        )
        .catch((error) => console.error(error));
    });

    // Listen for connectionstatechange on the local RTCPeerConnection
    peer.addEventListener("connectionstatechange", () => {
      setConnectionState(peer.connectionState);
      console.log("connection state change", peer.connectionState);
    });

    peer.addEventListener("iceconnectionstatechange", () => {
      console.log("ice connection state change", peer.iceConnectionState);
    });

    peer.addEventListener("icegatheringstatechange", () => {
      console.log("ice gathering state change", peer.iceGatheringState);
    });

    peer.addEventListener("signalingstatechange", () => {
      console.log("signaling state change", peer.signalingState);
    });

    peer.addEventListener("icecandidateerror", (event) => {
      console.error("ice candidate error", event);
    });

    setPeerConnection(peer);

    return () => {
      peer.close();
    };
  }, [socket]);

  // Handle messages from socket
  React.useEffect(() => {
    if (!socket || !peerConnection) return;

    const onMessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "offer") {
        // Receive offer from the other user
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(data.data))
          .then(() => peerConnection.createAnswer())
          .then((answer) => peerConnection.setLocalDescription(answer))
          .then(() => {
            socket.send(
              JSON.stringify({
                type: "answer",
                data: peerConnection.localDescription,
              })
            );
          })
          .catch((error) => {
            console.error(error);
          });
      }

      if (data.type === "answer") {
        // Receive answer from the other user
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(data.data))
          .catch((error) => {
            console.error(error);
          });
      }

      if (data.type === "ice.candidate") {
        // Receive ICE candidate from the other user
        peerConnection
          .addIceCandidate(new RTCIceCandidate(data.data))
          .catch((error) => {
            console.error(error);
          });
      }
    };

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, peerConnection]);

  // Ready to connect
  React.useEffect(() => {
    if (!socket || !peerConnection) return;

    const onMessage = (e) => {
      const data = JSON.parse(e.data);

      if (data.type === "askToJoin") {
        socket.send(JSON.stringify({ type: "readyToJoin" }));
      }

      if (data.type === "readyToJoin") {
        peerConnection.restartIce();
      }
    }

    socket.send(JSON.stringify({ type: "askToJoin" }));

    socket.addEventListener("message", onMessage);

    return () => {
      socket.removeEventListener("message", onMessage);
    };
  }, [socket, peerConnection]);

  // React.useEffect(() => {
  //   if (videoStream && shareVideoStatus) {
  //     updateVideoShare(videoStream);
  //   }
  // }, [videoStream, shareVideoStatus]);

  // Close peer connection
  React.useEffect(() => {
    return () => {
      if (peerConnection) {
        peerConnection.close();
      }
    };
  }, [peerConnection]);

  const value = {
    socket,
    remoteStream,
    shareVideoStatus,
    setShareVideoStatus,
    shareAudioStatus,
    setShareAudioStatus,
    connectionState,
    setConnectionState,
    peerConnection,
    setPeerConnection,
    startVideoShare,
    updateVideoShare,
    stopVideoShare,
    startAudioShare,
    updateAudioShare,
    stopAudioShare,
  };

  return <PeerContext.Provider value={value}>{children}</PeerContext.Provider>;
}

export { PeerProvider, usePeer };
