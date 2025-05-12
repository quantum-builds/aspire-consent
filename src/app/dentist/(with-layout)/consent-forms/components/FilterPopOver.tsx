import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterType } from "@/types/common";
import { formatDateTimeLocal } from "@/utils/dateFormatter";
import { format } from "date-fns";
import { Filter, X } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react";

type FilterPopOverProps = {
  filters: FilterType;
  setFilters: Dispatch<SetStateAction<FilterType>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};
export default function FilterPopOver({
  filters,
  setFilters,
  setCurrentPage,
}: FilterPopOverProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== "" && value !== null
  ).length;
  return (
    <div className="flex items-center justify-between mt-4">
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
            <Button variant="outline" className="flex items-center gap-2 h-12">
              <Filter className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-1 bg-[#698AFF] text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[480px] p-4" align="end">
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
                <label className="text-sm font-medium">Procedure Name</label>
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
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
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
                <label className="text-sm font-medium">Expiry Date Range</label>
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
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
