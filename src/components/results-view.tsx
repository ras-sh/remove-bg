import { Button } from "@ras-sh/ui";
import { Download, RotateCcw } from "lucide-react";
import { ImageResult } from "~/components/image-result";

type ProcessedImage = {
  original: string;
  processed: string;
  filename: string;
  processingTime: number;
};

type ResultsViewProps = {
  processedImage: ProcessedImage;
  onDownloadImage: (
    dataUrl: string,
    filename: string,
    format?: "png" | "webp" | "jpeg"
  ) => void;
  onProcessMore: () => void;
};

export function ResultsView({
  processedImage,
  onDownloadImage,
  onProcessMore,
}: ResultsViewProps) {
  function downloadImage(format: "png" | "jpeg" | "webp") {
    window.umami?.track("image_downloaded", {
      format,
    });
    onDownloadImage(processedImage.processed, processedImage.filename, format);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-between">
        <Button
          onClick={() => {
            window.umami?.track("process_new_image_clicked");
            onProcessMore();
          }}
          variant="default"
        >
          <RotateCcw className="size-4" />
          Process New Image
        </Button>

        <div className="flex flex-wrap justify-center gap-2 md:justify-end">
          <Button onClick={() => downloadImage("png")} variant="outline">
            <Download className="size-4" />
            Download PNG
          </Button>
          <Button onClick={() => downloadImage("jpeg")} variant="outline">
            <Download className="size-4" />
            Download JPEG
          </Button>
          <Button onClick={() => downloadImage("webp")} variant="outline">
            <Download className="size-4" />
            Download WebP
          </Button>
        </div>
      </div>

      <ImageResult image={processedImage} />
    </div>
  );
}
