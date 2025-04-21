import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const FoodManager = () => {
  const [foods, setFoods] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await fetch("http://localhost:5000/foods");
      const data = await res.json();
      setFoods(data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách món:", err);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Bạn có chắc muốn xoá món ăn này?");
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/foods/delete/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Đã xoá thành công!");
        setFoods((prev) => prev.filter((food) => food._id !== id));
      } else {
        const error = await res.json();
        alert("Lỗi xoá: " + error.message);
      }
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
    }
  };

  const groupedFoods = foods.reduce((acc, food) => {
    const cat = food.category || "Khác";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(food);
    return acc;
  }, {});

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "10px" }}>
      {/* Nút quay lại */}
      <button
        onClick={() => navigate("/admin")}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          backgroundColor: "#6c757d",
          color: "#fff",
          border: "none",
          padding: "8px 16px",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        ← Quay lại
      </button>

      <h2 style={{ textAlign: "center", marginTop: "60px" }}>Quản lý Món Ăn</h2>

      {Object.keys(groupedFoods).map((category) => (
        <div key={category} style={styles.categoryBlock}>
          <h3 style={styles.categoryTitle}>{category}</h3>

          {groupedFoods[category].map((food) => (
            <div key={food._id} style={styles.foodItem}>
              <div style={{ flex: 1 }}>
                <strong>{food.name}</strong>
                <p style={{ margin: "4px 0" }}>{food.description}</p>
                <p style={{ fontSize: "14px", color: "#555" }}>{food.price} VNĐ</p>
              </div>
              <img
                src={getImageUrl(food.image)}
                alt={food.name}
                style={styles.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/100?text=No+Image";
                }}
              />
              <button onClick={() => handleDelete(food._id)} style={styles.deleteBtn}>
                Xoá
              </button>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

//  Tự động xử lý ảnh: nếu ảnh đã có đường dẫn đầy đủ thì giữ nguyên
const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/100?text=No+Image";
  if (image.startsWith("http")) return image;
  return `http://localhost:5000/uploads/${image}`;
};

const styles = {
  categoryBlock: {
    marginBottom: "30px",
    paddingBottom: "20px",
    borderBottom: "1px solid #ddd",
  },
  categoryTitle: {
    marginBottom: "10px",
    borderLeft: "4px solid #007bff",
    paddingLeft: "10px",
    fontSize: "20px",
    color: "#007bff",
  },
  foodItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #eee",
    borderRadius: "8px",
    backgroundColor: "#fafafa",
  },
  image: {
    width: "80px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  deleteBtn: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default FoodManager;
