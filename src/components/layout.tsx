import { SiGithub } from "@icons-pack/react-simple-icons";
import { Button } from "@ras-sh/ui";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center space-y-12 p-8 transition-all duration-300 sm:p-12 md:p-16 lg:p-20">
      <header className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-bold font-mono text-4xl text-zinc-100">
            remove-bg
          </h1>

          <Button asChild>
            <a
              data-umami-event="github_link_clicked"
              href="https://github.com/ras-sh/remove-bg"
              rel="noopener noreferrer"
              target="_blank"
            >
              <SiGithub className="size-4" />
              GitHub
            </a>
          </Button>
        </div>

        <p className="font-sans text-xl text-zinc-300 leading-relaxed">
          ✂️ AI-powered background removal that runs entirely in your browser. No
          uploads, no paywalls, fully client-side.
        </p>
      </header>

      <main className="w-full space-y-8">{children}</main>

      <footer className="inline-flex flex-wrap items-center justify-center gap-1 text-center text-sm text-zinc-400">
        Made with ❤️ by{" "}
        <a
          className="inline-flex flex-wrap items-center gap-1 font-medium underline decoration-zinc-600 underline-offset-2 transition-colors hover:text-zinc-100 hover:decoration-zinc-400"
          data-umami-event="footer_link_clicked"
          href="https://ras.sh"
          rel="noopener noreferrer"
          target="_blank"
        >
          <img
            alt="ras.sh logo"
            className="size-5"
            height={40}
            src="https://r2.ras.sh/icon.svg"
            width={40}
          />
          ras.sh
        </a>
      </footer>
    </div>
  );
}
