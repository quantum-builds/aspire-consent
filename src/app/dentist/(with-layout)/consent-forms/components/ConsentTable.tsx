import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { formatDate } from "@/utils/dateFormatter";
import { TConsentForm } from "@/types/consent-form";
import { useDeleteConsentForm } from "@/services/consent-form/ConsentFomMutation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

type ConsentTableType = {
  isLoading: boolean;
  paginatedData: TConsentForm[];
};

export default function ConsentTable({
  isLoading,
  paginatedData,
}: ConsentTableType) {
  const { mutate: deleteConsentForm, isPending } = useDeleteConsentForm();
  const [deletingId, setDeletingId] = useState<string | null>(null);
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

  return (
    <div className="overflow-hidden">
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3 p-3">
        {isLoading ? (
          [...Array(3)].map((_, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <Skeleton className="h-5 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-3" />
              <div className="flex justify-between">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="space-y-1">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
              <div className="mt-3 flex space-x-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
              </div>
            </div>
          ))
        ) : paginatedData.length > 0 ? (
          paginatedData.map((record) => (
            <div
              key={record.id}
              className="p-4 border rounded-lg bg-white shadow-sm"
            >
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">
                    {record.patient.email}
                  </div>
                  <div className="text-sm text-gray-600 mt-1 truncate">
                    {record.procedure.name}
                  </div>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusClasses(
                    record.status
                  )}`}
                >
                  {record.status.replace("_", " ")}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-xs text-gray-500 font-medium">
                    Created
                  </div>
                  <div className="text-gray-900">
                    {formatDate(record.createdAt)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-medium">
                    Expires
                  </div>
                  <div className="text-gray-900">
                    {formatDate(record.expiresAt)}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  asChild
                >
                  <Link href={`/dentist/consent-forms/view/${record.token}`}>
                    <Eye className="h-3.5 w-3.5 mr-1.5" />
                    View
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs"
                  asChild
                >
                  <Link href={`/dentist/consent-forms/edit/${record.token}`}>
                    <Edit className="h-3.5 w-3.5 mr-1.5" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 px-3 text-xs text-red-500 hover:text-red-600"
                  onClick={() => handleDelete(record.id)}
                  disabled={isPending && deletingId === record.id}
                >
                  {isPending && deletingId === record.id ? (
                    <span className="animate-spin flex items-center">
                      <span className="mr-1.5">↻</span>
                      Deleting
                    </span>
                  ) : (
                    <>
                      <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                      Delete
                    </>
                  )}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="h-40 flex flex-col items-center justify-center text-gray-500 space-y-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm">No consent forms found</p>
          </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="min-w-[800px] lg:min-w-full">
          <TableHeader>
            <TableRow className="text-lg">
              <TableHead className="min-w-[180px]">Patient</TableHead>
              <TableHead className="min-w-[150px]">Procedure</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap hidden lg:table-cell">
                Created
              </TableHead>
              <TableHead className="whitespace-nowrap hidden md:table-cell">
                Expiry
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          {isLoading ? (
            <TableSkeleton />
          ) : (
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div>{record.patient.email}</div>
                      <div className="text-sm text-gray-500 lg:hidden">
                        Created: {formatDate(record.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>{record.procedure.name}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClasses(
                          record.status
                        )}`}
                      >
                        {record.status.replace("_", " ")}
                      </span>
                    </TableCell>
                    <TableCell className="whitespace-nowrap hidden lg:table-cell">
                      {formatDate(record.createdAt)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap hidden md:table-cell">
                      {formatDate(record.expiresAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
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
                          className="h-8 w-8"
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
    </div>
  );
}
