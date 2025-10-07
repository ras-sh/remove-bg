/// <reference types="vite/client" />
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { PostHogProvider } from "posthog-js/react";
import type * as React from "react";
import { DefaultCatchBoundary } from "~/components/default-catch-boundary";
import { NotFound } from "~/components/not-found";
import { seo } from "~/lib/seo";
import appCss from "~/styles/app.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      ...seo({
        title: "remove-bg.ras.sh | AI-powered background removal",
        description:
          "✂️ AI-powered background removal that runs entirely in your browser. No uploads, no paywalls, fully client-side.",
      }),
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  errorComponent: DefaultCatchBoundary,
  notFoundComponent: () => <NotFound />,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body className="dark min-h-dvh font-sans text-foreground antialiased">
        <PostHogProvider
          apiKey={import.meta.env.VITE_POSTHOG_KEY}
          options={{
            api_host: import.meta.env.VITE_POSTHOG_HOST,
            defaults: "2025-05-24",
            capture_exceptions: true,
            debug: import.meta.env.MODE === "development",
          }}
        >
          {children}
        </PostHogProvider>
        <Scripts />
      </body>
    </html>
  );
}
