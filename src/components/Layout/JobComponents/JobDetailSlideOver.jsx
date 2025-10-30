import { useParams,  useOutletContext } from "react-router-dom";
import { useState } from "react";
import JobEditForm from "./JobEditForm";
import LoadingSpinner from "../LoadingSpinner";
import toast from "react-hot-toast";

export default function JobDetailSlideOver() {
  const { jobs, refetch,loading } = useOutletContext(); 
  const { jobId } = useParams();

    
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  if (loading) return <LoadingSpinner fullScreen={true} size="md" />;
  
  const job = jobs.find(j => j.id.toString() === jobId);
  const open = !!job;


  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
    setError(null);
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    setError(null);
    try {
      const response = await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update job: ${response.statusText}`);
      }
      await refetch();
      toast.success(`Job "${formData.title || job.title}" updated successfully!`);
      setIsEditMode(false);
    } catch (err) {
      const errorMessage = err.message || 'An unknown error occurred during update.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Error updating job:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditMode(false);
    setError(null);
  };

  if (!open) return null;

  // Premium Priority chip
  const priorityColor = {
    high: "bg-red-500/20 text-red-300 border border-red-500/50",
    medium: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/50",
    low: "bg-green-500/20 text-green-300 border border-green-500/50",
  }[job.priority] || "bg-gray-500/20 text-gray-300 border border-gray-500/50";

  const DetailItem = ({ title, value }) => (
    <div className="flex flex-col space-y-1 py-1">
      <dt className="text-xs font-medium uppercase tracking-wider text-spotify-light-gray/60">{title}</dt>
      <dd className="text-base font-semibold text-white truncate">{value || "-"}</dd>
    </div>
  );

  function formatDate(dateString) {
    if (!dateString) return "-";
    const d = new Date(dateString);
    return isNaN(d)
      ? "-"
      : d.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
  }

  return (
    // <SlideOver open={true} onClose={handleClose}>
      <div
        className="relative bg-[#1A1A1A] shadow-2xl w-full max-w-2xl h-full p-10 
          overflow-y-auto text-white flex flex-col mx-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Overlay spinner for save */}
        {isSaving && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 rounded-2xl">
            <LoadingSpinner fullScreen={false} size="md" />
          </div>
        )}

        {/* Header with Edit Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <h2 className="text-3xl font-extrabold tracking-tight">
              {isEditMode ? "Edit Job" : "Job Details"}
            </h2>
          </div>
          {!isEditMode && (
            <button
              onClick={handleEditToggle}
              className="flex items-center space-x-2 px-4 py-2 bg-spotify-green text-black rounded-full hover:bg-spotify-green/90 transition font-medium text-sm shadow-md"
              aria-label="Edit job details"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-800/20 border border-red-600/50 rounded-lg text-red-300 text-sm">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="break-all font-medium">{error}</span>
            </div>
          </div>
        )}

        {/* Content - Switch between Display and Edit modes */}
        {isEditMode ? (
          <JobEditForm
            job={job}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            isSaving={isSaving}
          />
        ) : (
          <>
            {/* Title and Priority Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-spotify-light-gray/10 pb-4">
              <h3 className="text-4xl font-extrabold text-white leading-tight pr-4">
                {job.title}
              </h3>
              <span className={`flex-shrink-0 px-3 py-1 text-xs rounded-full font-bold uppercase tracking-wider ${priorityColor}`}>
                {job.priority?.charAt(0).toUpperCase() + job.priority?.slice(1) || "Unknown"}
              </span>
            </div>
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {(job.tags || []).map(tag => (
                <span
                  key={tag}
                  className="bg-spotify-light-dark text-spotify-green border border-spotify-green/50 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
            {/* Details Section */}
            <div className="border-b border-spotify-light-gray/10 mb-8 pb-8">
              <h4 className="text-xl font-semibold mb-4 text-spotify-green">Key Details</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-4 gap-x-6">
                <DetailItem title="ID" value={job.id} />
                <DetailItem title="Status" value={job.status} />
                <DetailItem title="Department" value={job.department} />
                <DetailItem title="Employment" value={job.employmentType} />
                <DetailItem title="Experience" value={job.experience} />
                <DetailItem title="Openings" value={job.openings} />
                <DetailItem title="Location" value={job.location} />
                <DetailItem title="Salary" value={job.salary} />
                <DetailItem title="Fill By" value={formatDate(job.fillBy)} />
                <DetailItem title="Created At" value={formatDate(job.createdAt)} />
              </div>
            </div>
            {/* Job Description */}
            {job.description && (
              <div className="flex-grow">
                <h4 className="text-xl font-semibold mb-4 text-spotify-green">Description</h4>
                <div className="text-spotify-light-gray leading-relaxed whitespace-pre-line text-base">
                  {job.description}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    // </SlideOver>
  );
}
