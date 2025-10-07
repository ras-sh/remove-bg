import { useCallback, useRef, useState } from "react";
import {
  type BackgroundRemovalOptions,
  preloadBackgroundRemoval,
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
  const modelLoaded = useRef(false);

  const processImage = useCallback(
    async (file: File): Promise<ProcessedImage> => {
      const startTime = Date.now();

      // Lazy load model on first image processing
      if (!modelLoaded.current) {
        try {
          await preloadBackgroundRemoval();
          modelLoaded.current = true;
        } catch (error) {
          console.warn("Failed to preload model:", error);
        }
      }

      const reader = new FileReader();
      const originalDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const options: BackgroundRemovalOptions = {
        progress: (progressPercent) => {
          setProgress(progressPercent);
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

      const imageFiles = files.filter((f) => f.type.startsWith("image/"));
      const file = imageFiles[0]; // Only process first image

      if (!file) {
        setProcessing(false);
        return;
      }

      try {
        const processed = await processImage(file);
        setProcessedImages([processed]); // Replace with single image
        setProgress(0);
      } catch (error) {
        console.error(`Error processing ${file.name}:`, error);
      } finally {
        setProcessing(false);
        setProgress(0);
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
    processFiles,
    clearAll,
  };
}
