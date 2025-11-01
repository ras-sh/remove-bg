// biome-ignore lint/style/useConsistentTypeDefinitions: window object
interface Window {
  umami?: {
    track: (eventName: string, eventData?: Record<string, unknown>) => void;
  };
}
