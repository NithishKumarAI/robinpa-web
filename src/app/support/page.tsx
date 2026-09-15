import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, LAST_UPDATED } from "@/config/site";
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
  title: "Support & Getting Started",
  description:
    "Setup guides, troubleshooting, and support documentation for Robin V1 on Windows. Configure Ollama, Google Workspace, Gemini, and voice interaction.",
  alternates: {
    canonical: "/support",
  },
};

export default function SupportPage() {
  return (
    <LegalPage
      badge="Documentation &amp; Help"
      title="Robin Support"
      subtitle="Practical guides, setup steps, and troubleshooting for running Robin on your Windows PC."
      lastUpdated={LAST_UPDATED}
    >
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
        <a
          href="#getting-started"
          className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors flex items-start gap-3 group"
        >
          <div className="p-2 rounded bg-brand-violet/10 text-brand-violet mt-0.5">
            <HelpCircle className="w-4 h-4" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white group-hover:text-brand-violet transition-colors">
              Getting Started
            </h3>
            <p className="text-xs text-foreground-muted mt-0.5">Platform notes and initial setup</p>
          </div>
        </a>

        <a
          href="#google-services"
          className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-colors flex items-start gap-3 group"
        >
          <div className="p-2 rounded bg-brand-indigo/10 text-brand-indigo mt-0.5">
            <Mail className="w-4 h-4" aria-hidden="true" />
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
            <Cpu className="w-4 h-4" aria-hidden="true" />
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
            <Mic className="w-4 h-4" aria-hidden="true" />
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
          <HelpCircle className="w-5 h-5 text-brand-violet" aria-hidden="true" />
          1. Getting Started
        </h2>
        <p>
          Robin is a desktop application designed specifically for the Windows environment.
        </p>
        <div className="space-y-2 text-xs text-foreground-muted">
          <h3 className="text-sm font-semibold text-white">Platform &amp; Prerequisites</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong className="text-white/90">Operating System:</strong> Windows.</li>
            <li><strong className="text-white/90">Audio Input:</strong> A working microphone and speaker output if you wish to use voice interaction.</li>
            <li><strong className="text-white/90">Internet Access:</strong> Local Ollama model inference itself can run without internet access. Features that use Google services, cloud models, or other online services still require a network connection.</li>
          </ul>
        </div>
      </section>

      {/* 2. Connecting Google Services */}
      <section id="google-services" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-indigo" aria-hidden="true" />
          2. Google Workspace Setup
        </h2>
        <p>
          Robin connects to Gmail, Google Calendar, Google Tasks, and Google Contacts through standard OAuth authorization.
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Open Settings:</strong> In the Robin application, navigate to the Settings panel.
          </li>
          <li>
            <strong className="text-white/90">Connect Google Account:</strong> Click &quot;Connect Google Account&quot; to open the sign-in page in your default web browser.
          </li>
          <li>
            <strong className="text-white/90">Authorize Access:</strong> Review the requested scopes (Gmail drafts and messages, Calendar events, Tasks, and Contacts) and click Allow.
          </li>
          <li>
            <strong className="text-white/90">Secure Storage:</strong> Robin receives OAuth tokens and stores them in your Windows Credential Manager under the service name <code className="font-mono text-white/90">Robin</code>.
          </li>
        </ol>
        <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-foreground-muted">
          <strong className="text-white font-medium">To Disconnect:</strong> In Robin Settings under Google Status, click &quot;Disconnect&quot; to remove your stored credentials immediately.
        </div>
      </section>

      {/* 3. Local AI with Ollama */}
      <section id="local-ai" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Cpu className="w-5 h-5 text-brand-violet" aria-hidden="true" />
          3. Local AI (Ollama)
        </h2>
        <p>
          If you want all assistant reasoning to run on your local PC, configure Robin to use Ollama:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Install Ollama:</strong> Install Ollama from{" "}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-violet hover:underline inline-flex items-center gap-0.5"
            >
              ollama.com <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
            </a>.
          </li>
          <li>
            <strong className="text-white/90">Install a Supported Model:</strong> Download a supported model via Windows Terminal (for example: <code className="font-mono text-white/90">ollama pull llama3:latest</code>).
          </li>
          <li>
            <strong className="text-white/90">Configure in Robin:</strong> Ensure Ollama is running at <code className="font-mono text-white/90">http://localhost:11434</code>. In Robin Settings under &quot;AI Engine&quot;, select &quot;Ollama&quot;, discover available models, and choose your downloaded model from the list.
          </li>
        </ol>
      </section>

      {/* 4. Cloud AI (Gemini) */}
      <section id="cloud-ai" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Cloud className="w-5 h-5 text-brand-indigo" aria-hidden="true" />
          4. Cloud AI (Google Gemini)
        </h2>
        <p>
          If you prefer cloud model reasoning, Robin supports Google Gemini:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">API Key:</strong> Generate an API key from Google AI Studio.
          </li>
          <li>
            <strong className="text-white/90">Enter Key:</strong> In Robin Settings, select &quot;Cloud (Gemini)&quot; and enter your API key.
          </li>
          <li>
            <strong className="text-white/90">Model:</strong> Robin connects directly to Gemini for assistant completions.
          </li>
        </ol>
      </section>

      {/* 5. Voice & Wake Word */}
      <section id="voice" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Mic className="w-5 h-5 text-brand-magenta" aria-hidden="true" />
          5. Voice &amp; Hands-Free Interaction
        </h2>
        <p>
          Robin features an on-device streaming voice pipeline:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Wake Word:</strong> Speak &quot;Robin&quot; clearly to activate listening.
          </li>
          <li>
            <strong className="text-white/90">Microphone Access:</strong> Ensure Windows Settings &gt; Privacy &amp; security &gt; Microphone allows desktop apps access.
          </li>
          <li>
            <strong className="text-white/90">Audio Processing:</strong> Audio frames are processed in-memory locally on your CPU for wake-word spotting and speech recognition.
          </li>
        </ul>
      </section>

      {/* 6. Scoped Workspace */}
      <section id="workspace" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Folder className="w-5 h-5 text-brand-violet" aria-hidden="true" />
          6. Scoped Workspace &amp; Files
        </h2>
        <p>
          Robin allows you to summarize and reference files in its designated workspace directory:
        </p>
        <pre className="p-2.5 rounded bg-black/50 border border-white/[0.08] font-mono text-xs text-white/90">
          C:\RobinWorkspace
        </pre>
        <p className="text-xs text-foreground-muted">
          Robin does not search outside this folder. You can configure a different directory path in Robin Settings.
        </p>
      </section>

      {/* 7. Action Approvals */}
      <section id="approvals" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
          7. Action Approvals (Human-in-the-Loop)
        </h2>
        <p>
          Robin requires explicit human review before performing mutating actions.
        </p>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-foreground-muted space-y-2">
          <ul className="list-disc pl-4 space-y-1">
            <li><strong className="text-white/90">Reading Data:</strong> Checking your calendar, listing tasks, or reading workspace files does not require approval gates.</li>
            <li><strong className="text-white/90">Modifying Data:</strong> Sending an email, altering a calendar event, or updating tasks presents an approval card with action parameters.</li>
            <li><strong className="text-white/90">Confirmation:</strong> Robin only executes when you click &quot;Approve&quot;. Clicking &quot;Cancel&quot; discards the proposed action.</li>
          </ul>
        </div>
      </section>

      {/* 8. Troubleshooting */}
      <section id="troubleshooting" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-400" aria-hidden="true" />
          8. Common Troubleshooting
        </h2>
        <div className="space-y-3 pt-1">
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <h3 className="font-semibold text-white">Q: Ollama connection error</h3>
            <p className="text-foreground-muted">
              Verify that Ollama is running on your machine by opening a browser to <code className="font-mono text-white/90">http://localhost:11434</code>. You should see &quot;Ollama is running&quot;.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <h3 className="font-semibold text-white">Q: Google authorization expired</h3>
            <p className="text-foreground-muted">
              If an authorization error occurs, open Robin Settings &gt; Google Status, click &quot;Disconnect&quot;, and re-connect your account to refresh tokens.
            </p>
          </div>

          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1 text-xs">
            <h3 className="font-semibold text-white">Q: Wake word not triggering</h3>
            <p className="text-foreground-muted">
              Check your microphone volume in Windows Settings &gt; System &gt; Sound &gt; Input. Ensure the microphone is not muted and that Robin has microphone permission.
            </p>
          </div>
        </div>
      </section>

      {/* 9. Contact */}
      <section id="contact" className="space-y-3 pt-6 border-t border-white/[0.08]">
        <h2 className="text-xl font-semibold text-white tracking-tight">9. Support Contact</h2>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
          {SUPPORT_EMAIL ? (
            <p className="text-foreground-muted">
              For technical support, reach out to:{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="text-brand-violet hover:underline">
                {SUPPORT_EMAIL}
              </a>
            </p>
          ) : (
            <p className="text-foreground-muted leading-relaxed">
              Official support mailboxes will be announced on this website prior to the public Windows release.
              Early preview testers may submit feedback through their designated communication channels.
            </p>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
