import React, { useEffect, useState } from "react";
import { FaTrashAlt, FaTimes, FaRegClock } from "react-icons/fa";

interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  user: { _id: string; name: string; avt: string }[];
}

interface Comment {
  _id: string;
  user: { _id: string; name: string; avt: string }[];
  content: string;
}

interface TaskDetailProps {
  taskId: string;
  onClose: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ taskId, onClose }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>("");

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3000/tasks/${taskId}`);
        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết task:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/comments/task/${taskId}`
        );
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Lỗi khi lấy comment:", error);
      }
    };

    fetchTaskDetails();
    fetchComments();
  }, [taskId]);

  const handleAddComment = async () => {
    const userID = localStorage.getItem("currentUserId");
    if (!userID || !newComment.trim()) return;

    const commentData = {
      taskId,
      user: userID,
      content: newComment,
    };

    try {
      const response = await fetch("http://localhost:3000/comments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentData),
      });

      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error tạo comment:", error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/comments/delete/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setComments(comments.filter((comment) => comment._id !== commentId));
      }
    } catch (error) {
      console.error("Lỗi khi xóa comment:", error);
    }
  };

  if (!task) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b flex-shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{task.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Description Section - Now Scrollable */}
          <div className="mb-6 max-h-40 overflow-y-auto pr-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2 sticky top-0 bg-white z-10">
              Description
            </h4>
            <div
              className="prose max-w-none text-gray-600"
              dangerouslySetInnerHTML={{
                __html: task.description,
              }}
            />
          </div>

          {/* Due Date & Assigned Users */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="flex items-center text-gray-500">
              <FaRegClock className="mr-2" />
              <span className="text-sm">
                Due Date: {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex -space-x-2">
              {task.user.map((user) => (
                <img
                  key={user._id}
                  src={user.avt}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                  title={user.name}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Comment Form */}
        <div className="p-6 border-b bg-gray-50 flex-shrink-0">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Add a Comment
          </h4>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Write your comment here..."
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddComment}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Comment
            </button>
          </div>
        </div>

        {/* Comments List - Now Scrollable */}
        <div className="flex-grow overflow-y-auto">
          <div className="p-6">
            <h4 className="text-sm font-medium text-gray-700 mb-4 sticky top-0 bg-white z-10">
              Comments ({comments.length})
            </h4>
            <div className="space-y-4">
              {comments.map((comment) => (
                <div
                  key={comment._id}
                  className="flex gap-3 p-4 bg-gray-50 rounded-lg"
                >
                  <img
                    src={comment.user[0].avt}
                    alt={comment.user[0].name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-800">
                        {comment.user[0].name}
                      </span>
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <FaTrashAlt size={14} />
                      </button>
                    </div>
                    <p className="text-gray-600">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
