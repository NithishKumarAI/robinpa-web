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
            <p className="text-xs text-foreground-muted mt-0.5">Microphone setup and voice</p>
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
            <li><strong className="text-white/90">Operating System:</strong> Windows 11 (64-bit) is actively verified during development; Windows 10 (64-bit) is architecturally targeted.</li>
            <li><strong className="text-white/90">Audio Input:</strong> A working microphone and speaker output if you wish to use voice interaction.</li>
            <li><strong className="text-white/90">Internet Access:</strong> Local Ollama model inference, workspace files, and local memory run offline once set up. Google services, Gemini cloud conversation, initial model downloads, and OAuth sign-in require a network connection.</li>
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
          Robin includes automated in-app AI onboarding to make running on-device models easy:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Automated Hardware Detection:</strong> When you open Robin or navigate to Settings &gt; AI Engine, Robin automatically evaluates your system hardware—including system RAM, CPU cores/threads, NVIDIA GPU availability, VRAM, and free disk space.
          </li>
          <li>
            <strong className="text-white/90">Recommended Model Selection:</strong> Robin recommends a compatible model tier suited to your specifications (e.g., Qwen3 1.7B or Llama 3.2 1B for entry-level/8 GB systems; 3B–4B for balanced PCs; 8B for higher-performance systems with 16+ GB RAM or dedicated GPUs).
          </li>
          <li>
            <strong className="text-white/90">In-App Download &amp; Validation:</strong> If Ollama is not installed, Robin guides you to the official installer at{" "}
            <a
              href="https://ollama.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-violet hover:underline inline-flex items-center gap-0.5"
            >
              ollama.com <ExternalLink className="w-2.5 h-2.5 opacity-70" aria-hidden="true" />
            </a>. Once Ollama is running at <code className="font-mono text-white/90">http://localhost:11434</code>, Robin pulls and validates the recommended model directly within the app—no manual terminal commands required.
          </li>
          <li>
            <strong className="text-white/90">Required for Workspace Data:</strong> AI-assisted Google Workspace tasks (reading emails, drafting responses, organizing calendar events) require Local AI so personal data remains strictly on your machine.
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
          If your PC cannot comfortably run a local model, Robin supports Google Gemini for cloud reasoning:
        </p>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">API Key:</strong> Obtain a personal API key from Google AI Studio.
          </li>
          <li>
            <strong className="text-white/90">Configure in Robin:</strong> In Robin Settings under &quot;AI Engine&quot;, select &quot;Cloud (Gemini)&quot;, enter your API key, and test the connection. The key is encrypted and stored in your Windows Credential Manager.
          </li>
          <li>
            <strong className="text-white/90">Fail-Closed Privacy Boundary:</strong> Gemini is used exclusively for general, non-Workspace conversations. Google Workspace-derived data (Gmail, Calendar, Tasks, Contacts, and Workspace memory) is strictly blocked from Gemini context. Workspace-assisted tasks require switching to Local AI.
          </li>
        </ol>
      </section>

      {/* 5. Voice Interaction */}
      <section id="voice" className="space-y-3 pt-6">
        <h2 className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
          <Mic className="w-5 h-5 text-brand-magenta" aria-hidden="true" />
          5. Voice Interaction
        </h2>
        <p>
          Robin features an on-device speech-to-text pipeline:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">User-Initiated Speech:</strong> Click the microphone or use the talk shortcut to begin speaking. Voice interaction is active and strictly initiated by the user.
          </li>
          <li>
            <strong className="text-white/90">Microphone Access:</strong> Ensure Windows Settings &gt; Privacy &amp; security &gt; Microphone allows desktop apps access.
          </li>
          <li>
            <strong className="text-white/90">On-Device Processing:</strong> Spoken audio frames are transcribed locally in volatile memory on your CPU using Moonshine. Robin does not save permanent audio files.
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
            <h3 className="font-semibold text-white">Q: Microphone not capturing voice</h3>
            <p className="text-foreground-muted">
              Check your microphone volume in Windows Settings &gt; System &gt; Sound &gt; Input. Ensure the microphone is not muted and that desktop apps have microphone permission in Windows Privacy settings.
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
