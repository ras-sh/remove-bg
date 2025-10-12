import {
  type Config,
  preload,
  removeBackground,
} from "@imgly/background-removal";

export type BackgroundRemovalOptions = {
  progress?: (progress: number, status: string) => void;
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

    // Stage 1: Loading model (0-70%)
    if (modelPreloaded) {
      // Model already loaded, skip to next stage
      progress?.(70, "Preparing image...");
    } else {
      console.log("Model not preloaded, preloading now...");
      progress?.(0, "Loading AI model...");

      // Show progress for model loading
      const preloadConfig: Config = {
        model: MODEL,
        debug: false,
        progress: progress
          ? (key, current, total) => {
              console.log(`Loading model - ${key}: ${current}/${total}`);
              const MODEL_LOADING_MAX = 70; // Model loading takes 0-70% of progress
              const progressPercent = Math.round(
                (current / total) * MODEL_LOADING_MAX
              );
              progress(progressPercent, "Loading AI model...");
            }
          : undefined,
      };

      await preload(preloadConfig);
      modelPreloaded = true;
    }

    const config: Config = {
      model: MODEL,
      debug: false,
      output: {
        format: "image/webp",
        quality: 1.0,
      },
    };

    console.log("Config:", config);

    // Stage 2: Preparing image (70-75%)
    console.log("Processing file directly...");
    progress?.(70, "Preparing image...");
    let result: unknown;

    try {
      // Stage 3: Analyzing image (75-95%)
      progress?.(75, "Analyzing image...");
      result = await removeBackground(file, config);
      console.log("Direct file processing result:", result);
    } catch (fileError) {
      console.warn(
        "Direct file processing failed, trying with Image element:",
        fileError
      );

      // Fallback to Image element approach
      progress?.(70, "Preparing image...");
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imageUrl;
      });

      console.log("Processing with Image element...");
      progress?.(75, "Analyzing image...");
      result = await removeBackground(img, config);
      console.log("Image element processing result:", result);

      // Clean up the object URL
      URL.revokeObjectURL(imageUrl);
    }

    if (!result) {
      throw new Error("removeBackground returned undefined");
    }

    console.log("Result type:", typeof result, result.constructor.name);

    // Stage 4: Finalizing (95-100%)
    progress?.(95, "Finalizing result...");

    // Brief delay to show the finalizing stage
    await new Promise((resolve) => setTimeout(resolve, 300));

    let finalResult: string;
    if (result instanceof Blob) {
      // Convert the Blob to a data URL
      finalResult = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(result);
      });
    } else if (result instanceof HTMLCanvasElement) {
      finalResult = (result as HTMLCanvasElement).toDataURL("image/png");
    } else if (result instanceof ImageData) {
      // Convert ImageData to canvas and then to data URL
      const canvas = document.createElement("canvas");
      const imageData = result as ImageData;
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Failed to create canvas context");
      }
      ctx.putImageData(imageData, 0, 0);
      finalResult = canvas.toDataURL("image/png");
    } else {
      console.error("Unexpected result type:", result);
      throw new Error(`Unexpected result type: ${typeof result}`);
    }

    // Brief delay at completion before showing results
    progress?.(100, "Complete!");
    await new Promise((resolve) => setTimeout(resolve, 300));

    return finalResult;
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
