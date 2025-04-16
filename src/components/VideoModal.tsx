"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2 } from "lucide-react";

interface VideoModalProps {
  videoUrl: string;
  thumbnailUrl: string;
}

export function VideoModal({ videoUrl, thumbnailUrl }: VideoModalProps) {
  const [loading, setLoading] = useState(true);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="p-0 w-full h-full">
          {thumbnailUrl ? (
            <Image
              src={thumbnailUrl}
              alt="Video Thumbnail"
              width={300}
              height={200}
              className="rounded-md w-full h-full object-cover"
            />
          ) : (
            <div className="rounded-md w-full h-full bg-gray-200 flex items-center justify-center">
              <Loader2 className="w-20 h-20 animate-spin text-black" />
            </div>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <div className="rounded-md w-full aspect-video overflow-hidden relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
              <Loader2 className="w-10 h-10 animate-spin text-white" />
            </div>
          )}
          <video
            controls
            className="h-full w-full p-1"
            onLoadedData={() => setLoading(false)}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </DialogContent>
    </Dialog>
  );
}
