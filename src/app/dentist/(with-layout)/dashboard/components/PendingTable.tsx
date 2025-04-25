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
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Eye, MoreHorizontal } from "lucide-react";
import { PaginationControls } from "./PaginationControl";
import { format } from "date-fns";
import TableSkeleton from "./TableSkeleton";
import { TConsentFormData } from "@/types/consent-form";
import { Dispatch, SetStateAction } from "react";

type PendingTableProps = {
  currentPendingForms: TConsentFormData[];
  pendingForms: TConsentFormData[];
  totalPendingPages: number;
  currentPage: number;
  itemsPerPage: number;
  isLoading: boolean;
  setCurrentPage: Dispatch<SetStateAction<number>>;
};

export default function PendingTable({
  currentPendingForms,
  pendingForms,
  totalPendingPages,
  currentPage,
  itemsPerPage,
  isLoading,
  setCurrentPage,
}: PendingTableProps) {
  return (
    <TabsContent value="pending">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-lg font-semibold">
              Patient Email
            </TableHead>
            <TableHead className="text-lg font-semibold">Procedure</TableHead>
            <TableHead className="text-lg font-semibold">Status</TableHead>
            <TableHead className="text-lg font-semibold">Expires At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>

        {isLoading ? (
          <TableSkeleton />
        ) : (
          <TableBody>
            {currentPendingForms.length > 0 ? (
              currentPendingForms.map((form) => (
                <TableRow key={form.id}>
                  <TableCell className="text-lg">{form.patientEmail}</TableCell>
                  <TableCell className="text-lg ">
                    {form.procedureName}
                  </TableCell>
                  <TableCell className="text-lg ">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Pending
                    </span>
                  </TableCell>
                  <TableCell className="text-lg ">
                    {format(new Date(form.expiresAt), "PPP")}
                  </TableCell>
                  <TableCell className="text-left text-lg font-semibold">
                    <div className="hidden md:flex justify-start md:items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8" asChild>
                        <Link
                          href={`/dentist/consent-forms/view/${form.token}`}
                        >
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
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dentist/consent-forms/view/${form.token}`}
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
          startIndex={currentPage === 1 ? 0 : (currentPage - 1) * itemsPerPage}
          endIndex={Math.min(currentPage * itemsPerPage, pendingForms.length)}
          totalItems={pendingForms.length}
        />
      )}
    </TabsContent>
  );
}
