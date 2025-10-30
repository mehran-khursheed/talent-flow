import React from 'react';
import QuestionEditor from './QuestionEditor';
import { questionTypes } from '../../../pages/assessments/AssessmentBuilderPage'; // Adjust path as needed

export default function SectionEditor({ 
  section, 
  sectionIndex, 
  onUpdate, 
  onDelete, 
  onAddQuestion, 
  onUpdateQuestion, 
  onDeleteQuestion,
  onMoveQuestion,
  allQuestions
}) {
  return (
    <div className="bg-white/5 rounded-xl p-6 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
      <div className="flex justify-between items-start mb-6 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
        <div className="flex-1">
          <input
            type="text"
            value={section.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="text-2xl font-bold bg-transparent border-b border-white/20 focus:outline-none focus:border-spotify-green w-full mb-2"
            placeholder="Section title"
          />
          <textarea
            value={section.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Section description..."
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-spotify-green"
            rows={2}
          />
        </div>
        <button
          onClick={onDelete}
          className="ml-4 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
        >
          Delete Section
        </button>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {questionTypes.map(type => (
          <button
            key={type.value}
            onClick={() => onAddQuestion(type.value)}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors flex items-center gap-2"
          >
            <span>{type.icon}</span>
            <span>{type.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {section.questions?.map((question, questionIndex) => (
          <QuestionEditor
            key={question.id}
            question={question}
            questionIndex={questionIndex}
            totalQuestions={section.questions.length}
            onUpdate={(updates) => onUpdateQuestion(questionIndex, updates)}
            onDelete={() => onDeleteQuestion(questionIndex)}
            onMoveUp={questionIndex > 0 ? () => onMoveQuestion(sectionIndex, questionIndex, questionIndex - 1) : null}
            onMoveDown={questionIndex < section.questions.length - 1 ? () => onMoveQuestion(sectionIndex, questionIndex, questionIndex + 1) : null}
            allQuestions={allQuestions}
          />
        ))} 
      </div>

      {(!section.questions || section.questions.length === 0) && (
        <div className="text-center py-8 text-white/60">
          <p>No questions in this section yet</p>
          <p className="text-sm mt-1">Add questions using the buttons above</p>
        </div>
      )}
    </div>
  );
}