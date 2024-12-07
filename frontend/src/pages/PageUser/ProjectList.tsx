import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import axios from "axios";
interface User {
  _id: string;
  name: string;
  avt: string;
}

interface Project {
  _id: string;
  name: string;
  url: string;
  description: string;
  projectCategory: string;
  user: User[];
  createdBy: string;
}

interface NewProjectPayload {
  name: string;
  description: string;
  projectCategory: string;
  user: string[];
  url: string;
  createdBy: string;
}

const ProjectList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  type FormMode = "create" | "update" | "view";
  const [formMode, setFormMode] = useState<FormMode>("create"); // Mặc định là "create"
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    projectCategory: "",
    member: "",
    url: "",
    createdBy: "",
  });

  const handleEditorChange = (content: string) => {
    setNewProject((prev) => ({ ...prev, description: content }));
  };
  // Fetch data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch("http://localhost:3000/projects/all");
        const data = await response.json();
        setProjects(data);
        setFilteredProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchProjects();
  }, []);
  //Get list user
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No access token found");
          return;
        }
        const response = await fetch("http://localhost:3000/user/list", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm accessToken vào header
          },
        });
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data); // Set initial filtered users to all users
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Lấy thông tin người dùng hiện tại từ localStorage (hoặc API)
  useEffect(() => {
    if (showModal && formMode === "create") {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("accessToken"); // Lấy accessToken từ localStorage

          if (token) {
            const response = await axios.get(
              "http://localhost:3000/user/profile",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const user = response.data; // Giả sử API trả về thông tin người dùng trong `data`
            if (user && user.position) {
              setNewProject((prev) => ({
                ...prev,
                createdBy: user.position, // Điền chức vụ của người dùng vào trường createdBy
              }));
            }
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [showModal, formMode]);
  // Handle search input change
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };
  // Handle search for users (for Add Member input)
  const handleUserSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewProject({ ...newProject, member: value });

    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };
  // Select user for the project
  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) => [...prev, userId]);
    setNewProject({
      ...newProject,
      member: "", // Reset the input after selecting user
    });
    setFilteredUsers([]); // Clear the user list after selection
  };
  // Hàm xóa người dùng khỏi danh sách đã chọn
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };
  // Toggle modal visibility
  const toggleModal = () => setShowModal(!showModal);

  // Open Create form
  const handleCreate = () => {
    setNewProject({
      name: "",
      description: "",
      projectCategory: "",
      member: "",
      url: "",
      createdBy: "",
    });
    setFormMode("create");
    setShowModal(true);
  };

  // Open Edit form
  const handleEdit = async (projectId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/projects/detail/${projectId}`
      );
      const project = await response.json();
      setNewProject({
        name: project.name,
        description: project.description,
        projectCategory: project.projectCategory,
        member: project.user.map((u: User) => u._id).join(","),
        url: project.url,
        createdBy: project.createdBy,
      });
      setEditingProjectId(projectId);
      setFormMode("update");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching project detail:", error);
    }
  };

  // Open View Detail form
  const handleViewDetail = async (projectId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/projects/detail/${projectId}`
      );
      const project = await response.json();
      setNewProject({
        name: project.name,
        description: project.description,
        projectCategory: project.projectCategory,
        member: project.user.map((u: User) => u._id).join(","),
        url: project.url,
        createdBy: project.createdBy,
      });
      setFormMode("view");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching project detail:", error);
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const payload: NewProjectPayload = {
      name: newProject.name,
      description: newProject.description,
      projectCategory: newProject.projectCategory,
      user: selectedUsers,
      url: newProject.url,
      createdBy: newProject.createdBy,
    };

    const token = localStorage.getItem("accessToken");
    try {
      const url =
        formMode === "update"
          ? `http://localhost:3000/projects/update/${editingProjectId}`
          : "http://localhost:3000/projects/create";
      const method = formMode === "update" ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedProject = await response.json();
        if (formMode === "update") {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProjectId ? updatedProject : p))
          );
        } else {
          setProjects([...projects, updatedProject]);
        }
        toggleModal();
      } else {
        console.error("Failed to submit project");
      }
    } catch (error) {
      console.error("Error submitting project:", error);
    }
  };
  const handleDelete = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `http://localhost:3000/projects/delete/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setProjects(projects.filter((project) => project._id !== projectId));
        setFilteredProjects(
          filteredProjects.filter((project) => project._id !== projectId)
        );
        alert("Project deleted successfully");
      } else {
        console.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };
  return (
    <div
      className="mt-24 p-6 min-h-screen"
      style={{ backgroundColor: "#f7fafd" }}
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Project List</h1>
      </div>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={handleSearch}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleCreate}
          className="flex items-center px-4 py-2 text-gray-900 font-bold rounded-lg hover:bg-green-600"
          style={{ backgroundColor: "#52e052" }}
        >
          <FaPlus className="mr-2" />
          New Project
        </button>
      </div>

      {/* Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full table-auto">
          <thead>
            <tr
              className="text-left border-b rounded-t-xl"
              style={{ backgroundColor: "#d9e6f2" }}
            >
              <th className="px-4 py-2">Name Project</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Members</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((project) => (
              <tr key={project._id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{project.name}</td>
                <td className="px-4 py-2">{project.projectCategory}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center space-x-2">
                    {project.user.map((user) => (
                      <span
                        key={user._id}
                        className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-2 py-1 rounded-full"
                      >
                        <img
                          src={user.avt}
                          alt={user.name}
                          className="w-6 h-6 rounded-full"
                        />
                        <span>{user.name}</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleViewDetail(project._id)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleEdit(project._id)}
                    className="text-yellow-500 hover:text-yellow-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTrashAlt />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50"
          onClick={toggleModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-bold mb-4">
                {formMode === "create"
                  ? "Create Project"
                  : formMode === "update"
                  ? "Update Project"
                  : "View Project"}
              </h2>
              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                {/* Left column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Project Name</label>
                    <input
                      type="text"
                      name="name"
                      value={newProject.name}
                      readOnly={formMode === "view"}
                      onChange={(e) =>
                        setNewProject({ ...newProject, name: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${
                        formMode === "view" ? "bg-gray-100" : ""
                      }`}
                      placeholder="Project Name"
                      required={formMode !== "view"}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Add Member</label>
                    <input
                      type="text"
                      name="member"
                      value={newProject.member}
                      readOnly={formMode === "view"}
                      onChange={handleUserSearch} // Function to handle user search
                      className={`w-full px-4 py-2 border rounded-lg ${
                        formMode === "view" ? "bg-gray-100" : ""
                      }`}
                      placeholder="Search members..."
                    />
                    <ul className="mt-2 max-h-40 overflow-y-auto">
                      {filteredUsers.map(
                        (user) =>
                          !selectedUsers.includes(user._id) && (
                            <li
                              key={user._id}
                              onClick={() => handleUserSelect(user._id)}
                              className="cursor-pointer px-2 py-1 hover:bg-gray-200 flex items-center"
                            >
                              <img
                                src={user.avt} // Hiển thị ảnh đại diện
                                alt={user.name}
                                className="w-8 h-8 rounded-full mr-2"
                              />
                              {user.name}
                            </li>
                          )
                      )}
                    </ul>

                    {/* Hiển thị các người dùng đã chọn */}
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
                  <div className="mb-4">
                    <label className="block text-gray-700">Project URL</label>
                    <input
                      type="url"
                      name="url"
                      value={newProject.url}
                      readOnly={formMode === "view"}
                      onChange={(e) =>
                        setNewProject({ ...newProject, url: e.target.value })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${
                        formMode === "view" ? "bg-gray-100" : ""
                      }`}
                      placeholder="Project URL"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">Created By</label>
                    <input
                      type="text"
                      name="createdBy"
                      value={newProject.createdBy}
                      readOnly={formMode === "view"}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          createdBy: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${
                        formMode === "view" ? "bg-gray-100" : ""
                      }`}
                      placeholder="Created By"
                      required={formMode !== "view"}
                    />
                  </div>
                </div>

                {/* Right column */}
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Project Category
                    </label>
                    <select
                      name="projectCategory"
                      value={newProject.projectCategory}
                      disabled={formMode === "view"}
                      onChange={(e) =>
                        setNewProject({
                          ...newProject,
                          projectCategory: e.target.value,
                        })
                      }
                      className={`w-full px-4 py-2 border rounded-lg ${
                        formMode === "view" ? "bg-gray-100" : ""
                      }`}
                      required={formMode !== "view"}
                    >
                      <option value="">Select a category</option>
                      <option value="Category1">Category 1</option>
                      <option value="Category2">Category 2</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700">
                      Project Description
                    </label>
                    <Editor
                      apiKey="ukbx68ea6fmdx70aa0i1xe2qpekdqjmf3p540yemmh7lsorc"
                      initialValue={newProject.description}
                      init={{
                        height: 300,
                        menubar: false,
                        plugins: [
                          "advlist autolink lists link image charmap print preview anchor",
                          "searchreplace visualblocks code fullscreen",
                          "insertdatetime media table paste code help wordcount",
                        ],
                        toolbar:
                          "undo redo | formatselect | bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | help",
                      }}
                      disabled={formMode === "view"}
                      onEditorChange={handleEditorChange}
                    />
                  </div>
                </div>

                {/* Action buttons */}
                <div className="col-span-2 flex justify-end">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  {formMode !== "view" && (
                    <button
                      type="submit"
                      className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
                    >
                      {formMode === "create" ? "Create" : "Update"}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
