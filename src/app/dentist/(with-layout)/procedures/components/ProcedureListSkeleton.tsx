import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProceduresListSkeleton() {
  return (
    <div className="container mx-auto mt-15">
      {/* Title and Add Button Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center my-4 gap-4">
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-5 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search and Table Section */}
      <div className="space-y-4">
        <div className="rounded-md border p-5 flex flex-col gap-5">
          {/* Search Bar */}
          <div className="flex justify-end">
            <Skeleton className="h-12 w-full max-w-lg" />
          </div>

          {/* Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>
                  <Skeleton className="h-6 w-32" />
                </TableHead>
                <TableHead className="text-right">
                  <Skeleton className="h-6 w-24 ml-auto" />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Table Rows */}
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-6 w-3/4" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="hidden md:flex justify-end gap-2">
                      <Skeleton className="h-8 w-24" />
                      <Skeleton className="h-8 w-24" />
                    </div>
                    <div className="md:hidden flex justify-end">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-9 w-9" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
