import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, LEGAL_EMAIL, GITHUB_REPO_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Robin",
  description:
    "Plain-language privacy policy for Robin V1, the Windows personal AI assistant. Details on local storage, model providers, Google user data, and permissions.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      badge="Legal Documentation"
      title="Privacy Policy"
      subtitle="How Robin handles your personal context, connected accounts, files, and AI processing on your Windows computer."
      lastUpdated="March 2026"
    >
      {/* 1. About Robin */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">1. About Robin</h2>
        <p>
          Robin is a desktop personal assistant for Windows designed to help you manage everyday
          information—including email, calendar events, tasks, contacts, files, and notes—through
          a unified conversational interface.
        </p>
        <p>
          Robin operates on a local-first philosophy: the application runtime, database, configuration,
          and session memory live on your physical Windows PC rather than on remote centralized servers
          operated by Robin. When you choose to connect third-party cloud services or cloud AI models,
          data flows directly between your desktop and those authorized providers according to your configuration.
        </p>
      </section>

      {/* 2. Information Robin Processes */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          2. Information Robin Processes
        </h2>
        <p>Depending on which features you enable and use, Robin may process:</p>
        <ul className="list-disc pl-5 space-y-1.5 text-foreground-muted">
          <li>
            <strong className="text-white/90">User Requests &amp; Prompts:</strong> Text messages,
            spoken requests, and commands you submit in conversation.
          </li>
          <li>
            <strong className="text-white/90">Connected Account Data:</strong> Email metadata, message
            content, calendar events, task lists, and contact information retrieved via authorized
            integrations (such as Google Workspace).
          </li>
          <li>
            <strong className="text-white/90">Workspace Files:</strong> Content and metadata of files
            located strictly within your configured local Robin workspace folder.
          </li>
          <li>
            <strong className="text-white/90">Local Memory &amp; Preferences:</strong> Key facts, project
            names, user preferences, and confirmed people saved across sessions.
          </li>
          <li>
            <strong className="text-white/90">Real-Time Voice Audio:</strong> In-memory microphone audio
            captured locally during live voice interaction or wake-word detection.
          </li>
        </ul>
      </section>

      {/* 3. Local Processing and Storage */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          3. Local Processing and Storage
        </h2>
        <p>
          By default, Robin stores application data on your local hard drive in your Windows user directory
          under <code className="px-1.5 py-0.5 rounded bg-white/[0.06] text-white/90 font-mono text-xs">~/.robin</code>.
          This local storage includes:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-foreground-muted">
          <li>
            <strong className="text-white/90">Local SQLite Database (<code className="font-mono text-xs">robin.db</code>):</strong> Stores
            action history, confirmed contacts, and assistant preferences.
          </li>
          <li>
            <strong className="text-white/90">Session Database (<code className="font-mono text-xs">adk-sessions.db</code>):</strong> Stores
            conversation message history so you can review prior interactions.
          </li>
          <li>
            <strong className="text-white/90">Embedded Vector Store (<code className="font-mono text-xs">qdrant/</code>):</strong> Local
            embedded semantic index used for contextual memory retrieval on your device.
          </li>
        </ul>
        <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-foreground-muted">
          <strong className="text-white font-medium">Important:</strong> Stating that Robin is local-first
          does not mean that zero information ever leaves your device. If you configure a cloud AI provider
          (such as Gemini) or connect cloud accounts (such as Google), relevant requests and authorization tokens
          communicate directly with those respective providers over encrypted HTTPS connections.
        </div>
      </section>

      {/* 4. AI Model Providers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">4. AI Model Providers</h2>
        <p>Robin gives you control over which AI model powers your assistant:</p>
        <div className="space-y-4 pt-1">
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <h3 className="text-sm font-semibold text-white">A. Local AI (Ollama)</h3>
            <p className="text-xs text-foreground-muted">
              When Robin is configured to run with local models via Ollama (typically connecting to{" "}
              <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono">http://localhost:11434</code>),
              all model reasoning and response generation execute on your computer&apos;s CPU or GPU.
              Prompts and context are not sent to any cloud AI provider.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] space-y-1.5">
            <h3 className="text-sm font-semibold text-white">B. Cloud AI (e.g. Google Gemini)</h3>
            <p className="text-xs text-foreground-muted">
              If you configure a cloud model such as Google Gemini, relevant conversation context, user instructions,
              and tool inputs are transmitted to the cloud provider&apos;s API to generate answers.
              Robin uses your configured API key directly. Third-party cloud providers process that data
              under their own applicable terms of service and privacy policies.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Google User Data (OAuth Compliance) */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">5. Google User Data</h2>
        <p>
          Robin offers optional integrations with Google Workspace services to assist with email, calendar,
          tasks, and contacts. You must explicitly initiate this connection through an OAuth 2.0 authorization flow.
        </p>

        <h3 className="text-sm font-semibold text-white pt-2">A. Scopes Requested</h3>
        <p className="text-xs text-foreground-muted">Robin may request the following Google OAuth scopes:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted font-mono">
          <li>https://www.googleapis.com/auth/gmail.compose</li>
          <li>https://www.googleapis.com/auth/gmail.readonly</li>
          <li>https://www.googleapis.com/auth/gmail.modify</li>
          <li>https://www.googleapis.com/auth/tasks</li>
          <li>https://www.googleapis.com/auth/calendar.events</li>
          <li>https://www.googleapis.com/auth/contacts.readonly</li>
        </ul>

        <h3 className="text-sm font-semibold text-white pt-2">B. Purpose &amp; Usage</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Gmail:</strong> Read headers and recent messages to summarize your
            inbox, locate relevant information you ask about, and prepare email drafts. Robin will not send an email
            without your explicit review and approval.
          </li>
          <li>
            <strong className="text-white/90">Calendar:</strong> Check upcoming events, resolve scheduling conflicts,
            and prepare calendar invites or agenda changes based on your instructions.
          </li>
          <li>
            <strong className="text-white/90">Tasks:</strong> List, organize, and prepare new tasks in your Google Tasks lists.
          </li>
          <li>
            <strong className="text-white/90">Contacts:</strong> Read contact names and addresses to correctly resolve
            recipient names (e.g., distinguishing &quot;Vicky&quot; by confirming their saved email address).
          </li>
        </ul>

        <h3 className="text-sm font-semibold text-white pt-2">C. Limited Use Compliance</h3>
        <div className="p-4 rounded-lg bg-brand-violet/5 border border-brand-violet/20 text-xs text-foreground-muted space-y-2">
          <p className="text-white/90 font-medium">
            Robin&apos;s use and transfer to any other app of information received from Google APIs adheres to the{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-violet hover:underline inline-flex items-center gap-0.5"
            >
              Google API Services User Data Policy
            </a>
            , including the Limited Use requirements.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>We do not sell Google user data to third parties, data brokers, or advertising networks.</li>
            <li>We do not use or transfer Google user data for serving advertisements, retargeting, or personalized marketing.</li>
            <li>We do not use Google user data to train or fine-tune generalized or non-personalized machine learning or AI models.</li>
            <li>We do not allow humans to read your Google user data unless you provide affirmative consent for specific support or debugging issues, it is necessary for security investigations, or it is required to comply with applicable law.</li>
          </ul>
        </div>

        <h3 className="text-sm font-semibold text-white pt-2">D. Revocation &amp; Disconnection</h3>
        <p className="text-xs text-foreground-muted">
          You can disconnect Google at any time in Robin&apos;s Settings. Disconnecting immediately removes
          stored tokens from your local Windows Credential Manager. You can also revoke Robin&apos;s access
          directly from your{" "}
          <a
            href="https://myaccount.google.com/permissions"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/90 underline hover:text-white"
          >
            Google Account Security Settings
          </a>.
        </p>
      </section>

      {/* 6. Files and Workspace Access */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">6. Files and Workspace Access</h2>
        <p>
          Robin includes tools to inspect, summarize, and reference local workspace files. To protect your
          privacy and system security, file access is constrained to a specific designated folder
          (by default <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-xs">C:\RobinWorkspace</code> or
          your customized workspace path).
        </p>
        <p>
          Robin does not perform background scans of your entire hard drive, personal documents, Windows
          system files, or unselected directories.
        </p>
      </section>

      {/* 7. Voice Features */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">7. Voice Features</h2>
        <p>
          Robin provides hands-free voice interaction powered by an on-device audio pipeline:
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            <strong className="text-white/90">Wake Word Detection:</strong> Powered by an on-device keyword spotter
            (Sherpa-ONNX) running locally on your CPU. It continuously analyzes local microphone audio buffers only to
            detect the activation phrase (&quot;Robin&quot;).
          </li>
          <li>
            <strong className="text-white/90">Speech-to-Text:</strong> Once activated, incoming speech is transcribed
            locally using Moonshine streaming models on your CPU.
          </li>
          <li>
            <strong className="text-white/90">Text-to-Speech:</strong> Spoken responses are generated locally using the
            Kokoro speech engine.
          </li>
        </ul>
        <p className="text-xs text-foreground-muted">
          Robin processes audio frames in memory for the duration of a spoken interaction. Robin does not
          record or persist permanent audio files to disk, nor does it stream your voice recordings to remote audio servers.
        </p>
      </section>

      {/* 8. Memory and Personal Context */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">8. Memory and Personal Context</h2>
        <p>
          To provide conversational continuity, Robin can remember specific facts you share (such as your preferred
          meeting length, key project names, or confirmed contact identities).
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Memory is stored locally on your machine in <code className="font-mono text-xs">robin.db</code> and the local vector store.</li>
          <li>Robin does not claim to remember everything; it retains explicit and contextual items relevant to your workflow.</li>
          <li>Memory is not hidden surveillance—it is visible and manageable within your local application data.</li>
        </ul>
      </section>

      {/* 9. Credentials and Connected Accounts */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          9. Credentials and Connected Accounts
        </h2>
        <p>
          Robin does not store your Google or third-party account passwords. When you authenticate via OAuth,
          access and refresh tokens are stored in the <strong className="text-white/90">Windows Credential Locker (Credential Manager)</strong> under
          the secure service name <code className="px-1 py-0.5 rounded bg-white/[0.06] font-mono text-xs">Robin</code>.
        </p>
        <p className="text-xs text-foreground-muted">
          Tokens and credentials are never written to unencrypted log files, persisted in action plans, or transferred
          to Robin servers.
        </p>
      </section>

      {/* 10. Human-in-the-Loop & Action Approvals */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          10. Human-in-the-Loop &amp; Action Approvals
        </h2>
        <p>
          Robin separates reading actions from mutating actions. Actions that alter external state—such as
          sending an email, changing a calendar event, or modifying a task—are prepared in a pending state
          and held at an approval gate.
        </p>
        <p className="text-xs text-foreground-muted">
          Robin will not execute mutating actions without your explicit human confirmation. Unapproved pending
          actions automatically expire after 24 hours in the local store.
        </p>
      </section>

      {/* 11. Telemetry and Analytics */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">11. Telemetry and Analytics</h2>
        <p>
          Neither the Robin desktop application nor this marketing website (<code className="font-mono text-xs">robinpa.in</code>) operates
          third-party analytics trackers, behavioral ad monitors, or telemetry SDKs (such as PostHog, Google Analytics,
          Mixpanel, or Sentry).
        </p>
        <p className="text-xs text-foreground-muted">
          Robin does not track your keystrokes, browsing habits, or general computer activity outside the application window.
        </p>
      </section>

      {/* 12. Data Sharing and Selling */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">12. Data Sharing and Selling</h2>
        <p>
          <strong className="text-white">Robin does not sell, rent, or trade your personal information</strong> or connected
          account data to advertisers, data brokers, or commercial third parties.
        </p>
        <p className="text-xs text-foreground-muted">
          Data is transferred solely to third parties that you explicitly authorize (such as your chosen cloud AI model
          or connected Google services) to fulfill your specific requests.
        </p>
      </section>

      {/* 13. Data Retention and Removal */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">13. Data Retention and Removal</h2>
        <p>
          Because Robin stores data locally, you retain complete ownership and control over data lifecycle:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>You can delete individual conversations or action items within the application.</li>
          <li>Disconnecting connected accounts purges associated OAuth tokens from the Windows Credential Manager.</li>
          <li>
            Deleting the <code className="font-mono text-xs">~/.robin</code> directory on your PC permanently erases your local databases,
            cached models, vector indices, and configuration.
          </li>
        </ul>
      </section>

      {/* 14. Security */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">14. Security</h2>
        <p>
          Robin implements layered security safeguards appropriate for desktop software:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Hardware/OS credential protection using Windows Credential Locker.</li>
          <li>OAuth 2.0 PKCE authorization standards.</li>
          <li>Scoped directory boundaries preventing unauthorized disk access.</li>
          <li>Human confirmation gates before mutating actions execute.</li>
        </ul>
        <p className="text-xs text-foreground-muted">
          While we implement strict protective practices, no software application or network communication can be guaranteed
          to be completely impenetrable. You are responsible for maintaining the physical and operational security of your Windows device.
        </p>
      </section>

      {/* 15. Children's Privacy */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">15. Children&apos;s Privacy</h2>
        <p>
          Robin is intended for general productivity and professional use by adults. It is not directed to children under 13
          (or under 16 in certain jurisdictions), and we do not knowingly collect personal information from children.
        </p>
      </section>

      {/* 16. Changes and Contact */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">16. Changes to This Policy &amp; Contact</h2>
        <p>
          We may update this Privacy Policy as Robin evolves. Updates will be posted on this page with an updated
          &quot;Last updated&quot; date.
        </p>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
          <p className="text-white font-medium">Contacting Robin</p>
          {LEGAL_EMAIL || SUPPORT_EMAIL ? (
            <p className="text-foreground-muted">
              For privacy-related inquiries, contact us at:{" "}
              <a href={`mailto:${LEGAL_EMAIL || SUPPORT_EMAIL}`} className="text-brand-violet hover:underline">
                {LEGAL_EMAIL || SUPPORT_EMAIL}
              </a>
            </p>
          ) : (
            <p className="text-foreground-muted leading-relaxed">
              Inquiries regarding privacy or data handling may be submitted via our official project repository at{" "}
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-violet hover:underline"
              >
                GitHub ({GITHUB_REPO_URL})
              </a>
              . Direct legal contact mailboxes will be published prior to broad commercial release.
            </p>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
