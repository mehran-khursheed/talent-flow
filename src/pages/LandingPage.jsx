import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HiCheckCircle } from 'react-icons/hi';
import LoadingSpinner from '../components/Layout/LoadingSpinner';

const LandingPage = () => {
  const { login, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="w-full scrollbar-spotify scrollbar-spotify-dark">
      {/* Hero Banner Section */}
      <div className=" scrollbar-spotify scrollbar-spotify-darkw-full bg-gradient-to-b from-spotify-light-dark to-spotify-dark h-[60vh] md:h-[80vh] flex items-center justify-center text-center p-8  scrollbar-spotify-dark">
        <div>
          <h1 className="text-5xl md:text-8xl font-extrabold text-white mb-6">
            Hire better, faster.
          </h1>
          <h2 className="text-xl md:text-3xl text-spotify-light-gray font-semibold mb-10">
            Welcome to <span className="text-spotify-green">TalentFlow</span>.
          </h2>
          <button 
            onClick={login}
            className="bg-spotify-green text-white font-bold py-4 px-10 rounded-full text-lg hover:scale-105 transition-transform shadow-lg shadow-spotify-green/30"
          >
            Get Started
          </button>
          
          
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-8 py-20 scrollbar-spotify scrollbar-spotify-dark">
        <h3 className="text-4xl font-bold text-center mb-16">
          Everything you need to manage hiring
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<HiCheckCircle size={48} className="text-spotify-green" />}
            title="Manage Jobs"
            description="Create, edit, and organize job postings with drag-and-drop simplicity."
          />
          <FeatureCard
            icon={<HiCheckCircle size={48} className="text-spotify-green" />}
            title="Track Candidates"
            description="Visualize candidate pipelines and move them through hiring stages seamlessly."
          />
          <FeatureCard
            icon={<HiCheckCircle size={48} className="text-spotify-green" />}
            title="Build Assessments"
            description="Create custom assessments with conditional logic and validation rules."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-spotify-light-dark p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex justify-center mb-4">{icon}</div>
    <h4 className="text-2xl font-bold mb-3 text-center">{title}</h4>
    <p className="text-spotify-light-gray text-center">{description}</p>
  </div>
);

export default LandingPage;
