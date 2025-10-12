import {
  type Config,
  preload,
  removeBackground,
} from "@imgly/background-removal";

export type BackgroundRemovalOptions = {
  progress?: (progress: number) => void;
};

const MODEL = "isnet";

let modelPreloaded = false;

export async function processImageWithBackgroundRemoval(
  file: File,
  options: BackgroundRemovalOptions = {}
): Promise<string> {
  try {
    const { progress } = options;

    console.log(`Processing image with model: ${MODEL}`);

    const config: Config = {
      model: MODEL,
      debug: false,
      output: {
        format: "image/webp",
        quality: 1.0,
      },
    };

    // Add progress callback if provided
    if (progress) {
      config.progress = (key, current, total) => {
        console.log(`Download progress - ${key}: ${current}/${total}`);
        const PERCENTAGE_MULTIPLIER = 100;
        const progressPercent = Math.round(
          (current / total) * PERCENTAGE_MULTIPLIER
        );
        progress(progressPercent);
      };
    }

    console.log("Config:", config);

    // Try using the File directly first, as the library supports it
    console.log("Processing file directly...");
    let result: unknown;

    try {
      result = await removeBackground(file, config);
      console.log("Direct file processing result:", result);
    } catch (fileError) {
      console.warn(
        "Direct file processing failed, trying with Image element:",
        fileError
      );

      // Fallback to Image element approach
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      console.log("Processing with Image element...");
      result = await removeBackground(img, config);
      console.log("Image element processing result:", result);

      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);
    }

    if (!result) {
      throw new Error("removeBackground returned undefined");
    }

    console.log("Result type:", typeof result, result.constructor.name);

    // Handle different result types
    if (result instanceof Blob) {
      // Convert the Blob to a data URL
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(result);
      });
    }
    if (result instanceof HTMLCanvasElement) {
      return (result as HTMLCanvasElement).toDataURL("image/png");
    }
    if (result instanceof ImageData) {
      // Convert ImageData to canvas and then to data URL
      const canvas = document.createElement("canvas");
      const imageData = result as ImageData;
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.putImageData(imageData, 0, 0);
        return canvas.toDataURL("image/png");
      }
      throw new Error("Failed to create canvas context");
    }
    console.error("Unexpected result type:", result);
    throw new Error(`Unexpected result type: ${typeof result}`);
  } catch (error) {
    console.error("Background removal failed:", error);
    throw new Error(
      `Failed to remove background: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function preloadBackgroundRemoval() {
  try {
    if (modelPreloaded) {
      return;
    }

    const config: Config = {
      model: MODEL,
      debug: false,
    };

    await preload(config);
    modelPreloaded = true;
  } catch (error) {
    console.warn(`Failed to preload ${MODEL} model:`, error);
    throw error;
  }
}
