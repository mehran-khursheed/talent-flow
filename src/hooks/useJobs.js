import { useState, useEffect, useCallback } from "react";

export function useJobs({ 
  search = "", 
  status = "", 
  page = 1, 
  pageSize = 10, 
  sort = "order:asc"
} = {}) {
  const [jobs, setJobs] = useState([]);
  const [meta, setMeta] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetchSignal, setRefetchSignal] = useState(0);

  const refetch = useCallback(async () => {
    setRefetchSignal((s) => s + 1);
  }, []);

  // Optimistically update a job in the local state
  const optimisticallyUpdateJob = useCallback((jobId, updates) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, ...updates } : job
      )
    );
  }, []);

  // Rollback optimistic update in case of error
  const rollbackJobUpdate = useCallback((jobId, originalJob) => {
    setJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? originalJob : job
      )
    );
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const controller = new AbortController();

    async function fetchJobs() {
      try {
        const qs = new URLSearchParams({ search, status, page, pageSize, sort }).toString();
        console.log("📡 Fetching jobs with sort:", sort);
        const response = await fetch(`/api/jobs?${qs}`, { signal: controller.signal });

        if (!response.ok) throw new Error("Failed to fetch jobs");

        const data = await response.json();

        if (!cancelled) {
          console.log("✅ Jobs received with order:", data.data.map(j => ({ id: j.id, order: j.order })));
          setJobs(Array.isArray(data.data) ? data.data : []);
          setMeta(data.meta || {});
          setError(null);
        }
      } catch (err) {
        if (!cancelled && err.name !== "AbortError") {
          setJobs([]);
          setError(err.message || "Failed to load jobs");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchJobs();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [search, status, page, pageSize, sort, refetchSignal]);

  return { 
    jobs, 
    meta, 
    loading, 
    error, 
    refetch, 
    setJobs,
    optimisticallyUpdateJob,
    rollbackJobUpdate
  };
}