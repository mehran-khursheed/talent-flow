import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AssessmentCard from "../../components/Layout/AssessmentComponents/AssessmentCard";
import Toast from "../../components/Layout/Toast";


export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customToast, setCustomToast] = useState(null);

  const fetchAssessments = async () => {
  try {
    setLoading(true);
    const response = await fetch("/api/assessments");
    console.log("assessment resposne",response)
    
    if (!response.ok) {
      throw new Error("Failed to fetch assessments");
    }
    
    const data = await response.json();
    console.log("API Response:", data); // Debug log
    
    // FIX: Extract assessments from the response object
    const assessmentsData = data.assessments || [];
    setAssessments(Array.isArray(assessmentsData) ? assessmentsData : []);
  } catch (err) {
    console.error("Error fetching assessments:", err);
    setError(err.message);
    toast.error("Failed to load assessments");
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchAssessments();
  }, []);


const handleSendAssessment = async (assessment, candidateEmail) => {
    // Create a mock assessment link
    const mockAssessmentLink = `${window.location.origin}/assessment/${assessment.jobId}?token=mock_token_${Date.now()}`;
    const mockSubmissionCode = Math.random().toString(36).substr(2, 8).toUpperCase();
    
    // Copy the link to clipboard
    try {
      await navigator.clipboard.writeText(mockAssessmentLink);
    } catch (err) {
      console.log('Clipboard copy failed:', err);
    }
    
    // Show styled toast - use the renamed state
    setCustomToast({
      type: 'success',
      message: (
        <div className="space-y-2">
          <div className="font-semibold">Assessment Sent Successfully!</div>
          <div className="text-sm opacity-90">
            <div>📧 Sent to: <span className="text-white">{candidateEmail}</span></div>
            <div>🔗 Link copied to clipboard</div>
            <div>🔒 Code: <span className="font-mono text-white">{mockSubmissionCode}</span></div>
          </div>
        </div>
      )
    });

    // Log for debugging
    console.log('Mock assessment sent:', {
      candidateEmail,
      assessmentLink: mockAssessmentLink,
      submissionCode: mockSubmissionCode,
      assessment: assessment.title
    });
  };

  const handleViewAssessment = (assessment) => {
    // You can implement a view modal or detail page here
    console.log("View assessment:", assessment);
    toast.success(`Viewing assessment: ${assessment.title}`);
  };

  const handleDeleteAssessment = async (assessment) => {
  if (!window.confirm(`Are you sure you want to delete "${assessment.title}"?`)) {
    return;
  }

  try {
    // Use assessment.id (UUID) instead of jobId
    const response = await fetch(`/api/assessments/${assessment.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete assessment");
    }

    toast.success("Assessment deleted successfully");
    fetchAssessments(); // Refresh the list
  } catch (err) {
    console.error("Error deleting assessment:", err);
    toast.error("Failed to delete assessment");
  }
};

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto my-12 px-4">
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-spotify-green"></div>
          <p className="mt-4 text-gray-400">Loading your assessments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto my-12 px-4">
        <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
          <div className="text-red-400 text-lg mb-4">Error loading assessments</div>
          <button
            onClick={fetchAssessments}
            className="px-4 py-2 bg-spotify-green text-black rounded-full hover:bg-spotify-green/90 transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (

    <div className="max-w-6xl mx-auto my-12 px-4 ">
    {/* Render your custom Toast */}
      {customToast && (
        <Toast
          message={customToast.message}
          type={customToast.type}
          onClose={() => setCustomToast(null)}
        />
      )}

      {/* Header */}
     

      {/* Assessments Grid */}
      {assessments.length === 0 ? (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-white border-2 border-dashed border-white/20 rounded-2xl bg-white/5">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">No assessments created</h3>
            <p className="text-white/60">Your created assessments will appear here</p>
          </div>
        </div>
      ) : (
        <div className="  grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <AssessmentCard
              key={assessment.id}
              assessment={assessment}
              onView={handleViewAssessment}
              onDelete={handleDeleteAssessment}
              onSend={handleSendAssessment}
            />
          ))}
        </div>
      )}
    </div>
  );
}