import React, { useState, useEffect } from "react";
import { PeerConnection } from "./types";

interface VideoCallUIProps {
  localVideoRef: React.RefObject<HTMLVideoElement>;
  peers: PeerConnection[];
  participants: string[];
  localStream: MediaStream | null;
  onEndCall: () => void;
  callType: "audio" | "video";
}

export const VideoCallUI: React.FC<VideoCallUIProps> = ({
  localVideoRef,
  peers,
  participants,
  localStream,
  onEndCall,
  callType,
}) => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === "video");
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {callType === "video" ? "Video Call" : "Voice Call"} (
            {participants.length} người tham gia)
          </h2>
          <button
            onClick={onEndCall}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            Kết thúc
          </button>
        </div>

        {callType === "video" && (
          <div className="grid grid-cols-3 gap-4">
            <div className="relative">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded"
              />
              <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                Bạn
              </span>
            </div>

            {peers.map((peer) => (
              <div key={peer.userId} className="relative">
                <video
                  autoPlay
                  playsInline
                  ref={(video) => {
                    if (video && peer.stream) {
                      video.srcObject = peer.stream;
                    }
                  }}
                  className="w-full rounded"
                />
                <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
                  {peer.userId}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-center mt-4 space-x-4">
          {callType === "video" && (
            <button
              onClick={toggleVideo}
              className={`p-2 rounded-full ${
                isVideoEnabled ? "bg-gray-200" : "bg-red-500 text-white"
              }`}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          )}
          <button
            onClick={toggleAudio}
            className={`p-2 rounded-full ${
              isAudioEnabled ? "bg-gray-200" : "bg-red-500 text-white"
            }`}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
