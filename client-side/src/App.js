import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TrangChu from './component/TrangChu';
import ChiTietMonAn from './component/ChiTietMonAn';
import FromLogin from './component/FromLogin';
import Admin from './component/Admin';
import Admin_Sua from './component/Admin_Sua';
import Admin_SuaCT from './component/Admin_SuaCT'
import Admin_Them from './component/Admin_Them';
import Admin_Xoa from './component/Admin_Xoa';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TrangChu />} />
        <Route path="/food/:id" element={<ChiTietMonAn />} />
        <Route path="/login" element={<FromLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/suamonan" element={<Admin_Sua />} />
        <Route path="/admin/suact/:id" element={<Admin_SuaCT />} />
        <Route path="/admin/themmonan" element={<Admin_Them />} />
        <Route path="/admin/xoamonan" element={<Admin_Xoa />} />
      </Routes>
    </Router>
  );
}

export default App;
