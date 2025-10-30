import React, { useEffect, useState, useCallback } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import toast, { Toaster } from "react-hot-toast";

import CandidateModal from "../components/Layout/CandidateComponents/CandidateModel";
import CandidateCard from "../components/Layout/CandidateComponents/CandidateCard";
import { stages } from "../constants/constants"; 

export default function CandidateDetailPage() {
  const [tasks, setTasks] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);


  const mapDisplayStageToBackendStage = (displayStage) => {
    switch (displayStage.toLowerCase().trim()) {
      case "applied": return "applied";
      case "screening": return "screen";
      case "technical stage": return "tech";
      case "offer": return "offer";
      case "onboard": return "hired";
      default: return displayStage.toLowerCase().trim();
    }
  };

  const mapBackendStageToDisplayStage = (backendStage) => {
    if (!backendStage) return "";
    switch (backendStage.toLowerCase().trim()) {
      case "applied": return "applied";
      case "screen": return "screening";
      case "tech": return "technical stage";
      case "offer": return "offer"; 
      case "hired": return "onboard";
      case "rejected": return "rejected";
      default: return backendStage.toLowerCase().trim();
    }
  };

  const getTasksForStage = (stage) => {
    const targetStage = stage.toLowerCase().trim();
    return tasks.filter((task) => {
      if (!task.stage || typeof task.stage !== "string") return false;
      return task.stage.toLowerCase().trim() === targetStage;
    });
  };

  const formatStageName = (stage) => {
    const stageNames = {
      applied: "APPLIED",
      screening: "SCREENING",
      "technical stage": "TECHNICAL STAGE",
      offer: "OFFER",
      onboard: "ONBOARD",
    };
    return stageNames[stage] || stage.toUpperCase();
  };


  const fetchCandidates = useCallback(async (pageToFetch = 1) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams({ page: pageToFetch }).toString();
      const response = await fetch(`/api/candidates?${qs}`);
      if (!response.ok) throw new Error("Failed to fetch candidates");
      const { data, meta } = await response.json();

      setTasks((prevTasks) => {
        const newTasks = Array.isArray(data) ? data : data || [];

        const formattedNewTasks = newTasks.map((task) => ({
          ...task,
          stage: mapBackendStageToDisplayStage(task.stage),
        }));

        if (pageToFetch === 1) return formattedNewTasks;

        const existingIds = new Set(prevTasks.map((t) => String(t.id)));
        const uniqueNewTasks = formattedNewTasks.filter(
          (task) => !existingIds.has(String(task.id))
        );
        return [...prevTasks, ...uniqueNewTasks];
      });

      if (meta) setTotalPages(meta.totalPages);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);
      toast.error("Failed to load candidates.", { duration: 3000 });
      if (pageToFetch === 1) setTasks([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandidates(1);
  }, [fetchCandidates]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchCandidates(nextPage);
  };


  const updateCandidateStage = async (candidateId, newStageBackendName) => {
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stage: newStageBackendName }),
      });

      if (!response.ok)
        throw new Error("Failed to update candidate stage on server.");

      const responseData = await response.json();
      
      const updatedCandidate = responseData.data || responseData;
      const oldCandidate = tasks.find(
        (t) => String(t.id) === String(candidateId)
      );

      const correctlyFormattedCandidate = {
        ...oldCandidate,
        ...updatedCandidate,
        stage: mapBackendStageToDisplayStage(updatedCandidate.stage),
      };

      return correctlyFormattedCandidate;
    } catch (error) {
      console.error("Stage update API failed:", error);
      throw error;
    }
  };

  
  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    const candidateId = draggableId;

    if (!destination || source.droppableId === destination.droppableId) return;

    const sourceStage = source.droppableId;
    const destinationStage = destination.droppableId;

    const sourceIndex = stages.findIndex((s) => s === sourceStage);
    const destIndex = stages.findIndex((s) => s === destinationStage);

    if (destIndex <= sourceIndex) {
      toast.error("Movement is restricted to the next stages only (left-to-right).", { duration: 3000 });
      return;
    }

    const newStageBackendName = mapDisplayStageToBackendStage(destinationStage);
    const candidateToMove = tasks.find((t) => String(t.id) === candidateId);

    if (!candidateToMove) return;

    const originalTask = { ...candidateToMove };

    toast((t) => (
      <div className="flex flex-col space-y-2">
        <p className="font-semibold text-white">Confirm Stage Change</p>
        <p className="text-sm text-white/80">
          Move <b>{candidateToMove.name || `ID ${candidateId}`}</b> to{" "}
          <b>{formatStageName(destinationStage)}</b>?
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              
              setIsUpdating(true);

              try {
                const finalCandidate = await updateCandidateStage(
                  candidateId,
                  newStageBackendName
                );

                if (finalCandidate) {
                  // Refresh all candidates from the API to ensure sync
                  for (let page = 1; page <= currentPage; page++) {
                    await fetchCandidates(page);
                  }
                  
                  toast.success(
                    `Candidate ${finalCandidate.name || `ID ${candidateId}`} moved to ${formatStageName(finalCandidate.stage)}`,
                    { duration: 2000 }
                  );
                } else {
                  setTasks((prevTasks) => [...prevTasks, originalTask]);
                  toast.error("Failed to update candidate stage.", { duration: 3000 });
                }
              } catch (error) {
                setTasks((prevTasks) => [...prevTasks, originalTask]);
                toast.error("An error occurred while updating the candidate.", { duration: 3000 });
              } finally {
                setIsUpdating(false);
              }
            }}
            className="px-3 py-1 bg-spotify-green text-black rounded-full hover:bg-spotify-green/90 text-xs font-medium transition-all duration-200"
            disabled={isUpdating}
          >
            {isUpdating ? "Moving..." : "Confirm"}
          </button>
          <button
            onClick={() => {
              setTasks((prevTasks) => [...prevTasks, originalTask]);
              toast.dismiss(t.id);
            }}
            className="px-3 py-1 bg-white/10 border border-white/20 text-white/70 rounded-full hover:bg-white/20 text-xs font-medium transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
      id: `confirm-${candidateId}`,
      className: "bg-gradient-to-br from-[#131b20] to-[#191c1f] border border-white/10 text-white shadow-2xl rounded-xl",
    });
  };



  const showLoadMore = currentPage < totalPages && !loading;

  return (
    <section className="p-8   min-h-screen text-white scrollbar-spotify scrollbar-spotify-dark">
      <Toaster position="top-right" reverseOrder={false} />

     

      {isUpdating && (
        <div className="text-center p-3 bg-yellow-500/20 border border-yellow-500/40 text-yellow-300 rounded-xl mb-4 text-sm font-medium">
          Updating candidate stage... Please wait.
        </div>
      )}

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-5 gap-6">
          {stages.map((stage) => {
            const stageTasks = getTasksForStage(stage);
            return (
              <Droppable droppableId={stage} key={stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`p-4 rounded-2xl shadow-lg  transition-all duration-200 border ${
                      snapshot.isDraggingOver
                        ? "ring-2 ring-spotify-green/50 bg-spotify-green/10"
                        : ""
                    }`}
                  >
                    <h3 className="font-bold mb-4 text-center text-sm uppercase tracking-wider text-spotify-green">
                      {formatStageName(stage)}
                      
                      
                    </h3>
                    <div className="space-y-3 min-h-[65vh] ">
                      {stageTasks.map((task, index) => (
                        <Draggable
                          draggableId={String(task.id)}
                          index={index}
                          key={String(task.id)}
                          isDragDisabled={isUpdating || loading}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`${
                                snapshot.isDragging
                                  ? "shadow-2xl ring-2 ring-spotify-green/80 transform rotate-2"
                                  : ""
                              } transition-all duration-200 ${
                                isUpdating
                                  ? "opacity-70 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              <CandidateCard
                                name={task.name}
                                email={task.email}
                                appliedAt={task.appliedAt}
                                jobId={task.jobId}
                                onClick={() => setSelectedCandidate(task)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {showLoadMore && (
        <div className="flex justify-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={loading || isUpdating}
            className={`px-6 py-2 rounded-full font-medium text-sm transition-all duration-200 ${
              loading || isUpdating
                ? "bg-white/10 border border-white/20 text-white/40 cursor-not-allowed"
                : "bg-spotify-green text-black hover:bg-spotify-green/90 hover:shadow-2xl shadow-lg"
            }`}
          >
            {loading ? "Loading More..." : "Load More Candidates"}
          </button>
        </div>
      )}

      {selectedCandidate && (
        <CandidateModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </section>
  );
}