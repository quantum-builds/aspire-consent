"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ConsentFormMCQSnapshot } from "@/types/consent-form";
import { Check, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type VideoQuestionViewerProps = {
  data?: ConsentFormMCQSnapshot[];
  dentistEmail?: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function VideoQuestionViewer({
  data,
  dentistEmail,
  isOpen,
  setIsOpen,
}: VideoQuestionViewerProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<null | number>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [watchedVideos, setWatchedVideos] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedQuestion(0);
    }
  }, [data]);

  const handleVideoEnded = () => {
    if (data && selectedQuestion !== null) {
      setWatchedVideos((prev) => ({
        ...prev,
        [data[selectedQuestion].id]: true,
      }));
    }
  };

  const allVideosWatched = data?.every((q) => watchedVideos[q.id]) || false;

  return (
    <>
      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open && isOpen && !showConfirmation) {
            setShowConfirmation(true);
          } else {
            setIsOpen(open);
          }
        }}
      >
        <DialogContent className="max-w-[90vw] lg:max-w-[1200px] w-full h-[70vh] p-0 overflow-hidden bg-white border-0 shadow-lg rounded-xl">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl font-bold text-indigo-700">
              Video Questions
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              Watch these videos to help you understand the procedure better.
            </DialogDescription>
          </DialogHeader>
          {data && selectedQuestion !== null ? (
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Left panel - Current question and video */}
              <div className="col-span-2 p-6 flex flex-col h-full overflow-hidden">
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      Question {selectedQuestion + 1}
                    </h3>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 rounded-full hover:bg-indigo-50"
                          >
                            <Info className="h-4 w-4 text-indigo-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="bg-white border border-indigo-100 shadow-lg">
                          <p className="max-w-xs text-gray-700">
                            Watching this video will help you answer the
                            question correctly.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-gray-700 mt-1">
                    {data[selectedQuestion].questionText}
                  </p>
                </div>
                <div className="flex-grow relative min-h-0 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                  <video
                    src={data[selectedQuestion].videoUrl}
                    controls
                    className="w-full h-full object-contain bg-gray-900"
                    onEnded={handleVideoEnded}
                  >
                    Your browser does not support the video tag.
                  </video>
                  {watchedVideos[data[selectedQuestion].id] && (
                    <div className="absolute top-3 right-3 bg-indigo-600 text-white rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Watched
                    </div>
                  )}
                </div>
              </div>

              <div className="border-l border-gray-200 h-full overflow-hidden bg-gray-50">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <h3 className="font-medium mb-3 text-gray-700">
                      All Questions
                    </h3>
                    <ul className="space-y-2">
                      {data.map((question, index) => (
                        <li key={question.id}>
                          <button
                            onClick={() => setSelectedQuestion(index)}
                            className={cn(
                              "w-full text-left p-3 rounded-lg transition-colors",
                              selectedQuestion === index
                                ? "bg-indigo-100 border border-indigo-200"
                                : "bg-white border border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-gray-800">
                                Question {index + 1}
                              </div>
                              {watchedVideos[question.id] && (
                                <div className="flex items-center gap-1 text-xs font-medium text-indigo-600">
                                  <Check className="w-3 h-3" />
                                  Watched
                                </div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
                              {question.questionText}
                            </div>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollArea>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-600">
              No questions uploaded yet. Please contact at{" "}
              <span className="font-medium text-indigo-700">
                {dentistEmail ? dentistEmail : "aspire@example.com"}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[450px] bg-white rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-gray-800">
              Ready to Continue?
            </DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              {allVideosWatched
                ? "Great job! You've watched all the videos which will help you answer the questions correctly."
                : "It is recommended that you watch all the videos before proceeding to the questions. This will help you better understand the content."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 gap-3">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => setShowConfirmation(false)}
            >
              Continue Watching
            </Button>
            <Button
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => {
                setShowConfirmation(false);
                setIsOpen(false);
              }}
            >
              Proceed to Questions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
