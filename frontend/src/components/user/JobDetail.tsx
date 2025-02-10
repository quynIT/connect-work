import { useParams } from "react-router-dom";
import {
  MapPin,
  DollarSign,
  Clock,
  Building2,
  GraduationCap,
  Users,
  FileText,
} from "lucide-react";
import { useState, useEffect } from "react";
import ApplicationForm from "./FormApply";

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

const JobDetailPage = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await fetch(`http://localhost:3000/jobs/${id}`);
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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
    <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 min-h-screen mt-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Main Job Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  {job.title}
                </h1>
                <button className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                  Lưu tin
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <span>Tới {job.salaryRange} USD</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-green-600" />
                  <span>
                    Hạn nộp: {new Date(job.dueDate).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsFormOpen(true)}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors mb-6"
              >
                Ứng tuyển ngay
              </button>
              <ApplicationForm
                jobId={job._id}
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
              />
              <div>
                <h2 className="text-xl font-semibold mb-4">
                  Chi tiết tin tuyển dụng
                </h2>
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
                {job.attachments && job.attachments.length > 0 && (
                  <div className="mt-4 border-t pt-4">
                    {" "}
                    {/* Thêm đường kẻ phân cách */}
                    <p className="font-medium text-gray-900 mb-2">
                      Xem thêm về thông tin công việc:
                    </p>
                    <div className="flex items-center flex-wrap gap-2">
                      <FileText className="text-purple-400" size={20} />
                      {job.attachments.map((url, index) => (
                        <button
                          key={index}
                          onClick={() => openFileInViewer(url)}
                          className="text-blue-500 hover:underline cursor-pointer flex items-center"
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

        {/* Right Column - Company Info */}
        <div className="space-y-6">
          {/* Company Information Card */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <img
                  src="/api/placeholder/80/80"
                  alt="Company logo"
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div>
                  <h3 className="font-semibold text-lg">Công ty TNHH ABC</h3>
                  <p className="text-gray-600">IT - Phần mềm</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2 items-start">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <p className="text-gray-600">
                    Tầng 14, tháp Hòa Bình, số 106 đường Hoàng Quốc Việt
                  </p>
                </div>
                <div className="flex gap-2 items-center">
                  <Users className="w-5 h-5 text-gray-500" />
                  <p className="text-gray-600">25-99 nhân viên</p>
                </div>
              </div>
              <button className="mt-4 w-full py-2 px-4 bg-white border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors">
                Xem trang công ty
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Thông tin chung</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building2 className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-gray-600">Cấp bậc</p>
                    <p className="font-medium">Nhân viên</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-gray-600">Học vấn</p>
                    <p className="font-medium">Đại học trở lên</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-gray-600">Số lượng tuyển</p>
                    <p className="font-medium">2 người</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailPage;
