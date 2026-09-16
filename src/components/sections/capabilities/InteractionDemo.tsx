import React from "react";
import { Mail, Check, Calendar, CheckSquare, Bell, Folder, Brain, Mic } from "lucide-react";

/**
 * Moment 2: Communication Interaction Card (Email & People)
 */
export const CommunicationDemo = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => (
    <div
      ref={ref}
      className={`w-full max-w-sm sm:max-w-md p-4 rounded-xl bg-background-surface/95 border border-brand-violet/30 shadow-[0_8px_30px_rgba(139,92,246,0.15)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06] mb-3">
        <span className="flex items-center gap-1.5 text-brand-violet">
          <Mail size={12} />
          <span>Email &amp; People</span>
        </span>
        <span>Resolution</span>
      </div>
      <div className="space-y-2">
        <div className="p-2.5 rounded-lg bg-background-elevated/70 border border-white/[0.06] flex items-center justify-between">
          <span className="text-xs text-white/95 font-medium">&ldquo;Draft a reply to my latest email.&rdquo;</span>
          <span className="text-[10px] font-mono text-foreground-subtle">Voice / Text</span>
        </div>
        <div className="flex items-center justify-between text-xs px-1">
          <span className="text-foreground-muted">Recipient &rarr; confirmed contact</span>
          <span className="inline-flex items-center gap-1 text-[11px] font-mono text-brand-violet">
            <Check size={11} />
            Draft ready for review
          </span>
        </div>
      </div>
    </div>
  )
);
CommunicationDemo.displayName = "CommunicationDemo";

/**
 * Moment 3: Time Interaction Card (Calendar, Tasks, Reminders)
 */
export const TimeDemo = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => (
    <div
      ref={ref}
      className={`w-full max-w-sm sm:max-w-md p-4 rounded-xl bg-background-surface/95 border border-brand-indigo/30 shadow-[0_8px_30px_rgba(99,102,241,0.15)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06] mb-3">
        <span className="flex items-center gap-1.5 text-brand-indigo">
          <Calendar size={12} />
          <span>Calendar &bull; Tasks &bull; Reminders</span>
        </span>
        <span>Schedule sync</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-2 rounded bg-background-elevated/60 border border-white/[0.05] flex items-center justify-between">
          <span className="text-white/90">&ldquo;What do I have tomorrow?&rdquo;</span>
          <span className="text-[10px] font-mono text-brand-indigo">Calendar</span>
        </div>
        <div className="p-2 rounded bg-background-elevated/60 border border-white/[0.05] flex items-center justify-between">
          <span className="text-white/90">&ldquo;Create a task for Friday.&rdquo;</span>
          <span className="text-[10px] font-mono text-brand-indigo">Tasks</span>
        </div>
        <div className="p-2 rounded bg-background-elevated/60 border border-white/[0.05] flex items-center justify-between">
          <span className="text-white/90">&ldquo;Remind me at 7 PM.&rdquo;</span>
          <span className="text-[10px] font-mono text-brand-indigo">Reminders</span>
        </div>
      </div>
    </div>
  )
);
TimeDemo.displayName = "TimeDemo";

/**
 * Moment 4: Workspace Interaction Card (Files & Memory)
 */
export const WorkspaceDemo = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => (
    <div
      ref={ref}
      className={`w-full max-w-sm sm:max-w-md p-4 rounded-xl bg-background-surface/95 border border-brand-violet/30 shadow-[0_8px_30px_rgba(139,92,246,0.15)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06] mb-3">
        <span className="flex items-center gap-1.5 text-brand-violet">
          <Folder size={12} />
          <span>Configured Workspace &bull; Memory</span>
        </span>
        <span>Scoped sandbox</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-2 rounded bg-background-elevated/60 border border-white/[0.05] flex items-center justify-between">
          <span className="text-white/90">&ldquo;Open the project notes.&rdquo;</span>
          <span className="text-[10px] font-mono text-brand-violet">Workspace file</span>
        </div>
        <div className="p-2 rounded bg-background-elevated/60 border border-white/[0.05] flex items-center justify-between">
          <span className="text-white/90">&ldquo;What do you remember about this project?&rdquo;</span>
          <span className="text-[10px] font-mono text-brand-violet">Local memory</span>
        </div>
      </div>
      <p className="mt-2 text-[10px] font-mono text-foreground-subtle/80 text-center">
        Operates strictly within your configured folder sandbox
      </p>
    </div>
  )
);
WorkspaceDemo.displayName = "WorkspaceDemo";

/**
 * Moment 5: Natural Interaction Card (Voice Conversation)
 */
export const VoiceDemo = React.forwardRef<HTMLDivElement, { className?: string }>(
  ({ className = "" }, ref) => (
    <div
      ref={ref}
      className={`w-full max-w-sm sm:max-w-md p-4 rounded-xl bg-background-surface/95 border border-brand-magenta/30 shadow-[0_8px_30px_rgba(217,70,239,0.15)] backdrop-blur-md ${className}`}
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-foreground-subtle pb-2 border-b border-white/[0.06] mb-3">
        <span className="flex items-center gap-1.5 text-brand-magenta">
          <Mic size={12} />
          <span>Real-time Voice State</span>
        </span>
        <span>Unified Core</span>
      </div>
      <div className="flex items-center justify-around py-2">
        <div className="flex flex-col items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-indigo animate-pulse" />
          <span className="text-[10px] font-mono text-foreground-subtle">Listening</span>
        </div>
        <span className="text-foreground-subtle/40 text-xs">&rarr;</span>
        <div className="flex flex-col items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-violet animate-pulse" />
          <span className="text-[10px] font-mono text-foreground-subtle">Thinking</span>
        </div>
        <span className="text-foreground-subtle/40 text-xs">&rarr;</span>
        <div className="flex flex-col items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-brand-magenta animate-pulse" />
          <span className="text-[10px] font-mono text-foreground-subtle">Speaking</span>
        </div>
      </div>
      <p className="mt-3 pt-2 border-t border-white/[0.06] text-xs text-center text-white/90 font-medium">
        Type it or say it. Robin uses the same assistant underneath.
      </p>
    </div>
  )
);
VoiceDemo.displayName = "VoiceDemo";
