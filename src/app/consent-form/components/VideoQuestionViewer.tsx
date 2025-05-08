"use client";

import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TConsentForm } from "@/types/consent-form";
import {
  Calendar,
  Check,
  ChevronLeft,
  ChevronRight,
  Info,
  Mail,
  PlayCircle,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type VideoQuestionViewerProps = {
  data: TConsentForm | null;
  setCurrentPage: Dispatch<SetStateAction<"videos" | "mcqs">>;
};

export function VideoQuestionViewer({
  data,
  setCurrentPage,
}: VideoQuestionViewerProps) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>(
    {}
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (data && data.snapshotMCQs && data.snapshotMCQs.length > 0) {
      setCurrentVideoIndex(0);
    }
  }, [data]);

  useEffect(() => {
    // Check if all videos are watched whenever watchedVideos changes
    if (data?.snapshotMCQs && Object.keys(watchedVideos).length > 0) {
      const allWatched = data.snapshotMCQs.every((q) => watchedVideos[q.id]);
      if (allWatched) {
        setShowCompletionDialog(true);
      }
    }
  }, [watchedVideos, data?.snapshotMCQs]);

  const handleVideoEnded = () => {
    if (!data || !data.snapshotMCQs) return;

    // Mark current video as watched
    setWatchedVideos((prev) => ({
      ...prev,
      [data.snapshotMCQs[currentVideoIndex].id]: true,
    }));

    // Auto-play next video if available
    if (currentVideoIndex < data.snapshotMCQs.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
      setTimeout(() => {
        videoRef.current
          ?.play()
          .catch((e) => console.error("Auto-play failed:", e));
      }, 100);
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const formatDate = (date: Date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (error) {
      console.log(error);
      return "Invalid date";
    }
  };

  const handleMoveToQuestions = () => {
    setShowConfirmDialog(true);
  };

  return (
    <div className="flex flex-col">
      <div className="container mx-auto px-4 py-2 flex justify-end">
        <Button
          variant="outline"
          onClick={handleMoveToQuestions}
          className="bg-indigo-600 hover:bg-indigo-700 text-white hover:text-white cursor-pointer"
        >
          Move to Questions
        </Button>
      </div>
      <main className="container mx-auto px-4 py-2 flex-grow flex flex-col lg:flex-row gap-6">
        {data ? (
          <>
            <div className="flex flex-col gap-6">
              <div className="lg:w-72 flex-shrink-0">
                <div className="flex flex-col gap-3 bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <div className="mb-3 sm:mb-0">
                    <h1 className="text-2xl font-bold text-indigo-700">
                      Procedure Videos
                    </h1>
                    {data && (
                      <p className="text-gray-600 text-sm">
                        Procedure:{" "}
                        <span className="font-medium">
                          {data.procedure.name}
                        </span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:items-end">
                    {data && (
                      <div className="bg-indigo-50 rounded-md px-3 py-1 text-sm text-indigo-700 flex items-center gap-1">
                        <Info className="w-4 h-4" />
                        Status:{" "}
                        <span className="font-semibold">{data.status}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="lg:w-72 flex-shrink-0">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                  <h2 className="font-semibold text-lg text-gray-800 mb-4">
                    Consent Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <User className="w-4 h-4" />
                        <span>Patient</span>
                      </div>
                      <p className="font-medium text-gray-800">
                        {data.patient.fullName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {data.patient.email}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Mail className="w-4 h-4" />
                        <span>Dentist</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {data.dentist.email}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Calendar className="w-4 h-4" />
                        <span>Expires</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatDate(data.expiresAt)}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
                        <span>Progress</span>
                        <span className="font-medium">
                          {data.progressPercentage}%
                        </span>
                      </div>
                      <Progress
                        value={data.progressPercentage}
                        className="h-2"
                      />
                    </div>

                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <PlayCircle className="w-4 h-4" />
                        <span>Videos</span>
                      </div>
                      {data.snapshotMCQs && (
                        <p className="text-sm">
                          <span className="font-medium text-indigo-600">
                            {Object.keys(watchedVideos).length}
                          </span>{" "}
                          of{" "}
                          <span className="font-medium text-gray-700">
                            {data.snapshotMCQs.length}
                          </span>{" "}
                          watched
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-grow flex flex-col">
              {data.snapshotMCQs && data.snapshotMCQs.length > 0 ? (
                <>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="font-semibold text-gray-800">
                        {data.snapshotMCQs[currentVideoIndex].questionText ||
                          "Video Explanation"}
                      </h2>
                      <div className="text-sm text-gray-500">
                        Part {currentVideoIndex + 1} of{" "}
                        {data.snapshotMCQs.length}
                      </div>
                    </div>

                    <div className="h-[60vh] relative rounded-lg border border-gray-200 shadow-sm bg-gray-900 overflow-hidden">
                      <video
                        ref={videoRef}
                        key={data.snapshotMCQs[currentVideoIndex].id}
                        src={data.snapshotMCQs[currentVideoIndex].videoUrl}
                        controls
                        className="w-full h-full object-contain"
                        onEnded={handleVideoEnded}
                        onPlay={handleVideoPlay}
                        onPause={handleVideoPause}
                        autoPlay={isPlaying}
                      >
                        Your browser does not support the video tag.
                      </video>

                      {watchedVideos[
                        data.snapshotMCQs[currentVideoIndex].id
                      ] && (
                        <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Watched
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-4">
                    <div className="flex justify-between items-center">
                      <div className="flex-1" />
                      <div className="flex items-center justify-center gap-2 flex-1">
                        {data.snapshotMCQs.map((_, index) => (
                          <div
                            key={index}
                            className={cn(
                              "w-3 h-3 rounded-full cursor-pointer",
                              index === currentVideoIndex
                                ? "bg-indigo-600"
                                : watchedVideos[data.snapshotMCQs[index].id]
                                ? "bg-green-500"
                                : "bg-gray-300"
                            )}
                            onClick={() => {
                              setCurrentVideoIndex(index);
                              if (isPlaying) {
                                setTimeout(() => videoRef.current?.play(), 100);
                              }
                            }}
                          />
                        ))}
                      </div>

                      <div className="flex-1 flex flex-row items-center gap-4 justify-end">
                        <Button
                          variant="outline"
                          disabled={currentVideoIndex === 0}
                          onClick={() => {
                            setCurrentVideoIndex((prev) =>
                              Math.max(0, prev - 1)
                            );
                            if (isPlaying) {
                              setTimeout(() => videoRef.current?.play(), 100);
                            }
                          }}
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Previous Video
                        </Button>
                        <Button
                          variant="outline"
                          disabled={
                            currentVideoIndex === data.snapshotMCQs.length - 1
                          }
                          onClick={() => {
                            setCurrentVideoIndex((prev) =>
                              Math.min(data.snapshotMCQs.length - 1, prev + 1)
                            );
                            if (isPlaying) {
                              setTimeout(() => videoRef.current?.play(), 100);
                            }
                          }}
                          className="bg-indigo-600 text-white"
                        >
                          Next Video
                          <ChevronRight className="w-4 h-4 " />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center flex-grow flex items-center justify-center">
                  <div>
                    <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-medium text-gray-700 mb-2">
                      No Videos Available
                    </h2>
                    <p className="text-gray-500 max-w-md mx-auto">
                      There are no videos available for this procedure yet.
                      Please contact your dentist at{" "}
                      <span className="font-medium text-indigo-700">
                        {data.dentist.email}
                      </span>{" "}
                      for more information.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center w-full flex items-center justify-center min-h-[50vh]">
            <div>
              <PlayCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-medium text-gray-700 mb-2">
                No Data Available
              </h2>
              <p className="text-gray-500">
                Unable to load consent form data. Please try again later.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Manual Navigation Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Navigation</DialogTitle>
            <DialogDescription>
              Are you sure you want to move to the questions section?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => setCurrentPage("mcqs")}
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Move to Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Completion Dialog - Shows when all videos are watched */}
      <Dialog
        open={showCompletionDialog}
        onOpenChange={setShowCompletionDialog}
      >
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>All Videos Watched</DialogTitle>
            <DialogDescription>
              You&apos;ve completed all the videos. Would you like to proceed to
              the questions section now?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowCompletionDialog(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setShowCompletionDialog(false);
                setCurrentPage("mcqs");
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
            >
              Move to Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
