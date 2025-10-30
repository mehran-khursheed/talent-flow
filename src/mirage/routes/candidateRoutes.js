import { db } from "../db";
import { withErrorSimulation } from "../helpers/errorSimulator";

export function candidateRoutes(server) {

    server.get("/candidates" , async (schema , request) => {
        try {
            const search = request.queryParams.search?.toLowerCase() || "";
            const stage = request.queryParams.stage?.toLowerCase() || "";
            const page = parseInt(request.queryParams.page || "1" , 10);

            console.log("Searching candidates with params:" , search , stage , page);

            let candidates = await db.candidates.toArray();

            if(search) {
            candidates = candidates.filter(
                c =>
                    c.name.toLowerCase().includes(search) ||
                    c.email.toLowerCase().includes(search)
            )
            }

            if(stage) {
                candidates = candidates.filter(c => c.stage.toLowerCase() === stage);
            }

            const total = candidates.length;
            const pageSize = 10;
            const start = (page - 1) * pageSize;
            const end = start + pageSize;
            const paginatedCandidates = candidates.slice(start , end);

            return {
                data: paginatedCandidates,
                meta: {
                    total,
                    page,
                    pageSize,
                    totalPages: Math.ceil(total / pageSize)
                }
            }
        } catch (error) {
            console.error("Error while fetching candidates:", error);
            return new Response(500, {}, { error: "Failed to fetch. Please try again." });
        }
    })

    server.post("/candidates" , withErrorSimulation(async (request) => {
        try {
            console.log("Creating new candidate");
    
            const reqBody = JSON.parse(request.requestBody);
    
            if(!reqBody.name && !reqBody.email && !reqBody.stage) {
                throw new Error("Missing required candidate fields");   
            }
    
            const now = new Date().toISOString();
            const newCandidate = {
            name: reqBody.name,
            email: reqBody.email,
            jobId: reqBody.jobId,               
            stage: reqBody.stage || "applied", 
            appliedAt: now,
            interviewScheduledAt: reqBody.interviewScheduledAt || null,
            interviewer: reqBody.interviewer || null,
            feedback: [],                        
            rejectedReason: null,
            offerSalary: null,
            offerBenefits: null,
            createdAt: now,
            updatedAt: now
            };
    
            const id = await db.candidates.add(newCandidate);
            const savedCandidate = await db.candidates.get(id);
            return new Response(201, { "Content-Type": "application/json" }, savedCandidate);
        } 
        catch (error) {
            console.error("Error creating candidate:", error);
            return new Response(500, {}, { error: "Failed to create candidate. Please try again." });
        }
    }))

    server.patch("/candidates/:id",withErrorSimulation(async ( request) => {
    try {
        const candidateId = parseInt(request.params.id, 10);
        const attrs = JSON.parse(request.requestBody);

        const candidate = await db.candidates.get(candidateId);
        if (!candidate) {
        return new Response(404, {}, { error: "Candidate not found." });
        }

        if (attrs.stage !== undefined) {
        const validStages = ["applied", "screen", "tech", "offer", "hired", "rejected"];
        const newStage = attrs.stage.toLowerCase();
        if (!validStages.includes(newStage)) {
            return new Response(400, {}, { error: "Invalid stage value." });
        }

        candidate.stage = newStage;
        candidate.updatedAt = new Date().toISOString();

        const timelineEvent = {
            candidateId: candidate.id,
            event: newStage,
            description: `Moved to stage: ${newStage}`,
            timestamp: candidate.updatedAt
        };
        await db.candidateTimeline.add(timelineEvent);
        }

        const updatedCandidate = { ...candidate, ...attrs, updatedAt: new Date().toISOString() };
        await db.candidates.put(updatedCandidate);

        const savedCandidate = await db.candidates.get(candidateId);
        return new Response(200, { "Content-Type": "application/json" }, savedCandidate);

    } catch (error) {
        console.error("Error updating candidate:", error);
        return new Response(500, {}, { error: "Failed to update candidate. Please try again." });
    }
  }));


}