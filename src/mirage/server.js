// src/mirage/server.js
import { createServer, Model } from "miragejs";
import { seedJobs } from "./seeds/seedJobs";
import { seedCandidates } from "./seeds/seedCandidates";
import { seedAssessments } from "./seeds/seedAssessments";
import { jobRoutes } from "./routes/jobRoutes";
import { candidateRoutes } from "./routes/candidateRoutes";
import { assessmentRoutes } from "./routes/asessmentRoutes";
import { getRandomLatency } from "./helpers/errorSimulator";

export function makeServer() {
  const server = createServer({
   

    models: {
      job: Model,
      candidate: Model,
      assessment: Model,
      candidateTimeline: Model,
    },

    seeds(server) {
      console.log("🌱 Starting seed process...");
      
      // Seed in order: jobs → candidates → assessments
      seedJobs(server).then(() => {
        return seedCandidates(server);
      }).then(() => {
        return seedAssessments(server);
      }).then(() => {
        console.log(" All data seeded successfully!");
      });
    },

    routes() {
      this.namespace = "api";
      
      // Add random latency (200-1200ms) to ALL requests
      this.timing = getRandomLatency();
      
      // Configure passthrough for any external APIs
      this.passthrough("https://api.external.com/**");
      
      // Register routes
      jobRoutes(this);
      candidateRoutes(this);
     assessmentRoutes(this);
    },
  });

  return server;
}
