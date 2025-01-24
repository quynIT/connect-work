import React, { useEffect, useRef, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  query,
  where,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { VideoCallProps, PeerConnection, RTCConfiguration } from "./types";
import { VideoCallUI } from "./VideoCallUI";
import { db } from "../../../firebase/config";

const VideoCall: React.FC<VideoCallProps> = ({
  roomId,
  username, // Đổi từ username sang username
  isInitiator = false,
  callDocId,
  callType,
  onClose,
}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [participants, setParticipants] = useState<string[]>([username]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});
  const callDocRef = useRef<string | null>(callDocId || null);
  const createPeerConnection = (userId: string, stream: MediaStream) => {
    console.log("Creating peer connection for user:", userId);
    const peerConnection = new RTCPeerConnection(RTCConfiguration);

    // Add all tracks to the peer connection
    stream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, stream);
    });

    // Handle ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate && callDocRef.current) {
        try {
          await addDoc(
            collection(db, "calls", callDocRef.current, "candidates"),
            {
              userId,
              candidate: event.candidate.toJSON(),
              fromUserId: username,
            }
          );
        } catch (err) {
          console.error("Error adding ICE candidate:", err);
        }
      }
    };

    // Handle incoming tracks
    peerConnection.ontrack = (event) => {
      console.log("Received remote track from:", userId);
      const [remoteStream] = event.streams;
      setPeers((currentPeers) => {
        const existingPeer = currentPeers.find((p) => p.userId === userId);
        if (!existingPeer) {
          return [
            ...currentPeers,
            {
              userId,
              connection: peerConnection,
              stream: remoteStream,
            },
          ];
        }
        return currentPeers;
      });
    };

    peerConnections.current[userId] = peerConnection;
    return peerConnection;
  };

  const setupCallListeners = async (callId: string, stream: MediaStream) => {
    try {
      const callDoc = await doc(db, "calls", callId);
      const callSnapshot = await getDoc(callDoc);

      if (!callSnapshot.exists() || callSnapshot.data()?.status === "ended") {
        throw new Error("Call does not exist or has ended");
      }

      console.log("Setting up call listeners for:", callId);
      // Listen for participants
      const participantsQuery = query(
        collection(db, "calls", callId, "participants")
      );

      onSnapshot(participantsQuery, (snapshot) => {
        const participantIds = snapshot.docs.map((doc) => doc.data().userId);
        setParticipants(participantIds);

        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const participantId = change.doc.data().userId;
            console.log("New participant joined:", participantId);

            if (participantId !== username) {
              const peerConnection = createPeerConnection(
                participantId,
                stream
              );

              if (isInitiator) {
                try {
                  const offer = await peerConnection.createOffer();
                  await peerConnection.setLocalDescription(offer);
                  console.log("Created offer for:", participantId);

                  await addDoc(collection(db, "calls", callId, "offers"), {
                    userId: username,
                    targetUserId: participantId,
                    sdp: offer.sdp,
                  });
                } catch (err) {
                  console.error("Error creating offer:", err);
                }
              }
            }
          }
        });
      });

      // Listen for offers
      const offersQuery = query(
        collection(db, "calls", callId, "offers"),
        where("targetUserId", "==", username)
      );

      onSnapshot(offersQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const offerData = change.doc.data();
            console.log("Received offer from:", offerData.userId);

            const peerConnection = createPeerConnection(
              offerData.userId,
              stream
            );

            try {
              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(offerData.sdp)
              );
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);

              await addDoc(collection(db, "calls", callId, "answers"), {
                userId: username,
                targetUserId: offerData.userId,
                sdp: answer.sdp,
              });
            } catch (err) {
              console.error("Error handling offer:", err);
            }
          }
        });
      });

      // Listen for answers
      const answersQuery = query(
        collection(db, "calls", callId, "answers"),
        where("targetUserId", "==", username)
      );

      onSnapshot(answersQuery, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            const answerData = change.doc.data();
            console.log("Received answer from:", answerData.userId);

            const peerConnection = peerConnections.current[answerData.userId];
            if (peerConnection) {
              try {
                await peerConnection.setRemoteDescription(
                  new RTCSessionDescription(answerData.sdp)
                );
              } catch (err) {
                console.error("Error handling answer:", err);
              }
            }
          }
        });
      });

      // Listen for ICE candidates
      const candidatesQuery = query(
        collection(db, "calls", callId, "candidates"),
        where("fromUserId", "!=", username)
      );

      onSnapshot(candidatesQuery, (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            const data = change.doc.data();
            console.log("Received ICE candidate from:", data.fromUserId);

            const peerConnection = peerConnections.current[data.fromUserId];
            if (peerConnection) {
              try {
                const candidate = new RTCIceCandidate(data.candidate);
                peerConnection.addIceCandidate(candidate);
              } catch (err) {
                console.error("Error adding ICE candidate:", err);
              }
            }
          }
        });
      });
    } catch (err) {
      console.error("Error in setupCallListeners:", err);
      throw err;
    }
  };

  const initializeCall = async () => {
    try {
      if (!isInitiator && !callDocRef.current) {
        throw new Error("Call document ID is required for non-initiator");
      }
      // Request permissions first
      await navigator.mediaDevices.getUserMedia({
        video: callType === "video",
        audio: true,
      });

      const mediaConstraints = {
        video: callType === "video",
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        mediaConstraints
      );
      if (!stream) {
        throw new Error("Could not get media stream");
      }

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setLocalStream(stream);
      setIsCallActive(true);

      // Create call document if initiator
      if (isInitiator && !callDocRef.current) {
        const callDoc = await addDoc(collection(db, "calls"), {
          roomId,
          callerId: username,
          participants: [username],
          status: "active",
          callType,
          timestamp: serverTimestamp(),
        });

        callDocRef.current = callDoc.id;
        // Add initial participant document
        await addDoc(collection(db, "calls", callDoc.id, "participants"), {
          userId: username,
          joinedAt: serverTimestamp(),
        });
      }

      if (callDocRef.current) {
        await setupCallListeners(callDocRef.current, stream);
      } else {
        throw new Error("Call document reference is missing");
      }
    } catch (err: any) {
      console.error("Call initialization error:", err);
      let errorMessage = "Error initializing call: ";

      switch (err.name) {
        case "NotAllowedError":
          errorMessage += "Please allow access to camera and microphone";
          break;
        case "NotFoundError":
          errorMessage += "Camera or microphone not found";
          break;
        case "NotReadableError":
          errorMessage += "Could not access your media devices";
          break;
        default:
          errorMessage += err.message;
      }

      alert(errorMessage);
      onClose();
    }
  };

  const endCall = async () => {
    try {
      // Stop all media tracks
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }

      // Close all peer connections
      Object.values(peerConnections.current).forEach((connection) => {
        connection.close();
      });

      // Update call status in Firebase
      if (callDocRef.current) {
        const callDoc = doc(db, "calls", callDocRef.current);
        await updateDoc(callDoc, {
          status: "ended",
          endedAt: serverTimestamp(),
        });
      }

      setIsCallActive(false);
      setLocalStream(null);
      setPeers([]);
      onClose();
    } catch (err) {
      console.error("Error ending call:", err);
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      if (mounted) {
        await initializeCall();
      }
    };

    initialize();

    return () => {
      mounted = false;
      if (isCallActive) {
        endCall();
      }
    };
  }, []);

  return (
    <VideoCallUI
      localVideoRef={localVideoRef}
      peers={peers}
      participants={participants}
      localStream={localStream}
      onEndCall={endCall}
      callType={callType}
    />
  );
};

export default VideoCall;
