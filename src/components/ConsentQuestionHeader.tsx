import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, CheckCircle, Clock, User, XCircle } from "lucide-react";
import { format } from "date-fns";

type ConsentQuestionHeaderProps = {
  patienFfullName: string;
  procedureName: string;
  expiresAt: Date | string;
  isActive: boolean;
};

export default function ConsentQuestionHeader({
  patienFfullName,
  procedureName,
  expiresAt,
  isActive,
}: ConsentQuestionHeaderProps) {
  // Format the date if it's a string
  const formattedDate =
    typeof expiresAt === "string"
      ? expiresAt.split("T")[0]
      : format(expiresAt, "MMM dd, yyyy");

  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 md:py-6 px-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-gray-800 h-full">
          <User className="h-6 w-6 md:h-7 md:w-7 text-blue-600" />
          {patienFfullName || "Patient Name Unavailable"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-md font-medium text-gray-500">Procedure</p>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <p className="text-lg font-medium text-gray-800">
                {procedureName}
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-md font-medium text-gray-500">Status</p>
            <div className="flex items-center gap-2">
              {isActive ? (
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  <CheckCircle className="mr-1 h-5 w-5" />
                  Active
                </Badge>
              ) : (
                <Badge
                  variant="outline"
                  className="border-red-200 bg-red-50 text-red-700"
                >
                  <XCircle className="mr-1 h-5 w-5" />
                  Inactive
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-md font-medium text-gray-500">Expiry Date</p>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-blue-600" />
              <p className="text-lg font-medium text-gray-800">
                {formattedDate}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
