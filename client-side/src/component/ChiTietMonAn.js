import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ChiTietMonAn = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const navigate = useNavigate(); // Khởi tạo useNavigate

  useEffect(() => {
    fetch(`https://doancuoiky-phln.onrender.com/foods/${id}`)
      .then(res => res.json())
      .then(data => setFood(data))
      .catch(err => console.error("Lỗi khi fetch chi tiết món ăn:", err));
  }, [id]);

  if (!food) return <div>Đang tải...</div>;

  return (
    <div>
        <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        marginBottom: '20px',
        cursor: 'pointer'
        
      }}>
        <img
          src="/avt1.png"
          alt="Logo"
          style={{ width: 120, height: 120, marginRight: 10 }}
          onClick={() => navigate('/')}
          
        />
        <h1>Chi tiết món ăn </h1>
      </header>
      <h1>{food.name}</h1>
      <img src={food.image} alt={food.name} width="300" />
      <p><strong>Mô tả:</strong> {food.description}</p>
      <p><strong>Giá:</strong> {food.price.toLocaleString()} VND</p>
    </div>
  );
};

export default ChiTietMonAn;
