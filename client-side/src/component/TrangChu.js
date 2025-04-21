import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const TrangChu = () => {
  const [foods, setFoods] = useState([]);
  const [filteredFoods, setFilteredFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("userInfo");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    fetch("https://doancuoiky-phln.onrender.com/foods")
      .then(res => res.json())
      .then(data => {
        setFoods(data);
        setFilteredFoods(data);
      })
      .catch(err => console.error("Lỗi khi fetch món ăn:", err));
  }, []);

  useEffect(() => {
    let result = foods;

    if (selectedCategory !== 'Tất cả') {
      result = result.filter(food => food.category === selectedCategory);
    }

    if (searchTerm.trim()) {
      result = result.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFoods(result);
  }, [searchTerm, selectedCategory, foods]);

  return (
    <div style={{ padding: '20px' }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        borderBottom: '1px solid #ccc',
        marginBottom: '30px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src="/avt1.png"
            alt="Logo"
            style={{ width: 120, height: 120, marginRight: 10, cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
          <h1>Chào mừng đến trang chủ</h1>
        </div>

        {user ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowLogoutPopup(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2ecc71',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              {user.username}
            </button>

            {showLogoutPopup && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                borderRadius: '5px',
                padding: '10px',
                zIndex: 999
              }}>
                <p>Bạn có chắc muốn đăng xuất?</p>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("userInfo");
                    setUser(null);
                    setShowLogoutPopup(false);
                    navigate('/');
                  }}
                  style={{
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    marginRight: '10px',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowLogoutPopup(false)}
                  style={{
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  No
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Đăng ký / Đăng nhập
          </button>
        )}
      </header>

      {/* Thanh tìm kiếm và lọc */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
        <input
          type="text"
          placeholder="Tìm món ăn theo tên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            width: '300px'
          }}
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px',
            borderRadius: '8px',
            border: '1px solid #ccc'
          }}
        >
          <option value="Tất cả">Tất cả</option>
          <option value="Cơm">Cơm</option>
          <option value="Bánh mì">Bánh mì</option>
          <option value="Món Tây">Món Tây</option>
          <option value="Món nước">Món nước</option>
          <option value="Lẩu">Lẩu</option>
          <option value="Món Việt">Món Việt</option>
          <option value="Món Nhật">Món Nhật</option>
          <option value="Mì">Mì</option>
        </select>
      </div>

      {/* Danh sách món ăn */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
      }}>
        {filteredFoods.map((food) => (
          <Link
            to={`/food/${food.id}`}
            key={food.id}
            style={{
              textDecoration: 'none',
              color: 'inherit',
              border: '1px solid #ddd',
              borderRadius: '10px',
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            <img
              src={food.image}
              alt={food.name}
              style={{ width: '100%', height: '200px', objectFit: 'cover' }}
            />
            <div style={{ padding: '10px' }}>
              <h3 style={{ margin: '10px 0', color: '#2c3e50' }}>{food.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TrangChu;
