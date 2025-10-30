// src/mirage/seeds/seedAssessments.js
import { faker } from "@faker-js/faker";
import { db } from "../db/index";

const QUESTION_TYPES = ["single-choice", "multi-choice", "short-text", "long-text", "numeric", "file-upload"];

function generateQuestion(index) {
  const type = faker.helpers.arrayElement(QUESTION_TYPES);
  
  const baseQuestion = {
    id: faker.string.uuid(),
    type,
    text: faker.helpers.arrayElement([
      "What is your experience with this technology?",
      "Describe your approach to problem-solving.",
      "How do you handle tight deadlines?",
      "What motivates you in your career?",
      "Explain a challenging project you worked on.",
      "What are your salary expectations?",
      "Why are you interested in this role?",
      "What are your long-term career goals?",
    ]) + ` (Q${index + 1})`,
    required: faker.datatype.boolean(),
    order: index,
  };
  
  switch (type) {
    case "single-choice":
    case "multi-choice":
      baseQuestion.options = [
        "Excellent",
        "Good", 
        "Average",
        "Beginner",
        "No experience"
      ];
      break;
    case "numeric":
      baseQuestion.min = 0;
      baseQuestion.max = 100;
      break;
    case "short-text":
      baseQuestion.maxLength = 100;
      break;
    case "long-text":
      baseQuestion.maxLength = 500;
      break;
    default:
        baseQuestion.maxLength = 50;
  }
  
  if (index > 0 && faker.datatype.boolean(0.3)) {
    baseQuestion.conditionalOn = {
      questionId: index - 1,
      expectedValue: "Yes"
    };
  }
  
  return baseQuestion;
}

export async function seedAssessments(server) {
  const existingAssessments = await db.assessments.toArray();
  
  if (existingAssessments.length === 0) {
    console.log("🌱 Seeding assessments to IndexedDB...");
    
    const jobs = await db.jobs.toArray();
    const activeJobs = jobs.filter(job => job.status === "active");
    
    if (activeJobs.length === 0) {
      console.error("❌ No active jobs found!");
      return;
    }
    
    const numberOfAssessments = faker.number.int({ min: 3, max: 5 });
    const assessments = [];
    
    for (let i = 0; i < numberOfAssessments; i++) {
      const job = activeJobs[i % activeJobs.length];
      
      const numberOfQuestions = faker.number.int({ min: 10, max: 15 });
      const sections = [
        {
          id: faker.string.uuid(),
          title: "Background & Experience",
          description: "Tell us about your professional background",
          questions: Array.from({ length: Math.ceil(numberOfQuestions / 3) }, (_, idx) => 
            generateQuestion(idx)
          ),
        },
        {
          id: faker.string.uuid(),
          title: "Technical Skills", 
          description: "Assess your technical capabilities",
          questions: Array.from({ length: Math.ceil(numberOfQuestions / 3) }, (_, idx) => 
            generateQuestion(idx + Math.ceil(numberOfQuestions / 3))
          ),
        },
        {
          id: faker.string.uuid(),
          title: "Behavioral Questions",
          description: "Understanding your work style", 
          questions: Array.from({ length: Math.floor(numberOfQuestions / 3) }, (_, idx) => 
            generateQuestion(idx + 2 * Math.ceil(numberOfQuestions / 3))
          ),
        },
      ];
      
      const assessmentData = {
        id: faker.string.uuid(), // Add ID for IndexedDB
        jobId: job.id, // Use same ID type as jobs in IndexedDB
        title: `${job.title} Assessment`,
        description: faker.lorem.paragraph(),
        sections,
        timeLimit: faker.number.int({ min: 30, max: 90 }),
        passingScore: faker.number.int({ min: 60, max: 80 }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      assessments.push(assessmentData);
    }
    
    // Write ONLY to IndexedDB
    await db.assessments.bulkAdd(assessments);
    console.log(`✅ ${assessments.length} assessments seeded to IndexedDB!`);
    
    // Also add to Mirage for current session
    assessments.forEach(assessment => {
      server.create("assessment", assessment);
    });
    
  } else {
    console.log("♻️ Loading existing assessments from IndexedDB to Mirage...");
    // Sync IndexedDB to Mirage for current session
    existingAssessments.forEach((assessment) => {
      server.create("assessment", assessment);
    });
  }
}