import { Link, useParams } from "react-router-dom";
import { MapPin, DollarSign, Clock, FileText } from "lucide-react";
import { useState, useEffect } from "react";

interface Job {
  _id: string;
  title: string;
  description: string;
  location: string;
  salaryRange: string;
  status: string;
  dueDate: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

interface Candidate {
  fullName: string;
  email: string;
  phone: string;
  resume: string[];
  submittedAt: string;
}

interface Application {
  _id: string;
  jobId: string;
  candidate: Candidate;
  status: Status;
  createdAt: string;
}

enum Status {
  Pending = "pending",
  Passed = "passed",
  Interview = "interview",
  Probation = "probation",
  Rejected = "rejected",
}

const JobDetailAdmin = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<Status | "all">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobResponse, applicationsResponse] = await Promise.all([
          fetch(`http://localhost:3000/jobs/${id}`),
          fetch("http://localhost:3000/applications/"),
        ]);

        const jobData = await jobResponse.json();
        const applicationsData = await applicationsResponse.json();

        setJob(jobData);
        setApplications(
          applicationsData.filter((app: Application) => app.jobId === id)
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const filteredApplications =
    selectedStatus === "all"
      ? applications
      : applications.filter((app) => app.status === selectedStatus);

  const getStatusColor = (status: Status) => {
    const colors = {
      [Status.Pending]: "bg-yellow-900 text-yellow-300",
      [Status.Passed]: "bg-green-900 text-green-300",
      [Status.Interview]: "bg-blue-900 text-blue-300",
      [Status.Probation]: "bg-purple-900 text-purple-300",
      [Status.Rejected]: "bg-red-900 text-red-300",
    };
    return colors[status];
  };

  const getStatusLabel = (status: Status) => {
    const labels = {
      [Status.Pending]: "Đang chờ",
      [Status.Passed]: "Đạt",
      [Status.Interview]: "Phỏng vấn",
      [Status.Probation]: "Thử việc",
      [Status.Rejected]: "Từ chối",
    };
    return labels[status];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Job not found
      </div>
    );
  }

  const openFileInViewer = (url: string) => {
    const fileId = url.match(/id=(.*?)(&|$)/)?.[1];
    if (fileId) {
      const viewerUrl = `https://drive.google.com/file/d/${fileId}/view`;
      window.open(viewerUrl, "_blank");
    }
  };

  return (
    <div className="bg-black min-h-screen">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column - Main Job Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-lg shadow-md">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h1 className="text-2xl font-bold text-white">{job.title}</h1>
                  <button className="px-4 py-2 border border-green-400 text-green-400 rounded-md hover:bg-green-900 transition-colors">
                    Lưu tin
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span>Tới {job.salaryRange} USD</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin className="w-5 h-5 text-green-400" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="w-5 h-5 text-green-400" />
                    <span>
                      Hạn nộp:{" "}
                      {new Date(job.dueDate).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>

                <div className="text-white">
                  <h2 className="text-xl font-semibold mb-4">
                    Chi tiết tin tuyển dụng
                  </h2>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: job.description }}
                  />
                  {job.attachments && job.attachments.length > 0 && (
                    <div className="mt-4 border-t border-gray-700 pt-4">
                      <p className="font-medium text-gray-300 mb-2">
                        Xem thêm về thông tin công việc:
                      </p>
                      <div className="flex items-center flex-wrap gap-2">
                        <FileText className="text-purple-400" size={20} />
                        {job.attachments.map((url, index) => (
                          <button
                            key={index}
                            onClick={() => openFileInViewer(url)}
                            className="text-blue-400 hover:underline cursor-pointer flex items-center"
                          >
                            Tệp đính kèm {index + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Applications */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">
                  Đơn ứng tuyển ({filteredApplications.length})
                </h2>
                <select
                  value={selectedStatus}
                  onChange={(e) =>
                    setSelectedStatus(e.target.value as Status | "all")
                  }
                  className="bg-gray-800 text-white border border-gray-700 rounded-md px-3 py-1"
                >
                  <option value="all">Tất cả</option>
                  {Object.values(Status).map((status) => (
                    <option key={status} value={status}>
                      {getStatusLabel(status)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div
                    key={application._id}
                    className="border border-gray-700 rounded-lg p-4 text-gray-300"
                  >
                    <div className="space-y-2">
                      <p className="font-semibold text-white">
                        <Link
                          to={`/admin/mg-recruitment/cv/${application._id}`}
                          className="hover:text-blue-400 transition-colors"
                        >
                          {application.candidate.fullName}
                        </Link>
                      </p>
                      <p>{application.candidate.email}</p>
                      <p>{application.candidate.phone}</p>
                      <p className="text-sm">
                        Nộp lúc:{" "}
                        {new Date(
                          application.candidate.submittedAt
                        ).toLocaleString("vi-VN")}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <FileText className="text-purple-400" size={16} />
                          {application.candidate.resume.map((url, index) => (
                            <button
                              key={index}
                              onClick={() => openFileInViewer(url)}
                              className="text-blue-400 hover:underline text-sm"
                            >
                              Xem CV
                            </button>
                          ))}
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${getStatusColor(
                            application.status
                          )}`}
                        >
                          {getStatusLabel(application.status)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailAdmin;
