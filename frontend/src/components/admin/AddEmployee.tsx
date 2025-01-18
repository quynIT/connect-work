import React, { useState, useEffect, ChangeEvent } from "react";
import axios from "axios";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaHome,
  FaDollarSign,
  FaCamera,
  FaVenusMars,
  FaUserClock,
  FaMoneyCheckAlt,
} from "react-icons/fa";
import { db } from "../../firebase/config"; // Import firebase đã cấu hình
import { collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
function AddEmployee() {
  const [image, setImage] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [salary, setSalary] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Kiểm tra dung lượng ảnh (100 KB = 100 * 1024 bytes)
      const maxFileSize = 100 * 1024; // 100 KB
      if (file.size > maxFileSize) {
        alert("Dung lượng ảnh vượt quá 100KB. Vui lòng chọn ảnh nhỏ hơn.");
        return;
      }
  
      try {
        const storage = getStorage();
  
        // Tạo một đường dẫn cho ảnh thumbnail
        const fileName = file.name.split(".")[0] + "-thumbnail.jpg"; // Thêm "-thumbnail" vào tên file
        const fileRef = ref(storage, `avatars/${fileName}`);
  
        // Upload ảnh thumbnail lên Firebase
        await uploadBytes(fileRef, file);
  
        // Lấy URL của ảnh thumbnail sau khi upload thành công
        const fileURL = await getDownloadURL(fileRef);
  
        setImage(fileURL); // Lưu URL ảnh thumbnail vào state
      } catch (error) {
        console.error("Lỗi khi tải lên ảnh:", error);
        alert("Đã xảy ra lỗi trong quá trình tải lên ảnh.");
      }
    }
  };
  

  useEffect(() => {
    const usernameFromEmail = email.split("@")[0];
    setUsername(usernameFromEmail);
  }, [email]);

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).slice(-8); // tạo mật khẩu ngẫu nhiên có độ dài 8 ký tự
    setPassword(randomPassword); // Gán giá trị mật khẩu cho state
  };

  // useEffect để tự động cập nhật tên đăng nhập và mật khẩu khi email thay đổi
  useEffect(() => {
    if (email) {
      // Chỉ chạy khi email có giá trị
      const usernameFromEmail = email.split("@")[0];
      setUsername(usernameFromEmail); // Đặt tên đăng nhập từ phần đầu của email

      if (!password) {
        // Nếu mật khẩu chưa được tạo
        generateRandomPassword(); // Tạo mật khẩu ngẫu nhiên
      }
    }
  }, [email, password]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email là bắt buộc";
    if (!username) newErrors.username = "Tên đăng nhập là bắt buộc";
    if (!name) newErrors.name = "Tên là bắt buộc";
    if (!phone) newErrors.phone = "Số điện thoại là bắt buộc";
    if (!salary) newErrors.salary = "Lương là bắt buộc";
    if (!address) newErrors.address = "Địa chỉ là bắt buộc";
    if (!position) newErrors.position = "Chức vụ là bắt buộc";
    if (!bankAccount)
      newErrors.bankAccount = "Số tài khoản ngân hàng là bắt buộc";
    if (!dateOfBirth) newErrors.dateOfBirth = "Ngày sinh là bắt buộc";
    if (!gender) newErrors.gender = "Giới tính là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const formData = {
          email,
          password,
          username,
          phone,
          salary,
          gender,
          stk: bankAccount,
          address,
          position,
          avt: image, // Tạm thời dùng tên file tĩnh
          name,
          bithdate: dateOfBirth,
        };

        const response = await axios.post(
          "http://localhost:3000/auth/register",
          formData
        );
        const userRef = collection(db, "users");
        await addDoc(userRef, {
          username,
          name,
          gender,
          position,
          avt: image, // Lưu ảnh đại diện (có thể tải ảnh lên Firebase Storage nếu cần)
          createdAt: new Date(), // Thời gian tạo
        });
        alert("Thêm nhân viên thành công!");
        console.log(response.data);
      } catch (error) {
        console.error("Đã xảy ra lỗi khi thêm nhân viên:", error);
        alert("Thêm nhân viên thất bại. Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="bg-[#21222d] text-white p-6 rounded-xl max-w-7xl mx-auto">
      <h2 className="text-center text-2xl font-bold mb-6">Thêm Nhân Viên</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit}
      >
        {/* Email */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaEnvelope className="w-5 h-5 text-blue-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.email && <p className="text-red-500">{errors.email}</p>}

          {/* Username */}
          <div className="flex items-center space-x-2">
            <FaUser className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Tên đăng nhập"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.username && <p className="text-red-500">{errors.username}</p>}
          {/* Input cho name */}
          <div className="flex items-center space-x-2">
            <FaUser className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tên đầy đủ"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          {/* Gender */}
          <div className="flex items-center space-x-2">
            <FaVenusMars className="w-5 h-5 text-blue-400" />
            <select
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled>
                Giới tính
              </option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
              <option value="other">Khác</option>
            </select>
          </div>
          {errors.gender && <p className="text-red-500">{errors.gender}</p>}
          {/* Lương */}
          <div className="flex items-center space-x-2">
            <FaDollarSign className="w-5 h-5 text-blue-400" />
            <input
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Lương"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.salary && <p className="text-red-500">{errors.salary}</p>}
          {/* Địa chỉ */}
          <div className="flex items-center space-x-2">
            <FaHome className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Địa chỉ"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.address && <p className="text-red-500">{errors.address}</p>}
          {/* Chức vụ */}
          <div className="flex items-center space-x-2">
            <FaUserClock className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              placeholder="Chức vụ"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.position && <p className="text-red-500">{errors.position}</p>}
        </div>

        {/* Thông tin khác */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <FaUser className="w-5 h-5 text-blue-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.password && <p className="text-red-500">{errors.password}</p>}

          {/* Số tài khoản ngân hàng */}
          <div className="flex items-center space-x-2">
            <FaMoneyCheckAlt className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
              placeholder="Số tài khoản ngân hàng"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.bankAccount && (
            <p className="text-red-500">{errors.bankAccount}</p>
          )}

          {/* Ảnh đại diện */}
          <div className="flex items-center space-x-2">
            <FaCamera className="w-5 h-5 text-blue-400" />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {image && (
            <div className="mt-4">
              <img
                src={image}
                alt="Ảnh đại diện"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
          )}
        </div>
        <div className="space-y-4">
          {/* Số điện thoại */}
          <div className="flex items-center space-x-2">
            <FaPhone className="w-5 h-5 text-blue-400" />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Số điện thoại"
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}

          {/* Ngày sinh */}
          <div className="flex items-center space-x-2">
            <FaCalendarAlt className="w-5 h-5 text-blue-400" />
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="bg-[#171821] text-white w-full p-2 rounded-xl"
            />
          </div>
          {errors.dateOfBirth && (
            <p className="text-red-500">{errors.dateOfBirth}</p>
          )}
        </div>

        {/* Submit */}
        <div className="col-span-full mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-green-500 text-white w-64 p-2 rounded-xl hover:bg-green-600"
          >
            Thêm Nhân Viên
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
