import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, LEGAL_EMAIL, LAST_UPDATED } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy for Robin V1, the Windows desktop personal AI assistant. Factual details on local storage, model providers, Google user data, and permissions.",
  alternates: {
    canonical: "/privacy",
  },
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
            microphone during active voice interaction.
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
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-white tracking-tight">5. Google User Data</h2>
        <p>
          Robin offers optional integrations with Google Workspace. Robin accesses Google user data only after
          you explicitly initiate connection and authorize permissions through Google&apos;s standard OAuth sign-in flow.
        </p>

        {/* Affirmative Limited Use Statement */}
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.1] text-xs text-foreground-muted space-y-2">
          <p className="text-white font-medium text-sm">Google API Services User Data Policy Compliance</p>
          <p className="leading-relaxed">
            Robin&apos;s use and transfer to any other app of information received from Google APIs will adhere to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-violet hover:underline font-medium"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
        </div>

        <h3 className="text-sm font-semibold text-white pt-2">A. Exact Scopes &amp; Purpose</h3>
        <p className="text-xs text-foreground-muted">
          Robin requests only the specific permissions necessary to deliver assistant functionality that you command:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <code className="font-mono text-white/90 text-[11px]">https://www.googleapis.com/auth/gmail.readonly</code>:{" "}
            Used to inspect message headers and read emails when you explicitly ask Robin about your inbox or request details from a specific email thread.
          </li>
          <li>
            <code className="font-mono text-white/90 text-[11px]">https://www.googleapis.com/auth/gmail.compose</code>:{" "}
            Used to prepare and draft email messages for your explicit visual review and confirmation before sending.
          </li>
          <li>
            <code className="font-mono text-white/90 text-[11px]">https://www.googleapis.com/auth/gmail.modify</code>:{" "}
            Used to update labels, mark messages as read, or modify messages strictly when directed by you.
          </li>
          <li>
            <code className="font-mono text-white/90 text-[11px]">https://www.googleapis.com/auth/calendar.events</code>:{" "}
            Used to read your schedule, check for scheduling conflicts, and draft new events or updates on your Google Calendar.
          </li>
          <li>
            <code className="font-mono text-white/90 text-[11px]">https://www.googleapis.com/auth/tasks</code>:{" "}
            Used to view, organize, create, and update tasks in your Google Tasks lists.
          </li>
          <li>
            <code className="font-mono text-white/90 text-[11px]">https://www.googleapis.com/auth/contacts.readonly</code>:{" "}
            Used to read contact names and email addresses to resolve who you mean when asking Robin to contact or reference a person.
          </li>
        </ul>

        <h3 className="text-sm font-semibold text-white pt-2">B. How Google Data Is Handled</h3>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] text-xs text-foreground-muted space-y-2">
          <ul className="list-disc pl-4 space-y-1.5">
            <li>Robin uses authorized Google data solely to deliver user-facing assistant features requested by the user.</li>
            <li><strong className="text-white">No generalized AI model training:</strong> Robin does NOT use Google Workspace user data to train, retrain, or fine-tune generalized machine learning or artificial intelligence models.</li>
            <li>Robin does not use Google user data to display, target, or serve advertisements.</li>
            <li>Robin does not sell, rent, or transfer Google user data to data brokers, advertising platforms, or commercial third parties.</li>
            <li>Actions that modify external state—such as sending an email or saving a calendar event—require your explicit human review and approval in Robin before execution.</li>
          </ul>
        </div>

        <h3 className="text-sm font-semibold text-white pt-2">C. AI Model Processing with Google Data</h3>
        <p className="text-xs text-foreground-muted">
          How Google data interacts with AI reasoning depends on your chosen model provider:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
            <h4 className="text-xs font-semibold text-white">Local AI (Ollama)</h4>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              When using local Ollama models, all reasoning takes place 100% on your local PC. No Google Workspace data or prompts are transmitted to any external cloud AI provider.
            </p>
          </div>
          <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1">
            <h4 className="text-xs font-semibold text-white">Cloud AI (Google Gemini)</h4>
            <p className="text-[11px] text-foreground-muted leading-relaxed">
              When using Gemini, relevant excerpts from your request (e.g. an email snippet needed to draft a reply) are transmitted directly to the Google Gemini API using your personal API key over encrypted HTTPS.
            </p>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-white pt-2">D. Disconnecting Access &amp; Credential Storage</h3>
        <p className="text-xs text-foreground-muted leading-relaxed">
          Google OAuth tokens are stored exclusively in your local <strong className="text-white/90">Windows Credential Manager</strong> under the service name <code className="font-mono text-xs">Robin</code>. You can disconnect your Google account at any time in Robin Settings, which deletes the tokens from Windows Credential Manager. You can also revoke access at any time through your{" "}
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
        <ul className="list-disc pl-5 space-y-2 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">On-Device Transcription (Moonshine):</strong> Microphone audio is processed
            locally on your computer&apos;s CPU using the on-device Moonshine speech-to-text model. Spoken audio is converted to text locally before any assistant action occurs.
          </li>
          <li>
            <strong className="text-white/90">Volatile In-Memory Processing:</strong> Audio frames reside strictly in volatile memory
            buffers during active speech processing. Robin does not write permanent audio recording files to disk and does not stream raw microphone audio to remote servers.
          </li>
          <li>
            <strong className="text-white/90">User-Initiated Voice:</strong> In Robin V1, voice interactions are active and strictly initiated by the user. Robin processes speech only when deliberately activated and does not monitor background audio.
          </li>
          <li>
            <strong className="text-white/90">Cloud AI Distinction:</strong> When you speak to Robin while configured with a cloud AI provider
            (such as Gemini), your voice is transcribed to text locally on your PC, and only the resulting text prompt is transmitted to the cloud model.
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

      {/* 11. Website Analytics & Desktop Telemetry */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          11. Website Analytics &amp; Desktop Telemetry
        </h2>

        <h3 className="text-sm font-semibold text-white pt-1">A. Public Website Analytics (robinpa.in)</h3>
        <p>
          We use Google Analytics 4 on our public website (<code className="font-mono text-xs">robinpa.in</code>) to understand
          general visitor traffic, measure engagement with website content, and improve user experience.
        </p>
        <p className="text-xs text-foreground-muted">
          Google Analytics collects high-level site interaction information, such as:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Page visits, route navigations, and timestamps</li>
          <li>Referral sources (e.g. search engines or direct links)</li>
          <li>Browser type, device model, operating system, and screen resolution</li>
          <li>Approximate geographic region (country and city level inferred by Google)</li>
          <li>Website interaction events (such as clicking the Robin download link or feature discovery CTAs)</li>
        </ul>
        <p className="text-xs text-foreground-muted">
          Google processes this information under{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline hover:text-white"
          >
            Google&apos;s Privacy Policy
          </a>
          . You can prevent Google Analytics tracking across the web by installing the official{" "}
          <a
            href="https://tools.google.com/dlpage/gaoptout"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline hover:text-white"
          >
            Google Analytics Opt-out Browser Add-on
          </a>
          .
        </p>

        <h3 className="text-sm font-semibold text-white pt-2">B. No Personal Assistant or User Data Sent to Analytics</h3>
        <p className="text-xs text-foreground-muted">
          Robin does not intentionally send user assistant data to Google Analytics. Specifically, Google Analytics never receives:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Your Robin conversations, prompts, or messages</li>
          <li>Gmail messages, drafts, or inbox data</li>
          <li>Google Calendar events, schedules, or meetings</li>
          <li>Google Tasks or lists</li>
          <li>Google Contacts or people records</li>
          <li>Workspace file names, contents, or directory paths</li>
          <li>Microphone audio recordings or voice transcripts</li>
          <li>Local semantic memories stored on your device</li>
        </ul>

        <h3 className="text-sm font-semibold text-white pt-2">C. Desktop Application Telemetry</h3>
        <p className="text-xs text-foreground-muted">
          Google Analytics is deployed solely on the public <code className="font-mono text-xs">robinpa.in</code> website.
          The Robin Windows desktop application does not include Google Analytics, advertising SDKs, or background
          telemetry trackers. Robin does not monitor background computer activity, keystrokes, or browser history outside the assistant interface.
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
            Robin-cached voice models (such as Moonshine).
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
