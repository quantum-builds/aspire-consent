import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash, Edit2, List, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

type ConsentForm = {
  id: string;
  name: string;
};

export default function ConsentFormsList() {
  const consentForms: ConsentForm[] = [
    { id: "1", name: "Orthodontic Treatment" },
    { id: "2", name: "Root Canal" },
    { id: "3", name: "Wisdom Tooth Extractions" },
    { id: "4", name: "Root Canal" },
    { id: "5", name: "Dental Implants" },
    { id: "6", name: "Orthodontic Treatment" },
  ];

  return (
    <div className="flex w-full">
      <Card className="w-full mx-auto shadow-sm">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-2 space-y-3 sm:space-y-0">
          <CardTitle className="text-lg sm:text-xl font-medium">
            All Consent Forms
          </CardTitle>
          <div className="relative w-full sm:w-1/3">
            <Search className="absolute left-2 top-4 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8 py-6" />
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
            <tbody>
              {consentForms.map((form, index) => (
                <tr
                  key={form.id}
                  className={
                    index !== consentForms.length - 1 ? "border-b" : ""
                  }
                >
                  <td className="p-3 text-gray-500 text-base sm:text-lg">
                    {form.name}
                  </td>
                  <td className="p-3 text-right whitespace-nowrap">
                    {/* Desktop view - show all buttons */}
                    <div className="hidden md:flex space-x-2 justify-end">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Link
                          href={`/dentist/consent-questions/${form.name}`}
                          className="flex gap-2 items-center"
                        >
                          <List width={20} height={20} className="mr-1" />
                          View questions
                        </Link>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Edit2 width={20} height={20} className="mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-500 hover:text-red-500 hover:bg-red-50"
                      >
                        <Trash width={20} height={20} className="mr-1" />
                        Delete
                      </Button>
                    </div>

                    {/* Mobile view - show dropdown menu */}
                    <div className="md:hidden">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8">
                            <MoreHorizontal width={20} height={20} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem className="cursor-pointer">
                            <Link
                              href={`/dentist/consent-questions/${form.name}`}
                              className="flex gap-2 items-center"
                            >
                              <List width={16} height={16} className="mr-2" />
                              View questions
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Edit2 width={16} height={16} className="mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer text-red-500">
                            <Trash width={16} height={16} className="mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
