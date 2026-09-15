import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, LEGAL_EMAIL, LAST_UPDATED } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Robin",
  description:
    "Privacy policy for Robin V1, the Windows desktop personal AI assistant. Factual details on local storage, model providers, Google user data, and permissions.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Privacy Documentation"
      title="Privacy Policy"
      subtitle="How Robin processes and stores information across your local Windows computer, AI models, and connected services."
      lastUpdated={LAST_UPDATED}
    >
      {/* 1. About Robin */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">1. About Robin</h2>
        <p>
          Robin is a desktop personal assistant application for Windows designed to help you organize
          daily information—including email, calendar events, tasks, contacts, files, and notes—through
          a unified conversational interface.
        </p>
        <p>
          Robin operates with a local-first design: the application runtime, configuration, local database,
          and session records run on your physical Windows PC rather than on remote centralized servers
          operated by Robin. When you choose to connect third-party services or cloud AI models, information
          flows directly between your computer and those authorized providers according to your settings.
        </p>
      </section>

      {/* 2. Information Robin Processes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          2. Information Robin Processes
        </h2>
        <p>Depending on which features you enable and use, Robin processes:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-foreground-muted">
          <li>
            <strong className="text-white/90">User Requests:</strong> Text messages, spoken instructions,
            and commands you submit in conversation.
          </li>
          <li>
            <strong className="text-white/90">Connected Account Data:</strong> Email headers, message content,
            calendar events, task items, and contact information retrieved via services you authorize (such as Google Workspace).
          </li>
          <li>
            <strong className="text-white/90">Workspace Files:</strong> Content and metadata of documents
            located strictly within your configured local Robin workspace directory.
          </li>
          <li>
            <strong className="text-white/90">Local Memory &amp; Preferences:</strong> Saved context, project names,
            confirmed contact identities, and assistant preferences stored on your device.
          </li>
          <li>
            <strong className="text-white/90">Microphone Audio:</strong> Live audio captured in memory by your
            microphone during voice interaction and wake-word listening.
          </li>
        </ul>
      </section>

      {/* 3. Local Processing and Storage */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          3. Local Processing and Storage
        </h2>
        <p>
          Robin stores application data on your local hard drive in your Windows user profile under{" "}
          <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/90 font-mono text-xs">~/.robin</code>.
          This local storage consists of:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-foreground-muted">
          <li>
            <strong className="text-white/90">Application Database (<code className="font-mono text-xs">robin.db</code>):</strong> A local
            SQLite database storing confirmed contacts, action history, and configuration preferences.
          </li>
          <li>
            <strong className="text-white/90">Session Database (<code className="font-mono text-xs">adk-sessions.db</code>):</strong> A local
            SQLite database storing conversation logs and turn history on your machine.
          </li>
          <li>
            <strong className="text-white/90">Embedded Vector Store (<code className="font-mono text-xs">qdrant/</code>):</strong> A local
            embedded vector index used for contextual memory search on your device.
          </li>
        </ul>
        <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-foreground-muted">
          <strong className="text-white font-medium">Clear Boundary:</strong> Stating that Robin is local-first
          does not mean that all data remains offline under every configuration. If you configure a cloud model
          or connect online accounts, relevant requests and credentials communicate directly with those online services
          over encrypted HTTPS connections.
        </div>
      </section>

      {/* 4. AI Model Providers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">4. AI Model Providers</h2>
        <p>Robin allows you to choose how assistant reasoning is handled:</p>
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <h3 className="text-sm font-semibold text-white">A. Local AI via Ollama</h3>
            <p className="text-xs text-foreground-muted">
              When configured to use local AI through Ollama (connecting to{" "}
              <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono">http://localhost:11434</code>),
              model reasoning executes on your computer&apos;s hardware. Prompts and request context are not sent
              to cloud AI providers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <h3 className="text-sm font-semibold text-white">B. Cloud AI (Google Gemini)</h3>
            <p className="text-xs text-foreground-muted">
              When configured to use a cloud model such as Google Gemini, relevant user instructions,
              conversation context, and tool inputs are transmitted directly from your desktop to Google&apos;s Gemini API
              using your configured API key. That data is handled under Google&apos;s applicable terms and policies.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Google User Data */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">5. Google User Data</h2>
        <p>
          Robin offers optional integrations with Google Workspace. Robin accesses Google user data only after
          you explicitly initiate connection and authorize permissions through Google&apos;s standard OAuth sign-in flow.
        </p>

        <h3 className="text-sm font-semibold text-white pt-2">A. Scopes &amp; Access</h3>
        <p className="text-xs text-foreground-muted">
          Robin requests permissions limited to the assistant features you choose to use:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Gmail:</strong> Used to inspect message headers and recent emails when you ask
            about your inbox, retrieve specific email context you request, and prepare email drafts.
          </li>
          <li>
            <strong className="text-white/90">Calendar:</strong> Used to check your schedule, identify conflicts, and draft
            calendar events based on your instructions.
          </li>
          <li>
            <strong className="text-white/90">Tasks:</strong> Used to view and manage your Google Tasks lists.
          </li>
          <li>
            <strong className="text-white/90">Contacts:</strong> Used to read saved contact names and email addresses so Robin
            can resolve who you mean when asking to contact a person.
          </li>
        </ul>

        <h3 className="text-sm font-semibold text-white pt-2">B. How Google Data Is Handled</h3>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs text-foreground-muted space-y-2">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Robin uses authorized Google data solely to deliver the specific assistant functionality you request.</li>
            <li>Robin does not use Google user data to display, target, or serve advertisements.</li>
            <li>Robin does not sell, rent, or transfer Google user data to data brokers, advertising networks, or commercial third parties.</li>
            <li>Robin does not use Google user data to train or fine-tune generalized machine learning or artificial intelligence models.</li>
            <li>Mutating actions—such as sending an email or changing a calendar event—require your explicit approval in Robin before anything is changed.</li>
          </ul>
        </div>

        <h3 className="text-sm font-semibold text-white pt-2">C. Disconnecting Access</h3>
        <p className="text-xs text-foreground-muted">
          You can disconnect Google at any time in Robin Settings. Disconnecting removes your stored credentials
          from your local Windows Credential Manager. You can also revoke access at any time through your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline hover:text-white"
          >
            Google Account permissions page
          </a>.
        </p>
      </section>

      {/* 6. Files and Workspace Access */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">6. Files and Workspace Access</h2>
        <p>
          Robin can read and summarize local documents you place in its designated workspace directory
          (defaulting to <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-xs">C:\RobinWorkspace</code> or
          your customized folder).
        </p>
        <p className="text-xs text-foreground-muted">
          Robin&apos;s file tools are scoped to this directory. Robin does not perform background scans of your entire
          hard drive, personal folders, or system files.
        </p>
      </section>

      {/* 7. Voice Features */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">7. Voice Features</h2>
        <p>
          Robin includes voice capabilities using on-device speech processing:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Wake Word &amp; Speech-to-Text:</strong> Microphone audio is processed
            locally on your computer&apos;s CPU using on-device speech models (Sherpa-ONNX for wake-word detection and
            Moonshine for speech transcription).
          </li>
          <li>
            <strong className="text-white/90">Audio Buffers:</strong> Audio frames are processed in-memory during active voice
            interaction. Robin does not write permanent audio recording files to disk and does not stream raw audio to external audio servers.
          </li>
          <li>
            <strong className="text-white/90">Cloud AI Distinction:</strong> When you speak to Robin while using a cloud AI model
            (such as Gemini), your spoken audio is converted to text locally on your PC, and the resulting request text
            is sent to the cloud model to generate the response.
          </li>
        </ul>
      </section>

      {/* 8. Memory and Personal Context */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">8. Memory and Personal Context</h2>
        <p>
          To maintain conversational continuity, Robin can remember relevant details you share (such as preferred meeting
          times, ongoing project names, or confirmed contact identities).
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Memory records and semantic embeddings are stored locally on your device in <code className="font-mono text-xs">robin.db</code> and the local vector index.</li>
          <li>Robin does not claim to remember everything; it retains specific context relevant to your daily tasks.</li>
          <li>Memory is not hidden surveillance—it is stored in your local application data folder.</li>
        </ul>
      </section>

      {/* 9. Credentials and Connected Accounts */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          9. Credentials and Connected Accounts
        </h2>
        <p>
          Robin does not store your Google or third-party account passwords. When you connect an account via OAuth,
          access and refresh tokens are stored locally in the standard <strong className="text-white/90">Windows Credential Manager</strong> under
          the service name <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-xs">Robin</code> using the operating system&apos;s
          built-in credential locker.
        </p>
        <p className="text-xs text-foreground-muted">
          When you provide a Gemini API key in Robin Settings, Robin stores the key using Windows Credential Manager
          rather than in Robin&apos;s plaintext configuration files. Non-sensitive AI configuration, including the
          selected provider and model, is stored locally in{" "}
          <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-xs">~/.robin/ai-settings.json</code>.
        </p>
        <p className="text-xs text-foreground-muted">
          Tokens and credentials are not stored in reviewable action plans, unencrypted application logs, or transmitted to Robin servers.
        </p>
      </section>

      {/* 10. Human-in-the-Loop & Action Approvals */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          10. Human-in-the-Loop &amp; Action Approvals
        </h2>
        <p>
          Robin distinguishes between reading information and modifying external state. Actions that change
          something—such as sending an email, creating or editing a calendar event, or updating a task—are prepared in a
          pending state and require your explicit review and approval before execution.
        </p>
        <p className="text-xs text-foreground-muted">
          Pending actions that are not approved automatically expire after 24 hours in the local database.
        </p>
      </section>

      {/* 11. Telemetry and Analytics */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">11. Telemetry and Analytics</h2>
        <p>
          Robin does not currently include third-party product analytics or advertising tracking SDKs in the desktop application
          or on this website (<code className="font-mono text-xs">robinpa.in</code>).
        </p>
        <p className="text-xs text-foreground-muted">
          Robin does not monitor your general background computer activity, browser history, or keystrokes outside the assistant interface.
        </p>
      </section>

      {/* 12. Data Sharing and Selling */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">12. Data Sharing and Selling</h2>
        <p>
          <strong className="text-white">Robin does not currently sell personal information to advertisers.</strong>
        </p>
        <p className="text-xs text-foreground-muted">
          Information is shared only with third-party services that you explicitly configure or authorize (such as your chosen cloud AI provider
          or connected Google Workspace account) to carry out assistant requests.
        </p>
      </section>

      {/* 13. Data Retention and Removal */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">13. Data Retention and Removal</h2>
        <p>
          Because Robin stores its application data locally on your computer, you can manage and remove your data directly:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Robin Application Data:</strong> Deleting the local directory{" "}
            <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-xs">~/.robin</code> removes Robin-managed files,
            including your local SQLite databases (<code className="font-mono text-xs">robin.db</code> and{" "}
            <code className="font-mono text-xs">adk-sessions.db</code>), the local Qdrant vector index, local AI settings, and
            Robin-cached voice models (such as Moonshine and wake-word models).
          </li>
          <li>
            <strong className="text-white/90">Credentials and API Keys:</strong> Stored credentials—including Google OAuth tokens and
            your Gemini API key—are managed in the Windows Credential Manager. Disconnecting your account or clearing keys in Robin Settings
            removes those credentials from Windows Credential Manager.
          </li>
          <li>
            <strong className="text-white/90">Ollama Models:</strong> If you use Ollama for local AI, models you download are managed
            and stored independently by Ollama on your system. Deleting the <code className="font-mono text-xs">~/.robin</code> directory
            does not delete your Ollama installation or downloaded Ollama models; these can be managed or deleted directly through Ollama.
          </li>
        </ul>
      </section>

      {/* 14. Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">14. Security</h2>
        <p>
          Robin uses standard security practices suitable for Windows desktop software:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Storing account tokens in the Windows Credential Manager rather than plaintext files.</li>
          <li>Using standard OAuth 2.0 PKCE authentication flows.</li>
          <li>Restricting file operations to designated workspace paths.</li>
          <li>Requiring human approval before consequential actions execute.</li>
        </ul>
        <p className="text-xs text-foreground-muted">
          No software system is entirely immune to security risks. You are responsible for maintaining the physical and operating-system
          security of your Windows PC.
        </p>
      </section>

      {/* 15. Children's Privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">15. Children&apos;s Privacy</h2>
        <p>
          Robin is intended for general productivity use by adults. It is not directed to children under 13, and we do not
          knowingly collect personal information from children.
        </p>
      </section>

      {/* 16. Changes and Contact */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">16. Changes to This Policy &amp; Contact</h2>
        <p>
          We may update this Privacy Policy as Robin develops. Any updates will be posted to this page with an updated
          revision date.
        </p>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
          <p className="text-white font-medium">Contact</p>
          {LEGAL_EMAIL || SUPPORT_EMAIL ? (
            <p className="text-foreground-muted">
              For privacy-related inquiries, contact:{" "}
              <a href={`mailto:${LEGAL_EMAIL || SUPPORT_EMAIL}`} className="text-brand-violet hover:underline">
                {LEGAL_EMAIL || SUPPORT_EMAIL}
              </a>
            </p>
          ) : (
            <p className="text-foreground-muted leading-relaxed">
              Official public contact mailboxes will be provided on this website prior to public distribution.
            </p>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
