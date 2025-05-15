"use client";

import { Search, Trash2, Eye, Edit } from "lucide-react";
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
import Pagination from "@/app/dentist/components/Pagination";
import { Skeleton } from "@/components/ui/skeleton";

interface ProcedureQuestionFormListProps {
  data: TDentistProcedure[];
  errorMessage?: string | null;
  isLoading?: boolean;
}

export default function ProcedureQuestionFormsList({
  data,
  errorMessage,
  isLoading = false,
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

  const filteredData =
    data?.filter((procedure) =>
      procedure.procedure.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  if (errorMessage) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-red-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <Skeleton className="h-5 w-3/4 mb-3" />
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-20 rounded-md" />
                  <Skeleton className="h-8 w-20 rounded-md" />
                </div>
              </div>
            ))
          ) : paginatedData.length > 0 ? (
            paginatedData.map((procedure) => (
              <div
                key={procedure.procedureId}
                className="p-4 border rounded-lg bg-white shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div className=" text-gray-900 truncate">
                    {procedure.procedure.name}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dentist/procedures/view/${procedure.procedure.id}`}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/dentist/procedures/edit/${procedure.procedure.id}`}
                          className="flex items-center"
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDelete(procedure.procedureId)}
                        className="text-red-500 focus:text-red-500"
                        disabled={
                          isPending && deletingId === procedure.procedureId
                        }
                      >
                        {isPending && deletingId === procedure.procedureId ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2">↻</span>
                            Deleting
                          </span>
                        ) : (
                          <>
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </>
                        )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-gray-500 space-y-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm">No procedures found</p>
            </div>
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow className="text-lg">
                <TableHead>Procedure Name</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Skeleton className="h-8 w-28" />
                        <Skeleton className="h-8 w-20" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((procedure) => (
                  <TableRow key={procedure.procedureId}>
                    <TableCell className="text-lg ">
                      {procedure.procedure.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2" >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-50"
                          asChild
                        >
                          <Link
                            href={`/dentist/procedures/view/${procedure.procedure.id}`}
                            className="flex items-center"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-50"
                          asChild
                        >
                          <Link
                            href={`/dentist/procedures/edit/${procedure.procedure.id}`}
                            className="flex items-center"
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => handleDelete(procedure.procedureId)}
                          disabled={
                            isPending && deletingId === procedure.procedureId
                          }
                        >
                          {isPending && deletingId === procedure.procedureId ? (
                            <span className="animate-spin flex items-center">
                              <span className="">↻</span>
                            </span>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="h-24 text-center text-gray-500"
                  >
                    No procedures found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {filteredData.length > 0 && (
          <Pagination
            startIndex={startIndex}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            filteredData={filteredData}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
}
