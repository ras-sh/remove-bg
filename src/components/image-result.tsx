import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import ReactCompareImage from "react-compare-image";

type ProcessedImage = {
  original: string;
  processed: string;
  filename: string;
  processingTime: number;
};

type ImageResultProps = {
  image: ProcessedImage;
};

export function ImageResult({ image }: ImageResultProps) {
  const hasTrackedInteraction = useRef(false);

  useEffect(() => {
    posthog.capture("image_result_viewed", {
      project: "remove-bg",
      processing_time: image.processingTime,
    });
  }, [image.processingTime]);

  const handleSliderInteraction = () => {
    if (!hasTrackedInteraction.current) {
      posthog.capture("comparison_slider_used", {
        project: "remove-bg",
      });
      hasTrackedInteraction.current = true;
    }
  };

  return (
    <div className="space-y-3">
      <div
        className="relative overflow-hidden rounded-lg border border-zinc-800 bg-[conic-gradient(#e5e5e5_90deg,#ffffff_90deg_180deg,#e5e5e5_180deg_270deg,#ffffff_270deg)] bg-[length:20px_20px]"
        onMouseDown={handleSliderInteraction}
        onTouchStart={handleSliderInteraction}
      >
        <ReactCompareImage
          handleSize={40}
          leftImage={image.original}
          leftImageLabel="Original"
          rightImage={image.processed}
          rightImageLabel="Background Removed"
          sliderLineColor="#ffffff"
          sliderLineWidth={2}
        />
      </div>
      <p className="text-center text-sm text-zinc-500">
        Drag the slider to compare
      </p>
    </div>
  );
}
