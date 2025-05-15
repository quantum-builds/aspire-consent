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

interface ManualNavigationDialogProps {
  showConfirmDialog: boolean;
  setShowConfirmDialog: Dispatch<SetStateAction<boolean>>;
  setCurrentPage: Dispatch<SetStateAction<"videos" | "mcqs">>;
};

export default function ManualNavigationDialog({
  showConfirmDialog,
  setShowConfirmDialog,
  setCurrentPage,
}: ManualNavigationDialogProps) {
  return (
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
  );
}
