import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const AddFoodForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
  });
  const [generatedId, setGeneratedId] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/admin"); // 👈 
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    } else {
      setImagePreview(null);
    }
  };

  const handleCategoryChange = async (e) => {
    const category = e.target.value;
    setFormData({ ...formData, category });

    if (!category) {
      setGeneratedId("");
      return;
    }

    try {
      const response = await fetch(`https://doancuoiky-phln.onrender.com/next-id/${category}`);
      const data = await response.json();
      if (response.ok) {
        setGeneratedId(data.nextId);
      } else {
        console.error("Lỗi khi lấy ID:", data.message);
        setGeneratedId("");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API lấy ID:", error);
      setGeneratedId("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("price", formData.price);
    if (imageFile) data.append("image", imageFile);

    const response = await fetch("http://localhost:5000/foods/add", {
      method: "POST",
      body: data,
    });

    const result = await response.json();
    if (response.ok) {
      alert("Thêm món ăn thành công!");
      setFormData({ name: "", description: "", category: "", price: "" });
      setImageFile(null);
      setImagePreview(null);
      setGeneratedId("");
    } else {
      alert("Có lỗi xảy ra!");
      console.error(result);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Nút quay lại */}
      <button onClick={handleBack} style={styles.backButton}>← Quay lại Admin</button>

      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.heading}>Thêm món ăn mới</h2>

        <div style={styles.input}>
          <label>ID Món:</label>
          <input
            value={generatedId}
            readOnly
            style={{ ...styles.input, backgroundColor: "#e9ecef" }}
          />
        </div>

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Tên món"
          required
          style={styles.input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          style={styles.input}
        />

        {/* Xem trước ảnh */}
        {imagePreview && (
          <div style={{ textAlign: "center", marginBottom: "10px" }}>
            <img
              src={imagePreview}
              alt="Xem trước"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        )}

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Mô tả"
          required
          style={styles.textarea}
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleCategoryChange}
          required
          style={styles.input}
        >
          <option value="">Chọn loại món</option>
          <option value="Cơm">Cơm</option>
          <option value="Bánh mì">Bánh mì</option>
          <option value="Món Tây">Món Tây</option>
          <option value="Món nước">Món nước</option>
          <option value="Lẩu">Lẩu</option>
          <option value="Món Việt">Món Việt</option>
          <option value="Món Nhật">Món Nhật</option>
          <option value="Mì">Mì</option>
        </select>

        <input
          name="price"
          type="number"
          step="1000"
          min="0"
          value={formData.price}
          onChange={handleChange}
          placeholder="Giá (vnđ)"
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Thêm món</button>
      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    position: "relative",
    padding: "40px 20px",
  },
  backButton: {
    backgroundColor: "#e0e0e0",
    border: "none",
    padding: "8px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
    position: "absolute",
    top: "10px",
    left: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  form: {
    maxWidth: "400px",
    margin: "60px auto 0", // thêm top margin để tránh nút
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "12px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    height: "80px",
    margin: "10px 0",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default AddFoodForm;
