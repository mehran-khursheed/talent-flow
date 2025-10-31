
import { createHashRouter, Navigate } from 'react-router-dom';


// Layouts
import PublicLayout from '../components/Layout/PublicLayout';
import ProtectedRoute from './ProtectedRoute';

// Public Page
import LandingPage from '../pages/LandingPage';

// App (Protected) Pages
import JobsPage from '../pages/JobsPage';
import CandidatesPage from '../pages/CandidatesPage';
import AssessmentsPage from '../pages/assessments/AssessmentsPage';
import JobDetailSlideOver from '../components/Layout/JobComponents/JobDetailSlideOver';
import AssessmentBuilderSection from '../pages/assessments/AssessmentBuilderPage';

// Mock pages for public links (optional)
const ResourcesPage = () => <div className="p-8"><h1>Resources Page</h1></div>;
const ContactPage = () => <div className="p-8"><h1>Contact Page</h1></div>;
const SupportPage = () => <div className="p-8"><h1>Support Page</h1></div>;

export const router = createHashRouter([
  // --- PUBLIC ROUTES (Logged Out) ---
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: 'resources', element: <ResourcesPage /> },
      { path: 'contact', element: <ContactPage /> },
      { path: 'support', element: <SupportPage /> },

    ],
  },
  
  // --- APP ROUTES (Logged In) ---
  {
    path: '/app',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/app/jobs" replace /> },
      
      { 
  path: 'jobs', 
  element: <JobsPage />,
  children: [
    { path: ':jobId', element: <JobDetailSlideOver /> },
    { path: 'new', element: <JobDetailSlideOver /> } // ✅ This should be inside jobs children
  ] 
},
      
     
      { path: 'candidates', element: <CandidatesPage /> },
      { path: 'assessments', element: <AssessmentsPage /> },
      { path: 'assessment/builder/:jobId', element: <AssessmentBuilderSection /> },
    ],
  },
  
  { path: '*', element: <Navigate to="/" replace /> }
]);