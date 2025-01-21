export interface CallData {
  callerId: string;
  callerName: string;
  roomId: string;
  status: "ringing" | "active" | "ended" | "declined";
  timestamp: any;
  callType: "audio" | "video";
  callId?: string;
}

export interface IncomingCallData extends CallData {
  callId: string;
  [key: string]: any;
}

export interface VideoCallProps {
  roomId: string;
  username: string; // Thay đổi từ currentUserId sang username
  isInitiator?: boolean;
  callDocId?: string;
  callType: "audio" | "video";
  onClose: () => void; // Đổi tên từ onEnd sang onClose để khớp với usage
}

export interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream: MediaStream;
}

export interface CallNotificationProps {
  caller: string; // Thay đổi từ callData sang các prop riêng lẻ
  callType: "audio" | "video";
  onAccept: () => void;
  onDecline: () => void;
}

export const RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    {
      urls: "turn:numb.viagenie.ca",
      username: "webrtc@live.com",
      credential: "muazkh",
    },
  ],
  iceCandidatePoolSize: 10,
};
