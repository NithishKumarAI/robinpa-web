import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, LEGAL_EMAIL, GITHUB_REPO_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | Robin",
  description:
    "Terms of service governing the use of Robin V1, the Windows desktop personal AI assistant, and related website services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      badge="Legal Documentation"
      title="Terms of Service"
      subtitle="The rules, limitations, and user responsibilities for using the Robin desktop personal assistant software."
      lastUpdated="March 2026"
    >
      {/* 1. Acceptance of Terms */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">1. Acceptance of Terms</h2>
        <p>
          By downloading, installing, accessing, or using the Robin desktop personal assistant software
          (&quot;Robin&quot;, &quot;the Software&quot;) or the website at <code className="font-mono text-xs">robinpa.in</code>,
          you agree to be bound by these Terms of Service (&quot;Terms&quot;).
        </p>
        <p>
          If you do not agree to these Terms, you may not download, install, or use Robin.
        </p>
      </section>

      {/* 2. Description of Robin */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">2. Description of Software</h2>
        <p>
          Robin is a desktop personal assistant application built for Windows. It provides a conversational
          interface to interact with your local workspace files, local memory, on-device or cloud AI models,
          and authorized third-party productivity tools (such as Google Workspace).
        </p>
        <p>
          Robin is currently provided as a V1 desktop release. Features, model integrations, and interfaces
          may be modified, improved, or updated over time.
        </p>
      </section>

      {/* 3. Eligibility */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">3. Eligibility</h2>
        <p>
          You must be at least 13 years old (or the minimum legal age in your country to consent to software usage)
          to use Robin. If you are using Robin on behalf of an entity or organization, you represent that you have
          authority to bind that organization to these Terms.
        </p>
      </section>

      {/* 4. Connected Third-Party Services */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          4. Connected Third-Party Services
        </h2>
        <p>
          Robin allows you to connect third-party platforms and model providers, including Google Workspace,
          Ollama (local models), and Google Gemini (cloud models).
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>
            Your use of third-party services is governed by those third parties&apos; respective terms, policies,
            and service quotas.
          </li>
          <li>
            You are responsible for obtaining and managing any necessary API keys, account credentials, and software
            prerequisites (such as installing and running Ollama on your machine).
          </li>
          <li>
            Robin is not responsible for outages, rate limits, data practices, or service disruptions caused
            by third-party providers.
          </li>
        </ul>
      </section>

      {/* 5. AI-Generated Output & Limitations */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          5. AI-Generated Output &amp; Limitations
        </h2>
        <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-foreground-muted space-y-2">
          <p className="text-white font-medium">Artificial Intelligence Limitations</p>
          <p>
            Robin uses artificial intelligence models to interpret instructions and generate text, summaries,
            schedules, drafts, and tool plans. Artificial intelligence outputs may occasionally be inaccurate,
            incomplete, outdated, or hallucinated.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Outputs should not be relied upon as professional legal, medical, financial, tax, or safety advice.</li>
            <li>You should verify all critical facts, dates, calculations, and recipient details before taking real-world action.</li>
            <li>Robin is not certified for high-risk environments, autonomous emergency operations, or life-critical applications.</li>
          </ul>
        </div>
      </section>

      {/* 6. User Responsibility for Approvals & Actions */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          6. User Responsibility for Approvals &amp; Actions
        </h2>
        <p>
          A core design principle of Robin is human oversight: <strong className="text-white">Robin asks before it acts</strong>.
        </p>
        <p>
          Robin prepares actions—such as drafting an email, updating a calendar appointment, or deleting a task—in
          a pending review state. These actions are executed only when you explicitly confirm and click &quot;Approve&quot;.
        </p>
        <div className="p-4 rounded-lg bg-brand-violet/5 border border-brand-violet/20 text-xs text-foreground-muted">
          <strong className="text-white font-medium">Your Responsibility:</strong> You have the ultimate responsibility
          to review all proposed action parameters (including recipient email addresses, message body, event times, and file names)
          before approving them. Robin and its developers are not liable for any communications sent, schedule conflicts created,
          or data modified as a result of actions you approved.
        </div>
      </section>

      {/* 7. Files and User Content */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">7. Files and User Content</h2>
        <p>
          You retain all ownership rights to the files, messages, notes, prompts, and content you process with Robin.
          Robin does not claim intellectual property rights over your user content or files located in your workspace.
        </p>
        <p className="text-xs text-foreground-muted">
          You represent that you have the right to access and process any files or accounts you point Robin toward,
          and that your use does not violate intellectual property or confidentiality agreements.
        </p>
      </section>

      {/* 8. Acceptable Use */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">8. Acceptable Use</h2>
        <p>You agree not to use Robin to:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Violate any applicable local, state, national, or international laws or regulations.</li>
          <li>Send unsolicited mass communications, spam, fraudulent messages, or phishing emails.</li>
          <li>Distribute malicious software, malware, viruses, or computer exploits.</li>
          <li>Harass, stalk, threaten, defame, or violate the privacy of others.</li>
          <li>Attempt to reverse engineer, decompile, or tamper with security boundaries in a manner intended to cause harm.</li>
        </ul>
      </section>

      {/* 9. Software License & Availability */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          9. Software License &amp; Availability
        </h2>
        <p>
          Subject to your compliance with these Terms, you are granted a limited, personal, non-transferable,
          revocable license to download, install, and use the Robin binary on compatible Windows systems.
        </p>
        <p className="text-xs text-foreground-muted">
          Robin is provided as-is. We do not guarantee that software updates will always be backwards compatible
          with legacy local databases, or that third-party APIs will remain accessible perpetually.
        </p>
      </section>

      {/* 10. Intellectual Property */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">10. Intellectual Property</h2>
        <p>
          The Robin name, brand mark, visual orb designs, user interface code, documentation, and website assets
          are protected by applicable copyright, trademark, and intellectual property laws. All rights not expressly
          granted to you are reserved.
        </p>
      </section>

      {/* 11. Disclaimer of Warranties */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">11. Disclaimer of Warranties</h2>
        <p className="uppercase text-xs font-mono text-foreground-subtle tracking-wider">
          Please read this section carefully.
        </p>
        <p className="text-xs text-foreground-muted leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, ROBIN AND ITS ASSOCIATED WEBSITES ARE PROVIDED ON AN
          &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED,
          STATUTORY, OR OTHERWISE. THIS INCLUDES, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT ROBIN WILL OPERATE
          UNINTERRUPTED, SECURE, ACCURATE, OR ERROR-FREE.
        </p>
      </section>

      {/* 12. Limitation of Liability */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">12. Limitation of Liability</h2>
        <p className="text-xs text-foreground-muted leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ROBIN, ITS CREATORS, CONTRIBUTORS, OR AFFILIATES
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED
          TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR BUSINESS INTERRUPTION, ARISING OUT OF OR IN CONNECTION WITH YOUR
          USE OF OR INABILITY TO USE ROBIN, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
        </p>
      </section>

      {/* 13. Changes to Terms */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">13. Modifications to Terms</h2>
        <p>
          We reserve the right to revise these Terms as Robin develops. Changes will be posted to this page with
          an updated revision date. Continued use of Robin after changes become effective constitutes your acceptance
          of the updated Terms.
        </p>
      </section>

      {/* 14. Termination */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">14. Termination</h2>
        <p>
          You may terminate your agreement to these Terms at any time simply by ceasing use of Robin and uninstalling
          the software from your Windows computer. We reserve the right to suspend or discontinue availability of the
          software or website at any time without prior notice.
        </p>
      </section>

      {/* 15. Contact */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">15. Contact Information</h2>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
          {LEGAL_EMAIL || SUPPORT_EMAIL ? (
            <p className="text-foreground-muted">
              For questions regarding these Terms, contact us at:{" "}
              <a href={`mailto:${LEGAL_EMAIL || SUPPORT_EMAIL}`} className="text-brand-violet hover:underline">
                {LEGAL_EMAIL || SUPPORT_EMAIL}
              </a>
            </p>
          ) : (
            <p className="text-foreground-muted leading-relaxed">
              Questions regarding these Terms can be submitted via the official project repository at{" "}
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-violet hover:underline"
              >
                GitHub ({GITHUB_REPO_URL})
              </a>
              . Official administrative mailboxes will be updated upon general availability.
            </p>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
