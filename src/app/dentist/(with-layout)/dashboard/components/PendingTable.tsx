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
import { Edit, Eye, MoreHorizontal, Trash2 } from "lucide-react";
import { PaginationControls } from "./PaginationControl";
import { format } from "date-fns";
import TableSkeleton from "./TableSkeleton";
import { TConsentFormData } from "@/types/consent-form";
import { Dispatch, SetStateAction, useState } from "react";
import { useRouter } from "next/navigation";
import { useDeleteConsentForm } from "@/services/consent-form/ConsentFomMutation";
import toast from "react-hot-toast";

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
  const [deletingId, setDeletingId] = useState<string | null>(null);
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
                  {/* <TableCell className="text-left text-lg font-semibold">
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
                  </TableCell> */}
                  <TableCell className="text-right">
                    <div className="hidden md:flex justify-start md:items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-gray-100"
                        asChild
                      >
                        <Link
                          href={`/dentist/consent-forms/view/${form.token}`}
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
                          href={`/dentist/consent-forms/edit/${form.token}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-500 hover:bg-red-50"
                        onClick={() => handleDelete(form.id)}
                        disabled={isPending && deletingId === form.id}
                      >
                        {isPending && deletingId === form.id ? (
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
                        <DropdownMenuContent align="start">
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dentist/consent-forms/view/${form.token}`}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/dentist/consent-forms/edit/${form.token}`}
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(form.id)}
                            className="text-red-500 focus:text-red-500"
                            disabled={isPending && deletingId === form.id}
                          >
                            {isPending && deletingId === form.id ? (
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
