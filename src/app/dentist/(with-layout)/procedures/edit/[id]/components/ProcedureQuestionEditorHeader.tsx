"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { RichTextEditor } from "@/components/RichTextEditor";

export default function ProcedureQuestionEditorHeader() {
  return (
    <Card className="overflow-hidden border-gray-200 shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 py-4 md:py-6 px-4">
        <CardTitle className="flex items-center gap-3 text-xl md:text-2xl font-semibold text-gray-800 h-full">
          <Clock className="h-5 w-5 text-blue-600" />
          Procedure Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Procedure Name Field */}
        <FormField
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                <Clock className="h-4 w-4 text-blue-600" />
                Procedure Name
              </FormLabel>
              <FormControl>
                <Input
                  {...field}
                  className="mt-1 border-gray-300 focus-visible:ring-blue-500"
                  placeholder="Enter procedure name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Procedure Description Field */}
        <FormField
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center gap-2 font-medium text-gray-700">
                Description
              </FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Enter detailed procedure description..."
                  className="min-h-[150px]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
