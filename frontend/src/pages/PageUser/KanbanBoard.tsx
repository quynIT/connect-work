import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaPlus, FaClock, FaFilter, FaComment } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import TaskDetail from "../../components/user/TaskDetail";
import { useNotification } from "../../components/user/Notification";
interface User {
  _id: string;
  name: string;
  avt: string;
}

interface Task {
  _id: string;
  name: string;
  description: string;
  projectId: string;
  user: User[];
  status: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}
interface TaskForm {
  name: string;
  description: string;
  user: string[];
  status: string;
  projectId: string;
  type: string;
  dueDate: string | null;
  memberSearch: string;
}

const KanbanBoard: React.FC = () => {
  const { projectId } = useParams(); // Lấy idProject từ URL
  const [tasks, setTasks] = useState<Task[]>([]); // Lưu trữ danh sách task
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); // Lưu giá trị tìm kiếm
  const [loading, setLoading] = useState(true); // Hiển thị trạng thái loading
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái modal
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [filterMyTasks, setFilterMyTasks] = useState(false);
  const { showNotification } = useNotification();
  const [commentCounts, setCommentCounts] = useState<{
    [taskId: string]: number;
  }>({});
  const [filterDeadline, setFilterDeadline] = useState<
    "all" | "urgent" | "overdue"
  >("all");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [newTask, setNewTask] = useState<TaskForm>({
    name: "",
    description: "",
    user: [], // Khởi tạo là mảng rỗng
    memberSearch: "",
    status: "",
    projectId: projectId || "",
    type: "",
    dueDate: "",
  });
  // Gọi API để lấy task theo projectId
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks/project/${projectId}`
        );
        const data = await response.json();
        setTasks(data); // Cập nhật task vào state
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu task:", error);
      } finally {
        setLoading(false); // Kết thúc trạng thái loading
      }
    };

    fetchTasks();
  }, [projectId]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          console.error("Không có accessToken.");
          return;
        }
        const response = await fetch(
          `http://localhost:3000/projects/detail/${projectId}`
        );
        if (!response.ok) {
          throw new Error("Lỗi khi lấy dữ liệu người dùng.");
        }
        const data = await response.json();
        setUsers(data.user);
        console.log(data.user);
        setFilteredUsers(data.user);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu người dùng:", error);
      }
    };
    fetchUsers();
  }, [projectId]);
  // Fetch comment counts for tasks
  useEffect(() => {
    const fetchCommentCounts = async () => {
      try {
        const commentCountPromises = tasks.map(async (task) => {
          const response = await fetch(
            `http://localhost:3000/comments/task/${task._id}`
          );
          const comments = await response.json();
          return { [task._id]: comments.length };
        });

        const commentCountResults = await Promise.all(commentCountPromises);
        const commentCountMap = commentCountResults.reduce(
          (acc, curr) => ({ ...acc, ...curr }),
          {}
        );
        setCommentCounts(commentCountMap);
      } catch (error) {
        console.error("Error fetching comment counts:", error);
      }
    };

    if (tasks.length > 0) {
      fetchCommentCounts();
    }
  }, [tasks]);
  // Hàm xử lý tìm kiếm
  // const handleSearch = async () => {
  //   if (!searchTerm.trim()) {
  //     setSearchResults(null); // Nếu ô tìm kiếm trống, hiển thị lại tất cả tasks
  //     return;
  //   }

  //   try {
  //     setLoading(true); // Bật trạng thái loading
  //     const response = await fetch(
  //       `http://localhost:3000/tasks/search?name=${searchTerm}`
  //     );
  //     const data = await response.json();
  //     setSearchResults(data); // Cập nhật kết quả tìm kiếm vào state
  //   } catch (error) {
  //     console.error("Lỗi khi tìm kiếm task:", error);
  //   } finally {
  //     setLoading(false); // Tắt trạng thái loading
  //   }
  // };
  const handleEditorChange = (content: string) => {
    setNewTask((prev) => ({
      ...prev,
      description: content,
    }));
  };
  const handleUserSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewTask({ ...newTask, memberSearch: value }); // Cập nhật memberSearch

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedUsers.includes(user._id) // Loại bỏ người dùng đã chọn
    );
    setFilteredUsers(filtered);
  };
  // Hàm mở và đóng modal
  const openModal = () => setIsModalOpen(true);
  // Hàm xử lý khi nhập dữ liệu trong form
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "user") {
      // Tách chuỗi thành mảng ID người dùng
      const userIds = value.split(",").map((item) => item.trim()); // Tách theo dấu phẩy và loại bỏ khoảng trắng
      setNewTask((prev) => ({
        ...prev,
        [name]: userIds, // Lưu vào mảng user
      }));
    } else {
      setNewTask((prev) => ({
        ...prev,
        [name]: name === "dueDate" ? value || null : value, // Xử lý các trường khác như bình thường
      }));
    }
  };
  // Hàm xử lý tạo task mới
  const handleCreateTask = async () => {
    if (newTask.user.length === 0) {
      alert("Vui lòng chọn ít nhất một thành viên.");
      return; // Dừng quá trình nếu không có thành viên nào được chọn
    }
    try {
      // Lấy accessToken từ localStorage
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        console.error("Không có accessToken.");
        return;
      }

      // Gửi yêu cầu tạo task với token xác thực
      const response = await fetch(`http://localhost:3000/tasks/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Thêm token vào headers
        },
        body: JSON.stringify({ ...newTask, projectId }), // Dữ liệu gửi kèm sẽ có projectId từ URL
      });

      if (response.ok) {
        const createdTask = await response.json();
        setTasks((prev) => [...prev, createdTask]); // Thêm task mới vào danh sách
        closeModal(); // Đóng modal sau khi tạo thành công
      } else {
        console.error("Lỗi khi tạo task mới:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi tạo task mới:", error);
    }
  };
  // Select user for the task
  const handleUserSelect = (userId: string) => {
    setNewTask((prev) => ({
      ...prev,
      user: [...prev.user, userId], // Thêm userId vào mảng user của newTask
      memberSearch: "", // Xóa giá trị tìm kiếm
    }));
    setSelectedUsers((prev) => [...prev, userId]);
    setFilteredUsers([]); // Xóa danh sách tìm kiếm sau khi chọn
  };
  // Hàm xóa người dùng khỏi danh sách đã chọn
  const handleRemoveUser = (userId: string) => {
    setNewTask((prev) => ({
      ...prev,
      user: prev.user.filter((id) => id !== userId), // Xóa userId khỏi mảng user
    }));
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };

  // Hàm update
  const handleUpdateTask = async () => {
    if (!editingTask) return;

    try {
      // Bật trạng thái loading trước khi update
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        console.error("Không có accessToken.");
        setLoading(false);
        return;
      }

      const updatedTaskData = {
        ...newTask,
        status: newTask.status || editingTask.status,
      };

      const response = await fetch(
        `http://localhost:3000/tasks/update/${editingTask._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(updatedTaskData),
        }
      );

      if (response.ok) {
        // Fetch lại toàn bộ tasks để đảm bảo dữ liệu mới nhất
        const fetchTasksResponse = await fetch(
          `http://localhost:3000/tasks/project/${projectId}`
        );
        const updatedTasks = await fetchTasksResponse.json();

        // Cập nhật tasks và đóng modal
        setTasks(updatedTasks);
        closeModal();
        showNotification("success", "Cập nhật task thành công!");
      } else {
        showNotification("error", "Đã xảy ra lỗi khi thực hiện thao tác!");
        console.error("Lỗi khi cập nhật task:", response.statusText);
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật task:", error);
    } finally {
      // Tắt trạng thái loading dù có lỗi hay không
      setLoading(false);
    }
  };
  // Hàm xóa task
  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa task này?");
    if (confirmDelete) {
      try {
        const response = await fetch(
          `http://localhost:3000/tasks/delete/${taskId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setTasks((prevTasks) =>
            prevTasks.filter((task) => task._id !== taskId)
          );
          alert("Task đã được xóa.");
        } else {
          console.error("Lỗi khi xóa task:", response.statusText);
        }
      } catch (error) {
        console.error("Lỗi khi xóa task:", error);
      }
    }
  };
  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setSelectedUsers(task.user.map((u) => u._id));
    setNewTask({
      name: task.name,
      description: task.description,
      user: task.user.map((u) => u._id),
      status: task.status, // Đảm bảo status được set đúng
      projectId: task.projectId,
      dueDate: task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      memberSearch: "",
      type: "",
    });
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    setNewTask({
      name: "",
      description: "",
      user: [],
      memberSearch: "",
      status: "",
      projectId: projectId || "",
      type: "",
      dueDate: "",
    });
  };
  // Xử lý mở chi tiết task
  const handleOpenTaskDetail = (taskId: string) => {
    setSelectedTaskId(taskId); // Lưu taskId vào state để hiển thị chi tiết
  };
  // Đóng chi tiết task
  const handleCloseTaskDetail = () => {
    setSelectedTaskId(null); // Đặt lại selectedTaskId thành null để đóng chi tiết
  };
  // Hàm render các task theo cột
  const renderTasks = (status: keyof typeof categorizedTasks) =>
    categorizedTasks[status].map((task) => {
      const timeStatus = getTimeRemaining(task.dueDate);
      const commentCount = commentCounts[task._id] || 0;
      return (
        <div
          key={task._id}
          className="bg-white rounded-xl p-4 mb-4 shadow-md hover:shadow-lg transition-shadow duration-200"
        >
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-gray-800 font-medium text-lg">{task.name}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => handleOpenTaskDetail(task._id)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaEye className="text-blue-500 w-4 h-4" />
              </button>
              <button
                onClick={() => openEditModal(task)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaEdit className="text-yellow-500 w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteTask(task._id)}
                className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <FaTrash className="text-red-500 w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description preview */}
          <div
            className="text-gray-600 text-sm mb-4 line-clamp-2"
            dangerouslySetInnerHTML={{
              __html: task.description.substring(0, 100) + "...",
            }}
          ></div>

          <div className="flex justify-between items-center">
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
            {commentCount > 0 && (
              <div className="flex items-center text-gray-600">
                <FaComment className="mr-1 w-3 h-3" />
                <span className="text-sm">{commentCount}</span>
              </div>
            )}
            {status === "Done" && task.dueDate ? (
              <div className="flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-600">
                <FaClock className="mr-1 w-3 h-3" />
                <span>
                  {new Date(task.dueDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </div>
            ) : (
              timeStatus && (
                <div
                  className={`flex items-center px-3 py-1 rounded-full text-sm ${
                    timeStatus.isOverdue
                      ? "bg-red-100 text-red-600"
                      : timeStatus.isUrgent
                      ? "bg-orange-100 text-orange-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  <FaClock className="mr-1 w-3 h-3" />
                  <span>{timeStatus.text}</span>
                </div>
              )
            )}
            {selectedTaskId && (
              <div className="task-detail-modal">
                <TaskDetail
                  taskId={selectedTaskId}
                  onClose={handleCloseTaskDetail}
                />
              </div>
            )}
          </div>
        </div>
      );
    });
  const getTimeRemaining = (dueDate: string | null) => {
    if (!dueDate) return null;

    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diff < 0) {
      return { isOverdue: true, text: "Trễ deadline" };
    } else if (days === 0) {
      return { isUrgent: true, text: `${hours} giờ còn lại` };
    } else {
      return { isNormal: true, text: `${days} ngày còn lại` };
    }
  };
  // Hàm kiểm tra task có phải của user hiện tại không
  const isMyTask = (task: Task) => {
    const currentUserId = localStorage.getItem("currentUserId");
    return task.user.some((user) => user._id === currentUserId);
  };

  // Hàm kiểm tra trạng thái deadline của task
  const checkDeadlineStatus = (dueDate: string | null) => {
    if (!dueDate) return { isUrgent: false, isOverdue: false };

    const now = new Date();
    const due = new Date(dueDate);
    const diff = due.getTime() - now.getTime();
    const daysRemaining = Math.floor(diff / (1000 * 60 * 60 * 24));

    return {
      isUrgent: daysRemaining >= 0 && daysRemaining <= 2, // Gần đến hạn (còn 2 ngày hoặc ít hơn)
      isOverdue: daysRemaining < 0, // Đã quá hạn
    };
  };
  const filterTasks = (tasks: Task[]) => {
    let filteredTasks = [...tasks];

    // Lọc theo search term (giữ nguyên logic search cũ)
    if (searchTerm.trim()) {
      filteredTasks = filteredTasks.filter((task) =>
        task.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Lọc theo user
    if (filterMyTasks) {
      filteredTasks = filteredTasks.filter(isMyTask);
    }

    // Lọc theo deadline
    if (filterDeadline !== "all") {
      filteredTasks = filteredTasks.filter((task) => {
        const deadlineStatus = checkDeadlineStatus(task.dueDate);
        if (filterDeadline === "urgent") {
          return deadlineStatus.isUrgent && !deadlineStatus.isOverdue;
        } else if (filterDeadline === "overdue") {
          return deadlineStatus.isOverdue;
        }
        return true;
      });
    }

    return filteredTasks;
  };
  // Phân loại task theo status
  const categorizedTasks = {
    "To Do": filterTasks(tasks).filter((task) => task.status === "To Do"),
    "In Progress": filterTasks(tasks).filter(
      (task) => task.status === "In Progress"
    ),
    "In Review": filterTasks(tasks).filter(
      (task) => task.status === "In Review"
    ),
    Done: filterTasks(tasks).filter((task) => task.status === "Done"),
  };
  // Component Filter Menu
  const FilterMenu = () => (
    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-50 p-4">
      <div className="mb-4">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={filterMyTasks}
            onChange={(e) => setFilterMyTasks(e.target.checked)}
            className="form-checkbox h-4 w-4 text-green-600"
          />
          <span>My Tasks Only</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block mb-2">Deadline Filter:</label>
        <select
          value={filterDeadline}
          onChange={(e) =>
            setFilterDeadline(e.target.value as "all" | "urgent" | "overdue")
          }
          className="w-full p-2 border rounded"
        >
          <option value="all">All Tasks</option>
          <option value="urgent">Urgent (≤ 2 days)</option>
          <option value="overdue">Overdue</option>
        </select>
      </div>
    </div>
  );
  return (
    <div className="mt-20 p-6 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Board: <span className="text-green-600">Task</span>
        </h1>
        <button
          className="flex items-center px-6 py-2.5 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-colors duration-200"
          onClick={openModal}
        >
          <FaPlus className="mr-2" />
          New Task
        </button>
      </div>

      {/* Modal for creating task */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-20">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-5xl w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingTask ? "Update Task" : "Create Task"}
            </h2>
            <form className="flex flex-wrap">
              {/* Left Column */}
              <div className="w-full sm:w-1/2 pr-4">
                {/* Task Name */}
                <label className="block mb-2 font-medium">Task Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newTask.name}
                  onChange={handleInputChange}
                  placeholder="Enter task name..."
                  className="w-full p-2 border rounded-lg mb-4"
                />

                {/* Status */}
                <label className="block mb-2 font-medium">Status</label>
                <select
                  name="status"
                  value={newTask.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg mb-4"
                >
                  <option value="">Select status</option>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="In Review">In Review</option>
                  <option value="Done">Done</option>
                </select>

                {/* Due Date */}
                <label className="block mb-2 font-medium">Due Date</label>
                <input
                  type="date"
                  name="dueDate"
                  value={newTask.dueDate ? newTask.dueDate : ""}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg mb-4"
                />

                {/* Members Input */}
                <label className="block mb-2 font-medium">Members</label>
                <input
                  type="text"
                  name="user"
                  value={newTask.memberSearch || ""}
                  onChange={handleUserSearch} // Sai cú pháp
                  placeholder="Enter user IDs (comma separated)"
                  className="w-full p-2 border rounded-lg mb-4"
                />
                {newTask.memberSearch && (
                  <ul className="mt-2 max-h-40 overflow-y-auto absolute z-10 bg-white shadow-md rounded-lg w-[430px]">
                    {filteredUsers.map((user) => (
                      <li
                        key={user._id}
                        onClick={() => handleUserSelect(user._id)}
                        className="cursor-pointer px-2 py-1 hover:bg-gray-200 flex items-center"
                      >
                        <img
                          src={user.avt}
                          alt={user.name}
                          className="w-8 h-8 rounded-full mr-2"
                        />
                        {user.name}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4">
                  {selectedUsers.map((userId) => {
                    const selectedUser = users.find(
                      (user) => user._id === userId
                    );
                    return (
                      selectedUser && (
                        <div
                          key={userId}
                          className="flex items-center justify-between mt-2 px-4 py-2 bg-gray-100 rounded-lg"
                        >
                          <img
                            src={selectedUser.avt}
                            alt={selectedUser.name}
                            className="w-8 h-8 rounded-full mr-2"
                          />
                          <span>{selectedUser.name}</span>
                          <button
                            onClick={() => handleRemoveUser(userId)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>

              {/* Right Column */}
              <div className="w-full sm:w-1/2 pl-4">
                {/* Project Description */}
                <label className="block mb-2 font-medium">
                  Project Description
                </label>
                <Editor
                  apiKey="2x0ufb2p4n449q9kvsa68unyrmh0vdhfkp2kxi2ccnmxlriv"
                  init={{
                    plugins: [
                      // Core editing features
                      "anchor",
                      "autolink",
                      "charmap",
                      "codesample",
                      "emoticons",
                      "image",
                      "link",
                      "lists",
                      "media",
                      "searchreplace",
                      "table",
                      "visualblocks",
                      "wordcount",
                      // Your account includes a free trial of TinyMCE premium features
                      // Try the most popular premium features until Jan 22, 2025:
                      "checklist",
                      "mediaembed",
                      "casechange",
                      "export",
                      "formatpainter",
                      "pageembed",
                      "a11ychecker",
                      "tinymcespellchecker",
                      "permanentpen",
                      "powerpaste",
                      "advtable",
                      "advcode",
                      "editimage",
                      "advtemplate",
                      "ai",
                      "mentions",
                      "tinycomments",
                      "tableofcontents",
                      "footnotes",
                      "mergetags",
                      "autocorrect",
                      "typography",
                      "inlinecss",
                      "markdown",
                      "importword",
                      "exportword",
                      "exportpdf",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
                    tinycomments_mode: "embedded",
                    tinycomments_author: "Author name",
                    mergetags_list: [
                      { value: "First.Name", title: "First Name" },
                      { value: "Email", title: "Email" },
                    ],
                    ai_request: (respondWith: {
                      string: (callback: () => Promise<string>) => void;
                    }) =>
                      respondWith.string(() =>
                        Promise.reject("See docs to implement AI Assistant")
                      ),
                  }}
                  onEditorChange={handleEditorChange}
                  value={newTask.description || ""}
                />
              </div>

              {/* Buttons */}
              <div className="flex justify-between w-full mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={editingTask ? handleUpdateTask : handleCreateTask}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg"
                >
                  {editingTask ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <div className="">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tasks..."
              className="w-96 px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="relative z-10">
            <button
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="flex items-center px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
            >
              <FaFilter className="mr-2" />
              Filters
              {(filterMyTasks || filterDeadline !== "all") && (
                <span className="ml-2 w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </button>
            {showFilterMenu && <FilterMenu />}
          </div>
        </div>
      </div>

      {/* Columns */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-6">
          {/* Column 1 */}
          <div className="bg-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                <h2 className="text-lg font-semibold text-gray-800">
                  To Do ({categorizedTasks["To Do"].length})
                </h2>
              </div>
            </div>
            {renderTasks("To Do")}
          </div>

          {/* Column 2 */}
          <div className="bg-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></div>
                <h2 className="text-lg font-semibold text-gray-800">
                  In Progress ({categorizedTasks["In Progress"].length})
                </h2>
              </div>
            </div>
            {renderTasks("In Progress")}
          </div>

          {/* Column 3 */}
          <div className="bg-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                <h2 className="text-lg font-semibold text-gray-800">
                  In Review ({categorizedTasks["In Review"].length})
                </h2>
              </div>
            </div>
            {renderTasks("In Review")}
          </div>

          {/* Column 4 */}
          <div className="bg-gray-100 rounded-xl shadow-sm p-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                <h2 className="text-lg font-semibold text-gray-800">
                  Done ({categorizedTasks["Done"].length})
                </h2>
              </div>
            </div>
            {renderTasks("Done")}
          </div>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
