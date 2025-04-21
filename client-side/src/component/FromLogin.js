import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css'

const FromLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: '', password: '' });
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? 'http://localhost:5000/login' : 'http://localhost:5000/register';

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Đã xảy ra lỗi");
        return;
      }

      alert(data.message);

      if (isLogin && data.token) {
        localStorage.setItem("token", data.token);
      
        const profileRes = await fetch("http://localhost:5000/profile", {
          headers: {
            "Authorization": `Bearer ${data.token}`
          }
        });
      
        const profileData = await profileRes.json();
        const user = profileData.user;
        setUserInfo(user);
        localStorage.setItem("userInfo", JSON.stringify(user));
      
        if (data.isAdmin) {
          navigate('/admin');
        } else {
          navigate('/');
        }
        
      }
      
      

    } catch (err) {
      console.error("Lỗi:", err);
      alert("Đã có lỗi xảy ra!");
    }
  };

  return (
    <div className="login-container">
      <h2>{isLogin ? 'Đăng nhập' : 'Đăng ký'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Tên đăng nhập"
          value={form.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />
        <button type="submit">{isLogin ? 'Đăng nhập' : 'Đăng ký'}</button>
      </form>

      <p>
        {isLogin ? 'Chưa có tài khoản?' : 'Đã có tài khoản?'}{' '}
        <button type="button" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Đăng ký' : 'Đăng nhập'}
        </button>
      </p>

      {userInfo && (
        <div className="user-info">
          <h3>Chào, {userInfo.username}</h3>
          <p>ID: {userInfo.userId}</p>
        </div>
      )}
    </div>
  );
};

export default FromLogin;
