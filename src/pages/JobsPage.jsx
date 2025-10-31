import  { useState, useRef, useEffect } from "react";
import { useJobs } from "../hooks/useJobs";
import JobCard from "../components/Layout/JobComponents/JobCard";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast from "react-hot-toast";
import { Outlet, useNavigate,useLocation} from "react-router-dom";
import LoadingSpinner from "../components/Layout/LoadingSpinner";
import SlideOver from "../components/Layout/SlideOver";
import { HiSearch } from "react-icons/hi";

export default function JobsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("active");
  const [page, setPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const [isTogglingId, setIsTogglingId] = useState(null);

  //  these hooks are for the slideover state
  const navigate = useNavigate();
  const location = useLocation();

  const { 
  meta={},
  loading,  
  jobs=[],
  refetch,
  error,
  setJobs,
  optimisticallyUpdateJob,
  rollbackJobUpdate } = useJobs({
  search,
  status,
  page
  });

  const jobsBackupRef = useRef([]);
  const isSlideOverOpen = location.pathname.includes('/jobs/') && location.pathname !== '/app/jobs';
  const handleCloseSlideOver = () => {
    navigate('/app/jobs');
  };


    // ✅ Full-screen loader only for initial load
    const [initialLoadDone, setInitialLoadDone] = useState(false);
    useEffect(() => {
      if (!loading) setInitialLoadDone(true);
    }, [loading]);

  


const handleToggleArchive = async (jobId) => {
  if (isTogglingId === jobId) return;
  setIsTogglingId(jobId);

  const jobToUpdate = jobs?.find(job => job.id === jobId);
  if (!jobToUpdate) {
    setIsTogglingId(null);
    return;
  }

  const isCurrentlyActive = jobToUpdate.status === "active";
  const newStatus = isCurrentlyActive ? "archived" : "active";
  const actionMessage = isCurrentlyActive ? "archived" : "unarchived";

  try {
    // Optimistic update
    optimisticallyUpdateJob(jobId, { 
      status: newStatus,
      updatedAt: new Date().toISOString()
    });

    const response = await fetch(`/api/jobs/${jobId}/archive`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const msg = body?.message || "Failed to update archive status";
      throw new Error(msg);
    }

    toast.success(`Job ${actionMessage} successfully`);
    
    // Optional: Refetch after a short delay to ensure consistency
    setTimeout(() => {
      refetch();
    }, 500);

  } catch (err) {
    console.error("Error toggling archive:", err.message);
    
    // Rollback optimistic update
    rollbackJobUpdate(jobId, jobToUpdate);
    
    if (!err.message.toLowerCase().includes("simulated")) {
      toast.error(`Failed to ${actionMessage} job`);
    }
    toast.info(`Job restored to previous state`);
  } finally {
    setIsTogglingId(null);
  }
};

// In your JSX where you render JobCards
// eslint-disable-next-line no-unused-vars
const jobCards = jobs?.map(job => (
  <JobCard
    key={job.id}
    job={job}
    toggleArchiveStatus={handleToggleArchive}
    isToggling={isTogglingId}
  />
));




    const reorder = (list, startIndex, endIndex) => {
      const result = Array.from(list);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result?.map((job, idx) => ({ ...job, order: idx }));
    };

      const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const from = result.source.index;
        const to = result.destination.index;
        if (from === to) return;

        jobsBackupRef.current = [...jobs];
        const reordered = reorder(jobs, from, to);
        setJobs(reordered);

        const movedJob = reordered[to];

        try {
          const response = await fetch(`/api/jobs/${movedJob.id}/reorder`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to }),
          });

          if (!response.ok) throw new Error("Failed to reorder");
          jobsBackupRef.current = [];
        } catch (err) {
          setJobs(jobsBackupRef.current || []);
          jobsBackupRef.current = [];
          toast.error("Reorder failed! Rolled back.");
        }
      };


    // ✅ Search typing logic — hide cards until fetch completes
    const handleSearch = (text) => {
      setIsSearching(true);
      setSearch(text);
      setPage(1);
    };

    useEffect(() => {
      const delay = setTimeout(async () => {
        await refetch();
        setIsSearching(false);
      }, 500);

      return () => clearTimeout(delay);
    }, [search, status, page , refetch]);

    // --- Loader only for first render ---
    if (!initialLoadDone && loading) {
      return <LoadingSpinner fullScreen={true} size="md" />;
    }

    // --- Error state ---
    if (error) {
      return (
        <div className="min-h-[40vh] flex flex-col items-center justify-center text-red-400 font-semibold text-lg">
          {typeof error === "string" ? error : "Failed to load jobs."}
        </div>
      );
    }

  return (
    <div className=" max-w-4xl mx-auto my-12 px-3 scrollbar-spotify scrollbar-spotify-dark">
     
      {/* --- Filters --- */}
      <div className="flex gap-4 mb-8 items-end ">
         
        {/* // search bar for jobs */}
        <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
                  <div className="relative w-full">
                    <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-spotify-light-gray" size={20} />
                    <input
                      
                      value={search}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search jobs..."
                      className="w-full bg-spotify-light-dark/40 text-white placeholder-spotify-light-gray pl-12 pr-4 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green transition-all"
                    />
                    
                  </div>
                  <button
         onClick={() => navigate('/app/jobs/new')}
         className="flex items-center space-x-2 px-6 py-2.5 bg-spotify-green text-black rounded-full hover:bg-spotify-green/90 transition font-medium text-sm shadow-md"
      >
         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
         </svg>
        <span className="font-bold">job</span>
    </button>
                </div>
        <div>
      <div className="relative">
        
  {/* Status Label */}
  <label className="block text-sm font-medium mb-2 text-spotify-light-gray ml-1">
    Status
  </label>
  
  {/* Status Select Container */}
  <div className="relative">
    {/* Filter Icon */}
    <svg 
      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-spotify-light-gray" 
      width="20" 
      height="20" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
    
    {/* Status Select */}
    <select
      value={status}
      onChange={(e) => {
        setStatus(e.target.value);
        setPage(1);
      }}
      className="w-full bg-spotify-light-dark/40 text-white pl-12 pr-10 py-2.5 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-spotify-green transition-all appearance-none cursor-pointer hover:bg-spotify-light-dark/60 border border-transparent focus:border-spotify-green/50"
    >
      
      <option value="active">Active</option>
      <option value="archived">Archived</option>
    </select>
    
    {/* Custom Dropdown Arrow */}
    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
      <svg 
        className="text-spotify-light-gray" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </div>
</div>





        </div>
      </div>

      {/* --- Card Section --- */}
      {isSearching ? (
        <div className="flex justify-center items-center min-h-[30vh]">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-spotify-light-gray text-lg">Searching...</span>
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="jobs-list">
              {(provided) => (
                <div
                  className="grid gap-6 sm:grid-cols-1"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {jobs.length === 0 && (
                    <p className="text-spotify-light-gray mt-6">No jobs found.</p>
                  )}

                  {jobs?.map((job, idx) => (
                    <Draggable key={job.id} draggableId={job.id.toString()} index={idx}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <JobCard
                            job={job}
                            toggleArchiveStatus={handleToggleArchive}
                            isToggling={isTogglingId === job.id}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* --- Pagination --- */}
          <div className="mt-10 flex justify-between">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="bg-black text-spotify-green font-bold py-2 px-6 rounded-full disabled:opacity-60"
            >
              Previous
            </button>

            <span className="text-white px-4">
              Page {meta.page || 1} of {meta.totalPages || 1}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={meta.page === meta.totalPages || jobs.length === 0}
              className="bg-black text-spotify-green font-bold py-2 px-6 rounded-full disabled:opacity-60"
            >
              Next
            </button>
          </div>

          {/* <Outlet context={{ jobs, refetch, loading }} /> */}
          <SlideOver open={isSlideOverOpen} onClose={handleCloseSlideOver}>
            <Outlet context={{ jobs, refetch, loading }} />
          </SlideOver>
        </>
      )}
    </div>
  );
}
