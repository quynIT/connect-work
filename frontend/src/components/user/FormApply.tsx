import React, { useState, ChangeEvent, FormEvent } from "react";
import { X } from "lucide-react";

interface ApplicationFormProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

export default function ApplicationForm({
  jobId,
  isOpen,
  onClose,
}: ApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
  });
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (selectedFiles.length > 3) {
      setError("Chỉ được chọn tối đa 3 file");
      return;
    }

    const invalidFile = selectedFiles.find(
      (file) => file.size > 10 * 1024 * 1024
    );
    if (invalidFile) {
      setError("Mỗi file không được vượt quá 10MB");
      return;
    }

    setFiles(selectedFiles);
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate files
    if (!files || files.length === 0) {
      setError("Vui lòng chọn ít nhất 1 file CV");
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("fullName", formData.fullName);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("phone", formData.phone);
    formDataToSend.append("resume", "[]");
    // Append mỗi file với key là 'files'
    files.forEach((file) => {
      const normalizedFileName = file.name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, ""); // Xóa dấu
      const renamedFile = new File([file], normalizedFileName, {
        type: file.type,
      });
      formDataToSend.append("files", renamedFile);
    });

    try {
      const response = await fetch(
        `http://localhost:3000/applications/${jobId}`,
        {
          method: "POST",
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Có lỗi xảy ra khi gửi đơn ứng tuyển"
        );
      }

      const result = await response.json();
      console.log("Upload success:", result);
      onClose();
      alert("Ứng tuyển thành công!");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-xl">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Ứng tuyển</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Họ và tên *
              </label>
              <input
                id="fullName"
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email *
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Số điện thoại *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="files"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                CV/Resume * (Tối đa 3 file, mỗi file không quá 10MB)
              </label>
              <input
                id="files"
                type="file"
                onChange={handleFileChange}
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>

            {error && <div className="text-red-500 text-sm">{error}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors disabled:bg-gray-400"
            >
              {loading ? "Đang xử lý..." : "Gửi đơn ứng tuyển"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
