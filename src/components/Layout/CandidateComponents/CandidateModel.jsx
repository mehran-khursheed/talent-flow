const CandidateModal = ({ candidate, onClose }) => {
  if (!candidate) {
    return null;
  }

  const modelCardArray = [
    { 
      label: "Email", 
      value: candidate.email, 
      icon: "📧", 
      highlight: "text-spotify-green hover:text-spotify-green/80" 
    },
    { 
      label: "Applied On", 
      value: candidate.appliedAt ? new Date(candidate.appliedAt).toLocaleDateString() : 'N/A', 
      icon: "📅",
      highlight: "text-white/80" 
    }, 
    { 
      label: "Applied Time", 
      value: candidate.appliedAt ? new Date(candidate.appliedAt).toLocaleTimeString() : 'N/A', 
      icon: "⏰",
      highlight: "text-white/80" 
    },
  ]

  // Helper to format the stage for display
  const formatStage = (stage) => {
    if (!stage) return 'N/A';
    return stage.charAt(0).toUpperCase() + stage.slice(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden relative border border-white/10">
        
        {/* Header Section */}
        <div className="p-6 relative border-b border-white/10">
          <h2 className="text-2xl font-extrabold text-white mb-3 tracking-tight">
            {candidate.name}
          </h2>
          <div className="flex items-center space-x-3">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-black/25 border border-spotify-green/30 text-spotify-green uppercase tracking-wider">
              {formatStage(candidate.stage)}
            </span>
            <p className="text-white/60 text-sm">
              Job ID: <span className="text-white font-medium">{candidate.jobId || 'N/A'}</span>
            </p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="p-6 grid grid-cols-2 gap-y-5 gap-x-6">
          {modelCardArray.map((item, index) => (
            <div key={index} className="flex flex-col space-y-1">
              <p className="text-xs font-medium uppercase tracking-wider text-white/60 mb-1 flex items-center">
                {item.icon} <span className="ml-1">{item.label}</span>
              </p>
              <p className={`text-sm font-semibold ${item.highlight} truncate`}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Offer Details Section */}
        {(candidate.offerSalary || candidate.offerBenefits) && (
          <div className="p-6 pt-4 border-t border-white/10 bg-black/25">
            <h4 className="text-sm font-bold uppercase text-spotify-green mb-3 tracking-wider flex items-center">
              💰 Offer Details
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              {candidate.offerSalary && (
                <div>
                  <p className="text-xs uppercase text-white/60 mb-1">Salary</p>
                  <p className="text-base font-bold text-spotify-green">
                    {candidate.offerSalary}
                  </p>
                </div>
              )}
              {candidate.offerBenefits && (
                <div>
                  <p className="text-xs uppercase text-white/60 mb-1">Benefits</p>
                  <p className="text-sm text-white/80">
                    {candidate.offerBenefits}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="p-4 bg-black/25 border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-white/10 border border-white/20 text-white/70 rounded-full text-sm font-medium hover:bg-spotify-green/90 hover:text-black hover:border-spotify-green transition-all duration-200"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateModal;