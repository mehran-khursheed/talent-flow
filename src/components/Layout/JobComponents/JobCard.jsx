import  { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ArchiveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2m-2 4v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m6 4h.01" />
  </svg>
);

const UnarchiveIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-6h6v6M5 8h14M5 8V6a2 2 0 012-2h10a2 2 0 012 2v2" />
  </svg>
);


const CreateAssessmentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const UpdateAssessmentIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

export default function JobCard({ 
  job, 
  toggleArchiveStatus, 
  isToggling,
  onArchiveSuccess // Add this prop for better state management
}) {
  const navigate = useNavigate();
  
  // Assessment related state
  const [hasAssessment, setHasAssessment] = useState(false);
  const [isCheckingAssessment, setIsCheckingAssessment] = useState(true);
  const [isArchiving, setIsArchiving] = useState(false);

  const priorityColor = {
    high: "bg-red-500 text-white",
    medium: "bg-yellow-400 text-black",
    low: "bg-green-400 text-black",
  }[job.priority] || "bg-gray-500 text-white";

  // Check assessment status when component mounts
  useEffect(() => {
    const checkAssessment = async () => {
      try {
        console.log("🔄 Checking assessment for job:", job.id);
        const response = await fetch(`/api/assessments/${job.id}`);
        
        if (response.ok) {
          const assessmentData = await response.json();
          console.log(" Assessment found:", assessmentData);
          setHasAssessment(true);
        } else if (response.status === 404) {
          console.log(" No assessment found for job");
          setHasAssessment(false);
        } else {
          console.log("⚠️ Unexpected response:", response.status);
          setHasAssessment(false);
        }
      } catch (error) {
        console.log(" Error checking assessment:", error);
        setHasAssessment(false);
      } finally {
        setIsCheckingAssessment(false);
      }
    };

    checkAssessment();
  }, [job.id]);

  // Handle archive toggle with proper state management
  const handleArchiveToggle = async (e) => {
    e.stopPropagation();
    
    if (isToggling || isArchiving) return;
    
    setIsArchiving(true);
    
    try {
      await toggleArchiveStatus(job.id);
      // Optional: Call success callback if provided
      if (onArchiveSuccess) {
        onArchiveSuccess(job.id, job.status === "active" ? "archived" : "active");
      }
    } catch (error) {
      console.error("Archive toggle failed:", error);
    } finally {
      setIsArchiving(false);
    }
  };

  function handleOpenDetails() {
    navigate(`/app/jobs/${job.id}`);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleOpenDetails();
    }
  }

  const handleBuildAssessment = (e) => {
    e.stopPropagation();
    navigate(`/app/assessment/builder/${job.id}`);
  };

  // Determine if this specific job is being toggled
  const isThisJobToggling = isToggling === job.id;

  return (
    <div
      className={`
        group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95
        transition-all duration-300 shadow
        hover:scale-[1.03] hover:shadow-2xl
        px-8 py-7 mb-10 cursor-pointer
        focus-within:ring-2 focus-within:ring-spotify-green
        ${isThisJobToggling ? 'opacity-60 pointer-events-none' : ''}
      `}
      onClick={handleOpenDetails}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`View job details for ${job.title}`}
    >
      {/* Archive Button (top-right) */}
      <button
        className="
          absolute top-6 right-6 
          bg-white/5 border border-white/20
          rounded-full p-2 z-10 drop-shadow
          text-white/70
          hover:bg-spotify-green/90 hover:text-black hover:border-spotify-green
          transition-all duration-200
          focus:outline-none
          disabled:opacity-60
        "
        title={job.status === "active" ? "Archive" : "Unarchive"}
        aria-label={`${job.status === "active" ? "Archive" : "Unarchive"} Job`}
        onClick={handleArchiveToggle}
        disabled={isThisJobToggling || isArchiving}
      >
        {isThisJobToggling ? (
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
        ) : job.status === "active" ? (
          <ArchiveIcon />
        ) : (
          <UnarchiveIcon />
        )}
      </button>

      {/* Assessment Button (top-left) */}
      {!isCheckingAssessment && (
        <button
          className={`
            absolute top-6 left-6 
            rounded-full p-2 z-10 drop-shadow
            transition-all duration-200
            focus:outline-none
            disabled:opacity-60
            ${hasAssessment 
              ? 'bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30 hover:text-green-300 hover:border-green-500/60' 
              : 'bg-blue-500/20 border border-blue-500/40 text-blue-400 hover:bg-blue-500/30 hover:text-blue-300 hover:border-blue-500/60'
            }
          `}
          title={hasAssessment ? "Update Assessment" : "Create Assessment"}
          aria-label={hasAssessment ? "Update Assessment for this job" : "Create Assessment for this job"}
          onClick={handleBuildAssessment}
          disabled={isThisJobToggling}
        >
          {hasAssessment ? <UpdateAssessmentIcon /> : <CreateAssessmentIcon />}
          {/* Small badge/dot for existing assessments */}
          {hasAssessment && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full"></span>
          )}
        </button>
      )}
      
      {/* Loading spinner while checking assessment status */}
      {isCheckingAssessment && (
        <div className="absolute top-6 left-6 rounded-full p-2 bg-gray-500/20 border border-gray-500/40">
          <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {/* Title Block */}
      <div className="flex flex-col mb-4 pl-12">
        <h2 className="text-2xl font-extrabold text-white leading-tight tracking-tight truncate">
          {job.title}
          {isThisJobToggling && (
            <span className="ml-2 text-sm text-yellow-400 font-normal">
              {job.status === "active" ? "Archiving..." : "Unarchiving..."}
            </span>
          )}
        </h2>
      </div>

      {/* Metadata Row: Location and Salary */}
      <div className="flex items-center gap-5 mb-6 text-sm text-white/80">
        <span className="truncate">{job.location}</span>
        <span className="inline-block opacity-40">·</span>
        <span className="truncate">{job.salary}</span>
      </div>

      {/* Tags Block */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(job.tags ?? []).map(tag => (
          <span
            key={tag}
            className="
              px-3 py-1 rounded-full text-xs font-medium
              bg-black/25 border border-spotify-green/30
              text-spotify-green
              transition
              shadow-none
            "
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Priority Chip - Footer accent */}
      <div className="mt-auto pt-2 flex flex-row items-end">
        <span className={`
          px-4 py-1 rounded-full text-sm font-bold
          ${priorityColor}
          shadow
        `}>
          {job.priority?.charAt(0).toUpperCase() + job.priority?.slice(1) || "Unknown"}
        </span>
        {/* Status badge */}
        <span className={`
          ml-2 px-3 py-1 rounded-full text-xs font-medium
          ${job.status === "active" 
            ? "bg-green-500/20 text-green-400 border border-green-500/30" 
            : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
          }
        `}>
          {job.status === "active" ? "Active" : "Archived"}
        </span>
      </div>
    </div>
  );
}