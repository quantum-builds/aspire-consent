"use client";

import { Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { List, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { TDentistProcedure } from "@/types/dentist-procedure";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDeleteProcedure } from "@/services/procedure/ProcedureMutation";
import ModalForm from "./AddProcedureModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type ProcedureQuestionFormListProps = {
  data: TDentistProcedure[];
  errorMessage?: string | null;
  isLoading?: boolean;
};

export default function ProcedureQuestionFormsList({
  data,
  errorMessage,
  isLoading = false,
}: ProcedureQuestionFormListProps) {
  const { mutate: deleteProcedure, isPending } = useDeleteProcedure();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    deleteProcedure(
      { id },
      {
        onSuccess: (data) => {
          console.log("data is ", data);
          setTimeout(() => {
            router.refresh();
          }, 100);
          toast.success("Procedure deleted successfully");
          setDeletingId(null);
        },
        onError: (error) => {
          toast.error(error.message);
          setDeletingId(null);
        },
      }
    );
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage, { id: "fetch-dentist-procedure-error" });
    }
  }, [errorMessage]);

  // Table skeleton loader
  const TableSkeleton = () => (
    <tbody>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className={index !== 4 ? "border-b" : ""}>
          <td className="p-3">
            <Skeleton className="h-6 w-48" />
          </td>
          <td className="p-3 text-right">
            <div className="hidden md:flex space-x-2 justify-end">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="md:hidden flex justify-end">
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  );

  return (
    <div className="flex w-full">
      <Card className="w-full mx-auto shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-3 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl font-medium">
            All Procedures
          </CardTitle>
          <div className="flex flex-row gap-3 w-1/2">
            <ModalForm />
            <div className="relative flex-1 sm:w-1/3">
              <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search" className="pl-8 py-6" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-full">
            <thead>
              <tr>
                <th className="text-left text-lg sm:text-xl p-3 font-medium">
                  Name
                </th>
                <th className="text-right p-3"></th>
              </tr>
            </thead>
            {isLoading ? (
              <TableSkeleton />
            ) : (
              <tbody>
                {data?.length > 0 ? (
                  <>
                    {data.map((form, index) => (
                      <tr
                        key={form.procedureId}
                        className={index !== data.length - 1 ? "border-b" : ""}
                      >
                        <td className="p-3 text-gray-500 text-base sm:text-lg">
                          {form.procedure.name}
                        </td>
                        <td className="p-3 text-right whitespace-nowrap">
                          {/* Desktop view - show all buttons */}
                          <div className="hidden md:flex space-x-2 justify-end">
                            <Button variant="ghost" size="sm" className="h-8">
                              <Link
                                href={`/dentist/consent-questions/${form.procedure.name}`}
                                className="flex gap-2 items-center"
                              >
                                <List width={20} height={20} className="mr-1" />
                                View questions
                              </Link>
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 text-red-500 hover:text-red-500 hover:bg-red-50"
                              onClick={() => handleDelete(form.procedureId)}
                              disabled={
                                isPending && deletingId === form.procedureId
                              }
                            >
                              {isPending && deletingId === form.procedureId ? (
                                <span className="flex items-center">
                                  <span className="animate-spin mr-2">↻</span>
                                  Deleting...
                                </span>
                              ) : (
                                <>
                                  <Trash
                                    width={20}
                                    height={20}
                                    className="mr-1"
                                  />
                                  Delete
                                </>
                              )}
                            </Button>
                          </div>

                          {/* Mobile view - show dropdown menu */}
                          <div className="md:hidden">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8"
                                >
                                  <MoreHorizontal width={20} height={20} />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem className="cursor-pointer">
                                  <Link
                                    href={`/dentist/consent-questions/${form.procedure.name}`}
                                    className="flex gap-2 items-center"
                                  >
                                    <List
                                      width={16}
                                      height={16}
                                      className="mr-2"
                                    />
                                    View questions
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-red-500"
                                  disabled={
                                    isPending && deletingId === form.procedureId
                                  }
                                  onClick={() => handleDelete(form.procedureId)}
                                >
                                  {isPending &&
                                  deletingId === form.procedureId ? (
                                    <span className="flex items-center">
                                      <span className="animate-spin mr-2">
                                        ↻
                                      </span>
                                      Deleting...
                                    </span>
                                  ) : (
                                    <>
                                      <Trash
                                        width={16}
                                        height={16}
                                        className="mr-2"
                                      />
                                      Delete
                                    </>
                                  )}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center p-4 text-red-500">
                      No Procedure found for this dentist
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
