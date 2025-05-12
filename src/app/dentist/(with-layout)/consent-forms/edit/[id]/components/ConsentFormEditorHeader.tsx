import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar, CheckCircle, Clock, User } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ConsentFormEditorHeader() {
  const formatDateForInput = (date: Date) => {
    if (!(date instanceof Date) || isNaN(date.getTime())) return "";

    const pad = (num: number) => num.toString().padStart(2, "0");
    const localDate = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    );

    return `${localDate.getFullYear()}-${pad(localDate.getMonth() + 1)}-${pad(
      localDate.getDate()
    )}T${pad(localDate.getHours())}:${pad(localDate.getMinutes())}`;
  };

  const getCurrentLocalDatetime = () => {
    const now = new Date();
    const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return localNow.toISOString().slice(0, 16);
  };

  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 md:py-6 px-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-gray-800 h-full">
          <Clock className="h-5 w-5 text-blue-600" />
          Consent Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Patient Name Field */}
          <FormField
            name="patient.fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                  <User className="h-4 w-4 text-blue-600" />
                  Patient Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    className="mt-1 border-gray-300 bg-gray-50 focus-visible:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Procedure Name Field */}
          <FormField
            name="procedure.name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Procedure Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={true}
                    className="mt-1 border-gray-300 bg-gray-50 focus-visible:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Expiration Date Field */}
        <FormField
          name="expiresAt"
          render={({ field }) => {
            const value =
              field.value instanceof Date
                ? formatDateForInput(field.value)
                : "";

            return (
              <FormItem>
                <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  Expiration Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    value={value}
                    min={getCurrentLocalDatetime()}
                    onChange={(e) => {
                      const newValue = e.target.value;
                      if (!newValue) {
                        field.onChange(null);
                        return;
                      }

                      // Convert to Date object in local timezone
                      const localDate = new Date(newValue);
                      const offset = localDate.getTimezoneOffset() * 60000;
                      const adjustedDate = new Date(
                        localDate.getTime() + offset
                      );

                      field.onChange(adjustedDate);
                    }}
                    className="mt-1 border-gray-300 focus-visible:ring-blue-500"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Active Status Field */}
        <FormField
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border border-gray-100 bg-gray-50 p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="data-[state=checked]:bg-blue-600 data-[state=checked]:text-white"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  Active Form
                </FormLabel>
                <p className="text-sm text-gray-500">
                  Enable this to make the procedure active
                </p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
