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
        <div className="flex justify-between">
          <h2 className="text-xl xl:text-2xl font-medium text-gray-800">
            Consents
          </h2>
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
        </Tabs>
      </div>
    </div>
  );
}
