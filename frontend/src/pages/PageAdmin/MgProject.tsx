import React, { useState, useEffect } from "react";
import { FaPlus, FaEye, FaEdit, FaTrashAlt } from "react-icons/fa";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useNotification } from "../../components/user/Notification";
import ProjectProgress from "../../components/admin/ProjectProgress";

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

const MgProject: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  type FormMode = "create" | "update" | "view";
  const [formMode, setFormMode] = useState<FormMode>("create");
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showNotification } = useNotification();
  const [newProject, setNewProject] = useState<{
    name: string;
    description: string;
    projectCategory: string;
    memberSearch: string;
    member: string[];
    url: string;
    createdBy: string;
  }>({
    name: "",
    description: "",
    projectCategory: "",
    memberSearch: "",
    member: [],
    url: "",
    createdBy: "",
  });

  const [viewingProject, setViewingProject] = useState<Project | null>(null);

  const handleEditorChange = (content: string) => {
    setNewProject((prev) => ({ ...prev, description: content }));
  };

  // Fetch projects with loading state
  const fetchProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/projects/all");
      const data = await response.json();
      setProjects(data);
      setFilteredProjects(data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) return;

        const response = await fetch("http://localhost:3000/user/list", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUsers(data);
        setFilteredUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch user profile for createdBy
  useEffect(() => {
    if (showModal && formMode === "create") {
      const fetchUserProfile = async () => {
        try {
          const token = localStorage.getItem("accessToken");
          if (!token) return;

          const response = await axios.get(
            "http://localhost:3000/user/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (response.data?.position) {
            setNewProject((prev) => ({
              ...prev,
              createdBy: response.data.position,
            }));
          }
        } catch (error) {
          console.error("Failed to fetch user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [showModal, formMode]);

  const handleNavigateToTask = (projectId: string) => {
    navigate(`/task-board/${projectId}`);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = projects.filter((project) =>
      project.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProjects(filtered);
  };

  const handleUserSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setNewProject((prev) => ({ ...prev, memberSearch: value }));

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(value.toLowerCase()) &&
        !selectedUsers.includes(user._id)
    );
    setFilteredUsers(filtered);
  };

  const handleUserSelect = (userId: string) => {
    setNewProject((prev) => ({ ...prev, memberSearch: "" }));
    setSelectedUsers((prev) => [...prev, userId]);
    setFilteredUsers([]);
  };

  const handleRemoveUser = (userId: string) => {
    setSelectedUsers((prev) => prev.filter((id) => id !== userId));
  };

  const resetForm = () => {
    setNewProject({
      name: "",
      description: "",
      projectCategory: "",
      memberSearch: "",
      member: [],
      url: "",
      createdBy: "",
    });
    setSelectedUsers([]);
    setEditingProjectId(null);
    setFormMode("create");
  };

  const toggleModal = () => {
    setShowModal(!showModal);
    if (!showModal) {
      resetForm();
    }
  };

  const toggleViewModal = () => {
    setViewingProject(null);
    setShowViewModal(!showViewModal);
  };

  const handleCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = async (projectId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/projects/detail/${projectId}`
      );
      const project = await response.json();

      setSelectedUsers(project.user.map((u: User) => u._id));
      setNewProject({
        name: project.name,
        description: project.description,
        projectCategory: project.projectCategory,
        member: project.user.map((u: User) => u._id),
        memberSearch: "",
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

  const handleViewDetail = async (projectId: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/projects/detail/${projectId}`
      );
      const project = await response.json();
      setViewingProject(project);
      setShowViewModal(true);
    } catch (error) {
      console.error("Error fetching project detail:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (selectedUsers.length === 0) {
      alert("Vui lòng chọn ít nhất một thành viên cho dự án.");
      return;
    }

    const payload: NewProjectPayload = {
      name: newProject.name,
      description: newProject.description,
      projectCategory: newProject.projectCategory,
      user: selectedUsers,
      url: newProject.url,
      createdBy: newProject.createdBy,
    };

    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const url =
        formMode === "update"
          ? `http://localhost:3000/projects/update/${editingProjectId}`
          : "http://localhost:3000/projects/create";

      const response = await fetch(url, {
        method: formMode === "update" ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const updatedProject = await response.json();

        // Update local state without refetching
        if (formMode === "update") {
          setProjects((prev) =>
            prev.map((p) => (p._id === editingProjectId ? updatedProject : p))
          );
          setFilteredProjects((prev) =>
            prev.map((p) => (p._id === editingProjectId ? updatedProject : p))
          );
          showNotification("success", "Cập nhật dự án thành công!");
        } else {
          setProjects((prev) => [...prev, updatedProject]);
          setFilteredProjects((prev) => [...prev, updatedProject]);
          showNotification("success", "Tạo dự án mới thành công!");
        }
        toggleModal();
      }
    } catch (error) {
      showNotification("error", "Đã xảy ra lỗi khi thực hiện thao tác!");
      console.error("Error submitting project:", error);
    }
  };

  const handleDelete = async (projectId: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("accessToken");
    if (!token) return;

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
        // Update local state without refetching
        setProjects((prev) =>
          prev.filter((project) => project._id !== projectId)
        );
        setFilteredProjects((prev) =>
          prev.filter((project) => project._id !== projectId)
        );
      }
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-80 px-4 py-2 pl-10 bg-gray-800 border border-gray-700 text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
          </div>

          <button
            onClick={handleCreate}
            className="flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <FaPlus className="mr-2" />
            New Project
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-700">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-700 text-left text-gray-200 text-sm uppercase tracking-wider">
                  <th className="px-6 py-4">Project Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Team Members</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredProjects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-gray-700 transition-colors"
                  >
                    <td
                      className="px-6 py-4 cursor-pointer text-blue-400 hover:text-blue-300"
                      onClick={() => handleNavigateToTask(project._id)}
                    >
                      {project.name}
                    </td>
                    <td className="px-6 py-4">
                      <ProjectProgress project={project} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {project.user.map((user) => (
                          <img
                            key={user._id}
                            src={user.avt}
                            alt={user.name}
                            title={user.name}
                            className="w-8 h-8 rounded-full border-2 border-gray-800"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleViewDetail(project._id)}
                          className="text-gray-400 hover:text-blue-400 transition-colors"
                          title="View Details"
                        >
                          <FaEye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(project._id)}
                          className="text-gray-400 hover:text-yellow-400 transition-colors"
                          title="Edit Project"
                        >
                          <FaEdit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete Project"
                        >
                          <FaTrashAlt size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Create/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <h2 className="text-2xl font-bold text-gray-100">
                  {formMode === "create"
                    ? "Create New Project"
                    : "Update Project"}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Project Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject({ ...newProject, name: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter project name"
                        required
                      />
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Team Members
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          name="memberSearch"
                          value={newProject.memberSearch}
                          onChange={handleUserSearch}
                          className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Search team members..."
                        />
                        {newProject.memberSearch && (
                          <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {filteredUsers.map((user) => (
                              <div
                                key={user._id}
                                onClick={() => handleUserSelect(user._id)}
                                className="flex items-center px-4 py-2 hover:bg-gray-700 cursor-pointer"
                              >
                                <img
                                  src={user.avt}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="ml-3 text-gray-200">
                                  {user.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Selected Members */}
                      <div className="mt-4 space-y-2">
                        {selectedUsers.map((userId) => {
                          const user = users.find((u) => u._id === userId);
                          return user ? (
                            <div
                              key={userId}
                              className="flex items-center justify-between bg-gray-700 px-4 py-2 rounded-lg"
                            >
                              <div className="flex items-center">
                                <img
                                  src={user.avt}
                                  alt={user.name}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="ml-3 text-gray-200">
                                  {user.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemoveUser(userId)}
                                className="text-red-400 hover:text-red-300 transition-colors"
                              >
                                <svg
                                  className="w-5 h-5"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Project URL
                      </label>
                      <input
                        type="url"
                        name="url"
                        value={newProject.url}
                        onChange={(e) =>
                          setNewProject({ ...newProject, url: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Enter project URL"
                      />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Project Category
                      </label>
                      <select
                        name="projectCategory"
                        value={newProject.projectCategory}
                        onChange={(e) =>
                          setNewProject({
                            ...newProject,
                            projectCategory: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 text-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                      >
                        <option value="">Select category</option>
                        <option value="Development">Development</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Research">Research</option>
                      </select>
                    </div>

                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Project Description
                      </label>
                      <Editor
                        apiKey="zro2pt95ubysk411xiu8r3u34h94jdak3t3vrn1rjwqucvc2"
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: [
                            "advlist",
                            "autolink",
                            "lists",
                            "link",
                            "image",
                            "charmap",
                            "preview",
                            "anchor",
                            "searchreplace",
                            "visualblocks",
                            "code",
                            "fullscreen",
                            "insertdatetime",
                            "media",
                            "table",
                            "code",
                            "help",
                            "wordcount",
                          ],
                          toolbar:
                            "undo redo | formatselect | " +
                            "bold italic backcolor | alignleft aligncenter " +
                            "alignright alignjustify | bullist numlist outdent indent | " +
                            "removeformat | help",
                          content_style:
                            "body { color: #e5e7eb; background-color: #374151; }",
                          skin: "oxide-dark",
                          content_css: "dark",
                        }}
                        onEditorChange={handleEditorChange}
                        value={newProject.description}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-700">
                  <button
                    type="button"
                    onClick={toggleModal}
                    className="px-6 py-2 border border-gray-600 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {formMode === "create"
                      ? "Create Project"
                      : "Update Project"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Modal */}
        {showViewModal && viewingProject && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="p-6 border-b border-gray-700">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-100">
                    Project Details
                  </h2>
                  <button
                    onClick={toggleViewModal}
                    className="text-gray-400 hover:text-gray-200"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-100">
                    {viewingProject.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    {viewingProject.projectCategory}
                  </p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-2">
                    Description
                  </h4>
                  <div
                    className="prose prose-invert max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{
                      __html: viewingProject.description,
                    }}
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-200 mb-3">
                    Team Members
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {viewingProject.user.map((user: User) => (
                      <div
                        key={user._id}
                        className="flex items-center p-3 bg-gray-700 rounded-lg"
                      >
                        <img
                          src={user.avt}
                          alt={user.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="ml-3 font-medium text-gray-200">
                          {user.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {viewingProject.url && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-200 mb-2">
                      Project URL
                    </h4>
                    <a
                      href={viewingProject.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 break-all"
                    >
                      {viewingProject.url}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MgProject;
