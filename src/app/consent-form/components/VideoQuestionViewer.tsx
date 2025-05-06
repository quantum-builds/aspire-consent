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
  // const [isOpen, setIsOpen] = useState(defaultOpen);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedQuestion(0);
    }
  }, [data]);

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
        {/* <DialogTrigger asChild>
          <Button>Open Video Questions</Button>
        </DialogTrigger> */}
        <DialogContent className="max-w-[90vw] lg:max-w-[1200px] w-full h-[70vh] p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Video Questions</DialogTitle>
          </DialogHeader>
          {data && selectedQuestion !== null ? (
            <div className="grid grid-cols-1 md:grid-cols-3 h-full">
              {/* Left panel - Current question and video */}
              <div className="col-span-2 p-6 flex flex-col h-full overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold">
                    Question {selectedQuestion + 1}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                    {data[selectedQuestion].questionText}
                  </p>
                </div>
                <div className="flex-grow relative min-h-0">
                  <video
                    src={data[selectedQuestion].videoUrl}
                    controls
                    className="w-full h-full object-contain bg-black"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>

              <div className="border-l border-gray-200 dark:border-gray-800 h-full overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4">
                    <h3 className="font-medium mb-3">All Questions</h3>
                    <ul className="space-y-2">
                      {data.map((question, index) => (
                        <li key={question.id}>
                          <button
                            onClick={() => setSelectedQuestion(index)}
                            className={cn(
                              "w-full text-left p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                              data[selectedQuestion].id === question.id &&
                                "bg-gray-100 dark:bg-gray-800"
                            )}
                          >
                            <div className="font-medium">
                              Question {index + 1}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
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
            <div className="p-6">
              No questions uploaded yet. Please contact at{" "}
              <span className="font-medium">
                {dentistEmail ? dentistEmail : "aspire@example.com"}
              </span>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[400px] bg-white">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              It is recommended that you watch all the videos before proceeding
              to the questions. This will help you better understand the
              content.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-[#5353FF] hover:bg-[#698AFF]  text-white cursor-pointer"
              onClick={() => {
                setShowConfirmation(false);
                setIsOpen(false);
              }}
            >
              {/* <Image
                    src={LogoutIcon}
                    alt="logout-logo"
                    width={20}
                    height={20}
                  /> */}
              {/* <D size={20} /> */}
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
