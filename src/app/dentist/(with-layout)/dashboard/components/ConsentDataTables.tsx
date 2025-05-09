"use client";

import { Filter, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CompleteTable from "./CompleteTable";
import PendingTable from "./PendingTable";
import ProgressExpiryTable from "./ProgressExpiryTable";
import { TConsentFormData } from "@/types/consent-form";
import { FilterType } from "@/types/common";
import { formatDateTimeLocal } from "@/utils/dateFormatter";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [filters, setFilters] = useState<FilterType>({
    patientEmail: "",
    procedureName: "",
    createdDateStart: null,
    createdDateEnd: null,
    expiryDateStart: null,
    expiryDateEnd: null,
  });

  const resetFilters = () => {
    setFilters({
      patientEmail: "",
      procedureName: "",
      createdDateStart: null,
      createdDateEnd: null,
      expiryDateStart: null,
      expiryDateEnd: null,
    });
    setCurrentPage(1);
  };

  const filteredData =
    data?.filter((item) => {
      // Filter by patient email
      if (
        filters.patientEmail &&
        !item.patientEmail
          .toLowerCase()
          .includes(filters.patientEmail.toLowerCase())
      ) {
        return false;
      }

      if (
        filters.procedureName &&
        !item.procedureName
          .toLowerCase()
          .includes(filters.procedureName.toLowerCase())
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

  const completedForms = filteredData.filter(
    (form) => form.status === "COMPLETED"
  );
  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "" && value !== null
  ).length;

  const pendingForms = filteredData.filter((form) => form.status === "PENDING");
  const activeAndExpiredForms = filteredData.filter(
    (form) => form.status === "IN_PROGRESS" || form.status === "EXPIRED"
  );

  const paginateData = (dataArray: TConsentFormData[], page: number) => {
    const startIndex = (page - 1) * itemsPerPage;
    return dataArray.slice(startIndex, startIndex + itemsPerPage);
  };

  const handleFilterChange = (
    key: keyof FilterType,
    value: string | Date | null
  ) => {
    console.log("in filter change ", key, value);
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const totalCompletedPages = Math.ceil(completedForms.length / itemsPerPage);
  const totalPendingPages = Math.ceil(pendingForms.length / itemsPerPage);
  const totalActiveExpiredPages = Math.ceil(
    activeAndExpiredForms.length / itemsPerPage
  );

  const currentCompletedForms = paginateData(completedForms, currentPage);
  const currentPendingForms = paginateData(pendingForms, currentPage);
  const currentActiveExpiredForms = paginateData(
    activeAndExpiredForms,
    currentPage
  );

  const handleTabChange = () => {
    setCurrentPage(1);
  };

  if (errorMessage) {
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
          <div>
            <h2 className="text-xl xl:text-2xl font-medium text-gray-800">
              Consents
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              The following forms will expire within the next 7 days.
            </p>
          </div>
          <div className="flex items-center justify-end gap-2 w-full">
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
                    <Badge className="ml-1 bg-[#698AFF] text-white">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[490px] p-4" align="end">
                <div className="max-h-[70vh] overflow-y-auto p-4">
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
                      <label className="text-sm font-medium">
                        Patient Email
                      </label>
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
                      className="w-full mt-4 bg-[#698AFF]"
                      onClick={() => setIsFilterOpen(false)}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
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
              In Progress ({activeAndExpiredForms.length})
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
