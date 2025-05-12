import { Button } from "@/components/ui/button";
import { TConsentForm } from "@/types/consent-form";
import { TDentistProcedure } from "@/types/dentist-procedure";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { SetStateAction } from "react";

type PaginationProps = {
  startIndex: number;
  itemsPerPage: number;
  currentPage: number;
  filteredData: TConsentForm[] | TDentistProcedure[];
  totalPages: number;
  setCurrentPage: (value: SetStateAction<number>) => void;
};
export default function Pagination({
  startIndex,
  itemsPerPage,
  currentPage,
  filteredData,
  setCurrentPage,
  totalPages,
}: PaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
      <p className="text-sm text-gray-500">
        Showing {startIndex + 1} to{" "}
        {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
        {filteredData.length} entries
      </p>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(1)}
          disabled={currentPage === 1}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages || 1}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages || totalPages === 0}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
