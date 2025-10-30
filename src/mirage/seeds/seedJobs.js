// src/mirage/seeds/seedJobs.js
import { faker } from "@faker-js/faker";
import { db } from "../db/index";

const JOB_TITLES = [
  "Senior Frontend Developer",
  "Backend Engineer",
  "Full Stack Developer",
  "DevOps Engineer",
  "Product Manager",
  "UX Designer",
  "Data Scientist",
  "Mobile Developer",
  "QA Engineer",
  "Technical Writer",
  "Solutions Architect",
  "Security Engineer",
  "Machine Learning Engineer",
  "Site Reliability Engineer",
  "Engineering Manager",
  "Business Analyst",
  "UI Designer",
  "Cloud Engineer",
  "Database Administrator",
  "Platform Engineer"
];

const TECH_TAGS = [
  "React", "Node.js", "Python", "AWS", "Docker", 
  "Kubernetes", "TypeScript", "GraphQL", "MongoDB", 
  "PostgreSQL", "Redis", "Microservices", "CI/CD"
];

export async function seedJobs(server) {
  const existingJobs = await db.jobs.toArray();
  
  if (existingJobs.length === 0) {
    console.log("🌱 Seeding 25 jobs...");
    
    for (let i = 0; i < 25; i++) {
      const title = JOB_TITLES[i % JOB_TITLES.length] + (i >= 20 ? ` (${i - 19})` : '');
      const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '');
      
      const jobData = {
        title,
        slug,
        status: i < 18 ? "active" : "archived", // 18 active, 7 archived
        description: faker.lorem.paragraphs(3),
        location: faker.location.city() + ", " + faker.location.country(),
        department: faker.helpers.arrayElement(["Engineering", "Product", "Design", "Operations"]),
        employmentType: faker.helpers.arrayElement(["Full-time", "Part-time", "Contract"]),
        experience: faker.helpers.arrayElement(["Entry Level", "Mid Level", "Senior", "Lead"]),
        salary: `$${faker.number.int({ min: 60, max: 200 })}k - $${faker.number.int({ min: 80, max: 250 })}k`,
        tags: faker.helpers.arrayElements(TECH_TAGS, { min: 2, max: 5 }),
        order: i,
        openings: faker.number.int({ min: 1, max: 5 }),
        createdAt: faker.date.past({ years: 1 }).toISOString(),
        fillBy: faker.date.soon({ days: faker.number.int({ min: 7, max: 90 }) }).toISOString(),
        priority: faker.helpers.arrayElement(["high", "medium", "low"]),
      };
      
      const job = server.create("job", jobData);
      await db.jobs.add(job.attrs);
    }
    
    console.log("✅ 25 jobs seeded!");
  } else {
    console.log("♻️ Loading existing jobs from IndexedDB...");
    existingJobs.forEach((job) => server.create("job", job));
  }
}
