import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import '../index.css'

const categoryOptions = [
  "Cơm", "Bánh mì", "Món Tây",
  "Món nước", "Lẩu", "Món Việt",
  "Món Nhật", "Mì"
];

const getCategoryCode = (category) => {
  if (['Cơm', 'Bánh mì', 'Món Tây'].includes(category)) return 'RICE';
  if (['Món nước', 'Lẩu', 'Món Việt'].includes(category)) return 'DRIN';
  if (['Món Nhật', 'Mì'].includes(category)) return 'NOOD';
  return 'UNKN';
};

const SuaCT = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [food, setFood] = useState(location.state?.food || null);
  const [loading, setLoading] = useState(true);
  const [showConfirmPopup, setShowConfirmPopup] = useState(false); // Thêm trạng thái cho pop-up
  const [isUpdating, setIsUpdating] = useState(false); // Trạng thái để ngăn click nhiều lần

  useEffect(() => {
    if (!food) {
      fetch(`https://doancuoiky-phln.onrender.com/foods/${id}`)
        .then(res => res.json())
        .then(data => {
          setFood(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Lỗi khi lấy dữ liệu món ăn:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [food, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFood(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!food || isUpdating) return;

    const updatedData = {
      name: food.name,
      image: food.image,
      description: food.description,
      category: food.category,
      price: Number(food.price),
    };

    try {
      setIsUpdating(true); // Đặt trạng thái để ngăn chặn nhấn liên tiếp
      const res = await fetch(`http://localhost:5000/foods/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!res.ok) {
        const error = await res.text();
        throw new Error(error);
      }

      alert('Cập nhật thành công!');
      navigate('/admin/suamonan');
    } catch (err) {
      console.error("Lỗi cập nhật:", err.message);
      alert("Có lỗi xảy ra khi cập nhật.");
    } finally {
      setIsUpdating(false); // Kết thúc quá trình cập nhật
    }
  };

  const handleConfirmUpdate = () => {
    setShowConfirmPopup(true); // Hiển thị pop-up xác nhận
  };

  const handleClosePopup = (confirm) => {
    if (confirm) {
      handleUpdate(); // Nếu nhấn Yes, thực hiện cập nhật
    }
    setShowConfirmPopup(false); // Đóng pop-up
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!food) return <p>Không tìm thấy món ăn.</p>;

  return (
    <div className="container">
      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
        cursor: 'pointer'
      }}>
        <img
          src="/avt1.png" // Giả sử bạn lưu ảnh logo là logo.png trong public/
          alt="Logo"
          style={{ width: 120, height: 120, marginRight: 10 }}
          onClick={() => navigate('/')} // Khi click vào logo sẽ chuyển về trang chủ
        />
        <h2 className="title">Chi Tiết Món Ăn Cần Sửa/Cập nhật</h2>
      </header>

      <div className="info">
        <p><strong>ID:</strong> {food.id || 'ID tự đặt'}</p>
        <p><strong>Danh mục hiện tại:</strong> {food.category} ({getCategoryCode(food.category)})</p>
      </div>

      <div className="form-group">
        <label><strong>Tên món:</strong></label>
        <input type="text" name="name" value={food.name || ''} onChange={handleChange} className="input-field" />
      </div>

      <div className="form-group">
        <label><strong>URL ảnh:</strong></label>
        <input
          type="text"
          name="image"
          value={food.image || ''}
          onChange={handleChange}
          className="input-field"
        />
        {food.image && (
          <img
            src={food.image}
            alt="Ảnh món ăn"
            style={{
              marginTop: '10px',
              maxWidth: '300px',
              height: 'auto',
              borderRadius: '10px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}
          />
        )}
      </div>

      <div className="form-group">
        <label><strong>Mô tả:</strong></label>
        <textarea name="description" value={food.description || ''} onChange={handleChange} className="textarea-field" />
      </div>

      <div className="form-group">
        <label><strong>Danh mục:</strong></label>
        <select name="category" value={food.category || ''} onChange={handleChange} className="input-field">
          <option value="">-- Chọn danh mục --</option>
          {categoryOptions.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label><strong>Giá:</strong></label>
        <input type="number" name="price" value={food.price || 0} onChange={handleChange} className="input-field" />
      </div>

      <button
        onClick={handleConfirmUpdate}
        className="submit-btn"
      >
        Cập nhật
      </button>

      {/* Pop-up xác nhận */}
      {showConfirmPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <p>Bạn có chắc chắn muốn cập nhật món ăn này?</p>
            <button onClick={() => handleClosePopup(true)} className="popup-btn">Yes</button>
            <button onClick={() => handleClosePopup(false)} className="popup-btn">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuaCT;
