import { createFileRoute } from "@tanstack/react-router";
import { BackgroundRemover } from "~/components/image-uploader";
import { Layout } from "~/components/layout";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Layout>
      <BackgroundRemover />
    </Layout>
  );
}
