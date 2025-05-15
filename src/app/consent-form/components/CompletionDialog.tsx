import { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface CompletionDialogProps {
  showCompletionDialog: boolean;
  setShowCompletionDialog: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<"videos" | "mcqs">>;
};

export default function CompletionDialog({
  showCompletionDialog,
  setShowCompletionDialog,
  setCurrentPage,
}: CompletionDialogProps) {
  return (
    <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
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
  );
}
