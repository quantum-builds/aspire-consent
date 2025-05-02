import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function ConsentListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-5 flex flex-col gap-5">
        {/* Search Bar */}
        <div className="flex justify-end">
          <div className="relative w-full max-w-lg">
            <Skeleton className="h-12 w-full" />
          </div>
        </div>

        {/* Table */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Skeleton className="h-6 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-32" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-24" />
              </TableHead>
              <TableHead>
                <Skeleton className="h-6 w-32" />
              </TableHead>
              <TableHead className="text-right">
                <Skeleton className="h-6 w-24 ml-auto" />
              </TableHead>
            </TableRow>
          </TableHeader>
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
                  <Skeleton className="h-6 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-6 w-24" />
                </TableCell>
                <TableCell className="text-right">
                  <div className="hidden md:flex justify-end gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                  <div className="md:hidden flex justify-end">
                    <Skeleton className="h-8 w-8 rounded-full" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Skeleton className="h-5 w-48" />
          <div className="flex items-center space-x-2">
            {[...Array(5)].map((_, index) => (
              <Skeleton key={index} className="h-9 w-9 rounded-md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
