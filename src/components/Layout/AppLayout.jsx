import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

const AppLayout = () => {
  const paramName = window.location.pathname.split('/')[2] || 'jobs';
  
  return (
    <div className="flex h-screen w-full bg-black">
      {/* 1. Left Sidebar */}
      <Sidebar />

      {/* 2. Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Scrollable Content with gradient background */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-spotify-dark via-[#121212] to-black">
          {/* Content container with max width */}
          <div className={`${paramName === 'jobs' ? 'px-8 py-6' : '' }`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
