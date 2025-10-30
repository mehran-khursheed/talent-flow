// pages/AssessmentBuilderPage.js
import  { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LivePreviewPane from '../../components/Layout/AssessmentComponents/LivePreviewPane';
import SectionEditor from '../../components/Layout/AssessmentComponents/SectionEditor';

// Export questionTypes for use in other components
export const questionTypes = [
  { value: 'short-text', label: 'Short Text', icon: '📝' },
  { value: 'long-text', label: 'Long Text', icon: '📄' },
  { value: 'numeric', label: 'Numeric', icon: '🔢' },
  { value: 'single-choice', label: 'Single Choice', icon: '☑️' },
  { value: 'multi-choice', label: 'Multiple Choice', icon: '✅' },
  { value: 'file-upload', label: 'File Upload', icon: '📎' },
];

export default function AssessmentBuilderSection() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  const [previewResponses, setPreviewResponses] = useState({});
  const [previewCurrentSection, setPreviewCurrentSection] = useState(0);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await fetch(`/api/assessments/${jobId}`);
        if (response.ok) {
          const data = await response.json();
          setAssessment({
            ...data,
            sections: data.sections || []
          });
        } else {
          // Create new assessment structure
          setAssessment({
            jobId: parseInt(jobId),
            id: crypto.randomUUID(),
            title: '',
            description: '',
            sections: [],
            timeLimit: 60,
            passingScore: 70,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } catch (error) {
        console.error('Failed to fetch assessment:', error);
        // Fallback assessment structure on error
        setAssessment({
          jobId: parseInt(jobId),
          id: crypto.randomUUID(),
          title: '',
          description: '',
          sections: [],
          timeLimit: 60,
          passingScore: 70,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssessment();
  }, [jobId]);

  const updateAssessment = (updates) => {
    setAssessment(prev => ({ ...prev, ...updates }));
  };

  const addSection = () => {
    const newSection = {
      id: crypto.randomUUID(),
      title: 'New Section',
      description: '',
      questions: []
    };
    setAssessment(prev => {
      const newSections = [...prev.sections, newSection];
      setActiveSection(newSections.length - 1);
      return {
        ...prev,
        sections: newSections
      };
    });
  };

  const updateSection = (sectionIndex, updates) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, ...updates } : section
      )
    }));
  };

  const deleteSection = (sectionIndex) => {
    setAssessment(prev => ({
      ...prev,
      sections: prev.sections.filter((_, index) => index !== sectionIndex)
    }));
    setActiveSection(Math.max(0, sectionIndex - 1));
  };

  const addQuestion = (sectionIndex, type) => {
    const section = assessment.sections[sectionIndex];
    const newQuestion = {
      id: crypto.randomUUID(),
      type,
      text: '',
      required: false,
      order: section.questions.length
    };

    switch (type) {
      case 'numeric':
        newQuestion.min = 0;
        newQuestion.max = 100;
        break;
      case 'single-choice':
      case 'multi-choice':
        newQuestion.options = ['Option 1', 'Option 2'];
        break;
      case 'file-upload':
        newQuestion.acceptedFormats = ['.pdf', '.doc', '.docx'];
        newQuestion.maxSize = 5;
        newQuestion.maxFiles = 1;
        break;
      case 'short-text':
        newQuestion.maxLength = 100;
        break;
      case 'long-text':
        newQuestion.maxLength = 500;
        break;
      default:
          newQuestion.maxLength = 100;
          break;
    }

    if (section.questions.length > 0 && Math.random() < 0.3) {
      newQuestion.conditionalLogic = {
        dependsOn: section.questions[section.questions.length - 1].id,
        condition: 'equals',
        value: "Yes"
      };
    }

    updateSection(sectionIndex, {
      questions: [...section.questions, newQuestion]
    });
  };

  const updateQuestion = (sectionIndex, questionIndex, updates) => {
    const section = assessment.sections[sectionIndex];
    const updatedQuestions = section.questions.map((question, index) =>
      index === questionIndex ? { ...question, ...updates } : question
    );
    updateSection(sectionIndex, { questions: updatedQuestions });
  };

  const deleteQuestion = (sectionIndex, questionIndex) => {
    const section = assessment.sections[sectionIndex];
    const updatedQuestions = section.questions.filter((_, index) => index !== questionIndex);
    updateSection(sectionIndex, { questions: updatedQuestions });
  };

  const moveQuestion = (sectionIndex, fromIndex, toIndex) => {
    const section = assessment.sections[sectionIndex];
    const questions = [...section.questions];
    const [moved] = questions.splice(fromIndex, 1);
    questions.splice(toIndex, 0, moved);
    
    const reorderedQuestions = questions.map((q, index) => ({ ...q, order: index }));
    updateSection(sectionIndex, { questions: reorderedQuestions });
  };

  const saveAssessment = async () => {
    setSaving(true);
    try {
      let isExistingAssessment = false;
      
      if (assessment.id) {
        try {
          const checkResponse = await fetch(`/api/assessments/${jobId}`);
          isExistingAssessment = checkResponse.ok;
        } catch (error) {
          isExistingAssessment = false;
        }
      }
      
      const method = isExistingAssessment ? 'PUT' : 'POST';
      const url = isExistingAssessment 
        ? `/api/assessments/${jobId}`
        : '/api/assessments';
      
      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(assessment)
      });

      if (response.ok) {
        const savedAssessment = await response.json();
        setAssessment(savedAssessment);
        alert('Assessment saved successfully!');
      } else {
         await response.text();
        throw new Error(`Failed to save assessment: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to save assessment:', error);
      alert(`Failed to save assessment: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewResponse = (questionId, value) => {
    setPreviewResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-white text-lg font-medium">Loading assessment...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95 text-white">
      {/* Clean Header */}
      <div className=" border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[2000px] mx-auto px-8 py-4 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
          <div className="flex justify-between items-center border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
            <div>
              <h1 className="text-2xl font-bold text-white">Assessment Builder</h1>
              <p className="text-gray-400 mt-1">Job #{jobId}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate(-1)}
                className="px-5 py-2.5 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 hover:border-gray-500 hover:text-white transition-colors"
              >
                Back
              </button>
              <button
                onClick={saveAssessment}
                disabled={saving}
                className="px-6 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                {saving ? 'Saving...' : 'Save Assessment'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-[2000px] mx-auto px-8 py-8 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
        <div className="flex flex-col xl:flex-row gap-8 h-[calc(100vh-120px)]">
          
          {/* Builder Section */}
          <div className="flex-1 min-w-0 space-y-6 overflow-y-auto scrollbar-spotify scrollbar-spotify-dark">
            
            {/* Assessment Settings */}
            <div className="rounded-xl p-6  border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
              <h2 className="text-xl font-semibold mb-6 text-white">Assessment Settings</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={assessment.title}
                    onChange={(e) => updateAssessment({ title: e.target.value })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="Assessment title"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Time Limit (minutes)</label>
                  <input
                    type="number"
                    value={assessment.timeLimit}
                    onChange={(e) => updateAssessment({ timeLimit: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
                <div className="lg:col-span-2">
                  <label className="block text-gray-300 font-medium mb-2">Description</label>
                  <textarea
                    value={assessment.description}
                    onChange={(e) => updateAssessment({ description: e.target.value })}
                    rows={3}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors resize-none"
                    placeholder="Assessment description"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-medium mb-2">Passing Score (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={assessment.passingScore}
                    onChange={(e) => updateAssessment({ passingScore: parseInt(e.target.value) || 0 })}
                    className="w-full bg-gray-700/50 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Sections Management */}
            <div className="bg-gray-800/50 rounded-xl p-6  border-gray-700 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95 ">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-white">Sections</h2>
                <button
                  onClick={addSection}
                  className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <span>+</span>
                  <span>Add Section</span>
                </button>
              </div>
              
              {/* Section Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-4">
                {assessment.sections?.map((section, index) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(index)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                      activeSection === index 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {section.title || 'Untitled Section'} ({section.questions?.length || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Section Editor */}
            {assessment.sections?.length > 0 ? (
              <SectionEditor
                section={assessment.sections[activeSection]}
                sectionIndex={activeSection}
                onUpdate={(updates) => updateSection(activeSection, updates)}
                onDelete={() => deleteSection(activeSection)}
                onAddQuestion={(type) => addQuestion(activeSection, type)}
                onUpdateQuestion={(questionIndex, updates) => updateQuestion(activeSection, questionIndex, updates)}
                onDeleteQuestion={(questionIndex) => deleteQuestion(activeSection, questionIndex)}
                onMoveQuestion={moveQuestion}
                allQuestions={assessment.sections[activeSection]?.questions || []}
              />
            ) : (
              <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-gray-700 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
                <h3 className="text-lg font-semibold mb-2 text-white">No sections yet</h3>
                <p className="text-gray-400 mb-6">Create your first section to start adding questions</p>
                <button
                  onClick={addSection}
                  className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Create First Section
                </button>
              </div>
            )}
          </div>

          {/* Live Preview Pane */}
          <div className="xl:w-[550px] flex-shrink-0 scrollbar-spotify scrollbar-spotify-dark">
            <div className="bg-gray-800/50 rounded-xl p-6 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto  border-gray-700 border-white/10 bg-gradient-to-br from-[#131b20] via-[#191c1f] to-[#131e16]/95">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Live Preview</h2>
                <div className="text-gray-400 text-sm">Real-time • Interactive</div>
              </div>
              
              <LivePreviewPane
                assessment={assessment}
                responses={previewResponses}
                currentSection={previewCurrentSection}
                onResponseChange={handlePreviewResponse}
                onSectionChange={setPreviewCurrentSection}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}