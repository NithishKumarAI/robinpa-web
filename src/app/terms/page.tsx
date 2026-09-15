import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/LegalPage";
import { SUPPORT_EMAIL, LEGAL_EMAIL, LAST_UPDATED } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service | Robin",
  description:
    "Terms of service governing the use of Robin V1, the Windows desktop personal AI assistant, and related website services.",
};

export default function TermsPage() {
  return (
    <LegalPage
      badge="Terms Documentation"
      title="Terms of Service"
      subtitle="The basic terms, limitations, and user responsibilities governing the use of the Robin desktop personal assistant."
      lastUpdated={LAST_UPDATED}
    >
      {/* 1. Acceptance of Terms */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">1. Acceptance of Terms</h2>
        <p>
          By downloading, installing, accessing, or using the Robin desktop application (&quot;Robin&quot;, &quot;the Software&quot;)
          or the website at <code className="font-mono text-xs">robinpa.in</code>, you agree to these Terms of Service (&quot;Terms&quot;).
        </p>
        <p>
          If you do not agree to these Terms, do not install or use Robin.
        </p>
      </section>

      {/* 2. Description of Software */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">2. Description of Software</h2>
        <p>
          Robin is a desktop personal assistant application built for Windows. It provides a conversational
          interface to interact with your local workspace files, local memory, on-device or cloud AI models,
          and authorized third-party productivity tools (such as Google Workspace).
        </p>
        <p>
          Robin is currently provided as an early-stage V1 software release. Features, supported model integrations,
          and capabilities may change or be updated as the product evolves.
        </p>
      </section>

      {/* 3. Connected Third-Party Services */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          3. Connected Third-Party Services
        </h2>
        <p>
          Robin allows you to connect third-party platforms and model providers, such as Google Workspace,
          Ollama (for local models), and Google Gemini (for cloud models).
        </p>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-foreground-muted">
          <li>Your use of third-party services is governed by those third parties&apos; respective terms and policies.</li>
          <li>You are responsible for any credentials or local software you supply, such as a Gemini API key (where cloud AI is chosen) or an active Ollama installation and downloaded models (where local AI is chosen).</li>
          <li>Robin is not responsible for outages, rate limits, or service disruptions caused by third-party platforms.</li>
        </ul>
      </section>

      {/* 4. AI-Generated Output & Limitations */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          4. AI-Generated Output &amp; Limitations
        </h2>
        <div className="p-4 rounded-lg bg-white/[0.03] border border-white/[0.08] text-xs text-foreground-muted space-y-2">
          <p className="text-white font-medium">Artificial Intelligence Limitations</p>
          <p>
            Robin uses artificial intelligence models to interpret commands and generate summaries, text,
            schedules, drafts, and tool plans. AI outputs may occasionally be inaccurate, incomplete, or hallucinated.
          </p>
          <ul className="list-disc pl-4 space-y-1">
            <li>Outputs should not be relied upon as professional legal, medical, financial, or tax advice.</li>
            <li>You should verify all critical dates, calculations, recipient addresses, and facts before taking action.</li>
            <li>Robin is not designed for autonomous high-risk, emergency, or life-critical applications.</li>
          </ul>
        </div>
      </section>

      {/* 5. User Responsibility for Approvals & Actions */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          5. User Responsibility for Approvals &amp; Actions
        </h2>
        <p>
          A central design principle of Robin is human control: <strong className="text-white">Robin asks before it acts</strong>.
        </p>
        <p>
          Robin prepares mutating actions—such as drafting an email, updating a calendar appointment, or modifying a task—in
          a pending review state. These actions execute only when you explicitly confirm and click &quot;Approve&quot;.
        </p>
        <div className="p-4 rounded-lg bg-brand-violet/5 border border-brand-violet/20 text-xs text-foreground-muted">
          <strong className="text-white font-medium">Your Review Responsibility:</strong> You retain the ultimate responsibility
          to review all proposed action parameters (such as recipient addresses, email contents, meeting times, and file targets)
          before approving them. Robin is not liable for communications sent, schedule conflicts created, or data altered as a result
          of actions you chose to approve.
        </div>
      </section>

      {/* 6. Files and User Content */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">6. Files and User Content</h2>
        <p>
          You retain full ownership of all files, documents, messages, and content you process using Robin.
          Robin does not claim intellectual property rights over your workspace documents or prompts.
        </p>
      </section>

      {/* 7. Acceptable Use */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">7. Acceptable Use</h2>
        <p>You agree not to use Robin to:</p>
        <ul className="list-disc pl-5 space-y-1 text-xs text-foreground-muted">
          <li>Violate any applicable laws or regulations.</li>
          <li>Transmit unauthorized mass communications, spam, or phishing emails.</li>
          <li>Distribute malicious software or exploits.</li>
          <li>Harass, defame, or violate the privacy of others.</li>
        </ul>
      </section>

      {/* 8. Software Availability */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">
          8. Software Availability &amp; License
        </h2>
        <p>
          Subject to these Terms, you are granted a personal, non-exclusive, revocable license to install and use
          the Robin desktop binary on compatible Windows systems. Robin is provided as-is, and availability or feature
          support may change over time.
        </p>
      </section>

      {/* 9. Disclaimers */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">9. Disclaimers</h2>
        <p className="text-xs text-foreground-muted leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, ROBIN AND ITS WEBSITE ARE PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
          FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SOFTWARE WILL OPERATE UNINTERRUPTED
          OR ERROR-FREE.
        </p>
      </section>

      {/* 10. Limitation of Liability */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">10. Limitation of Liability</h2>
        <p className="text-xs text-foreground-muted leading-relaxed">
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL ROBIN OR ITS CONTRIBUTORS BE LIABLE FOR ANY INDIRECT,
          INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, DATA, OR BUSINESS OPPORTUNITY)
          ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF OR INABILITY TO USE ROBIN.
        </p>
      </section>

      {/* 11. Changes & Termination */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">11. Changes &amp; Termination</h2>
        <p>
          We may update these Terms as the software evolves. Continued use of Robin after changes become effective
          constitutes acceptance of the revised Terms. You may terminate your use of Robin at any time by uninstalling
          the software from your PC.
        </p>
      </section>

      {/* 12. Contact */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white tracking-tight">12. Contact</h2>
        <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.06] text-xs space-y-2">
          {LEGAL_EMAIL || SUPPORT_EMAIL ? (
            <p className="text-foreground-muted">
              For inquiries regarding these Terms, contact:{" "}
              <a href={`mailto:${LEGAL_EMAIL || SUPPORT_EMAIL}`} className="text-brand-violet hover:underline">
                {LEGAL_EMAIL || SUPPORT_EMAIL}
              </a>
            </p>
          ) : (
            <p className="text-foreground-muted leading-relaxed">
              Official contact channels will be published on this website prior to public release.
            </p>
          )}
        </div>
      </section>
    </LegalPage>
  );
}
