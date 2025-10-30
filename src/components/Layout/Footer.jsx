/* eslint-disable jsx-a11y/anchor-is-valid */
import { SiGithub, SiLinkedin, SiX } from 'react-icons/si'; 

const Footer = () => {
  return (
    <footer className="w-full bg-black border-t border-spotify-light-dark/30 text-spotify-light-gray py-12 mt-20">
      <div className="max-w-7xl mx-auto px-8">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
             
              <span className="text-white text-2xl font-bold">TalentFlow</span>
            </div>
            <p className="text-sm max-w-md">
              A modern hiring platform for HR teams to manage jobs, candidates, and assessments seamlessly.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Press</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-spotify-light-dark/30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-sm">
              <p>&copy; 2025 TalentFlow. All rights reserved.</p>
              <p className="mt-1">A demo project inspired by Spotify's UI.</p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <a href="#" className="hover:text-spotify-green transition-colors">
                <SiGithub size={20} />
              </a>
              <a href="#" className="hover:text-spotify-green transition-colors">
                <SiLinkedin size={20} />
              </a>
              <a href="#" className="hover:text-spotify-green transition-colors">
                <SiX size={20} /> {/* Changed from SiTwitter to SiX */}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
