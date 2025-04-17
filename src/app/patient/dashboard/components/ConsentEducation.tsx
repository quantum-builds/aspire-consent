"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlayCircle } from "lucide-react";

export interface VideoItem {
  id: string;
  title: string;
  watched: boolean;
}

interface ConsentEducationProps {
  videos: VideoItem[];
}

export function ConsentEducation({ videos }: ConsentEducationProps) {
  return (
    <Card className="w-full shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium text-gray-800">
          Consent Education video
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-100">
          {videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-4 cursor-pointer hover:bg-gray-50"
            >
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <PlayCircle className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <p className="text-sm font-medium">{video.title}</p>
                {video.watched && (
                  <p className="text-xs text-gray-400">Watched</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
