"use client";

import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export interface Procedure {
  id: string;
  name: string;
  date: string;
  time: string;
  status: "Scheduled" | "Pending" | "Completed" | "Cancelled";
}

interface UpcomingProceduresProps {
  procedures: Procedure[];
}

export function UpcomingProcedures({ procedures }: UpcomingProceduresProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "#4a5565";
      case "Pending":
        return "#6a7282";
      case "Completed":
        return "#10b981";
      default:
        return "#dc2626";
    }
  };
  return (
    <div className="w-full">
      <h2 className="text-xl font-medium mb-4">Upcoming Procedures</h2>
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="font-medium">Procedure name</TableHead>
              <TableHead className="font-medium">Date</TableHead>
              <TableHead className="font-medium">Time</TableHead>
              <TableHead className="font-medium">Status</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procedures.map((procedure) => (
              <TableRow key={procedure.id}>
                <TableCell>{procedure.name}</TableCell>
                <TableCell>{procedure.date}</TableCell>
                <TableCell>{procedure.time}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: getStatusColor(procedure.status),
                      }}
                    ></div>
                    <span>{procedure.status}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 "
                    onClick={() => {}}
                  >
                    <Eye className="h-4 w-4 text-[#7b68ee]" />
                    <span className="text-gray-600 text-sm">View details</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
