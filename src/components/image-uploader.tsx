"use client";

import { ResultsView } from "~/components/results-view";
import { UploadZone } from "~/components/upload-zone";
import { useImageDownloader } from "~/hooks/use-image-downloader";
import { useImageProcessor } from "~/hooks/use-image-processor";

export function BackgroundRemover() {
  const { processing, processedImages, progress, processFiles, clearAll } =
    useImageProcessor();
  const { downloadImage } = useImageDownloader();

  const showResults = processedImages.length > 0;

  return (
    <div className="w-full">
      {showResults && processedImages[0] ? (
        <ResultsView
          onDownloadImage={downloadImage}
          onProcessMore={clearAll}
          processedImage={processedImages[0]}
        />
      ) : (
        <UploadZone
          onDrop={processFiles}
          processing={processing}
          progress={progress}
        />
      )}
    </div>
  );
}
