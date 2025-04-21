import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SuaMonAn = () => {
  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const navigate = useNavigate();

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

  useEffect(() => {
    fetch("http://localhost:5000/foods")
      .then(res => res.json())
      .then(data => setFoods(data))
      .catch(err => console.error("Lỗi khi fetch món ăn:", err));
  }, []);

  const handleEditClick = (food) => {
    // Chuyển toàn bộ thông tin món ăn khi điều hướng sang trang SuaCT
    navigate(`/admin/suact/${food._id}`, { state: { food } });
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedFood(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!selectedFood) return;

    const updatedData = {
      name: selectedFood.name,
      image: selectedFood.image,
      description: selectedFood.description,
      category: selectedFood.category,
      price: Number(selectedFood.price),
    };

    try {
      const response = await fetch(`http://localhost:5000/foods/${selectedFood._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Lỗi cập nhật: ${errorData}`);
      }

      const result = await response.json();
      alert("Cập nhật món ăn thành công!");
      setFoods(foods.map(food => (food._id === selectedFood._id ? result : food)));
      setSelectedFood(null);
    } catch (err) {
      console.error("Lỗi cập nhật:", err.message);
      alert("Đã xảy ra lỗi khi cập nhật món ăn.");
    }
  };

  const filteredFoods = foods.filter(food =>
    food.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '20px' }}>
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
        <h1>Sửa/Cập nhật món ăn</h1>
      </header>
      

      <input
        type="text"
        placeholder="Tìm món ăn..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
      />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        {filteredFoods.map((food) => (
          <div
            key={food._id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <img
              src={food.image}
              alt={food.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '10px' }}>
              <h3>{food.name}</h3>
              <p><strong>ID:</strong> {food.id}</p>
              <p><strong>Danh mục:</strong> {food.category} ({getCategoryCode(food.category)})</p>
              <p><strong>Giá:</strong> {food.price}đ</p>
              <button
                onClick={() => handleEditClick(food)}
                style={{ padding: '6px 10px', background: '#2980b9', color: 'white', border: 'none', borderRadius: '5px' }}
              >
                Sửa/Cập nhật
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedFood && (
        <div style={{ marginTop: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '10px' }}>
          <h3>Chỉnh sửa món: {selectedFood.name}</h3>
          <p><strong>ID:</strong> {selectedFood.id}</p>

          <label><strong>Tên món:</strong></label>
          <input
            type="text"
            name="name"
            value={selectedFood.name}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <label><strong>URL ảnh:</strong></label>
          <input
            type="text"
            name="image"
            value={selectedFood.image}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <label><strong>Mô tả:</strong></label>
          <textarea
            name="description"
            value={selectedFood.description || ""}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <label><strong>Danh mục:</strong></label>
          <select
            name="category"
            value={selectedFood.category}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categoryOptions.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <label><strong>Giá:</strong></label>
          <input
            type="number"
            name="price"
            value={selectedFood.price}
            onChange={handleChange}
            style={{ width: '100%', marginBottom: '10px' }}
          />

          <button
            onClick={handleUpdate}
            style={{ padding: '10px', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px' }}
          >
            Cập nhật món ăn
          </button>
        </div>
      )}
    </div>
  );
};

export default SuaMonAn;
