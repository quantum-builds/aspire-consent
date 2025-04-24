// components/ConsentList.tsx
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  Eye,
  Search,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { TConsentForm } from "@/types/consent-form";
import Link from "next/link";
import { useDeleteConsentForm } from "@/services/consent-form/ConsentFomMutation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";

interface DataTableProps {
  data: TConsentForm[] | null;
  error?: string;
  isLoading?: boolean;
}

export default function DataTable({
  data,
  error,
  isLoading = false,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const itemsPerPage = 10;
  const { mutate: deleteConsentForm, isPending } = useDeleteConsentForm();
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    deleteConsentForm(
      { id },
      {
        onSuccess: () => {
          setTimeout(() => {
            router.refresh();
          }, 100);
          toast.success("Consent form deleted successfully");
          setDeletingId(null);
        },
        onError: (error) => {
          toast.error(error.message);
          setDeletingId(null);
        },
      }
    );
  };

  // Table skeleton loader
  const TableSkeleton = () => (
    <TableBody>
      {[...Array(5)].map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-full" />
          </TableCell>
          <TableCell className="text-right">
            <Skeleton className="h-6 w-24 ml-auto" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );

  if (error) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!data && !isLoading) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-red-500">
            No consent form data available
          </p>
        </div>
      </div>
    );
  }

  const filteredData =
    data?.filter(
      (item) =>
        item.patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.procedure.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "#e100ff";
      case "pending":
        return "#7b68ee";
      case "in_progress":
        return "#f59e0b";
      case "expired":
        return "#fee2e2";
      default:
        return "#ccc";
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-5 flex flex-col gap-5">
        <div className="flex items-center justify-end mt-4 ">
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-2.5 top-4 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search by email, procedure or status..."
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
          <TableHeader className="">
            <TableRow className="text-lg">
              <TableHead>Patient Email</TableHead>
              <TableHead>Procedure Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Expiry Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <TableBody className="text-lg ">
              {paginatedData.length > 0 ? (
                paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="">{record.patient.email}</TableCell>
                    <TableCell>{record.procedure.name}</TableCell>
                    <TableCell className="flex gap-1 items-center my-auto">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: getStatusColor(record.status),
                        }}
                      ></div>
                      <span>{record.status}</span>
                    </TableCell>
                    <TableCell>{formatDate(record.expiresAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="hidden md:flex justify-end md:items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          asChild
                        >
                          <Link
                            href={`/dentist/consent-forms/view/${record.token}`}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          asChild
                        >
                          <Link
                            href={`/dentist/consent-forms/edit/${record.token}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Link>
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-50"
                          onClick={() => handleDelete(record.id)}
                          disabled={isPending && deletingId === record.id}
                        >
                          {isPending && deletingId === record.id ? (
                            <span className="animate-spin">↻</span>
                          ) : (
                            <Trash2 className="h-6 w-6" />
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
                                href={`/dentist/consent-forms/view/${record.token}`}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link
                                href={`/dentist/consent-forms/edit/${record.token}`}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(record.id)}
                              className="text-red-500 focus:text-red-500"
                              disabled={isPending && deletingId === record.id}
                            >
                              {isPending && deletingId === record.id ? (
                                <span className="flex items-center">
                                  <span className="animate-spin mr-2">↻</span>
                                  Deleting...
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
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="h-24 text-center text-red-500"
                  >
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
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
