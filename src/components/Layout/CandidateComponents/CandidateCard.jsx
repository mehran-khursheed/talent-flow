import React from "react";

const CandidateCard = ({ name, email, appliedAt, jobId, onClick }) => {
  
  
  const hasPrimaryContent = !!name || !!email;

  return (
    <div
      onClick={onClick}
      className={`
        group relative flex flex-col rounded-2xl border border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95
        transition-all duration-300 shadow
        hover:scale-[1.03] hover:shadow-2xl
        p-6 cursor-pointer min-h-[180px]
        focus-within:ring-2 focus-within:ring-spotify-green
      `}
      tabIndex={0}
      role="button"
      aria-label={`View candidate details for ${name || "candidate"}`}
    >
      {/* Main Content Container */}
      <div className="flex flex-col h-full">
        
        {/* Title and Main Info */}
        <div className="flex-1 mb-4">
          {/* Name/Title */}
          <div className="flex items-start justify-between mb-3">
            <h2 className="text-xl font-extrabold text-white leading-tight tracking-tight flex-1 min-w-0 pr-2">
              {hasPrimaryContent ? (name || "No Name Provided") : (jobId ? "Candidate Data Missing" : "New Candidate")}
            </h2>
          </div>

          {/* Email */}
          <div className="flex items-center mb-2">
            <span className="text-sm text-white/80 truncate flex-1 min-w-0">
              {email || "Email not provided"}
            </span>
          </div>

          {/* Applied Date */}
          {appliedAt && (
            <div className="flex items-center text-xs text-white/60">
              Applied: {new Date(appliedAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Footer with Status */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className={`
            px-3 py-1.5 rounded-full text-sm font-semibold
            bg-black/25 border border-spotify-green/30 text-spotify-green
            shadow flex-shrink-0
          `}>
            {jobId ? "Applied" : "New"}
          </span>
          
          {/* Optional: Add more footer elements if needed */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Add additional buttons or icons here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;