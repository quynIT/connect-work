import React, { useEffect, useRef, useState } from 'react';
import { collection, addDoc, onSnapshot, deleteDoc, doc, query, where } from 'firebase/firestore';
import { db } from '../../firebase/config';

interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

const VideoCall: React.FC<{
  roomId: string;
  currentUserId: string;
  onClose: () => void;
}> = ({ roomId, currentUserId, onClose }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [participants, setParticipants] = useState<string[]>([]);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnections = useRef<{ [key: string]: RTCPeerConnection }>({});

  // ICE servers configuration for WebRTC
  const configuration = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  // Khởi tạo cuộc gọi
  const initializeCall = async () => {
    try {
      // Kiểm tra số lượng người tham gia
      if (participants.length >= 5) {
        alert('Cuộc gọi đã đạt giới hạn 5 người tham gia!');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setLocalStream(stream);
      setIsCallActive(true);

      // Thêm người dùng vào danh sách tham gia
      const callDoc = await addDoc(collection(db, 'calls'), {
        roomId,
        participants: [currentUserId],
        createdAt: new Date()
      });

      // Lắng nghe các kết nối mới
      setupCallListeners(callDoc.id, stream);

    } catch (err) {
      console.error('Error starting call:', err);
      alert('Không thể khởi tạo cuộc gọi. Vui lòng kiểm tra quyền truy cập camera và mic.');
    }
  };

  // Thiết lập peer connection cho một người dùng mới
  const createPeerConnection = (userId: string, stream: MediaStream) => {
    const peerConnection = new RTCPeerConnection(configuration);

    // Thêm local stream vào peer connection
    stream.getTracks().forEach(track => {
      peerConnection.addTrack(track, stream);
    });

    // Xử lý ICE candidates
    peerConnection.onicecandidate = async (event) => {
      if (event.candidate) {
        await addDoc(collection(db, 'calls', roomId, 'candidates'), {
          userId,
          candidate: event.candidate.toJSON()
        });
      }
    };

    // Xử lý khi nhận được remote stream
    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      setPeers(currentPeers => [
        ...currentPeers,
        {
          userId,
          connection: peerConnection,
          stream: remoteStream
        }
      ]);
    };

    peerConnections.current[userId] = peerConnection;
    return peerConnection;
  };

  // Lắng nghe các sự kiện trong cuộc gọi
  const setupCallListeners = (callId: string, stream: MediaStream) => {
    // Lắng nghe người tham gia mới
    const participantsQuery = query(
      collection(db, 'calls'),
      where('roomId', '==', roomId)
    );

    onSnapshot(participantsQuery, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const participant = change.doc.data().userId;
          if (participant !== currentUserId && participants.length < 5) {
            createPeerConnection(participant, stream);
            setParticipants(prev => [...prev, participant]);
          }
        }
      });
    });

    // Lắng nghe ICE candidates
    const candidatesQuery = query(
      collection(db, 'calls', callId, 'candidates'),
      where('userId', '!=', currentUserId)
    );

    onSnapshot(candidatesQuery, (snapshot) => {
      snapshot.docChanges().forEach(change => {
        if (change.type === 'added') {
          const data = change.doc.data();
          const peerConnection = peerConnections.current[data.userId];
          if (peerConnection) {
            peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        }
      });
    });
  };

  // Kết thúc cuộc gọi
  const endCall = async () => {
    // Dừng tất cả các tracks trong local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }

    // Đóng tất cả peer connections
    Object.values(peerConnections.current).forEach(connection => {
      connection.close();
    });

    // Xóa thông tin cuộc gọi khỏi Firestore
    if (roomId) {
      await deleteDoc(doc(db, 'calls', roomId));
    }

    setIsCallActive(false);
    setLocalStream(null);
    setPeers([]);
    onClose();
  };

  // Cleanup khi component unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">
            Video Call ({participants.length}/5 participants)
          </h2>
          <button
            onClick={endCall}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            End Call
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* Local video */}
          <div className="relative">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full rounded"
            />
            <span className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded">
              You
            </span>
          </div>

          {/* Remote videos */}
          {peers.map(peer => (
            <div key={peer.userId} className="relative">
              <video
                autoPlay
                playsInline
                ref={video => {
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

        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={() => {
              if (localStream) {
                const videoTrack = localStream.getVideoTracks()[0];
                videoTrack.enabled = !videoTrack.enabled;
              }
            }}
            className="bg-gray-200 p-2 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button
            onClick={() => {
              if (localStream) {
                const audioTrack = localStream.getAudioTracks()[0];
                audioTrack.enabled = !audioTrack.enabled;
              }
            }}
            className="bg-gray-200 p-2 rounded-full"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCall;