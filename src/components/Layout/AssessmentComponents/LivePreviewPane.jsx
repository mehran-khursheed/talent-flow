import React from 'react';

// Define questionTypes locally since it's used in the component
const questionTypes = [
  { value: 'short-text', label: 'Short Text' },
  { value: 'long-text', label: 'Long Text' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'single-choice', label: 'Single Choice' },
  { value: 'multi-choice', label: 'Multiple Choice' },
  { value: 'file-upload', label: 'File Upload' },
];

const LivePreviewPane = ({ 
  assessment, 
  responses, 
  currentSection, 
  onResponseChange, 
  onSectionChange,
  isCandidateView,
}) => {
  const getValidationError = (question, value) => {
    if (question.required && !value) return 'This field is required';
    if (question.type === 'numeric' && value) {
      const num = Number(value);
      if (!isNaN(num)) {
        if (question.min !== undefined && num < question.min) 
          return `Minimum value is ${question.min}`;
        if (question.max !== undefined && num > question.max) 
          return `Maximum value is ${question.max}`;
      }
    }
    if ((question.type === 'short-text' || question.type === 'long-text') && value && value.length > question.maxLength)
      return `Maximum ${question.maxLength} characters allowed`;
    return null;
  };

  const renderQuestionInput = (question, questionNumber) => {
    const value = responses[question.id] || '';
    const validationError = getValidationError(question, value);

    const getInputClassName = (baseClass) => {
      if (validationError) {
        return `${baseClass} border-red-500/50 focus:ring-red-500 focus:border-red-500`;
      }
      return `${baseClass} border-white/20 focus:ring-spotify-green focus:border-spotify-green`;
    };

    switch (question.type) {
      case 'short-text':
        return (
          <div className="space-y-3">
            <input
              type="text"
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              maxLength={question.maxLength}
              className={getInputClassName("w-full bg-black/25 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:border-transparent placeholder-white/40")}
              placeholder="Type your answer here..."
            />
            <div className="flex justify-between text-xs">
              <span className={validationError ? "text-red-400" : "text-white/60"}>
                {validationError || "Short answer text"}
              </span>
              {question.maxLength && (
                <span className={value.length > question.maxLength ? "text-red-400" : "text-white/40"}>
                  {value.length}/{question.maxLength}
                </span>
              )}
            </div>
          </div>
        );
      
      case 'long-text':
        return (
          <div className="space-y-3">
            <textarea
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              maxLength={question.maxLength}
              rows={4}
              className={getInputClassName("w-full bg-black/25 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:border-transparent resize-vertical placeholder-white/40")}
              placeholder="Write your detailed answer here..."
            />
            <div className="flex justify-between text-xs">
              <span className={validationError ? "text-red-400" : "text-white/60"}>
                {validationError || "Detailed answer"}
              </span>
              {question.maxLength && (
                <span className={value.length > question.maxLength ? "text-red-400" : "text-white/40"}>
                  {value.length}/{question.maxLength}
                </span>
              )}
            </div>
          </div>
        );
      
      case 'numeric':
        return (
          <div className="space-y-3">
            <input
              type="number"
              value={value}
              onChange={(e) => onResponseChange(question.id, e.target.value)}
              min={question.min}
              max={question.max}
              step={question.step || 1}
              className={getInputClassName("w-32 bg-black/25 border rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:border-transparent placeholder-white/40")}
              placeholder="Enter number"
            />
            <div className="text-xs">
              <span className={validationError ? "text-red-400" : "text-white/60"}>
                {validationError || `Numeric input • Range: ${question.min || 0} to ${question.max || 100}`}
              </span>
            </div>
          </div>
        );
      
      case 'single-choice':
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                validationError 
                  ? "border-red-500/50 bg-red-500/10" 
                  : value === option
                    ? "border-spotify-green bg-spotify-green/10"
                    : "border-white/20 bg-black/25 hover:bg-white/5 hover:border-white/30"
              }`}>
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => onResponseChange(question.id, e.target.value)}
                  className="text-spotify-green focus:ring-spotify-green border-white/30"
                />
                <span className="text-white group-hover:text-spotify-green/80 transition-colors">
                  {option}
                </span>
              </label>
            ))}
            <div className="text-xs">
              <span className={validationError ? "text-red-400" : "text-white/60"}>
                {validationError || "Select one option"}
              </span>
            </div>
          </div>
        );
      
      case 'multi-choice':
        const selectedOptions = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {question.options?.map((option, index) => (
              <label key={index} className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer group ${
                validationError 
                  ? "border-red-500/50 bg-red-500/10" 
                  : selectedOptions.includes(option)
                    ? "border-spotify-green bg-spotify-green/10"
                    : "border-white/20 bg-black/25 hover:bg-white/5 hover:border-white/30"
              }`}>
                <input
                  type="checkbox"
                  value={option}
                  checked={selectedOptions.includes(option)}
                  onChange={(e) => {
                    const newValue = e.target.checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter(v => v !== option);
                    onResponseChange(question.id, newValue);
                  }}
                  className="text-spotify-green focus:ring-spotify-green border-white/30 rounded"
                />
                <span className="text-white group-hover:text-spotify-green/80 transition-colors">
                  {option}
                </span>
              </label>
            ))}
            <div className="text-xs">
              <span className={validationError ? "text-red-400" : "text-white/60"}>
                {validationError || "Select multiple options"}
              </span>
            </div>
          </div>
        );
      
      case 'file-upload':
        return (
          <div className="space-y-3">
            <div className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer group ${
              validationError 
                ? "border-red-500/50 bg-red-500/10" 
                : "border-white/20 bg-black/25 hover:border-spotify-green hover:bg-spotify-green/5"
            }`}>
              <input
                type="file"
                onChange={(e) => onResponseChange(question.id, e.target.files[0])}
                className="hidden"
                id={`preview-file-${question.id}`}
                multiple={question.maxFiles > 1}
              />
              <label
                htmlFor={`preview-file-${question.id}`}
                className="cursor-pointer block"
              >
                <div className="text-2xl mb-2 group-hover:text-spotify-green transition-colors">📎</div>
                <div className="text-white font-medium mb-1 group-hover:text-spotify-green transition-colors">
                  Click to upload files
                </div>
                <div className="text-xs">
                  <span className={validationError ? "text-red-400" : "text-white/60"}>
                    {validationError || `Supported: ${question.acceptedFormats?.join(', ') || '.pdf, .doc, .docx'}`}
                  </span>
                  <br />
                  <span className="text-white/40">
                    Max size: {question.maxSize}MB • Max files: {question.maxFiles || 1}
                  </span>
                </div>
              </label>
            </div>
            {value && (
              <div className="text-spotify-green text-xs flex items-center gap-2">
                <span>✓</span>
                <span>File selected: {value.name}</span>
              </div>
            )}
          </div>
        );
      
      default:
        return (
          <div className="bg-red-500/10 border rounded-xl p-4 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
            <div className="text-red-400 text-sm">Unknown question type</div>
          </div>
        );
    }
  };

  if (!assessment?.sections || assessment.sections.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-white/60 bg-gradient-to-br from-[#131b20] to-[#191c1f] rounded-2xl border border-white/10">
        <div className="text-center">
          <div className="text-4xl mb-4 opacity-50">📝</div>
          <div className="text-lg font-medium mb-2">Assessment Preview</div>
          <div className="text-sm">Add sections and questions to see the live preview</div>
        </div>
      </div>
    );
  }

  const currentSectionData = assessment.sections[currentSection];

  if (!currentSectionData) {
    return (
      <div className="h-full flex items-center justify-center text-white/60 bg-gradient-to-br from-[#131b20] to-[#191c1f] rounded-2xl border border-white/10">
        <div className="text-sm">Section not found</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col  border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95 shadow-2xl">
      {/* Header */}
      <div className="border-b  bg-black/20 rounded-t-2xl p-6 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
        <div className="flex items-start justify-between mb-4 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
          <div className="flex-1 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
            <h3 className="text-2xl font-extrabold text-white mb-2 tracking-tight">
              {assessment.title || 'Untitled Assessment'}
            </h3>
            {assessment.description && (
              <p className="text-white/70 text-sm leading-relaxed">{assessment.description}</p>
            )}
          </div>
          {!isCandidateView && (
            <div className="bg-spotify-green text-black text-xs font-bold px-3 py-1 rounded-full ml-4 flex-shrink-0">
              LIVE PREVIEW
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4 text-white/60">
            {assessment.timeLimit && <span>⏱️ {assessment.timeLimit} min</span>}
            <span>🎯 {assessment.passingScore || 70}% to pass</span>
          </div>
          <div className="text-white/60 text-right">
            Section {currentSection + 1} of {assessment.sections.length}
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      {assessment.sections.length > 1 && (
        <div className="border-b border-white/10 bg-black/25 px-6 py-4">
          <div className="flex gap-2 overflow-x-auto">
            {assessment.sections.map((section, index) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(index)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                  currentSection === index
                    ? 'bg-spotify-green text-black shadow-lg'
                    : 'bg-black/25 border border-white/20 text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                {section.title || `Section ${index + 1}`}
                <span className="ml-2 text-xs opacity-75">
                  ({section.questions?.length || 0})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Section Header */}
          <div className="text-center border-b border-white/10 pb-6">
            <h4 className="text-xl font-bold text-white mb-3">
              {currentSectionData.title || 'Untitled Section'}
            </h4>
            {currentSectionData.description && (
              <p className="text-white/70 text-base leading-relaxed">
                {currentSectionData.description}
              </p>
            )}
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {currentSectionData.questions?.map((question, index) => {
              const validationError = getValidationError(question, responses[question.id]);
              const isConditional = question.conditionalLogic?.dependsOn;
              
              // Check conditional logic
              if (isConditional) {
                const dependentAnswer = responses[question.conditionalLogic.dependsOn];
                let shouldShow = true;
                
                if (dependentAnswer !== undefined && dependentAnswer !== '') {
                  switch (question.conditionalLogic.condition) {
                    case 'equals':
                      shouldShow = dependentAnswer === question.conditionalLogic.value;
                      break;
                    case 'notEquals':
                      shouldShow = dependentAnswer !== question.conditionalLogic.value;
                      break;
                    case 'contains':
                      shouldShow = Array.isArray(dependentAnswer) 
                        ? dependentAnswer.includes(question.conditionalLogic.value)
                        : dependentAnswer.toString().includes(question.conditionalLogic.value);
                      break;
                    case 'greaterThan':
                      shouldShow = Number(dependentAnswer) > Number(question.conditionalLogic.value);
                      break;
                    case 'lessThan':
                      shouldShow = Number(dependentAnswer) < Number(question.conditionalLogic.value);
                      break;
                    default:
                      shouldShow = true;
                  }
                } else {
                  shouldShow = false;
                }
                
                if (!shouldShow) return null;
              }

              return (
                <div 
                  key={question.id} 
                  className={`bg-gradient-to-br from-black/25 to-black/10 rounded-2xl p-6 border shadow-lg ${
                    validationError ? 'border-red-500/50' : 'border-white/10'
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className={`text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 ${
                        validationError ? 'bg-red-500' : 'bg-spotify-green'
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h5 className="text-lg font-semibold text-white leading-relaxed">
                          {question.text || 'Untitled Question'}
                        </h5>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {question.required && (
                            <span className="inline-block bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-medium px-2 py-1 rounded-full">
                              Required
                            </span>
                          )}
                          {validationError && (
                            <span className="inline-block bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-medium px-2 py-1 rounded-full">
                              Validation Error
                            </span>
                          )}
                          {isConditional && (
                            <span className="inline-block bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-medium px-2 py-1 rounded-full">
                              Conditional
                            </span>
                          )}
                        </div>
                        {validationError && (
                          <div className="mt-3 text-red-400 text-sm flex items-center gap-2">
                            <span>⚠️</span>
                            <span>{validationError}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Question Input */}
                  <div className="ml-12">
                    {renderQuestionInput(question, index + 1)}
                  </div>

                  {/* Question Metadata */}
                  <div className="ml-12 mt-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="bg-black/25 border border-white/20 text-spotify-green px-2 py-1 rounded-full">
                        {questionTypes.find(t => t.value === question.type)?.label}
                      </span>
                      {question.type.includes('choice') && (
                        <span className="text-white/60">{question.options?.length || 0} options</span>
                      )}
                      {isConditional && (
                        <span className="text-purple-400">
                          Conditional question
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty States */}
          {(!currentSectionData.questions || currentSectionData.questions.length === 0) && (
            <div className="text-center py-12 text-white/60">
              <div className="text-3xl mb-3 opacity-50">❓</div>
              <div className="text-lg font-medium mb-1">No questions in this section</div>
              <div className="text-sm">Add questions to see them in the preview</div>
            </div>
          )}

          {/* No visible questions due to conditional logic */}
          {currentSectionData.questions && currentSectionData.questions.length > 0 && 
           currentSectionData.questions.every(q => {
             if (!q.conditionalLogic?.dependsOn) return false;
             const dependentAnswer = responses[q.conditionalLogic.dependsOn];
             if (dependentAnswer === undefined || dependentAnswer === '') return true;
             
             switch (q.conditionalLogic.condition) {
               case 'equals':
                 return dependentAnswer !== q.conditionalLogic.value;
               case 'notEquals':
                 return dependentAnswer === q.conditionalLogic.value;
               case 'contains':
                 return Array.isArray(dependentAnswer) 
                   ? !dependentAnswer.includes(q.conditionalLogic.value)
                   : !dependentAnswer.toString().includes(q.conditionalLogic.value);
               case 'greaterThan':
                 return Number(dependentAnswer) <= Number(q.conditionalLogic.value);
               case 'lessThan':
                 return Number(dependentAnswer) >= Number(q.conditionalLogic.value);
               default:
                 return false;
             }
           }) && (
            <div className="text-center py-12 text-white/60">
              <div className="text-3xl mb-3 opacity-50">🔍</div>
              <div className="text-lg font-medium mb-1">No questions to show</div>
              <div className="text-sm">Answer previous questions to see conditional questions</div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      {!isCandidateView && (
        <div className="border-t border-white/10 bg-black/20 rounded-b-2xl p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/60 flex items-center gap-2">
              <span>💡</span>
              <span>Live preview - changes update in real-time</span>
            </div>
            <div className="text-spotify-green font-medium flex items-center gap-2">
              <span>✓</span>
              <span>Auto-saved</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LivePreviewPane;