// components/Layout/AssessmentComponents/QuestionEditor.js
import React from 'react';
import { questionTypes } from '../../../pages/assessments/AssessmentBuilderPage'; // Adjust path as needed

export default function QuestionEditor({ 
  question, 
  questionIndex, 
  totalQuestions, 
  onUpdate, 
  onDelete, 
  onMoveUp, 
  onMoveDown, 
  allQuestions 
}) {
  const renderQuestionFields = () => {
    switch (question.type) {
      case 'numeric':
        return (
          <div className="grid grid-cols-2 gap-4 mt-3 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
            <div>
              <label className="block text-sm font-medium mb-1">Minimum Value</label>
              <input
                type="number"
                value={question.min ?? ''}
                onChange={(e) => onUpdate({ min: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                placeholder="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Maximum Value</label>
              <input
                type="number"
                value={question.max ?? ''}
                onChange={(e) => onUpdate({ max: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                placeholder="100"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Step (optional)</label>
              <input
                type="number"
                value={question.step ?? ''}
                onChange={(e) => onUpdate({ step: e.target.value ? parseFloat(e.target.value) : undefined })}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                placeholder="1"
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
        );
      
      case 'single-choice':
      case 'multi-choice':
        return (
          <div className="mt-3">
            <label className="block text-sm font-medium mb-2">
              Options {question.type === 'single-choice' ? '(Select one)' : '(Select multiple)'}
            </label>
            <div className="space-y-2">
              {question.options?.map((option, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-white/40 text-sm">{index + 1}.</span>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...question.options];
                      newOptions[index] = e.target.value;
                      onUpdate({ options: newOptions });
                    }}
                    className="flex-1 bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                    placeholder={`Option ${index + 1}`}
                  />
                  {question.options.length > 1 && (
                    <button
                      onClick={() => {
                        const newOptions = question.options.filter((_, i) => i !== index);
                        onUpdate({ options: newOptions });
                      }}
                      className="px-2 text-red-400 hover:text-red-300 text-lg"
                      title="Remove option"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => onUpdate({ options: [...question.options, 'New option'] })}
              className="mt-3 px-3 py-1 bg-white/10 rounded text-sm hover:bg-white/20 flex items-center gap-1"
            >
              + Add Option
            </button>
            
            {question.options?.some(opt => !opt.trim()) && (
              <div className="mt-2 text-yellow-400 text-xs">
                ⚠️ Empty options will be removed when saved
              </div>
            )}
          </div>
        );
      
      case 'file-upload':
        return (
          <div className="grid grid-cols-1 gap-4 mt-3">
            <div>
              <label className="block text-sm font-medium mb-1">Accepted File Formats</label>
              <input
                type="text"
                value={question.acceptedFormats?.join(', ') || ''}
                onChange={(e) => onUpdate({ 
                  acceptedFormats: e.target.value.split(',').map(f => f.trim()).filter(f => f) 
                })}
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                placeholder=".pdf, .doc, .docx, .jpg, .png"
              />
              <div className="text-xs text-white/60 mt-1">
                Separate formats with commas (e.g., .pdf, .doc, .jpg)
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Max File Size (MB)</label>
                <input
                  type="number"
                  value={question.maxSize || 10}
                  onChange={(e) => onUpdate({ maxSize: parseInt(e.target.value) || 10 })}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                  min="1"
                  max="100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Max Files</label>
                <input
                  type="number"
                  value={question.maxFiles || 1}
                  onChange={(e) => onUpdate({ maxFiles: parseInt(e.target.value) || 1 })}
                  className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
                  min="1"
                  max="10"
                />
              </div>
            </div>
          </div>
        );
      
      case 'short-text':
        return (
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Max Characters</label>
            <input
              type="number"
              value={question.maxLength || 250}
              onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) || 250 })}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
              min="1"
              max="1000"
            />
            <div className="text-xs text-white/60 mt-1">
              Recommended: 250 characters or less for short answers
            </div>
          </div>
        );
      
      case 'long-text':
        return (
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">Max Characters</label>
            <input
              type="number"
              value={question.maxLength || 2000}
              onChange={(e) => onUpdate({ maxLength: parseInt(e.target.value) || 2000 })}
              className="w-full bg-white/10 border border-white/20 rounded px-3 py-1 text-sm"
              min="1"
              max="10000"
            />
            <div className="text-xs text-white/60 mt-1">
              Recommended: 2000 characters for detailed responses
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  const renderConditionalLogic = () => {
    const previousQuestions = allQuestions?.slice(0, questionIndex) || [];
    
    return (
      <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
        <label className="block text-sm font-medium mb-2">Conditional Logic (Optional)</label>
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="md:col-span-3">
              <label className="block text-xs font-medium mb-1 text-white/70">Show this question only if:</label>
              <select
                value={question.conditionalLogic?.dependsOn || ''}
                onChange={(e) => onUpdate({ 
                  conditionalLogic: { 
                    ...question.conditionalLogic, 
                    dependsOn: e.target.value || null 
                  }
                })}
                className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
              >
                <option value="">Always show this question</option>
                {previousQuestions.map((prevQ, idx) => (
                  <option key={prevQ.id} value={prevQ.id}>
                    Q{idx + 1}: {prevQ.text?.substring(0, 30)}...
                  </option>
                ))}
              </select>
            </div>
            
            {question.conditionalLogic?.dependsOn && (
              <>
                <div>
                  <label className="block text-xs font-medium mb-1 text-white/70">Condition</label>
                  <select
                    value={question.conditionalLogic?.condition || 'equals'}
                    onChange={(e) => onUpdate({ 
                      conditionalLogic: { 
                        ...question.conditionalLogic, 
                        condition: e.target.value 
                      }
                    })}
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
                  >
                    <option value="equals">Equals</option>
                    <option value="notEquals">Not Equals</option>
                    <option value="contains">Contains</option>
                    <option value="greaterThan">Greater Than</option>
                    <option value="lessThan">Less Than</option>
                  </select>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium mb-1 text-white/70">Expected Value</label>
                  <input
                    type="text"
                    value={question.conditionalLogic?.value || ''}
                    onChange={(e) => onUpdate({ 
                      conditionalLogic: { 
                        ...question.conditionalLogic, 
                        value: e.target.value 
                      }
                    })}
                    placeholder="Enter expected answer..."
                    className="w-full bg-white/10 border border-white/20 rounded px-2 py-1 text-sm"
                  />
                </div>
              </>
            )}
          </div>
          
          {question.conditionalLogic?.dependsOn && (
            <div className="text-xs text-blue-300 bg-blue-500/20 p-2 rounded">
              💡 This question will only appear if <strong>Q{previousQuestions.findIndex(q => q.id === question.conditionalLogic.dependsOn) + 1}</strong> {question.conditionalLogic.condition} "<strong>{question.conditionalLogic.value}</strong>"
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black/20 rounded-lg p-4 border border-white/10">
      <div className="flex gap-3">
        <div className="flex flex-col items-center gap-2 pt-2">
          <div className="text-sm text-white/60 font-mono bg-white/10 rounded px-2 py-1">
            Q{questionIndex + 1}
          </div>
          <div className="flex flex-col gap-1">
            <button
              onClick={onMoveUp}
              disabled={!onMoveUp}
              className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30"
              title="Move up"
            >
              ↑
            </button>
            <button
              onClick={onMoveDown}
              disabled={!onMoveDown}
              className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30"
              title="Move down"
            >
              ↓
            </button>
          </div>
        </div>

        <div className="flex-1">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <input
                type="text"
                value={question.text}
                onChange={(e) => onUpdate({ text: e.target.value })}
                placeholder="Enter your question here..."
                className="w-full bg-white/10 border border-white/20 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-spotify-green text-lg"
              />
              {!question.text && (
                <div className="text-red-400 text-xs mt-1">Question text is required</div>
              )}
            </div>
            <div className="flex gap-2 ml-4 items-start">
              <label className="flex items-center gap-1 text-sm bg-white/10 px-2 py-1 rounded">
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => onUpdate({ required: e.target.checked })}
                  className="rounded"
                />
                Required
              </label>
              <button
                onClick={onDelete}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded text-sm hover:bg-red-500/30"
                title="Delete question"
              >
                Delete
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-white/60 mb-3">
            <span>Type: {questionTypes.find(t => t.value === question.type)?.label}</span>
            <span>•</span>
            <span>{question.required ? 'Required' : 'Optional'}</span>
            {question.conditionalLogic?.dependsOn && (
              <>
                <span>•</span>
                <span className="text-blue-400">Conditional</span>
              </>
            )}
          </div>

          {renderQuestionFields()}
          {renderConditionalLogic()}
        </div>
      </div>
    </div>
  );
}