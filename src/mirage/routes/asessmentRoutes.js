// src/mirage/routes/assessments.routes.js
import { Response } from "miragejs";
import { db } from "../db/index";
import { withErrorSimulation } from "../helpers/errorSimulator";

export function assessmentRoutes(server) {
   console.log("🔧 Registering assessment routes...");
  
 
  server.post("/assessments", withErrorSimulation(async (schema, request) => {
  const attrs = JSON.parse(request.requestBody);
  
  console.log("🟢 CREATE ASSESSMENT: Received data for jobId:", attrs.jobId);
  console.log("📦 Assessment data:", attrs);
  
  // Validation
  if (!attrs.jobId) {
    return new Response(400, {}, { 
      error: "jobId is required" 
    });
  }
  
  if (!attrs.title) {
    return new Response(400, {}, { 
      error: "Assessment title is required" 
    });
  }
  
  // Check if assessment already exists for this job
  const existingAssessment = schema.assessments.findBy({ jobId: parseInt(attrs.jobId) });
  if (existingAssessment) {
    return new Response(409, {}, { 
      error: "Assessment already exists for this job" 
    });
  }
  
  try {
    // Create assessment data with proper IDs and timestamps
    const assessmentData = {
      ...attrs,
      id: attrs.id || crypto.randomUUID(), // Use provided ID or generate new one
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    console.log("💾 Saving new assessment to IndexedDB...");
    
    // Save to IndexedDB first (source of truth)
    const id = await db.assessments.add(assessmentData);
    
    console.log("✅ Saved to IndexedDB with ID:", id);
    
    // Also create in Mirage for current session
    const assessment = server.create("assessment", { ...assessmentData, id });
    
    console.log("✅ Created in Mirage with ID:", assessment.id);
    
    return assessment;
    
  } catch (error) {
    console.error("🚨 Error creating assessment:", error);
    return new Response(500, {}, { 
      error: "Failed to create assessment in database" 
    });
  }
  }));
  server.get("/assessments/:jobId", async (schema, request) => {
    const jobId = request.params.jobId;
    
    // 🟢 DIAGNOSTIC 3: Check if the actual route HANDLER is being hit.
    console.log("✅ HIT: Mirage Route Fired for jobId:", jobId);
    
    const numericJobId = parseInt(jobId);
    
    try {
      // Check IndexedDB first (source of truth)
      const assessment = await db.assessments
        .where('jobId')
        .equals(numericJobId)
        .first();

      if (!assessment) {
        console.log("🔍 Mirage: No IndexedDB assessment found, returning 404.");
        return new Response(404, {}, { 
          error: "Assessment not found for this job" 
        });
      }
      
      // Also ensure it's in Mirage for current session
      const mirageAssessment = schema.assessments.findBy({ jobId: numericJobId });
      if (!mirageAssessment) {
        server.create("assessment", assessment);
      }
      
      console.log("✅ Mirage: Returning assessment:", assessment.id);
      return assessment;
      
    } catch (error) {
      console.error("🚨 Mirage: Error accessing IndexedDB or database:", error);
      return new Response(500, {}, { error: "Internal server error" });
    }
  });
  server.get("/assessments", withErrorSimulation(async (schema, request) => {
  const { jobId } = request.queryParams;
  
  console.log("🔄 GET /api/assessments - Reading from IndexedDB");
  
  try {
    // Always read from IndexedDB (source of truth)
    let assessments = await db.assessments.toArray();
    
    console.log("📊 Assessments from IndexedDB:", assessments);
    
    // Also sync with Mirage in-memory store
    const mirageAssessments = schema.assessments.all().models;
    if (mirageAssessments.length === 0 && assessments.length > 0) {
      console.log("🔄 Syncing IndexedDB data to Mirage...");
      assessments.forEach(assessment => {
        schema.assessments.create(assessment);
      });
    }
    
    // Filter by jobId if provided
    if (jobId) {
      assessments = assessments.filter(a => a.jobId === parseInt(jobId));
    }
    
    return {
      assessments,
      total: assessments.length
    };
  } catch (error) {
    console.error("🚨 Error reading from IndexedDB:", error);
    return new Response(500, {}, { error: "Failed to load assessments" });
  }
  }));
  server.put("/assessments/:jobId", async (schema, request) => {
  const jobId = request.params.jobId;
  const attrs = JSON.parse(request.requestBody);
  
  console.log("🟢 UPDATE ASSESSMENT: For jobId:", jobId);
  console.log("📦 Update data:", attrs);
  
  // Find existing assessment
  const assessment = schema.assessments.findBy({ jobId: parseInt(jobId) });
  
  if (!assessment) {
    return new Response(404, {}, { 
      error: "Assessment not found for this job" 
    });
  }
  
  // Validation
  if (!attrs.title) {
    return new Response(400, {}, { 
      error: "Assessment title is required" 
    });
  }
  
  
  // Update metadata
  const updatedData = {
    ...attrs,
    updatedAt: new Date().toISOString(),
  };
  
  try {
    // Update in IndexedDB
    console.log("💾 Updating assessment in IndexedDB with ID:", assessment.id);
    await db.assessments.update(assessment.id, updatedData);
    console.log("✅ Updated IndexedDB");
    
    // Update in Mirage
    assessment.update(updatedData);
    console.log("✅ Updated Mirage");
    
    return assessment;
    
  } catch (error) {
    console.error("🚨 Error updating assessment:", error);
    return new Response(500, {}, { 
      error: "Failed to update assessment in database" 
    });
  }
  });
  server.delete("/assessments/:id", withErrorSimulation(async (schema, request) => {
  const id = request.params.id; // This is the UUID
  
  console.log("🔄 DELETE assessment with ID:", id);
  
  // Find assessment by UUID in IndexedDB
  const assessment = await db.assessments.get(id);
  
  if (!assessment) {
    console.log("❌ Assessment not found with ID:", id);
    return new Response(404, {}, { 
      error: "Assessment not found" 
    });
  }
  
  // Delete from IndexedDB using UUID
  await db.assessments.delete(id);
  console.log("✅ Deleted assessment from IndexedDB");
  
  return new Response(204); // No content
}));












}