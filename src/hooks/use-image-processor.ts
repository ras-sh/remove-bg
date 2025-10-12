import { useCallback, useState } from "react";
import {
  type BackgroundRemovalOptions,
  processImageWithBackgroundRemoval,
} from "~/lib/background-removal";

type ProcessedImage = {
  original: string;
  processed: string;
  filename: string;
  processingTime: number;
};

export function useImageProcessor() {
  const [processing, setProcessing] = useState(false);
  const [processedImages, setProcessedImages] = useState<ProcessedImage[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<string>("");

  const processImage = useCallback(
    async (file: File): Promise<ProcessedImage> => {
      const startTime = Date.now();

      const reader = new FileReader();
      const originalDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const options: BackgroundRemovalOptions = {
        progress: (progressPercent, statusMessage) => {
          setProgress(progressPercent);
          setStatus(statusMessage);
        },
      };

      const processedDataUrl = await processImageWithBackgroundRemoval(
        file,
        options
      );
      const processingTime = Date.now() - startTime;

      return {
        original: originalDataUrl,
        processed: processedDataUrl,
        filename: file.name,
        processingTime,
      };
    },
    []
  );

  const processFiles = useCallback(
    async (files: File[]) => {
      setProcessing(true);
      setProgress(0);
      setStatus("");

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      const file = imageFiles[0]; // Only process first image

      if (!file) {
        setProcessing(false);
        return;
      }

      try {
        const processed = await processImage(file);

        // Brief delay to show completion state before showing results
        await new Promise((resolve) => setTimeout(resolve, 500));

        setProcessedImages([processed]); // Replace with single image
        setProgress(0);
        setStatus("");
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      } finally {
        setProcessing(false);
        setProgress(0);
        setStatus("");
      }
    },
    [processImage]
  );

  const clearAll = useCallback(() => {
    setProcessedImages([]);
  }, []);

  return {
    processing,
    processedImages,
    progress,
    status,
    processFiles,
    clearAll,
  };
}
