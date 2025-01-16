import {
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import "../../App.css";
import React, { useRef, useEffect, useState } from "react";
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
}
interface Room {
  id: string;
  name: string;
  members: string[]; // Danh sách các thành viên trong phòng
  avtroom: string; // URL avatar của phòng
  createdAt: Date; // Thời gian tạo phòng, có thể là Timestamp hoặc Date
  lastMessage?: string; // Tin nhắn cuối cùng (tùy chọn)
  lastMessageTime?: Date | null; // Thời gian tin nhắn cuối cùng (tùy chọn)
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
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<{
    name: string;
    avt: string;
  } | null>(null);
  //Lấy thông tin người dùng từ firebase
  useEffect(() => {
    const fetchUserProfile = async () => {
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
  }, []);

  // Lấy tt user danh sách phòng chat từ Firestore

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    const fetchRooms = async () => {
      try {
        const profile = await getUserProfile();
        setUsername(profile.username);
        const roomsRef = collection(db, "rooms");
        const q = query(
          roomsRef,
          where("members", "array-contains", profile.username) // Lọc các phòng mà người dùng tham gia
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const fetchedRooms: Room[] = snapshot.docs.map((doc) => {
            const data = doc.data();

            return {
              id: doc.id,
              name: data.name || "Noname",
              members: data.members || [],
              avtroom: data.avtroom || avtdefault,
              createdAt: data.createdAt || new Date(),
              lastMessage: data.lastMessage,
              lastMessageTime: data.lastMessageTime
                ? data.lastMessageTime.toDate()
                : null,
            };
          });
          fetchedRooms.sort((a, b) => {
            const timeA = a.lastMessageTime ? a.lastMessageTime.getTime() : 0; // Lấy thời gian tính bằng milliseconds
            const timeB = b.lastMessageTime ? b.lastMessageTime.getTime() : 0;
            return timeB - timeA; // Sắp xếp từ tin nhắn gần nhất
          });
          setRooms(fetchedRooms);
        });

        return unsubscribe;
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();

    return () => {
      // Cleanup subscription khi component unmount
      unsubscribe?.();
    };
  }, []);

  // Lấy tin nhắn của phòng khi chọn phòng
  useEffect(() => {
    // Nếu không có phòng được chọn, xóa danh sách tin nhắn
    if (!selectedRoom) {
      setMessages([]); // Reset tin nhắn khi không có phòng
      return;
    }

    const messagesRef = collection(db, "messages");
    const q = query(
      messagesRef,
      where("roomId", "==", selectedRoom.id),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          if (
            typeof data.text === "string" &&
            typeof data.username === "string" &&
            typeof data.name === "string" &&
            typeof data.avt === "string" &&
            typeof data.roomId === "string" &&
            data.createdAt
          ) {
            return {
              id: doc.id,
              text: data.text,
              username: data.username,
              name: data.name,
              avt: data.avt,
              roomId: data.roomId,
              createdAt: data.createdAt.toDate(), // Chuyển Timestamp Firestore sang Date
            };
          } else {
            console.warn("Invalid message data:", data); // Log nếu dữ liệu không hợp lệ
            return null;
          }
        })
        .filter((msg): msg is Message => msg !== null); // Lọc tin nhắn hợp lệ

      setMessages(fetchedMessages);
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
    if (!newMessage.trim() || !selectedRoom || !userProfile) return;

    const messagesRef = collection(db, "messages");
    const newMsg = {
      text: newMessage,
      username: username,
      name: userProfile.name,
      avt: userProfile.avt,
      roomId: selectedRoom.id,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(messagesRef, newMsg);

      // Cập nhật lastMessage và lastMessageTime cho phòng
      const roomRef = doc(db, "rooms", selectedRoom.id);
      await updateDoc(roomRef, {
        lastMessage: newMessage,
        lastMessageTime: serverTimestamp(),
      });
      setRooms((prevRooms) => {
        return prevRooms
          .map((room) =>
            room.id === selectedRoom.id
              ? {
                  ...room,
                  lastMessage: newMessage,
                  lastMessageTime: new Date(), // Cập nhật thời gian tin nhắn
                }
              : room
          )
          .sort((a, b) => {
            // Đảm bảo so sánh thời gian chính xác
            const timeA = a.lastMessageTime ? a.lastMessageTime.getTime() : 0;
            const timeB = b.lastMessageTime ? b.lastMessageTime.getTime() : 0;
            return timeB - timeA; // Sắp xếp từ tin nhắn gần nhất
          });
      });
      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Hàm cuộn xuống cuối
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  // Cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    scrollToBottom(); // Cuộn xuống cuối khi có tin nhắn mới hoặc chọn phòng mới
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
          {rooms.map((room) => (
            <li
              key={room.id}
              onClick={() => setSelectedRoom(room)}
              className={`cursor-pointer flex items-center p-2 ${
                selectedRoom?.id === room.id ? "bg-blue-100" : ""
              }`}
            >
              <img
                src={room.avtroom || avtdefault}
                alt={`${room.name} avatar`}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <h3 className="font-semibold">{room.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {room.lastMessage}
                </p>
              </div>
            </li>
          ))}
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
            <div className="overflow-y-auto flex-1 mb-4">
              {messages.length === 0 ? (
                <p className="text-center text-gray-600">
                  Chưa có tin nhắn nào
                </p>
              ) : (
                formattedMessages.map((message, index) => {
                  return (
                    <div
                      key={index}
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
                        className={`relative p-2 rounded-2xl max-w-xs pl-3 pr-3 break-words ${
                          message.username === username
                            ? "bg-yellow-800 text-white mr-2"
                            : "bg-gray-200 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        {message.username !== username && (
                          <p className="text-xs text-gray-600">
                            {message.name}
                          </p>
                        )}

                        {/* Hiển thị thời gian khi di chuột vào */}
                        {hoveredMessageId === message.id && (
                          <p
                            className={`absolute text-xs text-white ${
                              message.username === username
                                ? "left-0 mt-11"
                                : "right-0 mt-14"
                            } top-0 bg-black p-2 rounded-xl z-10`}
                          >
                            <div>{message.timeString}</div>
                            {/* Hiển thị thời gian */}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="flex items-center border-t p-2">
              <input
                type="text"
                placeholder="Aa"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
              />
              <button
                onClick={handleSendMessage}
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
    </div>
  );
}
