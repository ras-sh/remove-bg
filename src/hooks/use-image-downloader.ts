import { useCallback } from "react";

const EXTENSION_REGEX = /\.[^/.]+$/;

export function useImageDownloader() {
  const downloadImage = useCallback(
    (
      dataUrl: string,
      filename: string,
      format: "png" | "webp" | "jpeg" = "png"
    ) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        let mimeType: string;
        let extension: string;

        if (format === "webp") {
          mimeType = "image/webp";
          extension = "webp";
        } else if (format === "jpeg") {
          mimeType = "image/jpeg";
          extension = "jpg";
        } else {
          mimeType = "image/png";
          extension = "png";
        }

        const convertedDataUrl = canvas.toDataURL(mimeType, 1.0);

        const link = document.createElement("a");
        const baseFilename = filename.replace(EXTENSION_REGEX, "");
        link.download = `no-bg-${baseFilename}.${extension}`;
        link.href = convertedDataUrl;
        link.click();
      };

      img.src = dataUrl;
    },
    []
  );

  const formatProcessingTime = useCallback((time: number) => {
    const ONE_SECOND = 1000;
    return time < ONE_SECOND
      ? `${time}ms`
      : `${(time / ONE_SECOND).toFixed(1)}s`;
  }, []);

  return {
    downloadImage,
    formatProcessingTime,
  };
}
