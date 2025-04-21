import React from 'react';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px 20px',
          borderBottom: '1px solid #ccc',
          marginBottom: '20px',
        }}
      >
        <div
          onClick={() => navigate('/')}
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          title="Quay về trang chủ"
        >
          <img
            src="/avt1.png"
            alt="Logo"
            style={{ width: 120, height: 120, marginRight: 10 }}
          />
          <h1 style={{ margin: 0 }}>Trang quản trị</h1>
        </div>
      </header>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
        }}
      >
        <button onClick={() => navigate('/admin/xoamonan')} style={buttonStyle}>
          Xóa món ăn
        </button>

        <button onClick={() => navigate('/admin/suamonan')} style={buttonStyle}>
          Sửa/Cập nhật món ăn
        </button>

        <button onClick={() => navigate('/admin/themmonan')} style={buttonStyle}>
          Thêm món ăn
        </button>
      </div>
    </div>
  );
};

const buttonStyle = {
  padding: '15px 30px',
  backgroundColor: '#2ecc71',
  color: 'white',
  fontSize: '16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
};

export default Admin;
