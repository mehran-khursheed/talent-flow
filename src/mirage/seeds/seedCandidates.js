import { faker } from "@faker-js/faker";
import { db } from "../db/index";

const STAGES = ["applied", "screening", "technical stage", "offer", "onboard"];

export async function seedCandidates(server) {
  const existingCandidates = await db.candidates.toArray();

  if (existingCandidates.length === 0) {
    console.log("🌱 Seeding 1,000 candidates...");

    const jobs = await db.jobs.toArray();
    const jobIds = jobs.map((job) => job.id);

    if (jobIds.length === 0) {
      console.error("❌ No jobs found! Seed jobs first.");
      return;
    }

    const total = 1000;

    for (let i = 0; i < total; i++) {
      const stage = STAGES[i % STAGES.length]; 

      const candidateData = {
        name: faker.person.fullName(),
        email: faker.internet.email().toLowerCase(),
        jobId: faker.helpers.arrayElement(jobIds),
        stage,
        appliedAt: faker.date.past({ years: 1 }).toISOString(),
        interviewScheduledAt:
          stage === "screening" || stage === "technical stage"
            ? faker.date.future().toISOString()
            : null,
        interviewer:
          stage === "screening" || stage === "technical stage"
            ? faker.person.fullName()
            : null,
        feedback: [],
        rejectedReason: null,
        offerSalary:
          stage === "offer"
            ? faker.number.int({ min: 50000, max: 200000 })
            : null,
        offerBenefits:
          stage === "offer" ? ["Health Insurance", "401k"] : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const candidateId = await db.candidates.add(candidateData);

      await db.candidateTimeline.add({
        candidateId,
        event: "applied",
        description: `Applied for job ID ${candidateData.jobId}`,
        timestamp: candidateData.appliedAt,
      });

      if ((i + 1) % 100 === 0) {
        console.log(`📊 Seeded ${i + 1}/1000 candidates...`);
      }
    }

    console.log("✅ 1,000 candidates seeded evenly across stages!");
  } else {
    console.log("♻️ Loading existing candidates from IndexedDB...");
    existingCandidates.forEach((candidate) =>
      server.create("candidate", candidate)
    );
  }
}
