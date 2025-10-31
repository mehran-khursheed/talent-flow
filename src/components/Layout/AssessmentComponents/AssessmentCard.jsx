
import React, { useState } from "react";

const AssessmentCard = ({ assessment, onView, onDelete, onSend }) => {
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");

  const totalQuestions = assessment.sections?.reduce((total, section) => {
    return total + (section.questions?.length || 0);
  }, 0) || 0;

  const displayDescription = assessment.description || 
    assessment.sections?.[0]?.description || 
    "No description provided";

  const handleSendAssessment = () => {
    if (candidateEmail.trim()) {
      onSend(assessment, candidateEmail.trim());
      setCandidateEmail("");
      setShowSendDialog(false);
    }
  };

  return (
    <>
      <div
        className={`
          group relative flex flex-col rounded-2xl  border border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95
          transition-all duration-300 shadow
          hover:scale-[1.03] hover:shadow-2xl
          px-6 py-5 mb-6 cursor-pointer
          focus-within:ring-2 focus-within:ring-green-500
        `}
        tabIndex={0}
        role="button"
        aria-label={`View assessment for ${assessment.title}`}
        onClick={() => onView(assessment)}
      >
        {/* Action Buttons (top-right) */}
        <div className="absolute top-4 right-4 flex gap-2 z-10">
          {/* Send Button */}
          <button
            className="
              bg-white/5 border border-white/20
              rounded-full p-2 drop-shadow
              text-white/70
              hover:bg-green-500/90 hover:text-white hover:border-green-500
              transition-all duration-200
              focus:outline-none
            "
            title="Send to Candidate"
            aria-label="Send to Candidate"
            onClick={(e) => {
              e.stopPropagation();
              setShowSendDialog(true);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>

          {/* Delete Button */}
          <button
            className="
              bg-white/5 border border-white/20
              rounded-full p-2 drop-shadow
              text-white/70
              hover:bg-red-500/90 hover:text-white hover:border-red-500
              transition-all duration-200
              focus:outline-none
            "
            title="Delete Assessment"
            aria-label="Delete Assessment"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(assessment);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Title Block */}
        <div className="flex flex-col mb-3 pr-20">
          <h2 className="text-xl font-extrabold text-white leading-tight tracking-tight truncate">
            {assessment.title}
          </h2>
        </div>

        {/* Metadata Row */}
        <div className="flex items-center gap-4 mb-4 text-sm text-white/80 flex-wrap">
          <span className="truncate">Job ID: {assessment.jobId}</span>
          <span className="inline-block opacity-40">·</span>
          <span className="truncate">
            {assessment.sections?.length || 0} Sections
          </span>
          <span className="inline-block opacity-40">·</span>
          <span className="truncate">
            {totalQuestions} Questions
          </span>
          {assessment.timeLimit && (
            <>
              <span className="inline-block opacity-40">·</span>
              <span className="truncate">
                ⏱️ {assessment.timeLimit}min
              </span>
            </>
          )}
        </div>

        {/* Description */}
        {displayDescription && (
          <div className="mb-4">
            <p className="text-white/70 text-sm leading-relaxed line-clamp-2">
              {displayDescription}
            </p>
          </div>
        )}

        {/* Sections Preview */}
        {assessment.sections && assessment.sections.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {assessment.sections.slice(0, 3).map((section, index) => (
              <span
                key={section.id}
                className="
                  px-2 py-1 rounded-full text-xs font-medium
                  bg-black/25 border border-green-500/30
                  text-spotify-green
                  transition
                  shadow-none
                "
                title={`${section.questions?.length || 0} questions`}
              >
                {section.title}
              </span>
            ))}
            {assessment.sections.length > 3 && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-black/25 border border-white/20 text-white/60">
                +{assessment.sections.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-2 flex flex-row justify-between items-center">
          <span className={`
            px-3 py-1 rounded-full text-xs font-bold
            bg-black/25 border border-green-500/30 text-spotify-green
            shadow
          `}>
            {assessment.passingScore ? `${assessment.passingScore}% to pass` : "Active"}
          </span>
          
          <div className="flex items-center gap-2 text-xs text-white/50">
            {assessment.createdAt && (
              <span>
                Created: {new Date(assessment.createdAt).toLocaleDateString()}
              </span>
            )}
            {assessment.updatedAt && assessment.updatedAt !== assessment.createdAt && (
              <span title={`Updated: ${new Date(assessment.updatedAt).toLocaleDateString()}`}>
                ↻
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Send Assessment Dialog */}
      {showSendDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-[#131b20] to-[#191c1f] rounded-2xl border border-white/10 p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Send Assessment</h3>
            <p className="text-white/70 mb-4">
              Send this assessment to a candidate. They'll receive a unique link to complete it.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm mb-2">
                  Candidate Email
                </label>
                <input
                  type="email"
                  value={candidateEmail}
                  onChange={(e) => setCandidateEmail(e.target.value)}
                  placeholder="candidate@example.com"
                  className="w-full bg-black/25 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-spotify-green focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSendDialog(false)}
                  className="px-4 py-2 text-white/70 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendAssessment}
                  disabled={!candidateEmail.trim()}
                  className="px-4 py-2 bg-spotify-green text-black rounded-xl font-medium hover:bg-spotify-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AssessmentCard;