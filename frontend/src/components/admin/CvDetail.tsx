import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { FileText, Phone, Mail, Check, X } from "lucide-react";

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
  status: string;
  createdAt: string;
}

interface Assessment {
  interviewRound: number;
  scores: {
    skills: number;
    knowledge: number;
    expertise: number;
  };
  totalScore: number;
  comments: string;
}

const CustomAlert = ({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) => (
  <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-3 rounded shadow-lg flex items-center justify-between">
    <span>{message}</span>
    <button onClick={onClose} className="ml-4">
      <X className="w-4 h-4" />
    </button>
  </div>
);
const ConfirmDialog = ({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
      <p className="text-white mb-6">{message}</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={onCancel}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Hủy
        </button>
        <button
          onClick={onConfirm}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
);
const CVDetail = () => {
  const { id } = useParams();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const commentRef = useRef<HTMLTextAreaElement>(null);
  const [assessment, setAssessment] = useState<Assessment>({
    interviewRound: 1,
    scores: {
      skills: 0,
      knowledge: 0,
      expertise: 0,
    },
    totalScore: 0,
    comments: "",
  });

  const recruitmentSteps = [
    { label: "Ứng tuyển", value: "applied" },
    { label: "Đạt", value: "passed" },
    { label: "Phỏng vấn", value: "interview" },
    { label: "Thi", value: "test" },
    { label: "Đồng ý nhận việc", value: "accepted" },
  ];

  const statusOrder = {
    applied: 0,
    passed: 1,
    interview: 2,
    test: 3,
    accepted: 4,
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/applications/${id}`
        );
        const data = await response.json();
        setApplication(data);
      } catch (error) {
        console.error("Error fetching application:", error);
        setError("Failed to load application data");
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [error]);
  const hasValidAssessment = () => {
    return application?.assessments?.some(
      (assessment) =>
        assessment.scores.skills > 0 ||
        assessment.scores.knowledge > 0 ||
        assessment.scores.expertise > 0
    );
  };
  const getStepStatus = (stepValue: string) => {
    if (stepValue === "test") {
      return hasValidAssessment();
    }
    const stepIndex = statusOrder[stepValue as keyof typeof statusOrder] || 0;
    const currentIndex =
      statusOrder[application?.status as keyof typeof statusOrder] || 0;
    return stepIndex <= currentIndex;
  };
  const handleStatusUpdate = async (newStatus: string) => {
    if (!application) return;

    const currentStatusIndex =
      statusOrder[application.status as keyof typeof statusOrder] || 0;
    const newStatusIndex = statusOrder[newStatus as keyof typeof statusOrder];

    if (newStatusIndex < currentStatusIndex) {
      setError("Không thể quay lại trạng thái trước đó");
      return;
    }

    if (newStatus === "test") {
      setShowEvaluation(true);
      return;
    }
    if (newStatus === "interview") {
      setShowConfirm(true);
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/applications/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      setApplication((prev) => (prev ? { ...prev, status: newStatus } : null));
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Cập nhật trạng thái thất bại");
    }
  };

  const handleReject = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/applications/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "rejected" }),
        }
      );

      if (!response.ok) throw new Error("Failed to reject application");

      setApplication((prev) => (prev ? { ...prev, status: "rejected" } : null));
    } catch (error) {
      console.error("Error rejecting application:", error);
      setError("Từ chối ứng viên thất bại");
    }
  };
  const handleConfirmInterview = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/applications/status/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: "interview" }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");

      setApplication((prev) =>
        prev ? { ...prev, status: "interview" } : null
      );
    } catch (error) {
      console.error("Error updating status:", error);
      setError("Cập nhật trạng thái thất bại");
    } finally {
      setShowConfirm(false);
    }
  };

  const handleEvaluationSubmit = async () => {
    try {
      const submittedAssessment = {
        ...assessment,
        comments: commentRef.current?.value || "",
      };
      const response = await fetch(
        `http://localhost:3000/applications/assessments/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submittedAssessment),
        }
      );

      if (!response.ok) throw new Error("Failed to submit assessment");

      setShowEvaluation(false);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      setError("Lưu đánh giá thất bại");
    }
  };
  const openFileInViewer = (url: string) => {
    const fileId = url.match(/id=(.*?)(&|$)/)?.[1];
    if (fileId) {
      const viewerUrl = `https://drive.google.com/file/d/${fileId}/view`;
      window.open(viewerUrl, "_blank");
    }
  };

  const EvaluationForm = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-xl font-semibold text-white mb-4">
          Đánh giá ứng viên
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Kỹ năng</label>
            <select
              className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700"
              value={assessment.scores.skills}
              onChange={(e) =>
                setAssessment((prev) => ({
                  ...prev,
                  scores: { ...prev.scores, skills: Number(e.target.value) },
                }))
              }
            >
              <option value={0}>Chọn điểm</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Kiến thức</label>
            <select
              className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700"
              value={assessment.scores.knowledge}
              onChange={(e) =>
                setAssessment((prev) => ({
                  ...prev,
                  scores: { ...prev.scores, knowledge: Number(e.target.value) },
                }))
              }
            >
              <option value={0}>Chọn điểm</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Chuyên môn</label>
            <select
              className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700"
              value={assessment.scores.expertise}
              onChange={(e) =>
                setAssessment((prev) => ({
                  ...prev,
                  scores: { ...prev.scores, expertise: Number(e.target.value) },
                }))
              }
            >
              <option value={0}>Chọn điểm</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <option key={score} value={score}>
                  {score}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Nhận xét</label>
            <textarea
              ref={commentRef}
              className="w-full bg-gray-800 text-white rounded p-2 border border-gray-700"
              rows={4}
              defaultValue={assessment.comments}
            />
          </div>
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setShowEvaluation(false)}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
            >
              Hủy
            </button>
            <button
              onClick={handleEvaluationSubmit}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Lưu đánh giá
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        CV not found
      </div>
    );
  }

  const currentIndex =
    statusOrder[application?.status as keyof typeof statusOrder] || 0;

  return (
    <div className="bg-black min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <CustomAlert message={error} onClose={() => setError(null)} />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">
                Quá trình tuyển dụng
              </h2>
              <div className="relative">
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-700" />
                <div className="relative flex items-center justify-between">
                  {recruitmentSteps.map((step, index) => (
                    <button
                      key={index}
                      onClick={() => handleStatusUpdate(step.value)}
                      disabled={index > currentIndex + 1}
                      className={`flex flex-col items-center ${
                        index > currentIndex + 1
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                          getStepStatus(step.value)
                            ? "bg-green-500"
                            : "bg-gray-700"
                        }`}
                      >
                        <Check className="w-5 h-5 text-white" />
                      </div>
                      <span className="text-sm text-gray-300 mt-2">
                        {step.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-500 text-white rounded-md flex items-center gap-2 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                  Từ chối
                </button>
              </div>
            </div>

            {!showEvaluation && (
              <div className="bg-gray-900 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Thông tin cá nhân
                </h2>
                <div className="grid grid-cols-2 gap-6 text-gray-300">
                  <div>
                    <p className="mb-2 text-gray-500">Họ và tên</p>
                    <p>{application.candidate.fullName}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500">Quốc tịch</p>
                    <p>Việt Nam</p>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500">Chiều cao</p>
                    <p>178</p>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500">Cân nặng</p>
                    <p>70</p>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500">Dân tộc</p>
                    <p>Kinh</p>
                  </div>
                  <div>
                    <p className="mb-2 text-gray-500">Tôn giáo</p>
                    <p>Không</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/api/placeholder/120/120"
                  alt="Profile"
                  className="w-32 h-32 rounded-full mb-4"
                />
                <h2 className="text-xl font-semibold text-white mb-1">
                  {application.candidate.fullName}
                </h2>
                <p className="text-gray-400 mb-4">Ứng viên - Mã UV: UV00098</p>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Thông tin chung
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-500">Điện thoại</p>
                    <p className="text-white">{application.candidate.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="text-white">{application.candidate.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-gray-500">CV</p>
                    {application.candidate.resume.map((url, index) => (
                      <button
                        key={index}
                        onClick={() => openFileInViewer(url)}
                        className="text-blue-400 hover:underline"
                      >
                        Xem CV
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEvaluation && <EvaluationForm />}
      {showConfirm && (
        <ConfirmDialog
          message="Bạn có chắc chắn muốn cập nhật trạng thái phỏng vấn?"
          onConfirm={handleConfirmInterview}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
};

export default CVDetail;
