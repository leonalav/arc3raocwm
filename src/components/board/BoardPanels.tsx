import { useEffect, useRef, useState } from "react";
import {
  Check,
  CheckCircle2,
  ChevronDown,
  FilePenLine,
  GitBranch,
  LoaderCircle,
  Minus,
  Network,
  Paperclip,
  Image as ImageIcon,
  Mic,
  Undo2,
  X,
} from "lucide-react";
import type { BoardDoc } from "../../data/boards";
import { THEMES, FONTS, type BoardTheme } from "./Chalkboard";
import { startLiveDictation, type LiveDictation } from "../../lib/voice";

/* Marketing-site BoardPanels: SettingsPanel + ChatDock. */

export function SettingsPanel({
  theme,
  setTheme,
  fontId,
  setFontId,
  fontScale,
  setFontScale,
  latex,
  setLatex,
  onClose,
}: {
  theme: BoardTheme;
  setTheme: (t: BoardTheme) => void;
  fontId: string;
  setFontId: (f: string) => void;
  fontScale: number;
  setFontScale: (n: number) => void;
  latex: boolean;
  setLatex: (b: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="anim-toast absolute right-4 top-[68px] z-40 w-[298px] overflow-hidden rounded-lg border border-edge bg-[#161616]/97 shadow-[0_20px_56px_rgba(0,0,0,0.6)] backdrop-blur-md"
      data-nopan
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between border-b border-edge px-3 py-2.5">
        <h3 className="text-[12.5px] font-semibold text-fg">Board settings</h3>
        <button type="button" onClick={onClose} className="text-[12px] text-dim hover:text-fg">
          Close
        </button>
      </div>

      <div className="max-h-[54vh] overflow-y-auto p-3">
        <Label>Board style</Label>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTheme(t)}
              className={`overflow-hidden rounded-md border-2 transition-all ${
                theme.id === t.id ? "border-accent" : "border-edge hover:border-white/25"
              }`}
            >
              <div className="h-11 w-full" style={{ background: t.bg }} />
              <div className="px-1 py-1 text-[9.5px] leading-tight text-mut">{t.label}</div>
            </button>
          ))}
        </div>

        <Label>Handwriting</Label>
        <div className="mb-4 space-y-1">
          {FONTS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFontId(f.id)}
              className={`flex w-full items-center justify-between rounded px-2 py-1.5 text-left transition-colors ${
                fontId === f.id ? "bg-white/[0.09]" : "hover:bg-white/[0.06]"
              }`}
            >
              <span className="text-[15px] text-fg" style={{ fontFamily: f.css }}>
                {f.label}
              </span>
              {fontId === f.id && <Check size={13} className="text-accent" />}
            </button>
          ))}
        </div>

        <Label>Text size · {Math.round(fontScale * 100)}%</Label>
        <input
          type="range"
          min={0.75}
          max={1.5}
          step={0.05}
          value={fontScale}
          onChange={(e) => setFontScale(parseFloat(e.target.value))}
          className="mb-4 w-full accent-[#2383e2]"
        />

        <button
          type="button"
          onClick={() => setLatex(!latex)}
          className="flex w-full items-center gap-2.5 rounded-md border border-edge bg-raise px-2.5 py-2 text-left transition-colors hover:bg-white/[0.07]"
        >
          <span className="flex-1">
            <span className="block text-[12.5px] text-fg">LaTeX rendering</span>
            <span className="block text-[10.5px] text-dim">KaTeX for equations</span>
          </span>
          <span className={`h-4 w-7 rounded-full p-0.5 transition-colors ${latex ? "bg-accent" : "bg-[#3a3a38]"}`}>
            <span className={`block h-3 w-3 rounded-full bg-white transition-transform ${latex ? "translate-x-3" : ""}`} />
          </span>
        </button>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="mb-1.5 font-mono text-[10px] uppercase tracking-wider text-dim">{children}</div>;
}

function MMButton({
  children,
  onClick,
  title,
  label,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      disabled={disabled}
      className="chat-ui-9_5 flex items-center gap-1 rounded px-1.5 py-1 text-white/45 transition-colors hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent disabled:hover:text-white/45"
    >
      {children}
      <span className="chat-ui-label font-medium">{label}</span>
    </button>
  );
}

/* Chat dock */

