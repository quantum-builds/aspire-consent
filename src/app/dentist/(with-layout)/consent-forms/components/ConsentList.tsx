"use client";

import type { TConsentForm } from "@/types/consent-form";
import { FilterType } from "@/types/common";
import ConsentTable from "./ConsentTable";
import FilterPopOver from "./FilterPopOver";
import Pagination from "@/app/dentist/components/Pagination";
import { useState } from "react";

interface ConsentListProps {
  data: TConsentForm[] | null;
  error?: string;
  isLoading?: boolean;
}

export default function ConsentList({
  data,
  error,
  isLoading = false,
}: ConsentListProps) {
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
  const itemsPerPage = 10;

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

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="space-y-4">
      <div className="rounded-md border p-5 flex flex-col gap-5">
        <FilterPopOver
          filters={filters}
          setFilters={setFilters}
          setCurrentPage={setCurrentPage}
        />
        <ConsentTable isLoading={isLoading} paginatedData={paginatedData} />

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
