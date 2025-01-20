import {
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import "../../App.css";
import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { db } from "../../firebase/config";
import avtdefault from "../../assets/user/image/avt.jpg";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  updateDoc,
  doc,
  limit,
  startAfter,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { getUserProfile } from "../../services/authService";
import { AiFillDelete } from "react-icons/ai";
interface User {
  id: string;
  username: string;
  avt: string;
  name: string;
  lastMessage: string;
  active: boolean;
  unread: boolean;
}

interface Message {
  id: string;
  text: string;
  username: string;
  name: string;
  avt: string;
  roomId: string;
  createdAt: Date;
  imageUrl?: string; // URL của ảnh nếu có
  type: "text" | "image"; // Loại tin nhắn
  pending?: boolean;
  error?: boolean;
}
interface Room {
  id: string;
  name: string;
  members: string[];
  avtroom: string;
  createdAt: Date;
  lastMessage?: string;
  lastMessageTime?: Date | null;
  unreadCount?: number; // Số tin nhắn chưa đọc
  lastMessageUsername?: string; // Username của người gửi tin nhắn cuối
}
interface RoomListProps {
  rooms: Room[];
  selectedRoom: Room | null;
  setSelectedRoom: (room: Room) => void;
}
interface ActiveUsersProps {
  users: User[];
}
export default function ChatWeb() {
  const [showAddRoomForm, setShowAddRoomForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // Ảnh được chọn
  const [uploading, setUploading] = useState(false); // Trạng thái tải ảnh
  const [isMemberVisible, setIsMemberVisible] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [userResults, setUserResults] = useState<User[]>([]);
  const [username, setUsername] = useState<string | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const memoizedRooms = useMemo(() => rooms, [rooms]);
  const memoizedSetSelectedRoom = useCallback(setSelectedRoom, []);
  const [unreadRooms, setUnreadRooms] = useState<{ [key: string]: number }>({});
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastMessageRef, setLastMessageRef] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avt: string;
  } | null>(null);

  //Lấy thông tin người dùng từ firebase
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (users.length > 0) return;
      try {
        const profile = await getUserProfile();
        setUsername(profile.username);

        // Truy vấn Firestore để lấy name và avt
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", profile.username));
        const snapshot = await getDocs(q);

        // Truy vấn lấy tất cả người dùng từ Firestore
        const profileSnapshot = await getDocs(usersRef);
        const userList = profileSnapshot.docs.map((doc) => ({
          username: doc.id,
          ...doc.data(),
        }));
        setUsers(userList);

        if (!snapshot.empty) {
          const userData = snapshot.docs[0].data();
          setUserProfile({
            name: userData.name,
            avt: userData.avt,
          });
        } else {
          console.error("User data not found in Firestore");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [users]);

  // Lấy tt user danh sách phòng chat từ Firestore

  useEffect(() => {
    if (!username) return;

    const roomsRef = collection(db, "rooms");
    const q = query(roomsRef, where("members", "array-contains", username));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
          const roomData = change.doc.data();
          const roomId = change.doc.id;

          // Chỉ cập nhật rooms nếu:
          // 1. Là phòng mới được tạo
          // 2. Hoặc không phải là phòng đang được chọn
          // 3. Hoặc là thay đổi về thành viên/thông tin phòng (không phải last message)
          if (
            change.type === "added" ||
            roomId !== selectedRoom?.id ||
            !roomData.lastMessage
          ) {
            setRooms((prevRooms) => {
              const newRooms = [...prevRooms];
              const index = newRooms.findIndex((r) => r.id === roomId);
              const updatedRoom = {
                id: roomId,
                name: roomData.name || "Noname",
                members: roomData.members || [],
                avtroom: roomData.avtroom || avtdefault,
                createdAt: roomData.createdAt || new Date(),
                lastMessage: roomData.lastMessage,
                lastMessageTime: roomData.lastMessageTime
                  ? roomData.lastMessageTime.toDate()
                  : null,
              };

              if (index === -1) {
                newRooms.unshift(updatedRoom);
              } else {
                newRooms[index] = updatedRoom;
              }

              return newRooms.sort((a, b) => {
                const timeA = a.lastMessageTime
                  ? a.lastMessageTime.getTime()
                  : 0;
                const timeB = b.lastMessageTime
                  ? b.lastMessageTime.getTime()
                  : 0;
                return timeB - timeA;
              });
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [username, selectedRoom]);

  // Lấy tin nhắn của phòng khi chọn phòng
  useEffect(() => {
    if (!selectedRoom) {
      setMessages([]);
      setHasMore(true);
      setLastMessageRef(null);
      return;
    }

    const loadMessages = async () => {
      const messagesRef = collection(db, "messages");
      let q = query(
        messagesRef,
        where("roomId", "==", selectedRoom.id),
        orderBy("createdAt", "desc"),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Message[];

      setMessages(fetchedMessages.reverse());
      setLastMessageRef(snapshot.docs[0]);
      setHasMore(snapshot.docs.length === 20);
    };

    loadMessages();

    // Lắng nghe tin nhắn mới
    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("roomId", "==", selectedRoom.id),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newMessage = {
            id: change.doc.id,
            ...change.doc.data(),
            createdAt: change.doc.data().createdAt?.toDate(),
          } as Message;

          setMessages((prev) => {
            // Kiểm tra xem tin nhắn đã tồn tại chưa
            if (!prev.find((msg) => msg.id === newMessage.id)) {
              return [...prev, newMessage];
            }
            return prev;
          });
        }
      });
    });

    return () => unsubscribe();
  }, [selectedRoom]);

  useEffect(() => {
    const fetchRoomsWithLastMessage = async () => {
      try {
        const profile = await getUserProfile();
        setUsername(profile.username);
        const roomsRef = collection(db, "rooms");
        const q = query(
          roomsRef,
          where("members", "array-contains", profile.username) // Thêm bộ lọc ở đây
        );
        const roomsSnapshot = await getDocs(q);

        const fetchedRooms: Room[] = await Promise.all(
          roomsSnapshot.docs.map(async (roomDoc) => {
            const roomData = roomDoc.data();
            const messagesRef = collection(db, "messages");
            const lastMessageQuery = query(
              messagesRef,
              where("roomId", "==", roomDoc.id),
              orderBy("createdAt", "desc"),
              limit(10) // Lấy tin nhắn gần nhất
            );
            const messageSnapshot = await getDocs(lastMessageQuery);
            const lastMessage = messageSnapshot.docs[0]?.data() || null;

            return {
              id: roomDoc.id,
              name: roomData.name || "Tên phòng", // Gán giá trị mặc định nếu thiếu
              members: roomData.members || [], // Gán mảng rỗng nếu thiếu
              avtroom: roomData.avtroom || avtdefault, // Gán giá trị mặc định nếu thiếu
              createdAt: roomData.createdAt || new Date(), // Gán thời gian hiện tại nếu thiếu
              lastMessage: lastMessage?.text || "Chưa có tin nhắn",
              lastMessageTime: lastMessage?.createdAt
                ? lastMessage.createdAt.toDate()
                : null,
            };
          })
        );

        // Sắp xếp danh sách phòng theo tin nhắn gần nhất
        fetchedRooms.sort((a, b) => {
          const timeA = a.lastMessageTime ? a.lastMessageTime.getTime() : 0; // 0 nếu là null hoặc undefined
          const timeB = b.lastMessageTime ? b.lastMessageTime.getTime() : 0; // 0 nếu là null hoặc undefined

          return timeB - timeA; // Sắp xếp từ tin nhắn gần nhất
        });

        setRooms(fetchedRooms);
      } catch (error) {
        console.error("Error fetching rooms with last message:", error);
      }
    };

    fetchRoomsWithLastMessage();
  }, []);
  useEffect(() => {
    document.body.classList.add("no-footer"); // Thêm lớp 'no-footer' khi vào trang
    return () => document.body.classList.remove("no-footer"); // Gỡ lớp khi rời trang
  }, []);

  // Cập nhật useEffect cho việc lắng nghe tin nhắn mới
  useEffect(() => {
    if (!username) return;

    const messagesRef = collection(db, "messages");
    const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          const newMessage = change.doc.data();
          const roomId = newMessage.roomId;

          // Kiểm tra nếu tin nhắn mới không phải từ user hiện tại và không đang ở trong phòng đó
          if (
            newMessage.username !== username &&
            (!selectedRoom || selectedRoom.id !== roomId)
          ) {
            setUnreadRooms((prev) => ({
              ...prev,
              [roomId]: (prev[roomId] || 0) + 1,
            }));

            // Cập nhật lại danh sách phòng để đưa phòng có tin nhắn mới lên đầu
            setRooms((prevRooms) => {
              const updatedRooms = [...prevRooms];
              const roomIndex = updatedRooms.findIndex((r) => r.id === roomId);

              if (roomIndex !== -1) {
                const room = updatedRooms[roomIndex];
                updatedRooms.splice(roomIndex, 1);
                updatedRooms.unshift({
                  ...room,
                  lastMessage: newMessage.text,
                  lastMessageTime: new Date(),
                  lastMessageUsername: newMessage.username,
                });
              }

              return updatedRooms;
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [username, selectedRoom]);
  // Tìm kiếm user trong Firestore ( Nếu dữ liệu lớn tạo thêm trường keyword để tìm kiếm)
  const handleSearchUser = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const queryText = e.target.value.trim().toLowerCase();
    setSearchUser(queryText);

    if (!queryText) {
      setUserResults([]);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const results = snapshot.docs
        .map((doc) => {
          const data = doc.data() as User;
          return {
            username: doc.id, // Sử dụng doc.id làm username nếu đây là giá trị chính.
            ...data,
          };
        })
        .filter(
          (user) =>
            !selectedMembers.includes(user.username) && // Loại user đã thêm
            user.name.toLowerCase().includes(queryText) // Kiểm tra chứa ký tự tìm kiếm
        );

      setUserResults(results);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Thêm user vào danh sách thành viên
  const handleAddMember = (username: string) => {
    if (!selectedMembers.includes(username)) {
      setSelectedMembers((prev) => [...prev, username]);
    }
    setSearchUser(""); // Reset input search
    setUserResults([]); // Xóa kết quả tìm kiếm
  };
  // Hàm up ảnh room
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };
  // Lưu room mới vào Firestore
  const handleSaveRoom = async () => {
    if (!newRoomName.trim() || selectedMembers.length === 0 || !username) {
      alert("Vui lòng điền tên room và thêm thành viên!");
      return;
    }
    setUploading(true); // Hiển thị trạng thái tải ảnh

    let avtroomURL = "";
    if (selectedImage) {
      try {
        const storage = getStorage();
        const storageRef = ref(storage, `rooms/${newRoomName}_${Date.now()}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedImage);

        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            null,
            (error) => reject(error),
            async () => {
              avtroomURL = await getDownloadURL(storageRef);
              resolve();
            }
          );
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Có lỗi khi tải ảnh lên.");
        setUploading(false);
        return;
      }
    }
    try {
      const roomsRef = collection(db, "rooms");

      // Thêm username của người tạo vào danh sách thành viên
      const members = Array.from(new Set([...selectedMembers, username]));

      await addDoc(roomsRef, {
        name: newRoomName,
        members,
        avtroom: avtroomURL || avtdefault,
        createdAt: serverTimestamp(),
      });

      alert("Room created successfully!");
      setShowAddRoomForm(false);
      setNewRoomName("");
      setSelectedMembers([]);
      setSearchUser(""); // Reset ô tìm kiếm user
      setUserResults([]); // Xóa kết quả tìm kiếm user
    } catch (error) {
      console.error("Error saving room:", error);
      alert("Có lỗi xảy ra khi lưu room!");
    }
  };

  // Xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedRoom || !userProfile || !username)
      return;

    const messageText = newMessage.trim();
    const tempId = `temp-${Date.now()}`;
    const clientTimestamp = new Date();

    // Tạo message object với trạng thái pending
    const newMsg = {
      id: tempId,
      text: messageText,
      username: username,
      name: userProfile.name,
      avt: userProfile.avt,
      roomId: selectedRoom.id,
      createdAt: clientTimestamp,
      type: "text",
      pending: true, // Thêm trạng thái pending
      error: false, // Thêm trạng thái error
    } as Message;

    try {
      // Cập nhật UI trước
      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
      scrollToBottom();

      // Cập nhật room's last message
      const optimisticRoom = {
        ...selectedRoom,
        lastMessage: messageText,
        lastMessageTime: clientTimestamp,
      };

      setRooms((prev) =>
        prev
          .map((room) => (room.id === selectedRoom.id ? optimisticRoom : room))
          .sort((a, b) => {
            const timeA = a.lastMessageTime?.getTime() || 0;
            const timeB = b.lastMessageTime?.getTime() || 0;
            return timeB - timeA;
          })
      );

      // Gửi message lên Firebase
      const messagesRef = collection(db, "messages");
      const docRef = await addDoc(messagesRef, {
        text: messageText,
        username: username,
        name: userProfile.name,
        avt: userProfile.avt,
        roomId: selectedRoom.id,
        createdAt: serverTimestamp(),
        type: "text",
      });

      // Cập nhật room trên Firebase
      const roomRef = doc(db, "rooms", selectedRoom.id);
      await updateDoc(roomRef, {
        lastMessage: messageText,
        lastMessageTime: serverTimestamp(),
      });
      // Cập nhật message thành công
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, id: docRef.id, pending: false } : msg
        )
      );

      console.log("Cập nhật thành công, pending:", messages);
    } catch (error) {
      console.error("Error sending message:", error);

      // Đánh dấu tin nhắn lỗi thay vì xóa nó
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempId ? { ...msg, error: true, pending: false } : msg
        )
      );

      // Khôi phục lại trạng thái room
      const lastMessage = messages[messages.length - 1];
      if (lastMessage) {
        setRooms((prev) =>
          prev
            .map((room) =>
              room.id === selectedRoom.id
                ? {
                    ...room,
                    lastMessage: lastMessage.text,
                    lastMessageTime: lastMessage.createdAt,
                  }
                : room
            )
            .sort((a, b) => {
              const timeA = a.lastMessageTime?.getTime() || 0;
              const timeB = b.lastMessageTime?.getTime() || 0;
              return timeB - timeA;
            })
        );
      }

      alert("Có lỗi xảy ra khi gửi tin nhắn! Vui lòng thử lại.");
    }
  };

  // Hàm cuộn xuống cuối
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };
  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedRoom]);
  const handleSearchAddMember = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const queryText = e.target.value.trim().toLowerCase();
    setSearchUser(queryText);

    if (!queryText) {
      setUserResults([]);
      return;
    }

    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);

      const results = snapshot.docs
        .map((doc) => {
          const data = doc.data() as User;
          return {
            username: doc.id, // Sử dụng doc.id làm username nếu đây là giá trị chính.
            ...data,
          };
        })
        .filter(
          (user) =>
            !selectedRoom.members.includes(user.username) && // Chỉ tìm user chưa nằm trong phòng
            user.name.toLowerCase().includes(queryText) // Kiểm tra chứa ký tự tìm kiếm
        );

      setUserResults(results);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  // Hiện form thêm thành viên
  const toggleMemberList = () => {
    setIsMemberVisible(!isMemberVisible); // Chuyển đổi trạng thái hiển thị form
  };
  // Hàm thêm thành viên vào phòng
  const handleAddMemberToRoom = async (username: string) => {
    if (!selectedRoom) return;

    try {
      const roomRef = doc(db, "rooms", selectedRoom.id);

      // Lấy danh sách members hiện tại và thêm user mới
      const updatedMembers = Array.from(
        new Set([...selectedRoom.members, username])
      );

      // Cập nhật Firestore
      await updateDoc(roomRef, { members: updatedMembers });

      // Cập nhật UI
      setSelectedRoom(
        (prevRoom) => prevRoom && { ...prevRoom, members: updatedMembers }
      );
      setSearchUser(""); // Reset ô tìm kiếm user
      setUserResults([]); // Xóa kết quả tìm kiếm user
      alert("Thành viên đã được thêm vào phòng!");
    } catch (error) {
      console.error("Error adding member to room:", error);
      alert("Có lỗi xảy ra khi thêm thành viên vào phòng!");
    }
  };
  // Hàm xóa thành viên khỏi phòng
  const handleRemoveMemberFromRoom = async (username: string) => {
    if (!selectedRoom) return;

    try {
      const roomRef = doc(db, "rooms", selectedRoom.id);

      // Loại bỏ thành viên khỏi danh sách
      const updatedMembers = selectedRoom.members.filter(
        (member: string) => member !== username
      );

      // Cập nhật Firestore
      await updateDoc(roomRef, { members: updatedMembers });

      // Cập nhật UI
      setSelectedRoom((prevRoom: Room | null) =>
        prevRoom ? { ...prevRoom, members: updatedMembers } : null
      );

      alert("Đã xóa thành viên khỏi phòng!");
    } catch (error) {
      console.error("Error removing member from room:", error);
      alert("Có lỗi xảy ra khi xóa thành viên!");
    }
  };
  // Hàm kiểm tra kích thước file
  const validateImageSize = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const maxSize = 300 * 1024; // 300KB
      if (file.size > maxSize) {
        alert("Ảnh phải nhỏ hơn 300KB");
        resolve(false);
      }
      resolve(true);
    });
  };
  // Hàm load thêm tin nhắn cũ
  const loadMoreMessages = async () => {
    if (!selectedRoom || !lastMessageRef || isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const messagesRef = collection(db, "messages");
      const q = query(
        messagesRef,
        where("roomId", "==", selectedRoom.id),
        orderBy("createdAt", "desc"),
        startAfter(lastMessageRef),
        limit(20)
      );

      const snapshot = await getDocs(q);
      const olderMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as Message[];

      setMessages((prev) => [...olderMessages.reverse(), ...prev]);
      setLastMessageRef(snapshot.docs[0]);
      setHasMore(snapshot.docs.length === 20);
    } catch (error) {
      console.error("Error loading more messages:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };
  // Hàm xử lý upload ảnh
  const handleImageUploadMes = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRoom || !userProfile || !username) return;

    const isValid = await validateImageSize(file);
    if (!isValid) return;

    setUploadingImage(true);
    try {
      const storage = getStorage();
      const storageRef = ref(
        storage,
        `chat-images/${selectedRoom.id}/${Date.now()}_${file.name}`
      );
      await uploadBytesResumable(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);

      // Gửi tin nhắn chứa ảnh
      await addDoc(collection(db, "messages"), {
        type: "image",
        imageUrl,
        text: "",
        username: username,
        name: userProfile.name,
        avt: userProfile.avt,
        roomId: selectedRoom.id,
        createdAt: serverTimestamp(),
      });

      // Cập nhật last message của room
      const roomRef = doc(db, "rooms", selectedRoom.id);
      await updateDoc(roomRef, {
        lastMessage: "Đã gửi một ảnh",
        lastMessageTime: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Lỗi khi tải ảnh lên!");
    } finally {
      setUploadingImage(false);
    }
  };
  const formattedMessages = messages.map((message) => {
    const messageDate = new Date(message.createdAt);
    return {
      ...message,
      timeString: messageDate.toLocaleString("en-US", {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  });
  const handleSelectRoom = useCallback((room: Room) => {
    setSelectedRoom(room);
    // Xóa số tin nhắn chưa đọc khi vào phòng
    setUnreadRooms((prev) => ({
      ...prev,
      [room.id]: 0,
    }));
  }, []);
  const RoomList: React.FC<RoomListProps> = React.memo(
    ({ rooms, selectedRoom, setSelectedRoom }) => {
      return rooms.map((room) => (
        <li
          key={room.id}
          onClick={() => handleSelectRoom(room)}
          className={`cursor-pointer flex items-center p-2 relative ${
            selectedRoom?.id === room.id ? "bg-blue-100" : ""
          }`}
        >
          <img
            loading="lazy"
            src={room.avtroom || avtdefault}
            alt={`${room.name} avatar`}
            className="w-10 h-10 rounded-full mr-3"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = avtdefault;
            }}
          />
          <div className="flex-1">
            <h3 className="font-semibold">{room.name}</h3>
            <p className="text-sm text-gray-600 truncate">{room.lastMessage}</p>
          </div>

          {/* Hiển thị số tin nhắn chưa đọc */}
          {unreadRooms[room.id] > 0 && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                {unreadRooms[room.id]}
              </span>
            </div>
          )}
        </li>
      ));
    }
  );
  const ActiveUsers: React.FC<ActiveUsersProps> = React.memo(({ users }) => {
    return (
      <div className="w-1/4 bg-white p-4 overflow-y-auto border-l">
        <h2 className="text-lg font-semibold mb-4">Active</h2>
        <ul>
          {users.map((user) => (
            <li
              key={user.username}
              className="flex items-center space-x-4 p-2 hover:bg-gray-200 rounded"
            >
              <img
                src={user.avt}
                alt={user.name}
                className="w-10 h-10 rounded-full"
              />
              <p className="font-semibold">{user.name}</p>
              <span className="h-3 w-3 bg-green-500 rounded-full ml-auto" />
            </li>
          ))}
        </ul>
      </div>
    );
  });
  return (
    <div className="flex mt-[100px] h-[85vh] mb-5">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <div className="flex">
          <h2 className="text-lg font-semibold mb-4">Chats</h2>
          <button
            onClick={() => setShowAddRoomForm(true)}
            className=" bg-blue-500 text-white px-4 py-2 rounded mb-4 ml-40"
          >
            + Add Room
          </button>
        </div>
        <input
          type="text"
          placeholder="Search Messenger"
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <ul>
          <RoomList
            rooms={memoizedRooms}
            selectedRoom={selectedRoom}
            setSelectedRoom={memoizedSetSelectedRoom}
          />
          ;
        </ul>
      </div>
      {/* Add Room Form */}
      {showAddRoomForm && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
            <h2 className="text-xl font-semibold mb-4">Add New Room</h2>
            <input
              type="text"
              placeholder="Room Name"
              className="w-full px-3 py-2 mb-4 border rounded"
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Search Users"
              className="w-full px-3 py-2 mb-4 border rounded"
              value={searchUser}
              onChange={handleSearchUser}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4"
            />
            {uploading && <p>Uploading image...</p>}
            <ul className="mb-4">
              {userResults.map((user) => (
                <li
                  key={user.username}
                  className="flex justify-between items-center p-2 border-b"
                >
                  <span>{user.name}</span>
                  <button
                    onClick={() => handleAddMember(user.username)}
                    className="text-blue-500"
                  >
                    Add
                  </button>
                </li>
              ))}
            </ul>
            <div className="mb-4">
              <h3 className="font-semibold">Selected Members:</h3>
              <ul>
                {selectedMembers.map((member, index) => (
                  <li key={index} className="text-gray-700">
                    {member}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowAddRoomForm(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveRoom}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Save Room
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Chat Section */}
      <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-between">
        {selectedRoom ? (
          <>
            {/* Header */}
            <div className="flex items-center border-b pb-4 mb-4">
              {selectedRoom.avtroom ? (
                <img
                  src={selectedRoom.avtroom}
                  alt={`${selectedRoom.name} avatar`}
                  className="w-10 h-10 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-400 rounded-full mr-4" />
              )}
              <h2 className="text-lg font-semibold flex-1">
                {selectedRoom.name}
              </h2>
              <button onClick={toggleMemberList} className="text-blue-500">
                {isMemberVisible ? "Ẩn thành viên" : "Xem thành viên"}
              </button>
              <div className="flex space-x-3">
                {isMemberVisible && selectedRoom && (
                  <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Thành viên</h3>
                        <button
                          onClick={toggleMemberList}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          <span className="text-2xl">&times;</span>
                        </button>
                      </div>

                      {/* Tìm kiếm thành viên */}
                      <input
                        type="text"
                        placeholder="Tìm thành viên để thêm"
                        className="w-full px-3 py-2 mb-4 border rounded"
                        value={searchUser}
                        onChange={handleSearchAddMember}
                      />

                      {/* Danh sách thành viên hiện tại */}
                      <ul className="max-h-60 overflow-y-auto">
                        {selectedRoom.members.map(
                          (member: string, index: number) => {
                            const user = users.find(
                              (user) => user.username === member
                            );

                            return (
                              <li
                                key={index}
                                className="flex items-center justify-between p-2 border-b hover:bg-gray-50"
                              >
                                <div className="flex items-center space-x-3">
                                  {/* Hiển thị avatar */}
                                  {user?.avt ? (
                                    <img
                                      src={user.avt}
                                      alt={`${user.name}'s avatar`}
                                      className="w-10 h-10 rounded-full"
                                    />
                                  ) : (
                                    <div className="w-10 h-10 bg-gray-400 rounded-full" />
                                  )}
                                  {/* Tên thành viên */}
                                  <span className="text-gray-700 font-medium">
                                    {user?.name}
                                  </span>
                                </div>
                                {/* Nút thùng rác */}
                                <button
                                  onClick={() =>
                                    handleRemoveMemberFromRoom(member)
                                  }
                                  className="text-red-500 hover:text-red-700 transition duration-200 ease-in-out"
                                >
                                  <AiFillDelete className="w-6 h-6" />
                                </button>
                              </li>
                            );
                          }
                        )}
                      </ul>

                      {/* Kết quả tìm kiếm người dùng */}
                      <ul className="mt-4">
                        {userResults.map((user) => (
                          <li
                            key={user.username}
                            className="flex justify-between items-center p-2 border-b"
                          >
                            <span>{user.name}</span>
                            <button
                              onClick={() =>
                                handleAddMemberToRoom(user.username)
                              }
                              className="text-blue-500"
                            >
                              Thêm
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
                <PhoneIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
                <VideoCameraIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
                <InformationCircleIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
              </div>
            </div>

            {/* Messages */}
            <div
              ref={messagesContainerRef}
              className="overflow-y-auto flex-1 mb-4 space-y-4 flex flex-col"
              onScroll={(e) => {
                const element = e.currentTarget;
                if (element.scrollTop === 0 && hasMore && !isLoadingMore) {
                  loadMoreMessages();
                }
              }}
            >
              {isLoadingMore && (
                <div className="text-center py-2">
                  <span className="text-gray-500">Đang tải tin nhắn cũ...</span>
                </div>
              )}

              {formattedMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.username === username
                      ? "justify-end"
                      : "justify-start"
                  } mb-2`}
                  onMouseEnter={() => setHoveredMessageId(message.id)}
                  onMouseLeave={() => setHoveredMessageId(null)}
                >
                  {message.username !== username && (
                    <img
                      src={message.avt}
                      alt={`${message.name}'s avatar`}
                      className="w-9 h-9 rounded-full mr-2 mt-1"
                    />
                  )}
                  <div
                    className={`relative p-2 rounded-2xl max-w-xs ${
                      message.username === username
                        ? "bg-yellow-800 text-white mr-2"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {message.type === "image" ? (
                      <img
                        src={message.imageUrl}
                        alt="Sent image"
                        className="max-w-full rounded-lg cursor-pointer"
                        onClick={() => window.open(message.imageUrl, "_blank")}
                      />
                    ) : (
                      <>
                        <p className="text-sm">{message.text}</p>
                        {message.pending && (
                          <span className="text-xs">Đang gửi...</span>
                        )}
                        {message.error && (
                          <span className="text-xs text-red-300">
                            Lỗi gửi tin nhắn
                          </span>
                        )}
                      </>
                    )}
                    {message.username !== username && (
                      <p className="text-xs text-gray-600">{message.name}</p>
                    )}
                    {hoveredMessageId === message.id && (
                      <div
                        className={`absolute text-xs ${
                          message.username === username
                            ? "right-full mr-2" // Tin nhắn người gửi, hiển thị bên trái
                            : "left-full ml-2" // Tin nhắn người nhận, hiển thị bên phải
                        } top-1/2 transform -translate-y-1/2 bg-black text-white p-2 rounded-xl whitespace-nowrap z-10`}
                      >
                        {message.timeString}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex items-center border-t p-2">
              <label className="cursor-pointer mr-2">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUploadMes}
                  disabled={uploadingImage}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-500 hover:text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </label>

              <input
                type="text"
                placeholder="Aa"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={uploadingImage}
                className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
              >
                Gửi
              </button>
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">
            Chọn một phòng để bắt đầu chat
          </p>
        )}
      </div>

      {/* Right Sidebar - Active Users */}
      <ActiveUsers users={users} />
    </div>
  );
}
