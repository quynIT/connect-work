import React, { useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { app } from "../firebase/config"; // Import Firebase app đã khởi tạo

const TestDB: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImage(e.target.files[0]); // Lưu ảnh được chọn vào state
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || !image) {
      setMessage("Vui lòng nhập đầy đủ thông tin và chọn ảnh.");
      return;
    }

    setLoading(true);
    const storage = getStorage(app); // Khởi tạo Firebase Storage
    const storageRef = ref(storage, `images/${image.name}`); // Tạo reference tới đường dẫn ảnh trong storage

    try {
      // Upload ảnh lên Firebase Storage
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef); // Lấy URL của ảnh đã upload

      // Lưu dữ liệu vào Firestore
      const db = getFirestore(app);
      await addDoc(collection(db, "items"), {
        name,
        description,
        imageUrl: downloadURL, // Lưu URL ảnh vào Firestore
      });

      setMessage("Dữ liệu đã được lưu thành công!");
      setName("");
      setDescription("");
      setImage(null); // Reset form
    } catch (error) {
      console.error("Lỗi khi upload ảnh hoặc lưu dữ liệu:", error);
      setMessage("Lỗi khi upload ảnh hoặc lưu dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Thêm dữ liệu với ảnh</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Tên:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Mô tả:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Chọn ảnh:</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Đang tải..." : "Lưu dữ liệu"}
        </button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
};

export default TestDB;
