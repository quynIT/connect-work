import React, { useEffect, useState } from "react";
import { MapPin, DollarSign, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

const CocaColaCareers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"about" | "jobs">("about");
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const navigate = useNavigate();

  const handleViewDetails = (jobId: string) => {
    navigate(`/recruitment/${jobId}`);
  };
  const fetchJobListings = async () => {
    try {
      const response = await fetch("http://localhost:3000/jobs", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Không thể tải danh sách job");
      }

      let jobs = await response.json();
      jobs = jobs
        .filter((job: JobListing) => job.status.toLowerCase() === "open")
        .sort(
          (a: JobListing, b: JobListing) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      setJobListings(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      alert("Lỗi khi tải danh sách job");
    }
  };

  useEffect(() => {
    if (activeTab === "jobs") {
      fetchJobListings();
    }
  }, [activeTab]);

  const calculateTimeRemaining = (dueDate: string): string => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = Math.abs(due.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng`;
    } else {
      return `${diffDays} ngày`;
    }
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Banner Section */}
      <div className="w-full h-64 bg-sky-200 relative">
        <img
          src="../src/assets/bg_home.jpg"
          alt="Coca-Cola Vietnam Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="flex items-start gap-6">
          <div className="w-32 h-32 bg-black rounded-lg shadow-md overflow-hidden">
            <img
              src="../../../public/logo.png"
              alt="Coca-Cola Vietnam Logo"
              className="w-full h-full object-contain p-2"
            />
          </div>
          <div className="flex-1 pt-16 mt-3">
            <h1 className="text-2xl font-bold text-gray-800">
              Nước giải khát Coca-Cola Việt Nam
            </h1>
            <p className="text-gray-600">1656 lượt theo dõi</p>
          </div>
          <div className="pt-16 mt-3">
            <button className="bg-orange-400 hover:bg-orange-500 text-white px-6 py-2 rounded-full">
              Theo dõi
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b mt-8">
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "about"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("about")}
          >
            Về chúng tôi
          </button>
          <button
            className={`px-6 py-3 font-medium ${
              activeTab === "jobs"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setActiveTab("jobs")}
          >
            Vị trí đang tuyển dụng
          </button>
        </div>

        {/* Content Section */}
        <div className="py-8">
          {activeTab === "about" ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Lĩnh vực
                </h3>
                <p className="text-gray-600">Hàng tiêu dùng</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Liên hệ
                </h3>
                <p className="text-gray-600">Phòng nhân sự</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  Địa chỉ
                </h3>
                <p className="text-gray-600">
                  485 Xa lộ Hà Nội, P. Linh Trung, Q. Thủ Đức, TP.HCM
                  <a href="#" className="text-blue-600 ml-2">
                    ( Xem bản đồ )
                  </a>
                </p>
              </div>
              <div>
                <p className="text-gray-700 leading-relaxed">
                  Coca-Cola Việt Nam là một thành viên của Swire Coca-Cola
                  Limited - đối tác đóng chai lớn thứ năm trong hệ thống dựa
                  trên số lượng bán toàn cầu, được cấp quyền sản xuất, tiếp thị
                  và phân phối các sản phẩm của Tập đoàn Coca-Cola. COCA-COLA
                  VIỆT NAM TỰ HÀO HÀNH TRÌNH ĐÓNG KIẾN TẠO SỰG KHOÁI TRỌNG VĂN
                  HÓA DOANH NGHIỆP Tại Coca-Cola Việt Nam, chúng tôi cam kết tạo
                  ra các thương hiệu và nước giải khát được mọi người yêu thích
                  với nhiều sản phẩm và kích thước khác nhau, đồng thời cung cấp
                  các giải pháp điều hành cho doanh nghiệp mang lại những ảnh
                  hưởng đối với cuộc sống của mọi người dân, đồng và toàn thể
                  giới. Chúng tôi tin rằng mục tiêu, tầm nhìn, sứ mệnh và các
                  giá trị cốt lõi giúp chúng tôi trở nên khác biệt và dẫn đất
                  cuộc hành trình thành công.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobListings.map((job) => (
                <div
                  key={job._id}
                  className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {job.title}
                  </h2>

                  <div className="space-y-3 text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="mr-2 text-blue-500" size={20} />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="mr-2 text-green-500" size={20} />
                      <span>{job.salaryRange || "Thương lượng"}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 text-orange-500" size={20} />
                      <span>
                        Còn {calculateTimeRemaining(job.dueDate)} để ứng tuyển
                      </span>
                    </div>
                  </div>

                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                    onClick={() => handleViewDetails(job._id)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CocaColaCareers;
