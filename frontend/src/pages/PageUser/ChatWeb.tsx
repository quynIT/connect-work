import {
  PhoneIcon,
  VideoCameraIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";
interface User {
  name: string;
  lastMessage: string;
  active: boolean;
  unread: boolean;
}

interface Message {
  text: string;
  sender: string;
  time: string;
}

const users: User[] = [
  {
    name: "Lại Hữu Lợi",
    lastMessage: "Bạn: v mai chạy qua lúc mấy h",
    active: false,
    unread: true,
  },
  { name: "Tấn Hào", lastMessage: "Bạn: ???", active: false, unread: false },
  {
    name: "thích đủ thứ🐱",
    lastMessage: "You sent a sticker.",
    active: false,
    unread: true,
  },
  { name: "Helen", lastMessage: "Mới gọi nè", active: false, unread: false },
  {
    name: "Võ Chế Bằng",
    lastMessage: "Code y chang tấn công",
    active: true,
    unread: true,
  },
  {
    name: "Phan Gia Đạt",
    lastMessage: "Quá trời r",
    active: true,
    unread: false,
  },
  {
    name: "Đoàn Nguyễn",
    lastMessage: "Miễn có là dc à",
    active: false,
    unread: true,
  },
];

const messages: Message[] = [
  { text: "ehehhehehehehehehheh", sender: "me", time: "2:45 PM" },
  {
    text: "ehehhehehehehehehheh",
    sender: "me",
    time: "2:46 PM",
  },
  {
    text: "ehehhehehehehehehhehehehhehehehehehehhehehehhehehehehehehhehehehhehehehehehehhehehehhehehehehehehheh",
    sender: "other",
    time: "2:47 PM",
  },
  {
    text: "ehehhehehehehehehheh",
    sender: "me",
    time: "2:48 PM",
  },
];

export default function ChatWeb() {
  const currentChatUser = "thích đủ thứ🐱";

  return (
    <div className="flex mt-[100px] h-[85vh] mb-5">
      {/* Left Sidebar - Chat List */}
      <div className="w-1/4 bg-gray-100 p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Chats</h2>
        <input
          type="text"
          placeholder="Search Messenger"
          className="w-full px-3 py-2 mb-4 border rounded"
        />
        <ul>
          {users.map((user, index) => (
            <li
              key={index}
              className="flex items-center space-x-4 p-2 hover:bg-gray-200 rounded"
            >
              <div className="w-10 h-10 bg-gray-400 rounded-full" />
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-sm text-gray-600">{user.lastMessage}</p>
              </div>
              {user.unread && (
                <span className="h-3 w-3 bg-blue-500 rounded-full ml-auto" />
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Section */}
      <div className="flex-1 bg-gray-50 p-4 flex flex-col justify-between">
        {/* Header - Display current chat user */}
        <div className="flex items-center border-b pb-4 mb-4">
          <div className="w-10 h-10 bg-gray-400 rounded-full mr-4" />
          <h2 className="text-lg font-semibold flex-1">{currentChatUser}</h2>

          {/* Icons for call, video call, and about */}
          <div className="flex space-x-3">
            <PhoneIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
            <VideoCameraIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
            <InformationCircleIcon className="h-6 w-6 text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Messages */}
        <div className="overflow-y-auto flex-1">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.sender === "me" ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`${
                  message.sender === "me" ? "bg-yellow-500" : "bg-gray-200"
                } p-2 rounded-lg max-w-xs break-words`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex items-center border-t p-2">
          <button className="text-gray-500 mr-2">
            <i className="fas fa-plus" />
          </button>
          <input
            type="text"
            placeholder="Aa"
            className="flex-1 px-3 py-2 border rounded-lg focus:outline-none"
          />
          <button className="text-gray-500 ml-2">
            <i className="fas fa-smile" />
          </button>
          <button className="text-gray-500 ml-2">
            <i className="fas fa-paper-plane" />
          </button>
        </div>
      </div>

      {/* Right Sidebar - Active Users */}
      <div className="w-1/4 bg-white p-4 overflow-y-auto border-l">
        <h2 className="text-lg font-semibold mb-4">Active</h2>
        <ul>
          {users
            .filter((user) => user.active)
            .map((user, index) => (
              <li
                key={index}
                className="flex items-center space-x-4 p-2 hover:bg-gray-200 rounded"
              >
                <div className="w-10 h-10 bg-gray-400 rounded-full" />
                <p className="font-semibold">{user.name}</p>
                <span className="h-3 w-3 bg-green-500 rounded-full ml-auto" />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
