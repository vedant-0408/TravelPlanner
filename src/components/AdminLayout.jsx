import React, { useEffect } from 'react'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const AdminLayout = () => {
  const admin_access = useSelector((state) => state.admin.adminAccess);
  const userInfo = useSelector((state) => state.auth.userInfo); // Add this to check if user data is loaded
  const navigate = useNavigate();

  // Option 1: Using useEffect for side-effects
  useEffect(() => {
    if (!admin_access) {
      navigate("/login");
    }
  }, [admin_access, navigate]);

  // Option 2: Using Navigate component (cleaner approach)
  if (!admin_access) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className='bg-[#f5f5fe] flex'>
      <Sidebar />
      <section className='flex-1 flex flex-col'>
        <div className='h-48 bg-[#0E1428] text-white flex justify-center flex-col px-10 gap-3'>
          <h1 className="text-5xl">Dashboard</h1>
          <p>The scraping engine is powered by Puppeteer</p>
        </div>
        <Dashboard />
      </section>
    </section>
  )
}

export default AdminLayout;