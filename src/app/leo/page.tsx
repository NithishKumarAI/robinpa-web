import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";

const release = {
  version: "0.1.1-beta.1",
  installer: "Leo Setup 0.1.1-beta.1.exe",
  size: "544.2 MiB (57,06,78,608 bytes)",
  sha256: "768f8e9e9f8db8a13b9076359a766496b770abbafa79aa3e2054f60a87c403eb",
};

export const metadata: Metadata = {
  title: { absolute: "Leo Beta for Windows" },
  description: "Invitation-only Windows 11 x64 testing for Leo, a local AI assistant.",
  alternates: { canonical: "/leo" },
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
  openGraph: {
    title: "Leo Beta for Windows",
    description: "Invitation-only Windows 11 x64 testing for Leo.",
    url: "/leo",
  },
  twitter: {
    card: "summary",
    title: "Leo Beta for Windows",
    description: "Invitation-only Windows 11 x64 testing for Leo.",
  },
};

export default function LeoBetaPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background py-10 sm:py-16">
      <Container size="narrow" className="max-w-3xl">
        <a href="/" className="text-sm text-foreground-muted underline underline-offset-4 hover:text-white">
          Back to robinpa.in
        </a>
        <header className="mt-12 border-b border-white/10 pb-8">
          <p className="text-sm font-medium text-violet-300">Private beta / Testing</p>
          <h1 className="mt-3 text-5xl font-semibold tracking-tight text-white sm:text-6xl">Leo Beta</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-foreground-muted">
            A Windows assistant for local chat, tasks, reminders, and files. Leo runs AI inference on your PC through Ollama.
          </p>
          <a href="#beta-access" className="mt-6 inline-flex rounded-md bg-violet-400 px-4 py-2 font-semibold text-slate-950 hover:bg-violet-300">
            Beta download access
          </a>
        </header>

        <section className="mt-8 rounded-xl border border-white/10 bg-white/[0.03] p-5 sm:p-7" aria-labelledby="build-title">
          <h2 id="build-title" className="text-xl font-semibold text-white">Windows installer</h2>
          <dl className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-3 text-sm text-foreground-muted">
            <dt>Version</dt><dd className="text-white">{release.version}</dd>
            <dt>Platform</dt><dd>Windows 11 x64</dd>
            <dt>File</dt><dd>{release.installer}</dd>
            <dt>Size</dt><dd>{release.size}</dd>
            <dt>SHA-256</dt><dd><code className="break-all text-xs text-white">{release.sha256}</code></dd>
          </dl>
          <p className="mt-5 text-sm leading-relaxed text-foreground-muted">
            This installer is unsigned. Compare its SHA-256 with the value above before opening it. If Windows blocks the installer, contact the release owner and keep Windows security protections enabled.
          </p>
        </section>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-foreground-muted">
          <section aria-labelledby="setup-title">
            <h2 id="setup-title" className="mb-2 text-lg font-semibold text-white">Setup and privacy</h2>
            <p>Leo guides you through installing Ollama and selecting a local model. The Qwen 3.5 4B option is about 3.3 GB to download. Allow additional space for the installed app and optional voice assets.</p>
            <p className="mt-2">Chat runs locally after setup. Model downloads, optional Google Calendar and Tasks sync, and web research you request require internet access.</p>
          </section>
          <section aria-labelledby="changes-title">
            <h2 id="changes-title" className="mb-2 text-lg font-semibold text-white">Changes in {release.version}</h2>
            <p>The beta adds a visible build version in Settings, clarifies which features use the internet, and includes third-party notices. Independent Windows install, upgrade, startup, and notification testing is pending.</p>
          </section>
          <section id="beta-access" aria-labelledby="access-title" className="scroll-mt-6 border-t border-white/10 pt-6">
            <h2 id="access-title" className="mb-2 text-lg font-semibold text-white">Beta download access</h2>
            <p>Downloads are available by invitation. Ask the release owner through your beta testing channel for the private installer link and tester instructions.</p>
          </section>
        </div>
      </Container>
    </main>
  );
}
