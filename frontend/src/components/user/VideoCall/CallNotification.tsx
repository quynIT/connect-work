import React from "react";
import { CallNotificationProps } from "../VideoCall/types";

export const CallNotification: React.FC<CallNotificationProps> = ({
  caller,
  callType,
  onAccept,
  onDecline,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl">
        <h3 className="text-xl font-semibold mb-4">Cuộc gọi đến</h3>
        <p className="mb-4">
          {caller} đang gọi {callType === "video" ? "video" : "thoại"}...
        </p>
        <div className="flex space-x-4">
          <button
            onClick={onAccept}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Chấp nhận
          </button>
          <button
            onClick={onDecline}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Từ chối
          </button>
        </div>
      </div>
    </div>
  );
};
