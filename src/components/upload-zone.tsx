"use client";

import { cn, Progress } from "@ras-sh/ui";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";

type UploadZoneProps = {
  onDrop: (files: File[]) => void;
  processing: boolean;
  progress: number;
  status: string;
};

export function UploadZone({
  onDrop,
  processing,
  progress,
  status,
}: UploadZoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const file = files[0];
      if (file) {
        window.umami?.track("image_uploaded", {
          file_type: file.type,
          file_size: file.size,
          upload_method: isDragActive ? "drag_drop" : "file_picker",
        });
      }
      onDrop(files);
    },
    accept: {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/gif": [".gif"],
      "image/webp": [".webp"],
    },
    disabled: processing,
    multiple: false,
  });

  return (
    <div className="space-y-6">
      <div
        {...getRootProps()}
        className={cn(
          "relative mx-auto cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors sm:p-24",
          isDragActive
            ? "border-zinc-100 bg-zinc-900/50"
            : "border-zinc-700 hover:border-zinc-600 hover:bg-zinc-900/30",
          processing ? "pointer-events-none opacity-50" : ""
        )}
      >
        <input {...getInputProps()} />

        <div className="space-y-6">
          <Upload className="mx-auto h-16 w-16 text-zinc-500" />
          <div>
            <h2 className="mb-2 font-bold text-2xl text-zinc-100">
              {processing
                ? "Processing image..."
                : isDragActive
                  ? "Drop image here"
                  : "Drop image here or click to select"}
            </h2>
            <p className="text-lg text-zinc-400">
              Supports JPG, PNG, GIF, and WEBP files
            </p>
            {!processing && (
              <p className="mt-3 text-sm text-zinc-500">
                This will download a 170MB AI model to your browser
              </p>
            )}
          </div>
        </div>
      </div>

      {processing && (
        <div className="mx-auto w-full max-w-md">
          <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
            <span>{status || "Processing..."}</span>
            <span className="font-mono text-zinc-400">{progress}%</span>
          </div>
          <Progress className="h-2 w-full" value={progress} />
        </div>
      )}
    </div>
  );
}
