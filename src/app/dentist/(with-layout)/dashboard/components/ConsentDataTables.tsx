"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompleteTable from "./CompleteTable";
import PendingTable from "./PendingTable";
import ProgressExpiryTable from "./ProgressExpiryTable";
import { TConsentFormData } from "@/types/consent-form";

// Define types for consent form data

type ConsentDataTableProps = {
  data: TConsentFormData[];
  errorMessage?: string | null;
  isLoading?: boolean;
};

export default function ConsentDataTable({
  data,
  errorMessage,
  isLoading = false,
}: ConsentDataTableProps) {
  console.log(data);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData =
    data?.filter(
      (form) =>
        form.patientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.procedureName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // Separate data by status
  const completedForms = filteredData.filter(
    (form) => form.status === "COMPLETED"
  );
  const pendingForms = filteredData.filter((form) => form.status === "PENDING");
  const activeAndExpiredForms = filteredData.filter(
    (form) => form.status === "IN_PROGRESS" || form.status === "EXPIRED"
  );

  // Function to paginate data
  const paginateData = (dataArray: TConsentFormData[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return dataArray.slice(startIndex, startIndex + itemsPerPage);
  };

  // Calculate pagination for each tab
  const totalCompletedPages = Math.ceil(completedForms.length / itemsPerPage);
  const totalPendingPages = Math.ceil(pendingForms.length / itemsPerPage);
  const totalActiveExpiredPages = Math.ceil(
    activeAndExpiredForms.length / itemsPerPage
  );

  // Get current page data for each tab
  const currentCompletedForms = paginateData(completedForms, currentPage);
  const currentPendingForms = paginateData(pendingForms, currentPage);
  const currentActiveExpiredForms = paginateData(
    activeAndExpiredForms,
    currentPage
  );

  // Table skeleton loader

  // Reset page when tab changes
  const handleTabChange = () => {
    setCurrentPage(1);
  };

  // Error state
  if (errorMessage) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-red-500">{errorMessage}</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (!data?.length && !isLoading) {
    return (
      <div className="rounded-md border p-5">
        <div className="flex items-center justify-center h-24">
          <p className="text-center text-gray-500">
            No consent form data available
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
              placeholder="Search by patient email or procedure..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 text-md h-12"
            />
          </div>
        </div>

        <Tabs defaultValue="completed" onValueChange={handleTabChange}>
          <TabsList className="inline-flex items-center bg-[#698AFF4D] rounded-full px-2 py-6 mb-4">
            <TabsTrigger
              value="completed"
              className="rounded-full px-4 py-4 text-sm font-medium transition-colors duration-200
      data-[state=active]:bg-[#B15EFF] data-[state=active]:text-white
      data-[state=inactive]:hover:bg-gray-200 data-[state=inactive]:hover:text-[#00000080]"
            >
              Completed ({completedForms.length})
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="rounded-full px-4 py-4 text-sm font-medium transition-colors duration-200
      data-[state=active]:bg-[#B15EFF] data-[state=active]:text-white
      data-[state=inactive]:hover:bg-gray-200 data-[state=inactive]:hover:text-[#00000080]"
            >
              Pending ({pendingForms.length})
            </TabsTrigger>
            <TabsTrigger
              value="active-expired"
              className="rounded-full px-4 py-4 text-sm font-medium transition-colors duration-200
      data-[state=active]:bg-[#B15EFF] data-[state=active]:text-white
      data-[state=inactive]:hover:bg-gray-200 data-[state=inactive]:hover:text-[#00000080]"
            >
              In Progress & Expired ({activeAndExpiredForms.length})
            </TabsTrigger>
          </TabsList>

          {/* COMPLETED FORMS TABLE */}
          <CompleteTable
            currentCompletedForms={currentCompletedForms}
            completedForms={completedForms}
            totalCompletedPages={totalCompletedPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            setCurrentPage={setCurrentPage}
          />
          {/* <TabsContent value="completed">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Email</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Completed At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableSkeleton />
              ) : (
                <TableBody>
                  {currentCompletedForms.length > 0 ? (
                    currentCompletedForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell>{form.patientEmail}</TableCell>
                        <TableCell>{form.procedureName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Completed
                          </span>
                        </TableCell>
                        <TableCell>
                          {form.completedAt
                            ? format(new Date(form.completedAt), "PPP")
                            : "N/A"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="hidden md:flex justify-end md:items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <Link href={`/dentist/consent-forms/${form.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
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
                                    href={`/dentist/consent-forms/${form.id}`}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
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
                        className="h-24 text-center text-gray-500"
                      >
                        No completed forms found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
            {completedForms.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalCompletedPages}
                setCurrentPage={setCurrentPage}
                startIndex={
                  currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage
                }
                endIndex={Math.min(
                  currentPage * itemsPerPage,
                  completedForms.length
                )}
                totalItems={completedForms.length}
              />
            )}
          </TabsContent> */}

          {/* PENDING FORMS TABLE */}
          <PendingTable
            currentPendingForms={currentPendingForms}
            pendingForms={pendingForms}
            totalPendingPages={totalPendingPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            setCurrentPage={setCurrentPage}
          />
          {/* <TabsContent value="pending">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Email</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires At</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableSkeleton />
              ) : (
                <TableBody>
                  {currentPendingForms.length > 0 ? (
                    currentPendingForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell>{form.patientEmail}</TableCell>
                        <TableCell>{form.procedureName}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Pending
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(form.expiresAt), "PPP")}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="hidden md:flex justify-end md:items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <Link href={`/dentist/consent-forms/${form.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
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
                                    href={`/dentist/consent-forms/${form.id}`}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
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
                        className="h-24 text-center text-gray-500"
                      >
                        No pending forms found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
            {pendingForms.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPendingPages}
                setCurrentPage={setCurrentPage}
                startIndex={
                  currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage
                }
                endIndex={Math.min(
                  currentPage * itemsPerPage,
                  pendingForms.length
                )}
                totalItems={pendingForms.length}
              />
            )}
          </TabsContent> */}

          {/* IN PROGRESS & EXPIRED FORMS TABLE */}
          <ProgressExpiryTable
            currentActiveExpiredForms={currentActiveExpiredForms}
            activeAndExpiredForms={activeAndExpiredForms}
            totalActiveExpiredPages={totalActiveExpiredPages}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isLoading={isLoading}
            setCurrentPage={setCurrentPage}
          />
          {/* <TabsContent value="active-expired">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Email</TableHead>
                  <TableHead>Procedure</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires/Expired At</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>

              {isLoading ? (
                <TableSkeleton />
              ) : (
                <TableBody>
                  {currentActiveExpiredForms.length > 0 ? (
                    currentActiveExpiredForms.map((form) => (
                      <TableRow key={form.id}>
                        <TableCell>{form.patientEmail}</TableCell>
                        <TableCell>{form.procedureName}</TableCell>
                        <TableCell>
                          {form.status === "IN_PROGRESS" ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              In Progress
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Expired
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {format(new Date(form.expiresAt), "PPP")}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress
                              value={form.progressPercentage}
                              className="h-2"
                            />
                            <span className="text-xs text-gray-500">
                              {form.progressPercentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="hidden md:flex justify-end md:items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8"
                              asChild
                            >
                              <Link href={`/dentist/consent-forms/${form.id}`}>
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
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
                                    href={`/dentist/consent-forms/${form.id}`}
                                  >
                                    <Eye className="h-4 w-4 mr-2" />
                                    View
                                  </Link>
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
                        className="h-24 text-center text-gray-500"
                      >
                        No in-progress or expired forms found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              )}
            </Table>
            {activeAndExpiredForms.length > 0 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalActiveExpiredPages}
                setCurrentPage={setCurrentPage}
                startIndex={
                  currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage
                }
                endIndex={Math.min(
                  currentPage * itemsPerPage,
                  activeAndExpiredForms.length
                )}
                totalItems={activeAndExpiredForms.length}
              />
            )}
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  );
}
