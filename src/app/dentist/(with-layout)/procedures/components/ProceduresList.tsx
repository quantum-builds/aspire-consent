"use client";

import {
  Search,
  Trash,
  List,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { TDentistProcedure } from "@/types/dentist-procedure";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDeleteProcedure } from "@/services/procedure/ProcedureMutation";
import { useRouter } from "next/navigation";

type ProcedureQuestionFormListProps = {
  data: TDentistProcedure[];
  errorMessage?: string | null;
};

export default function ProcedureQuestionFormsList({
  data,
  errorMessage,
}: ProcedureQuestionFormListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { mutate: deleteProcedure, isPending } = useDeleteProcedure();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    deleteProcedure(
      { id },
      {
        onSuccess: () => {
          router.refresh();
          toast.success("Procedure deleted successfully");
          setDeletingId(null);
        },
        onError: (error) => {
          toast.error(error.message);
          setDeletingId(null);
        },
      }
    );
  };

  console.log(errorMessage);

  const filteredData =
    data?.filter((procedure) =>
      procedure.procedure.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // // Table skeleton loader
  // const TableSkeleton = () => (
  //   <TableBody>
  //     {[...Array(5)].map((_, index) => (
  //       <TableRow key={index}>
  //         <TableCell>
  //           <Skeleton className="h-6 w-full" />
  //         </TableCell>
  //         <TableCell className="text-right">
  //           <div className="flex justify-end gap-2">
  //             <Skeleton className="h-8 w-24" />
  //             <Skeleton className="h-8 w-24" />
  //           </div>
  //         </TableCell>
  //       </TableRow>
  //     ))}
  //   </TableBody>
  // );

  if (errorMessage) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-red-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-red-500">
            No procedure data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-5 flex flex-col gap-5">
        <div className="flex justify-end">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-2.5 top-4 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search procedures..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 text-md h-12"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead>Procedure Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* {isLoading ? (
            <TableSkeleton />
          ) : ( */}
          <TableBody className="text-lg">
            {paginatedData.length > 0 ? (
              paginatedData.map((procedure) => (
                <TableRow key={procedure.procedureId}>
                  <TableCell>{procedure.procedure.name}</TableCell>
                  <TableCell className="text-right">
                    <div className="hidden md:flex justify-end md:items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8" asChild>
                        <Link
                          href={`/dentist/consent-questions/${procedure.procedure.id}`}
                        >
                          <List className="h-4 w-4 mr-2" />
                          View Questions
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-500 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(procedure.procedureId)}
                        disabled={
                          isPending && deletingId === procedure.procedureId
                        }
                      >
                        {isPending && deletingId === procedure.procedureId ? (
                          <span className="animate-spin">↻</span>
                        ) : (
                          <>
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dentist/consent-questions/${procedure.procedure.id}`}
                            >
                              <List className="h-4 w-4 mr-2" />
                              View Questions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(procedure.procedureId)}
                            className="text-red-500 focus:text-red-500"
                            disabled={
                              isPending && deletingId === procedure.procedureId
                            }
                          >
                            {isPending &&
                            deletingId === procedure.procedureId ? (
                              <span className="flex items-center">
                                <span className="animate-spin mr-2">↻</span>
                                Deleting...
                              </span>
                            ) : (
                              <>
                                <Trash className="h-4 w-4 mr-2" />
                                Delete
                              </>
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={2}
                  className="h-24 text-center text-red-500"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          {/* )} */}
        </Table>
      </div>

      {filteredData.length > 0 && (
        <div className="flex items-center justify-between">
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
      )}
    </div>
  );
}
