import Dexie from "dexie";

export const db = new Dexie("TalentFlowDB");

db.version(3).stores({
  jobs: "++id, title, slug, status, order, createdAt, updatedAt, tags",
  candidates: "++id, name, email, jobId, stage, appliedAt, interviewScheduledAt, interviewer, feedback, rejectedReason, offerSalary, offerBenefits, createdAt, updatedAt",
  assessments: "++id, jobId, title, createdAt",
  candidateTimeline: "++id, candidateId, event, description, timestamp"
});

