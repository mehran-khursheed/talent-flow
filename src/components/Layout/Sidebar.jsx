// src/components/Layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { HiHome, HiUsers, HiDocumentText } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }) =>
    `flex items-center space-x-4 px-4 py-3 rounded-md font-semibold text-sm transition-all duration-200 ${
      isActive
        ? 'text-white bg-spotify-light-dark'
        : 'text-spotify-light-gray hover:text-white hover:bg-spotify-light-dark/50'
    }`;

  return (
    <nav className="w-52 bg-black p-6 flex-shrink-0 flex flex-col border-r border-spotify-light-dark/30">
      {/* Logo Section */}
      <div className="flex items-center space-x-2 mb-8 px-2">
     {/* add your icon */}
        <span className="text-white text-2xl font-bold">TalentFlow</span>
      </div>

      {/* Main Navigation */}
      <ul className="space-y-2 flex-1">
        <li>
          <NavLink to="/app/jobs" className={navLinkClasses}>
            <HiHome size={24} />
            <span>Jobs</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/candidates" className={navLinkClasses}>
            <HiUsers size={24} />
            <span>Candidates</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/app/assessments" className={navLinkClasses}>
            <HiDocumentText size={24} />
            <span>Assessments</span>
          </NavLink>
        </li>
      </ul>

      {/* Bottom Section - Quick Actions */}
      <div className="mt-auto pt-6 border-t border-spotify-light-dark/30">
        <button className="w-full flex items-center space-x-3 px-4 py-3 text-spotify-light-gray hover:text-white text-sm font-semibold transition-colors rounded-md hover:bg-spotify-light-dark/50">
        
          
        </button>
        
        {/* User Badge */}
        <div className="mt-4 px-4 py-3 bg-spotify-light-dark/30 rounded-lg">
          <p className="text-xs text-spotify-light-gray">Logged in as</p>
          <p className="text-sm text-white font-semibold mt-1">{user?.role || 'HR Manager'}</p>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
