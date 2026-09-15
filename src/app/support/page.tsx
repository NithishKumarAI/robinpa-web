import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, GITHUB_REPO_URL } from "@/config/site";
import {
  HelpCircle,
  Cpu,
  Cloud,
  Mail,
  Folder,
  Mic,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Support & Getting Started | Robin",
  description:
    "Setup guides, troubleshooting, and support documentation for Robin V1 on Windows. Configure Ollama, Google Workspace, Gemini, and voice interaction.",
};

export default function SupportPage() {
  return (
    <LegalPage
      badge="Documentation &amp; Help"
      title="Robin Support"
      subtitle="Guides, troubleshooting, and practical instructions for running Robin on your Windows PC."
      lastUpdated="March 2026"
    >
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <a
          href="#getting-started"
          className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors flex items-start gap-3 group"
        >
          <div className="p-2 rounded bg-brand-violet/10 text-brand-violet mt-0.5">
            <HelpCircle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white group-hover:text-brand-violet transition-colors">
              Getting Started
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">System requirements and installation</p>
          </div>
        </a>

        <a
          href="#google-services"
          className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors flex items-start gap-3 group"
        >
          <div className="p-2 rounded bg-brand-indigo/10 text-brand-indigo mt-0.5">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white group-hover:text-brand-indigo transition-colors">
              Google Workspace
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">Connecting Gmail, Calendar, and Tasks</p>
          </div>
        </a>

        <a
          href="#local-ai"
          className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors flex items-start gap-3 group"
        >
          <div className="p-2 rounded bg-brand-violet/10 text-brand-violet mt-0.5">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white group-hover:text-brand-violet transition-colors">
              Local AI (Ollama)
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">Running models on your hardware</p>
          </div>
        </a>

        <a
          href="#voice"
          className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors flex items-start gap-3 group"
        >
          <div className="p-2 rounded bg-brand-magenta/10 text-brand-magenta mt-0.5">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white group-hover:text-brand-magenta transition-colors">
              Voice &amp; Audio
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">Microphone setup and wake word</p>
          </div>
        </a>
      </div>

      {/* 1. Getting Started */}
      <section id="getting-started" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-violet" />
          1. Getting Started
        </h2>
        <p>
          Robin is a desktop personal assistant engineered specifically for Windows.
        </p>
        <div className="space-y-2 text-xs text-foreground-muted">
          <h3 className="text-sm font-semibold text-white">System Requirements</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-white/90">OS:</strong> Windows 10 (64-bit) or Windows 11</li>
            <li><strong className="text-white/90">RAM:</strong> 8 GB minimum (16 GB recommended for local Ollama models)</li>
            <li><strong className="text-white/90">Disk Space:</strong> ~200 MB for Robin application; additional space if caching local voice or Ollama models</li>
            <li><strong className="text-white/90">Audio:</strong> Working microphone and speakers for voice features</li>
          </ul>
        </div>
      </section>

      {/* 2. Connecting Google Services */}
      <section id="google-services" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-indigo" />
          2. Google Workspace Setup
        </h2>
        <p>
          Robin integrates with Gmail, Google Calendar, Google Tasks, and Google Contacts to help you plan
          and coordinate your day without jumping between browser tabs.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Open Settings:</strong> In the Robin desktop app, click the Settings gear icon.
          </li>
          <li>
            <strong className="text-white/90">Select Connect Google:</strong> Click &quot;Connect Google Account&quot;. A browser window will open displaying Google&apos;s standard OAuth sign-in screen.
          </li>
          <li>
            <strong className="text-white/90">Authorize Permissions:</strong> Review the requested scopes (Gmail compose/readonly/modify, Calendar events, Tasks, and Contacts) and grant access.
          </li>
          <li>
            <strong className="text-white/90">Confirmation:</strong> The browser will confirm authentication and redirect to Robin. Tokens are saved securely to your Windows Credential Manager.
          </li>
        </ol>
        <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-foreground-muted">
          <strong className="text-white font-medium">To Disconnect:</strong> Open Robin Settings &gt; Google Status &gt; click &quot;Disconnect&quot;. This immediately removes your OAuth credentials from your device.
        </div>
      </section>

      {/* 3. Local AI with Ollama */}
      <section id="local-ai" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-violet" />
          3. Local AI (Ollama)
        </h2>
        <p>
          If you prefer your conversations and assistant reasoning to stay entirely on your device, Robin
          connects directly to Ollama.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Install Ollama:</strong> Download Ollama for Windows from{" "}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-violet hover:underline inline-flex items-center gap-0.5"
            >
              ollama.com <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>.
          </li>
          <li>
            <strong className="text-white/90">Pull a Model:</strong> Open PowerShell or Windows Terminal and run:
            <pre className="mt-1.5 p-2 rounded bg-black/50 border border-white/[0.08] font-mono text-[11px] text-white/90">
              ollama pull llama3:latest
            </pre>
          </li>
          <li>
            <strong className="text-white/90">Select in Robin:</strong> In Robin Settings &gt; Model Provider, choose &quot;Local (Ollama)&quot; and ensure the host is set to <code className="font-mono text-white/90">http://localhost:11434</code>.
          </li>
        </ol>
      </section>

      {/* 4. Cloud AI (Gemini) */}
      <section id="cloud-ai" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Cloud className="w-5 h-5 text-brand-indigo" />
          4. Cloud AI (Google Gemini)
        </h2>
        <p>
          For advanced reasoning, complex scheduling, or faster token generation on lighter laptops, you can
          connect Google Gemini.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Get an API Key:</strong> Obtain a Gemini API key from{" "}
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-violet hover:underline inline-flex items-center gap-0.5"
            >
              Google AI Studio <ExternalLink className="w-2.5 h-2.5 opacity-70" />
            </a>.
          </li>
          <li>
            <strong className="text-white/90">Enter in Robin:</strong> Navigate to Robin Settings &gt; Model Provider &gt; choose &quot;Cloud (Gemini)&quot; and paste your API key.
          </li>
          <li>
            <strong className="text-white/90">Routing:</strong> Robin uses the fast, capable <code className="font-mono text-white/90">gemini-3.1-flash-lite</code> model by default.
          </li>
        </ol>
      </section>

      {/* 5. Voice & Wake Word */}
      <section id="voice" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Mic className="w-5 h-5 text-brand-magenta" />
          5. Voice &amp; Hands-Free Interaction
        </h2>
        <p>
          Robin features an on-device streaming audio pipeline.
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Wake Word:</strong> Speak &quot;Robin&quot; clearly into your microphone to activate listening.
          </li>
          <li>
            <strong className="text-white/90">Microphone Permission:</strong> Windows may prompt you to allow Robin to access your microphone. Ensure microphone permissions are enabled in Windows Settings &gt; Privacy &amp; security &gt; Microphone.
          </li>
          <li>
            <strong className="text-white/90">Privacy:</strong> Audio frames are processed in-memory for speech recognition and are not uploaded to external servers or saved as audio files.
          </li>
        </ul>
      </section>

      {/* 6. Scoped Workspace */}
      <section id="workspace" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Folder className="w-5 h-5 text-brand-violet" />
          6. Scoped Workspace &amp; Files
        </h2>
        <p>
          Robin allows you to ask questions about your documents, summarize notes, or review drafts.
          By default, file tools are sandboxed to:
        </p>
        <pre className="p-2.5 rounded bg-black/50 border border-white/[0.08] font-mono text-xs text-white/90">
          C:\RobinWorkspace
        </pre>
        <p className="text-xs text-foreground-muted">
          Place files you want Robin to reference into this directory. Robin will not read or scan files
          outside of this folder. You can change this path in Robin Settings or by setting the{" "}
          <code className="font-mono text-white/90">ROBIN_WORKSPACE_PATH</code> environment variable.
        </p>
      </section>

      {/* 7. Action Approvals */}
      <section id="approvals" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          7. Action Approvals (Human-in-the-Loop)
        </h2>
        <p>
          Robin distinguishes between <em>reading</em> information and <em>changing</em> something.
        </p>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-foreground-muted space-y-2">
          <p className="text-white font-medium">How Approvals Work:</p>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              <strong className="text-white/90">Read Actions:</strong> Checking today&apos;s schedule, searching email headers, or reading workspace files happen seamlessly without unnecessary prompts.
            </li>
            <li>
              <strong className="text-white/90">Mutating Actions:</strong> Sending an email, scheduling a meeting, or editing tasks will pause at a visual approval card.
            </li>
            <li>
              <strong className="text-white/90">Review &amp; Confirmation:</strong> You inspect the details. Robin only executes when you click &quot;Approve&quot;. If you click &quot;Cancel&quot;, the action is discarded immediately.
            </li>
          </ul>
        </div>
      </section>

      {/* 8. Troubleshooting */}
      <section id="troubleshooting" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          8. Troubleshooting &amp; FAQs
        </h2>
        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <h3 className="font-semibold text-white">Q: Robin reports &quot;Ollama connection failed&quot;</h3>
            <p className="text-foreground-muted">
              Make sure Ollama is running in your Windows system tray or background. You can test it by opening
              your browser and visiting <code className="font-mono text-white/90">http://localhost:11434</code>. You
              should see &quot;Ollama is running&quot;.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <h3 className="font-semibold text-white">Q: Google credentials expired or needs re-authentication</h3>
            <p className="text-foreground-muted">
              Google OAuth tokens expire or refresh automatically. If re-authentication is needed, open Settings &gt;
              Google Status, click &quot;Disconnect&quot;, and re-connect to renew permissions cleanly.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <h3 className="font-semibold text-white">Q: Microphone not detecting voice wake word</h3>
            <p className="text-foreground-muted">
              Verify that your Windows Default Input Device is set to your active microphone. In Windows Settings &gt;
              System &gt; Sound &gt; Input, test your microphone input volume.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Contact & Help */}
      <section id="contact" className="space-y-3 pt-6 border-t border-white/[0.08]">
        <h2 className="text-xl font-semibold text-white tracking-tight">9. Contact &amp; Community Help</h2>
        <p>
          Robin is actively maintained and stabilized. If you encounter bugs, unexpected behavior, or need help:
        </p>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
          {SUPPORT_EMAIL ? (
            <p className="text-foreground-muted">
              Reach out to our support team at:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-violet hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          ) : (
            <div className="space-y-1.5">
              <p className="text-foreground-muted">
                Issue reports, bug inquiries, and feature suggestions can be filed directly on our public GitHub repository:
              </p>
              <a
                href={`${GITHUB_REPO_URL}/issues`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-violet hover:underline inline-flex items-center gap-1 font-mono"
              >
                {GITHUB_REPO_URL}/issues <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-foreground-subtle text-[11px] pt-1">
                Direct email support mailboxes will become available alongside the public Windows installer release.
              </p>
            </div>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
