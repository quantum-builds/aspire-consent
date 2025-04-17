"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PendingConsentProps {
  title: string;
  description: string;
  progress: number;
}

export function PendingConsent({
  title,
  description,
  progress,
}: PendingConsentProps) {
  return (
    <Card className="w-full h-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800">
          Pending Consent
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-base font-medium">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className="bg-indigo-500 h-2.5 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center">
          <div></div>
          <span className="text-sm text-gray-500">{progress}%</span>
        </div>

        <div className="flex justify-end pt-2">
          <Button className="bg-indigo-500 hover:bg-indigo-600 text-white">
            Start Consent
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
