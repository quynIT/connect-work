import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa"; // Import React icon trash

interface Task {
  _id: string;
  name: string;
  description: string;
  dueDate: string;
  user: { _id: string; name: string; avt: string }[]; // Task user details
}

interface Comment {
  _id: string;
  user: { _id: string; name: string; avt: string }[]; // Comment user details
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
        setNewComment(""); // Xóa nội dung input sau khi tạo comment
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
    return <div>Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{task.name}</h2>
        <p className="text-gray-700 mb-4">{task.description}</p>
        <p className="text-gray-500 mb-4">Due Date: {task.dueDate}</p>

        <div className="flex gap-3 mb-4">
          {task.user.map((user) => (
            <img
              key={user._id}
              src={user.avt}
              alt={user.name}
              className="w-10 h-10 rounded-full border-2 border-gray-300"
              title={user.name}
            />
          ))}
        </div>

        {/* Form tạo comment */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Add a Comment
          </label>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full p-3 mt-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Write your comment here..."
          />
        </div>

        <div className="flex justify-end gap-3 mb-4">
          <button
            onClick={handleAddComment}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Submit Comment
          </button>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Hiển thị danh sách comment */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Comments</h3>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="flex items-start p-4 bg-gray-100 rounded-lg shadow-sm space-x-4"
              >
                <img
                  src={comment.user[0].avt}
                  alt={comment.user[0].name}
                  className="w-10 h-10 rounded-full border-2 border-gray-300"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-700">
                      {comment.user[0].name}
                    </span>
                    <button
                      onClick={() => handleDeleteComment(comment._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                  <p className="text-gray-700 mt-1">{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskDetail;
