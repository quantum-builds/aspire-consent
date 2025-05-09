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
  Filter,
  Trash2,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import type { TConsentForm } from "@/types/consent-form";
import Link from "next/link";
import { useDeleteConsentForm } from "@/services/consent-form/ConsentFomMutation";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface DataTableProps {
  data: TConsentForm[] | null;
  error?: string;
  isLoading?: boolean;
}

type FilterType = {
  patientEmail: string;
  procedureName: string;
  status: string;
  createdDateStart: Date | null;
  createdDateEnd: Date | null;
  expiryDateStart: Date | null;
  expiryDateEnd: Date | null;
};

export default function DataTable({
  data,
  error,
  isLoading = false,
}: DataTableProps) {
  const [filters, setFilters] = useState<FilterType>({
    patientEmail: "",
    procedureName: "",
    status: "",
    createdDateStart: null,
    createdDateEnd: null,
    expiryDateStart: null,
    expiryDateEnd: null,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
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

  const resetFilters = () => {
    setFilters({
      patientEmail: "",
      procedureName: "",
      status: "",
      createdDateStart: null,
      createdDateEnd: null,
      expiryDateStart: null,
      expiryDateEnd: null,
    });
    setCurrentPage(1);
  };

  const handleFilterChange = (
    key: keyof FilterType,
    value: string | Date | null
  ) => {
    console.log("in filter change ", key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
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
    data?.filter((item) => {
      // Filter by patient email
      if (
        filters.patientEmail &&
        !item.patient.email
          .toLowerCase()
          .includes(filters.patientEmail.toLowerCase())
      ) {
        return false;
      }

      // Filter by procedure name
      if (
        filters.procedureName &&
        !item.procedure.name
          .toLowerCase()
          .includes(filters.procedureName.toLowerCase())
      ) {
        return false;
      }

      // Filter by status
      if (
        filters.status &&
        item.status.toLowerCase() !== filters.status.toLowerCase()
      ) {
        return false;
      }

      // Filter by created date range
      if (filters.createdDateStart && filters.createdDateEnd) {
        const createdDate = new Date(item.createdAt);
        if (
          createdDate < filters.createdDateStart ||
          createdDate > filters.createdDateEnd
        ) {
          return false;
        }
      } else if (filters.createdDateStart) {
        const createdDate = new Date(item.createdAt);
        if (createdDate < filters.createdDateStart) {
          return false;
        }
      } else if (filters.createdDateEnd) {
        const createdDate = new Date(item.createdAt);
        if (createdDate > filters.createdDateEnd) {
          return false;
        }
      }

      // Filter by expiry date range
      if (filters.expiryDateStart && filters.expiryDateEnd) {
        const expiryDate = new Date(item.expiresAt);
        if (
          expiryDate < filters.expiryDateStart ||
          expiryDate > filters.expiryDateEnd
        ) {
          return false;
        }
      } else if (filters.expiryDateStart) {
        const expiryDate = new Date(item.expiresAt);
        if (expiryDate < filters.expiryDateStart) {
          return false;
        }
      } else if (filters.expiryDateEnd) {
        const expiryDate = new Date(item.expiresAt);
        if (expiryDate > filters.expiryDateEnd) {
          return false;
        }
      }

      return true;
    }) || [];

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

  const getStatusClasses = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-blue-100 text-blue-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      case "expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "" && value !== null
  ).length;

  // Add this function to your component (outside the return statement)
  const formatDateTimeLocal = (date: Date) => {
    const d = new Date(date);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-5 flex flex-col gap-5 relative">
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center justify-end gap-2 w-full px-6">
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {filters.patientEmail && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    Email: {filters.patientEmail}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange("patientEmail", "")}
                    />
                  </div>
                )}
                {filters.procedureName && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    Procedure: {filters.procedureName}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange("procedureName", "")}
                    />
                  </div>
                )}
                {filters.status && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    Status:{" "}
                    {filters.status
                      .replace("_", " ")
                      .toLowerCase()
                      .replace(/^./, (char) => char.toUpperCase())}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => handleFilterChange("status", "")}
                    />
                  </div>
                )}
                {(filters.createdDateStart || filters.createdDateEnd) && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    Created:{" "}
                    {filters.createdDateStart
                      ? format(filters.createdDateStart, "PP")
                      : "Any"}{" "}
                    to{" "}
                    {filters.createdDateEnd
                      ? format(filters.createdDateEnd, "PP")
                      : "Any"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        handleFilterChange("createdDateStart", null);
                        handleFilterChange("createdDateEnd", null);
                      }}
                    />
                  </div>
                )}
                {(filters.expiryDateStart || filters.expiryDateEnd) && (
                  <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-lg">
                    Expires:{" "}
                    {filters.expiryDateStart
                      ? format(filters.expiryDateStart, "PP")
                      : "Any"}{" "}
                    to{" "}
                    {filters.expiryDateEnd
                      ? format(filters.expiryDateEnd, "PP")
                      : "Any"}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => {
                        handleFilterChange("expiryDateStart", null);
                        handleFilterChange("expiryDateEnd", null);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 h-12"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                  {activeFilterCount > 0 && (
                    <Badge className="ml-1 bg-primary text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[480px] p-4 absolute -right-5"
                align="start"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">Filter Consent Forms</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={resetFilters}
                      className="h-8 px-2 text-xs"
                    >
                      Reset all
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Patient Email</label>
                    <Input
                      placeholder="Filter by patient email"
                      value={filters.patientEmail}
                      onChange={(e) =>
                        handleFilterChange("patientEmail", e.target.value)
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Procedure Name
                    </label>
                    <Input
                      placeholder="Filter by procedure name"
                      value={filters.procedureName}
                      onChange={(e) =>
                        handleFilterChange("procedureName", e.target.value)
                      }
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={filters.status}
                      onValueChange={(value) =>
                        handleFilterChange("status", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ALL">All statuses</SelectItem>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="EXPIRED">Expired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Created Date Range
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        placeholder="From"
                        value={
                          filters.createdDateStart
                            ? formatDateTimeLocal(filters.createdDateStart)
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleFilterChange("createdDateStart", date);
                        }}
                        className="h-9 w-2/3"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="datetime-local"
                        placeholder="To"
                        value={
                          filters.createdDateEnd
                            ? formatDateTimeLocal(filters.createdDateEnd)
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleFilterChange("createdDateEnd", date);
                        }}
                        className="h-9 w-2/3"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Expiry Date Range
                    </label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="datetime-local"
                        placeholder="From"
                        value={
                          filters.expiryDateStart
                            ? formatDateTimeLocal(filters.expiryDateStart)
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleFilterChange("expiryDateStart", date);
                        }}
                        className="h-9"
                      />
                      <span className="text-muted-foreground">-</span>
                      <Input
                        type="datetime-local"
                        placeholder="To"
                        value={
                          filters.expiryDateEnd
                            ? formatDateTimeLocal(filters.expiryDateEnd)
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value)
                            : null;
                          handleFilterChange("expiryDateEnd", date);
                        }}
                        className="h-9"
                      />
                    </div>
                  </div>
                  <Button
                    className="w-full mt-4"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="">
              <TableRow className="text-lg">
                <TableHead>Patient Email</TableHead>
                <TableHead>Procedure Name</TableHead>
                <TableHead className="whitespace-nowrap">Status</TableHead>
                <TableHead className="whitespace-nowrap">
                  Date Created
                </TableHead>
                <TableHead className="whitespace-nowrap">Expiry Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            {isLoading ? (
              <TableSkeleton />
            ) : (
              <TableBody className="text-lg">
                {paginatedData.length > 0 ? (
                  paginatedData.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="min-w-[180px]">
                        {record.patient.email}
                      </TableCell>
                      <TableCell className="min-w-[150px]">
                        {record.procedure.name}
                      </TableCell>
                      <TableCell className="min-w-[120px]">
                        <div className="w-full">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                              record.status
                            )}`}
                          >
                            {record.status
                              .replace("_", " ")
                              .toLowerCase()
                              .replace(/^./, (char) => char.toUpperCase())}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap min-w-[120px]">
                        {formatDate(record.createdAt)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap min-w-[120px]">
                        {formatDate(record.expiresAt)}
                      </TableCell>
                      <TableCell className="text-right min-w-[120px]">
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
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>

                        <div className="md:hidden flex justify-end">
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
                      colSpan={6}
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
        )}
      </div>
    </div>
  );
}
