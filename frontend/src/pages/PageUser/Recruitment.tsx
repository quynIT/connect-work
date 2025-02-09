import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  MapPin,
  DollarSign,
  FileText,
  X,
  Upload,
  Calendar,
  Filter,
} from "lucide-react";
import { Editor } from "@tinymce/tinymce-react";
import { remove as removeDiacritics } from "diacritics";
import { useNotification } from "../../components/user/Notification";
interface JobListing {
  _id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  status: string;
  dueDate: string;
  attachments: string[];
  createdAt: string;
}
interface NewJobListing extends Omit<JobListing, "attachments" | "_id"> {
  attachments: File[];
}
const Recruitment: React.FC = () => {
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showNotification } = useNotification();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [newListing, setNewListing] = useState<NewJobListing>({
    title: "",
    description: "",
    location: "",
    salaryRange: "",
    status: "open",
    dueDate: "",
    attachments: [],
    createdAt: new Date().toISOString(),
  });
  const fetchJobListings = async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách job");
      }

      let jobs = await response.json();
      jobs = jobs.sort(
        (a: JobListing, b: JobListing) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setJobListings(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Lỗi khi tải danh sách job");
    }
  };

  // Call this when component mounts
  useEffect(() => {
    fetchJobListings();
  }, []);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewListing((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditorChange = (content: string) => {
    setNewListing((prev) => ({
      ...prev,
      description: content,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setNewListing((prev) => ({
        ...prev,
        attachments: files,
      }));
    }
  };

  const handleSubmitListing = async () => {
    try {
      // Validate dữ liệu trước khi gửi
      if (!newListing.title) {
        alert("Vui lòng nhập tiêu đề");
        return;
      }
      if (!newListing.description) {
        alert("Vui lòng nhập mô tả");
        return;
      }
      if (!newListing.location) {
        alert("Vui lòng nhập địa điểm");
        return;
      }
      if (!newListing.dueDate) {
        alert("Vui lòng chọn ngày hết hạn");
        return;
      }

      setIsLoading(true);

      const formData = new FormData();
      formData.append("title", newListing.title);
      formData.append("description", newListing.description);
      formData.append("location", newListing.location);
      formData.append("salaryRange", newListing.salaryRange || "");
      formData.append("status", newListing.status);
      formData.append("dueDate", newListing.dueDate);

      if (newListing.attachments.length > 0) {
        newListing.attachments.forEach((file) => {
          const normalizedFileName = removeDiacritics(file.name); // Xóa dấu
          const renamedFile = new File([file], normalizedFileName, {
            type: file.type,
          });
          formData.append("file", renamedFile);
        });
      }

      const response = await fetch("http://localhost:3000/jobs", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Lỗi khi tạo job");
      }

      const result = await response.json();
      // Ensure attachments is an array before adding to jobListings
      const newJob = {
        ...result,
        attachments: result.attachments || [],
      };
      setJobListings((prev) => [...prev, newJob]);
      setIsCreateModalOpen(false);
      alert("Tạo job thành công!");
      await fetchJobListings();
    } catch (error) {
      console.error("Error creating job:", error);
      alert("Có lỗi xảy ra khi tạo job");
    } finally {
      setIsLoading(false);
    }
  };
  const openFileInViewer = (url: string) => {
    const fileId = url.match(/id=(.*?)(&|$)/)?.[1];
    if (fileId) {
      const viewerUrl = `https://drive.google.com/file/d/${fileId}/view`;
      window.open(viewerUrl, "_blank");
    }
  };
  // Add function to toggle job status
  const toggleJobStatus = async (jobId: string, currentStatus: string) => {
    try {
      const newStatus =
        currentStatus.toLowerCase() === "open" ? "closed" : "open";

      const response = await fetch(`http://localhost:3000/jobs/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update job status");
      }

      // Update local state after successful API call
      setJobListings((prevListings) =>
        prevListings.map((job) =>
          job.id === jobId ? { ...job, status: newStatus } : job
        )
      );
      showNotification("success", "Cập nhật trạng thái thành công!");
      await fetchJobListings();
    } catch (error) {
      console.error("Error updating job status:", error);
      showNotification("error", "Đã xảy ra lỗi khi thực hiện thao tác!");
    }
  };
  // Lọc job dựa trên search term và status
  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      job.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });
  return (
    <div className="bg-gray-900 min-h-screen p-6">
      <div className="container mx-auto">
        {/* Search and Create Section */}
        <div className="flex mb-6">
          <div className="relative flex-grow mr-4">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          {/* Status Filter Dropdown */}
          <div className="relative min-w-[150px] mr-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
            <Filter
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              size={16}
            />
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
          >
            <Plus className="mr-2" /> Create Listing
          </button>
        </div>
        <div className="flex gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Total Jobs: </span>
            <span className="text-white font-bold">{jobListings.length}</span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Open Jobs: </span>
            <span className="text-white font-bold">
              {
                jobListings.filter((job) => job.status.toLowerCase() === "open")
                  .length
              }
            </span>
          </div>
          <div className="bg-gray-800 rounded-lg px-4 py-2">
            <span className="text-gray-400">Closed Jobs: </span>
            <span className="text-white font-bold">
              {
                jobListings.filter(
                  (job) => job.status.toLowerCase() === "closed"
                ).length
              }
            </span>
          </div>
        </div>
        {/* No Results Message */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-400">
              No jobs found matching your criteria
            </p>
          </div>
        )}
        {/* Job Listings */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">
                  {job.title}
                </h2>
                <button
                  onClick={() => toggleJobStatus(job._id, job.status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors ${
                    job.status?.toLowerCase() === "open"
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-red-600 hover:bg-red-700 text-white"
                  }`}
                >
                  {job.status ? job.status.toUpperCase() : "UNKNOWN"}
                </button>
              </div>

              <div
                dangerouslySetInnerHTML={{ __html: job.description }}
                className="text-gray-300 mb-4"
              />

              <div className="grid grid-cols-4 gap-4 text-gray-400">
                <div className="flex items-center">
                  <MapPin className="mr-2 text-blue-400" size={20} />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="mr-2 text-green-400" size={20} />
                  <span>{job.salaryRange}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-yellow-400" size={20} />
                  <span>{new Date(job.dueDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center">
                  <FileText className="mr-2 text-purple-400" size={20} />
                  {job.attachments &&
                    job.attachments.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => openFileInViewer(url)}
                        className="ml-2 text-blue-500 hover:underline cursor-pointer"
                      >
                        File {index + 1}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Create Listing Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-gray-800 rounded-lg p-8 w-full max-w-6xl relative">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl font-bold text-white mb-6">
                Create Job Listing
              </h2>

              <div className="flex gap-8">
                {/* Left Column */}
                <div className="flex-1 space-y-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      Job Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={newListing.title}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={newListing.location}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. Hanoi, Vietnam"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Salary Range
                    </label>
                    <input
                      type="text"
                      name="salaryRange"
                      value={newListing.salaryRange}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g. 5000 - 7000 USD"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="dueDate"
                      value={newListing.dueDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">Status</label>
                    <select
                      name="status"
                      value={newListing.status}
                      onChange={handleInputChange}
                      className="w-full bg-gray-700 text-white rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="open">Open</option>
                      <option value="closed">Closed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 mb-2">
                      Attachments
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        multiple
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label
                        htmlFor="file-upload"
                        className="flex items-center justify-center w-full bg-gray-700 text-white rounded-lg py-2 px-4 cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <Upload className="mr-2" size={20} />
                        Upload Files
                      </label>
                      {newListing.attachments.length > 0 && (
                        <div className="mt-2 text-gray-300">
                          {newListing.attachments.map((file, index) => (
                            <div key={index} className="flex items-center">
                              <FileText className="mr-2" size={16} />
                              {file.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="flex-1">
                  <label className="block text-gray-300 mb-2">
                    Description *
                  </label>
                  <Editor
                    apiKey="2x0ufb2p4n449q9kvsa68unyrmh0vdhfkp2kxi2ccnmxlriv"
                    init={{
                      height: 400,
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
                    }}
                    onEditorChange={handleEditorChange}
                    value={newListing.description}
                  />
                </div>
              </div>

              <div className="mt-6">
                <button
                  onClick={handleSubmitListing}
                  disabled={isLoading}
                  className={`w-full ${
                    isLoading
                      ? "bg-gray-600 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white py-3 rounded-lg transition-colors`}
                >
                  {isLoading ? "Creating..." : "Create Job Listing"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recruitment;
