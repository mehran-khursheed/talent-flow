// src/mirage/routes/jobRoutes.js
import { Response } from "miragejs";
import { db } from "../db/index";
import { withErrorSimulation } from "../helpers/errorSimulator";

export function jobRoutes(server) {

  
  server.get("/jobs", async (schema, request) => {
    try {
        const search = request.queryParams.search?.toLowerCase() || "";
        const status = request.queryParams.status || "";
        const page = parseInt(request.queryParams.page || "1", 10);
        const pageSize = parseInt(request.queryParams.pageSize || "10", 10);
        const sort = request.queryParams.sort || "order:asc"; // ✅ CHANGE: Default to order sorting

        let jobs = await db.jobs.toArray();

        // ✅ CRITICAL: ALWAYS sort by order first for drag-and-drop to work
        jobs.sort((a, b) => a.order - b.order);

        // Then apply other sorting if specified (and it's not the default order sort)
        if (sort && sort !== "order:asc") {
            const [sortField, sortDir] = sort.split(":");
            jobs.sort((a, b) => {
                if (a[sortField] < b[sortField]) return sortDir === "desc" ? 1 : -1;
                if (a[sortField] > b[sortField]) return sortDir === "desc" ? -1 : 1;
                return 0;
            });
        }

        // ... rest of your filtering and pagination logic
        if (search) {
            jobs = jobs.filter(
                job =>
                    job.title.toLowerCase().includes(search) ||
                    job.slug.toLowerCase().includes(search)
            );
        }

        if (status) {
            jobs = jobs.filter(job => job.status === status);
        }

        // Pagination
        const total = jobs.length;
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const paginatedJobs = jobs.slice(start, end);

        return new Response(200, { "Content-Type": "application/json" }, {
            data: paginatedJobs,
            meta: {
                total,
                page,
                pageSize,
                totalPages: Math.ceil(total / pageSize)
            }
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        return new Response(500, {}, { error: "Failed to fetch jobs." });
    }
  });
  server.post("/jobs", withErrorSimulation(async (schema, request) => {
    try {
      const attrs = JSON.parse(request.requestBody);

      if (!attrs.title) {
        return new Response(400, {}, { error: "Title is required." });
      }
      if (!attrs.slug) {
        return new Response(400, {}, { error: "Slug is required." });
      }

      const now = new Date().toISOString();
      const newJob = {
        title: attrs.title,
        slug: attrs.slug,
        status: attrs.status || "active",
        tags: attrs.tags || [],
        order: typeof attrs.order === "number" ? attrs.order : 0,
        createdAt: now,
        updatedAt: now,
      };

      const id = await db.jobs.add(newJob);
      const savedJob = await db.jobs.get(id);

      return new Response(201, { "Content-Type": "application/json" }, savedJob);

    } catch (error) {
      console.error("Error creating job:", error);
      return new Response(500, {}, { error: "Failed to create job. Please try again." });
    }
  }));

  server.patch("/jobs/:id", withErrorSimulation(async (schema, request) => {
    try {
      const jobId = request.params.id;
      const attrs = JSON.parse(request.requestBody);

      const job = await db.jobs.get(jobId);
      if (!job) {
        return new Response(404, {}, { error: "Job not found." });
      }

      if (attrs.title !== undefined && !attrs.title.trim()) {
        return new Response(400, {}, { error: "Title cannot be empty." });
      }

      const updatedJob = {
        ...job,
        ...attrs,
        updatedAt: new Date().toISOString()
      };

      await db.jobs.put(updatedJob);

      const savedJob = await db.jobs.get(jobId);
      return new Response(200, { "Content-Type": "application/json" }, savedJob);

    } catch (error) {
      console.error("Error updating job:", error);
      return new Response(500, {}, { error: "Failed to update job." });
    }
  }));
  

  server.patch("/jobs/:id/reorder", withErrorSimulation(async (schema, request) => {
    try {
        const jobId = request.params.id; 
        const { from, to } = JSON.parse(request.requestBody);
        
        console.log("Reorder request:", { jobId, from, to });
        
        const job = await db.jobs.get(jobId); 
        if (!job) {
            return new Response(404, {}, { error: "Job not found." });
        }

        let jobs = await db.jobs.toArray();

        // Sort by current order to ensure we're working with the correct sequence
        jobs.sort((a, b) => a.order - b.order);
        
        console.log("Jobs before reorder:", jobs.map(j => ({ id: j.id, order: j.order })));

        // Simulate 500 for rollback testing
        if (Math.random() < 0.3) {
            return new Response(500, {}, { error: "Simulated server error for rollback." });
        }

        // ✅ FIXED: Use array positions for reordering, not database order values
        // Remove from current position and insert at new position
        const [movedJob] = jobs.splice(from, 1);
        jobs.splice(to, 0, movedJob);
        
        // ✅ FIXED: Update ALL order values to match their new array positions
        const updatedJobs = jobs.map((job, index) => ({
            ...job,
            order: index
        }));

        console.log("Jobs after reorder:", updatedJobs.map(j => ({ id: j.id, order: j.order })));

        // ✅ FIXED: Use transaction for atomic operations and proper async handling
        await db.transaction('rw', db.jobs, async () => {
            // Clear all jobs and re-insert with new orders
            await db.jobs.clear();
            await db.jobs.bulkAdd(updatedJobs);
        });

        console.log("Database update completed successfully");

        // ✅ FIXED: Return the properly sorted jobs
        return new Response(200, { "Content-Type": "application/json" }, { 
            data: updatedJobs 
        });

    } catch (error) {
        console.error("Error reordering jobs:", error);
        return new Response(500, {}, { error: "Failed to reorder jobs." }); 
    }
  }));

  server.patch("/jobs/:id/archive", withErrorSimulation(async (schema, request) => {
  try {
    const jobId = request.params.id;
    const job = await db.jobs.get(jobId);

    if (!job) {
      return new Response(404, {}, { message: "Job not found" });
    }

    const newStatus = job.status === "active" ? "archived" : "active";

    await db.jobs.update(jobId, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });

    const updatedJob = await db.jobs.get(jobId);

    return new Response(200, { "Content-Type": "application/json" }, { 
      data: updatedJob,
      message: `Job ${newStatus === "archived" ? "archived" : "unarchived"} successfully`
    });
  } catch (error) {
    console.error("Error toggling archive status:", error);
    return new Response(500, {}, { 
      message: "Failed to update job status",
      error: error.message 
    });
  }
  }));




}
 