export interface ChatMsg {
  id: number;
  role: "tutor" | "user" | "system";
  text: string;
  imageData?: string;
  /** Board state as it stood immediately BEFORE this message was sent.
   *
   *  Reverting to a message restores this snapshot, so undoing a question also
   *  undoes everything the tutor drew in response to it. Captured only on user
   *  messages, which are the only revertable points. Optional because sessions
   *  saved before board-revert existed have no snapshot — those revert the
   *  transcript alone rather than failing. */
  boardSnapshot?: BoardSnapshot;
}

/** The board half of a revert point. Cloned at capture time so later mutation
 *  of the live boards cannot reach back and corrupt the history. */
export interface BoardSnapshot {
  boards: BoardDoc[];
  activeId: string;
}

export type AgentActivityKind =
  | "planning"
  | "thinking"
  | "responding"
  | "writing"
  | "visualizing"
  | "revising"
  | "spawning"
  | "complete"
  | "error";

export interface AgentActivity {
  kind: AgentActivityKind;
  label: string;
  detail: string;
  progress?: { current: number; total: number };
}

function AgentActivityWidget({ activity }: { activity: AgentActivity }) {
  // Planning/thinking is intentionally a tiny neutral presence. The expanded
  // blue activity card is reserved for an actual board/tool operation.
  if (["planning", "thinking", "responding"].includes(activity.kind)) {
    return (
      <div className="flex items-center gap-2 px-1 py-1 text-[9.5px] text-white/45" role="status" aria-live="polite">
        <span className="flex items-center gap-0.5" aria-hidden="true">
          {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/55 animate-bounce" style={{ animationDelay: `${i * 140}ms` }} />)}
        </span>
        <span>agent is thinking...</span>
      </div>
    );
  }

  const done = activity.kind === "complete";
  const failed = activity.kind === "error";
  const active = !done && !failed;
  const Icon = done
    ? CheckCircle2
    : failed
      ? X
      : activity.kind === "spawning"
        ? GitBranch
        : activity.kind === "visualizing"
          ? Network
          : activity.kind === "revising"
            ? FilePenLine
            : LoaderCircle;
  const progress = activity.progress;
  const percentage = progress ? Math.max(0, Math.min(100, (progress.current / progress.total) * 100)) : 0;

  return (
    <div
      className={`agent-activity relative overflow-hidden rounded-lg border px-2.5 py-2 ${
        done
          ? "border-[#4fb477]/25 bg-[#4fb477]/8"
          : failed
            ? "border-[#f87171]/25 bg-[#f87171]/8"
            : "agent-activity-active border-[#7dd3fc]/20 bg-[#2383e2]/10"
      }`}
      role="status"
      aria-live="polite"
      aria-label={`${activity.label}. ${activity.detail}`}
    >
      <div className="flex items-start gap-2">
        <span
          className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-md ${
            done ? "bg-[#4fb477]/15 text-[#86efac]" : failed ? "bg-[#f87171]/15 text-[#fca5a5]" : "bg-[#2383e2]/20 text-[#7dd3fc]"
          }`}
        >
          <Icon
            size={14}
            aria-hidden="true"
            className={active && Icon === LoaderCircle ? "animate-spin" : ""}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-center justify-between gap-2">
            <span className="truncate text-[10.5px] font-medium text-white/85">{activity.label}</span>
            {progress && (
              <span className="shrink-0 font-mono text-[8.5px] text-white/35">
                {progress.current}/{progress.total}
              </span>
            )}
          </span>
          <span className="mt-0.5 block text-[9.5px] leading-snug text-white/45">{activity.detail}</span>
        </span>
      </div>
      {progress && (
        <div className="mt-2 h-0.5 overflow-hidden rounded-full bg-white/8" aria-hidden="true">
          <div
            className="h-full rounded-full bg-[#7dd3fc]/70 transition-[width] duration-300 motion-reduce:transition-none"
            style={{ width: `${percentage}%` }}
          />
        </div>
      )}
    </div>
  );
}

function GenerativeTutorText({ text, animate }: { text: string; animate: boolean }) {
  const [visibleLength, setVisibleLength] = useState(animate ? 0 : text.length);

  useEffect(() => {
    if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleLength(text.length);
      return;
    }

    setVisibleLength(0);
    let frame = 0;
    let revealed = 0;
    let last = performance.now();
    const step = (now: number) => {
      if (now - last >= 22) {
        const remaining = text.length - revealed;
        const increment = Math.max(1, Math.min(5, Math.ceil(remaining / 28)));
        revealed = Math.min(text.length, revealed + increment);
        setVisibleLength(revealed);
        last = now;
      }
      if (revealed < text.length) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [animate, text]);

  const generating = visibleLength < text.length;
  return (
    <div className={`chat-ui-10_5 text-white/82 ${animate ? "generative-text" : ""}`}>
      <span aria-hidden={generating}>{text.slice(0, visibleLength)}</span>
      {generating && <span className="generative-caret ml-0.5 inline-block h-[1em] w-px translate-y-[2px] bg-[#7dd3fc]" aria-hidden="true" />}
      {generating && <span className="sr-only">{text}</span>}
    </div>
  );
}

export interface ChatAttachment {
  name: string;
  kind: "file" | "image" | "audio" | "code";
  url?: string;
  mimeType?: string;
  textContent?: string;
}

export function ChatDock({
  messages,
  onSend,
  onRevertMessage,
  collapsed,
  setCollapsed,
  onClose,
  typing,
  attachments,
  onAddAttachment,
  onClearAttachments,
  onRemoveAttachment,
  rewinding,
  agentStatus,
  activity,
}: {
  chatOpen?: boolean;
  messages: ChatMsg[];
  onSend: (t: string, imgData?: string) => void;
  onRevertMessage: (messageId: number) => void;
  collapsed: boolean;
  setCollapsed: (b: boolean) => void;
  onClose: () => void;
  typing: boolean;
  attachments: ChatAttachment[];
  onAddAttachment: (
    kind: ChatAttachment["kind"],
    name?: string,
    url?: string,
    mimeType?: string,
    textContent?: string
  ) => void;
  onClearAttachments: () => void;
  onRemoveAttachment: (index: number) => void;
  onSpeakLast: () => void;
  rewinding: boolean;
  agentStatus?: "idle" | "thinking" | "writing" | "error";
  activity?: AgentActivity | null;
}) {
  const [val, setVal] = useState("");
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const endRef = useRef<HTMLDivElement>(null);
  // Messages present when the dock mounts are restored history. Only tutor
  // messages arriving afterwards receive the live generative-text treatment.
  const initialMessageIds = useRef(new Set(messages.map((message) => message.id)));
  const imageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dictationRef = useRef<LiveDictation | null>(null);

  useEffect(() => () => dictationRef.current?.stop(), []);

  /* draggable position */
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const shellRef = useRef<HTMLDivElement>(null);

  const toggleVoiceDictation = () => {
    if (isRecordingVoice) {
      dictationRef.current?.stop();
      dictationRef.current = null;
      setIsRecordingVoice(false);
      return;
    }
    const live = startLiveDictation(
      (text) => setVal(text),
      () => setIsRecordingVoice(false)
    );
    if (live) {
      dictationRef.current = live;
      setIsRecordingVoice(true);
    }
  };

  const readImageAttachment = (file: File) => {
    // The Tutor transport accepts data URLs up to 8M characters. Reject before
    // FileReader allocates a larger base64 copy in the webview.
    if (!file.type.startsWith("image/")) {
      setAttachmentError("Choose an image file.");
      return;
    }
    if (file.size > 5_000_000) {
      setAttachmentError("Images must be 5 MB or smaller.");
      return;
    }
    setAttachmentError("");
    const reader = new FileReader();
    reader.onload = (evt) => {
      const url = evt.target?.result;
      if (typeof url === "string" && url.startsWith("data:image/")) {
        onAddAttachment("image", file.name, url, file.type);
      } else setAttachmentError("That image could not be read.");
    };
    reader.onerror = () => setAttachmentError("That image could not be read.");
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) readImageAttachment(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0] ?? "";
    if (file.type.startsWith("image/")) {
      readImageAttachment(file);
      return;
    }
    if (extension !== ".txt" && extension !== ".md") {
      setAttachmentError("Only .txt, .md, and image files are supported.");
      return;
    }
    if (file.size > 120_000) {
      setAttachmentError("Text files must be 120 KB or smaller.");
      return;
    }

    setAttachmentError("");
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        onAddAttachment(
          "file",
          file.name,
          undefined,
          extension === ".md" ? "text/markdown" : "text/plain",
          text
        );
      } else setAttachmentError("That text file could not be read.");
    };
    reader.onerror = () => setAttachmentError("That text file could not be read.");
    reader.readAsText(file);
  };

  const startDrag = (e: React.MouseEvent) => {
    const box = shellRef.current?.getBoundingClientRect();
    if (!box) return;
    dragRef.current = { dx: e.clientX - box.left, dy: e.clientY - box.top };
    e.preventDefault();
  };

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const d = dragRef.current;
      if (!d) return;
      const w = shellRef.current?.offsetWidth ?? 520;
      const h = shellRef.current?.offsetHeight ?? 200;
      const x = Math.min(Math.max(8, e.clientX - d.dx), window.innerWidth - w - 8);
      const y = Math.min(Math.max(8, e.clientY - d.dy), window.innerHeight - h - 8);
      setPos({ x, y });
    };
    const up = () => (dragRef.current = null);
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const shellStyle: React.CSSProperties = pos
    ? { left: pos.x, top: pos.y, transform: "none" }
    : {};
  const shellClass = pos
    ? "absolute z-40 w-[min(520px,calc(100vw-32px))]"
    : "absolute left-1/2 top-[68px] z-40 w-[min(520px,calc(100vw-32px))] -translate-x-1/2";

  useEffect(() => {
    // Only scroll the chat's own container, never the window. The previous
    // `scrollIntoView({behavior:"smooth"})` defaulted to `block: "start"` and
    // could nudge window.scrollY, which combined with inertial-scroll state
    // looked like a teleport to the top of the section.
    if (endRef.current) {
      const scroller = endRef.current.parentElement;
      if (scroller) {
        scroller.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
      } else {
        endRef.current.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      }
    }
  }, [messages, typing]);

  const send = () => {
    if (rewinding || (!val.trim() && attachments.length === 0)) return;
    const imgAtt = attachments.find((a) => a.kind === "image");
    onSend(val.trim(), imgAtt?.url);
    setVal("");
  };

  const attachmentsBar = (attachments.length > 0 || attachmentError) ? (
    <div className="flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.08] px-2.5 py-1.5">
      {attachmentError && <span className="shrink-0 font-mono text-[9.5px] text-red-300" role="alert">{attachmentError}</span>}
      {attachments.length === 0 ? (
        !attachmentError && <span className="font-mono text-[9.5px] text-white/30">No attachments · click File, Image, or Voice below</span>
      ) : (
        <>
          {attachments.map((a, i) => (
            <span key={i} className="flex items-center gap-1.5 rounded bg-white/[0.07] px-2 py-1 font-mono text-[10px] text-white/85">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              {a.name}
              <button
                onClick={() => onRemoveAttachment(i)}
                aria-label={`Remove ${a.name}`}
                title={`Remove ${a.name}`}
                className="grid h-3.5 w-3.5 place-items-center rounded text-white/45 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={9} />
              </button>
            </span>
          ))}
          <button onClick={onClearAttachments} className="ml-auto font-mono text-[9.5px] text-white/40 hover:text-white">
            clear
          </button>
        </>
      )}
    </div>
  ) : null;

  const multimodalRow = (
    <div className="relative flex items-center gap-0.5 px-2 py-1">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.md,image/*"
        hidden
        onChange={handleFileUpload}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={handleImageUpload}
      />

      <MMButton disabled={rewinding} onClick={() => fileInputRef.current?.click()} title="Attach a file" label="File">
        <Paperclip size={13} />
      </MMButton>
      <MMButton disabled={rewinding} onClick={() => imageInputRef.current?.click()} title="Attach an image" label="Image">
        <ImageIcon size={13} />
      </MMButton>
      <MMButton disabled={rewinding} onClick={toggleVoiceDictation} title="Voice input / Dictation" label="Voice">
        <Mic size={13} className={isRecordingVoice ? "text-accent animate-pulse" : ""} />
      </MMButton>
    </div>
  );

  /* Collapsed = only the thin bar */
  if (collapsed) {
    // While the agent is thinking/writing, the "Chat" button becomes an
    // animated typing bubble so the collapsed bar still signals activity.
    const busy = Boolean(activity && activity.kind !== "complete" && activity.kind !== "error")
      || typing
      || (agentStatus != null && agentStatus !== "idle" && agentStatus !== "error");
    return (
      <div
        ref={shellRef}
        className={shellClass}
        style={shellStyle}
        data-nopan
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div
          onMouseDown={startDrag}
          className="flex cursor-grab items-center gap-2 rounded-md border border-white/8 bg-[#343436]/58 px-2 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.25)] active:cursor-grabbing"
        >
          {busy ? (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setCollapsed(false)}
              className="chat-ui-9_5 flex h-[22px] max-w-[180px] items-center gap-1.5 rounded bg-accent/20 px-2 text-white/85"
              title={activity?.detail ?? (agentStatus === "writing" ? "Agent writing on the board…" : "Agent thinking…")}
              aria-label={activity?.label ?? "Agent is responding"}
            >
              <LoaderCircle size={11} className="shrink-0 animate-spin text-[#7dd3fc] motion-reduce:animate-none" />
              <span className="chat-ui-9_5 truncate">{activity?.label ?? "Working…"}</span>
            </button>
          ) : (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setCollapsed(false)}
              title="Expand the AI Response panel"
              className="chat-ui-10 rounded bg-white/10 px-2 py-1 font-medium text-white/75 transition-colors hover:bg-white/20 hover:text-white"
            >
              Chat
            </button>
          )}
          <textarea
            value={val}
            rows={Math.min(5, Math.max(1, val.split(/\r?\n/).length))}
            aria-label="AI Response message"
            onChange={(e) => setVal(e.target.value)}
            onMouseDown={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            disabled={rewinding}
            placeholder={rewinding ? "Returning conversation…" : busy ? "Studyus is responding…" : "Ask anything about the board…"}
            className="chat-ui-11 max-h-[90px] min-w-0 flex-1 resize-none overflow-y-auto cursor-text bg-transparent text-white outline-none placeholder:text-white/35 disabled:cursor-wait disabled:opacity-60"
          />
          <button
            onClick={send}
            disabled={rewinding || !val.trim()}
            className={`chat-ui-10 rounded px-2.5 py-1 font-medium transition-all ${
              !rewinding && val.trim() ? "bg-white text-black active:scale-95" : "bg-white/10 text-white/30"
            }`}
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={shellRef}
      className={shellClass}
      style={shellStyle}
      data-nopan
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onWheel={(e) => e.stopPropagation()}
    >
      {/* Floating Pill Window for Active Voice Soundwaves */}
      {isRecordingVoice && (
        <div className="anim-toast absolute -top-12 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-accent/40 bg-[#1c1c1e]/95 px-4 py-2 shadow-2xl backdrop-blur-md">
          <span className="h-2.5 w-2.5 rounded-full bg-accent animate-ping" />
          <span className="font-mono text-[11px] font-medium text-fg">Listening…</span>
          <div className="flex items-center gap-1 h-4">
            <span className="h-3 w-1 rounded bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
            <span className="h-4 w-1 rounded bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
            <span className="h-2 w-1 rounded bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
            <span className="h-4 w-1 rounded bg-accent animate-bounce" style={{ animationDelay: "450ms" }} />
            <span className="h-2.5 w-1 rounded bg-accent animate-bounce" style={{ animationDelay: "600ms" }} />
          </div>
          <button
            onClick={toggleVoiceDictation}
            className="ml-1 rounded-full bg-white/10 px-2 py-0.5 font-mono text-[9.5px] text-white hover:bg-white/20"
          >
            Done
          </button>
        </div>
      )}

      <div className="anim-toast overflow-hidden rounded-md border border-white/8 bg-[#343436]/58 shadow-[0_12px_32px_rgba(0,0,0,0.25)]">
        {/* compact title bar */}
        <div
          onMouseDown={startDrag}
          className="flex h-8 cursor-grab items-center gap-2 border-b border-white/[0.08] px-2.5 active:cursor-grabbing"
        >
          <div className="chat-ui-10 font-semibold text-white/75">AI Response</div>
          <div className="chat-ui-8 mx-auto max-w-[280px] flex-1 truncate rounded bg-white/[0.07] px-2 py-1 text-center font-mono text-white/52">
            Ask anything about the shared chalkboard
          </div>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setCollapsed(true)}
            className="rounded px-1 py-0.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
            title="Collapse"
          >
            <Minus size={13} />
          </button>
          <button
            onMouseDown={(e) => e.stopPropagation()}
            onClick={onClose}
            className="chat-ui-9 rounded px-1 py-0.5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            Esc
          </button>
        </div>

        {/* message stream */}
        <div className="max-h-[210px] space-y-2 overflow-y-auto px-3 py-2.5">
          {messages.map((m) => {
            if (m.role === "system") {
              return (
                <div key={m.id} className="anim-msg rounded bg-white/[0.04] px-2 py-1 font-mono text-[9.5px] text-white/40">
                  {m.text}
                </div>
              );
            }
            if (m.role === "user") {
              return (
                <div key={m.id} className="anim-msg space-y-1">
                  <div className="text-right text-[8.5px] uppercase tracking-[0.12em] text-white/30">You</div>
                  {/*  The bubble shrink-wraps its content (`w-fit`) so a short
                   *  message stays a short bubble, and the revert control sits
                   *  INLINE with the text rather than on its own row below it.
                   *  Both together keep "Okay. Where is it?" to a single line
                   *  instead of a mostly-empty box with a stranded arrow. */}
                  <div className="ml-auto flex w-fit max-w-[90%] items-start gap-1.5 rounded bg-white/[0.07] py-1.5 pl-2 pr-1.5 text-[10.5px] leading-relaxed text-white/82">
                    <div className="min-w-0 flex-1">
                      <div className="whitespace-pre-wrap break-words">{m.text}</div>
                      {m.imageData && (
                        <img
                          src={m.imageData}
                          alt="User uploaded attachment"
                          className="mt-2 max-h-[160px] max-w-full rounded-md border border-white/10 object-contain"
                        />
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVal(m.text);
                        onRevertMessage(m.id);
                      }}
                      disabled={rewinding}
                      aria-label="Revert to this message"
                      title="Revert to this message"
                      className="-mr-0.5 grid h-4 w-4 flex-none place-items-center rounded text-white/35 transition-colors hover:bg-white/10 hover:text-white/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#7dd3fc]/70 disabled:cursor-wait disabled:opacity-35"
                    >
                      <Undo2 size={11} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              );
            }
            return (
              <div key={m.id} className="anim-msg">
                <div className="mb-0.5 text-[8.5px] uppercase tracking-[0.12em] text-white/30">
                  AI Response
                </div>
                <GenerativeTutorText text={m.text} animate={!initialMessageIds.current.has(m.id)} />
              </div>
            );
          })}
          {activity ? (
            <AgentActivityWidget activity={activity} />
          ) : (typing || (agentStatus && agentStatus !== "idle")) ? (
            <AgentActivityWidget
              activity={{
                kind: agentStatus === "writing" ? "writing" : agentStatus === "error" ? "error" : "thinking",
                label: agentStatus === "writing" ? "Updating the board" : agentStatus === "error" ? "Could not finish" : "agent is thinking...",
                detail: agentStatus === "writing" ? "Applying validated board changes" : agentStatus === "error" ? "The operation stopped safely" : "Reading your request and board context",
              }}
            />
          ) : null}
          <div ref={endRef} />
        </div>

        {/* attachment strip */}
        {attachmentsBar}

        {/* composer with multimodal row + send */}
        <div className="border-t border-white/[0.08]">
          {multimodalRow}
          <div className="flex items-center gap-2 px-2.5 pb-2">
            <textarea
              value={val}
              rows={Math.min(5, Math.max(1, val.split(/\r?\n/).length))}
              aria-label="AI Response message"
              onChange={(e) => setVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={rewinding}
              placeholder={rewinding ? "Returning conversation…" : "what if I want to…"}
              className="chat-ui-10 max-h-[90px] min-w-0 flex-1 resize-none overflow-y-auto rounded bg-black/15 px-2 py-1.5 text-white outline-none placeholder:text-white/30 disabled:cursor-wait disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={rewinding || (!val.trim() && attachments.length === 0)}
              className={`chat-ui-9_5 rounded px-2.5 py-1.5 font-medium transition-all ${
                !rewinding && (val.trim() || attachments.length > 0) ? "bg-white text-black active:scale-95" : "bg-white/10 text-white/30"
              }`}
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      <div className="mt-1 flex justify-end">
        <button
          onClick={() => setCollapsed(true)}
          className="chat-ui-9 flex items-center gap-1 rounded border border-white/10 bg-[#343436]/90 px-2 py-0.5 text-white/45 transition-colors hover:text-white/75"
        >
          <ChevronDown size={11} />
          Collapse to bar
        </button>
      </div>
    </div>
  );
}

