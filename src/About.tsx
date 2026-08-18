import { useState } from 'react'
import type { ReactNode } from 'react'
import Footer, { type Section } from './Footer'
import ChalkboardViewport from './components/board/ChalkboardViewport'

/* ─── FAQ ─── */
const FAQS: { question: string; answer: string }[] = [
  {
    question: 'What is the virtual chalkboard?',
    answer:
      'An interactive workspace inside Studyus. As you work, the tutor draws graphs, histograms and diagrams so you learn by seeing structure — not just reading paragraphs.',
  },
  {
    question: 'What kinds of tests can Studyus generate?',
    answer:
      'From quick multiple-choice drills to free-response and proof-style questions. Pick a single idea or sit a full-length mock that mirrors real exam pacing.',
  },
  {
    question: 'Can I use my own textbook?',
    answer:
      'Yes. Upload any PDF. Studyus rebuilds lessons, diagrams and drills around that source — the definitions, chapter order and problems your class actually uses.',
  },
  {
    question: 'Who is Studyus for?',
    answer:
      'University students in Calculus / Linear Algebra, high-schoolers prepping for SAT / AP, and anyone who wants a sharper way to learn.',
  },
  {
    question: 'Do I still need to take notes?',
    answer:
      'Studyus captures the thread as you go so you can stay focused on understanding. Less filing, more thinking.',
  },
  {
    question: 'Is it only for test prep?',
    answer:
      'No. Test generation is one pillar. Many learners use just the chalkboard and curriculum tools to go deeper — no exam required.',
  },
]

/* ─── Small atoms ─── */
function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-white/40">{children}</p>
}

function ArrowCircle() {
  return (
    <span
      className="grid h-7 w-7 place-items-center rounded-full bg-white text-[14px] leading-none text-black"
      aria-hidden="true"
    >
      →
    </span>
  )
}

/* ─── Notion-style feature cards — now glass/dark to keep video background consistent ─── */
function FeatureCard({
  label,
  title,
  children,
}: {
  label: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.07] shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4 p-6 pb-4">
        <div>
          <p className="text-[11px] font-medium tracking-[0.12em] text-white/40">{label}</p>
          <h3 className="mt-1 text-[17px] font-semibold leading-tight tracking-tight text-white">{title}</h3>
        </div>
        <ArrowCircle />
      </div>
      <div className="mx-3 mb-3 overflow-hidden rounded-[14px] border border-white/10 bg-[#f6f6f3]">{children}</div>
    </div>
  )
}

/* ─── Mocks for Notion cards — light previews inside dark glass cards = high contrast ─── */
function ChalkboardMiniMock() {
  return (
    <div className="aspect-[1.55] bg-[#1b2f2b] p-3 sm:p-4">
      <div className="flex h-full flex-col rounded-lg border border-white/10 bg-[#233d33] p-3">
        <div className="flex items-center gap-2 text-[10px] font-medium text-white/60">
          <span className="h-2 w-2 rounded-full bg-emerald-400" /> Derivative · limit of secant
        </div>
        <div className="mt-3 flex-1 rounded-md bg-[#1e332b] p-2">
          <svg viewBox="0 0 200 80" className="h-full w-full">
            <line x1="10" y1="40" x2="190" y2="40" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <line x1="100" y1="10" x2="100" y2="70" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
            <path
              d="M20 65 C 60 60, 90 45, 120 30 C 150 15, 170 10, 185 8"
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="120" cy="30" r="3" fill="#fbbf24" stroke="white" strokeWidth="1" />
            <path d="M100 30 L 140 30" stroke="white" strokeDasharray="3 3" strokeWidth="1" opacity={0.6} />
          </svg>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[10px] text-white/50">
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono">f(x)=x²</span>
          <span>↗ secant → tangent</span>
        </div>
      </div>
    </div>
  )
}
function AskAnythingMock() {
  return (
    <div className="aspect-[1.55] bg-[#f6f6f3] p-3 sm:p-4">
      <div className="flex h-full flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-black px-2 py-1 text-[10px] font-medium text-white">H2 Deal Flow</span>
          <span className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[10px] text-black/60 shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Syncing
          </span>
        </div>
        <div className="flex-1 rounded-xl border border-black/5 bg-white p-3 shadow-sm">
          <div className="flex gap-2">
            <div className="flex-1">
              <div className="flex gap-1">
                <span className="h-2 w-8 rounded bg-black/10" />
                <span className="h-2 w-10 rounded bg-black/5" />
              </div>
              <div className="mt-2 flex items-end gap-1.5">
                <div className="h-6 w-3 rounded-sm bg-amber-400" style={{ height: 22 }} />
                <div className="h-10 w-3 rounded-sm bg-blue-500" style={{ height: 40 }} />
                <div className="h-7 w-3 rounded-sm bg-emerald-400" style={{ height: 28 }} />
                <div className="h-14 w-3 rounded-sm bg-red-500" style={{ height: 56 }} />
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-1 rounded-full border border-black/5 bg-white px-3 py-2 shadow">
              <div
                className="h-8 w-8 rounded-full border-4 border-emerald-400 border-t-transparent"
                style={{ transform: 'rotate(-20deg)' }}
              />
              <span className="text-[11px] font-semibold text-black">12</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 rounded-full border border-black/10 bg-[#fafafa] px-3 py-1.5 text-[11px] text-black/70">
            What are our biggest opportunities in H2?
            <span className="ml-auto grid h-5 w-5 place-items-center rounded-full bg-[#2383e2] text-white">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}
function PracticeMock() {
  return (
    <div className="aspect-[1.55] bg-[#f6f6f3] p-3 sm:p-4">
      <div className="grid h-full grid-cols-[1.1fr_0.9fr] gap-3">
        <div className="rounded-xl border border-black/5 bg-white p-3 shadow-sm">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-black">
            <span className="h-2 w-2 rounded-full bg-amber-400" /> Engineering Tasks
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-[9px]">
            <div className="rounded-lg border border-black/5 bg-[#fafafa] p-2 text-black">
              <p className="font-medium">Fix wrap on H1</p>
              <p className="text-black/40">High priority</p>
            </div>
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-2 text-black">
              <p className="font-medium">Create source map</p>
              <p className="text-black/40">Medium priority</p>
            </div>
            <div className="rounded-lg border border-black/5 bg-white p-2 text-black">
              <p className="font-medium">Animation refinements</p>
              <p className="text-black/40">Low priority</p>
            </div>
            <div className="rounded-lg border border-black/5 bg-white p-2 text-black">
              <p className="font-medium">Hover states</p>
              <p className="text-black/40">Medium priority</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-black/5 bg-[#fffef8] p-3 shadow-sm text-black">
          <div className="flex items-center gap-1.5 text-[10px] font-medium">
            <span className="grid h-5 w-5 place-items-center rounded-full bg-amber-100 text-[9px] font-bold text-amber-700">
              ✦
            </span>
            Coding Agent
          </div>
          <p className="mt-2 rounded bg-black/[0.04] px-2 py-1 text-[9px] leading-snug text-black/60">
            Take a look at what’s in <span className="font-medium text-black">Engineering Tasks</span> to see if there’s
            anything you can take off our team’s plate.
          </p>
          <p className="mt-2 text-[9px] leading-snug text-black/60">
            I went ahead and assigned myself a few tasks. It looks like{' '}
            <span className="font-medium">Fix wrap on H1</span> is the highest priority there. Want me to go ahead and get
            started?
          </p>
        </div>
      </div>
    </div>
  )
}
function CurriculumMock() {
  return (
    <div className="aspect-[1.55] bg-[#f6f6f3] p-3 sm:p-4">
      <div className="flex h-full flex-col rounded-xl border border-black/5 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-black/5 px-3 py-2">
          <span className="text-[10px] font-medium tracking-wide text-black/40">CURRICULUM</span>
          <span className="rounded-full bg-black px-2 py-0.5 text-[9px] font-medium text-white">Stewart · Ch. 2</span>
        </div>
        <div className="flex flex-1 gap-3 p-3">
          <div className="w-[92px] shrink-0 rounded-lg border border-black/5 bg-[#fafafa] p-2">
            <div className="h-24 rounded bg-white shadow-sm ring-1 ring-black/5">
              <div className="h-1.5 rounded-t bg-red-500" />
              <div className="p-2">
                <div className="h-1.5 w-12 rounded bg-black/15" />
                <div className="mt-1.5 space-y-1">
                  <div className="h-1 rounded bg-black/5" />
                  <div className="h-1 w-5/6 rounded bg-black/5" />
                  <div className="h-1 w-4/6 rounded bg-black/5" />
                </div>
                <div className="mt-2 h-10 rounded bg-gradient-to-br from-blue-50 to-indigo-50 ring-1 ring-black/5" />
              </div>
            </div>
            <p className="mt-1.5 text-center text-[8px] font-medium text-black/40">PDF uploaded</p>
          </div>
          <div className="flex-1">
            <div className="space-y-1.5">
              {[
                { n: '2.1', t: 'The Tangent Problem', done: true },
                { n: '2.2', t: 'Limit of a Function', done: true },
                { n: '2.3', t: 'Calculating Limits', active: true },
                { n: '2.5', t: 'Continuity', done: false },
              ].map((row) => (
                <div
                  key={row.n}
                  className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[10px] ${
                    row.active ? 'border-[#2383e2]/20 bg-[#2383e2]/5' : 'border-black/5 bg-white'
                  }`}
                >
                  <span
                    className={`grid h-4 w-4 place-items-center rounded-full text-[9px] ${row.done ? 'bg-emerald-500 text-white' : row.active ? 'bg-[#2383e2] text-white' : 'bg-black/5 text-black/30'}`}
                  >
                    {row.done ? '✓' : row.n}
                  </span>
                  <span className={row.active ? 'font-medium text-[#2383e2]' : 'text-black/70'}>{row.t}</span>
                  {row.active && <span className="ml-auto text-[9px] text-black/30">now</span>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── How we work / Cluely two-up — kept blue + dark glass to sit on video ─── */
function ListenCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-[#5B7FFF] p-6 text-white shadow-[0_8px_32px_rgba(0,0,0,0.25)] sm:p-8">
      <h3 className="text-[22px] font-semibold leading-tight tracking-tight">
        Studyus <span className="inline-flex items-center rounded-full bg-white/15 px-2 py-0.5 text-[13px] font-medium">listens</span> as you think
      </h3>
      <p className="mt-2 max-w-[36ch] text-[13px] leading-relaxed text-white/80">
        It picks up context from the board in real time, so it can help the moment you need it.
      </p>

      <div className="mt-6 flex flex-col items-center">
        <div className="text-[32px] font-semibold tabular-nums tracking-tight">00:19</div>
        <div className="text-[11px] font-medium tracking-wide text-white/70">● Recording</div>

        <div className="mt-4 flex h-10 w-full items-center justify-center gap-[2px]">
          {Array.from({ length: 48 }).map((_, i) => {
            const isActive = i > 6 && i < 14
            const h = isActive ? 18 + Math.sin(i * 0.9) * 10 : 4 + Math.random() * 2
            return (
              <span key={i} className="w-[3px] rounded-full bg-white" style={{ height: h, opacity: isActive ? 1 : 0.45 }} />
            )
          })}
        </div>

        <div className="mt-6 w-full rounded-[14px] border border-white/15 bg-[#3f5bd6]/40 p-2 backdrop-blur">
          <div className="flex items-center gap-2 px-2 py-1 text-[10px] text-white/60">
            <span>Assist</span>
            <span>·</span>
            <span>What should I say?</span>
            <span>·</span>
            <span>Follow-up</span>
          </div>
          <div className="mt-1 flex items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-[11px] text-white/70">
            Ask about your screen or conversation, or <span className="rounded bg-white/20 px-1 py-0.5 font-mono text-[10px]">⌘ ↵</span> for Assist
            <span className="ml-auto grid h-6 w-6 place-items-center rounded-full bg-[#2383e2] text-white">→</span>
          </div>
        </div>
      </div>
    </div>
  )
}
function AssistCard() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-8">
      <h3 className="text-[22px] font-semibold leading-tight tracking-tight text-white">
        When you’re stuck, Studyus <span className="inline-flex items-center rounded-full bg-white px-2 py-0.5 text-[13px] font-medium text-black shadow-sm">assists</span> you instantly
      </h3>
      <p className="mt-2 max-w-[38ch] text-[13px] leading-relaxed text-white/60">
        Hit <span className="rounded bg-white px-1 py-0.5 font-mono text-[11px] text-black">⌘ ↵</span> and Studyus writes on
        the board — not hidden in a chat bubble.
      </p>

      <div className="mt-6 flex justify-center">
        <div className="flex items-center gap-2 rounded-full bg-black/40 px-2 py-1.5 text-white shadow-lg ring-1 ring-white/10 backdrop-blur">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white text-black">✳︎</span>
          <span className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" /> Hide
          </span>
          <span className="grid h-7 w-7 place-items-center rounded-full bg-white/10">■</span>
        </div>
      </div>

      <div className="mt-4 rounded-[16px] border border-white/10 bg-[#1c1c1e]/80 p-4 text-white shadow-[0_8px_24px_rgba(0,0,0,0.35)] backdrop-blur">
        <p className="text-[10px] font-medium tracking-wide text-white/40">VIEWED SCREEN</p>
        <p className="mt-1 text-[11px] leading-relaxed text-white/70">
          Studyus is an AI tutor that listens as you work, understands what’s on the board, and gives you instant answers,
          visuals and next steps — all while staying in the flow where you study.
        </p>
        <div className="mt-3 flex items-center gap-2 text-[10px] text-white/40">
          <span>Assist</span>
          <span>·</span>
          <span>What should I say?</span>
          <span>·</span>
          <span>Follow-up</span>
          <span>·</span>
          <span>Recap</span>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] text-white/50">
          Ask about your screen or conversation, or <span className="rounded bg-white/10 px-1 py-0.5 font-mono text-[10px]">⌘ ↵</span> for Assist
          <span className="ml-auto grid h-7 w-7 place-items-center rounded-full bg-[#2383e2] text-white">→</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Instant notes showcase — dark glass ─── */
function InstantNotesShowcase() {
  return (
    <div className="overflow-hidden rounded-[24px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:p-10">
      <div className="mx-auto max-w-[720px] overflow-hidden rounded-[16px] border border-white/10 bg-[#101214] shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.04] px-4 py-2.5">
          <span className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="mx-auto rounded-full bg-white/10 px-3 py-1 text-[10px] font-medium text-white/60">
            Studyus · Notes
          </span>
          <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-black">Share →</span>
        </div>

        <div className="p-6">
          <p className="text-[11px] font-medium tracking-wide text-white/30">TUESDAY · CALCULUS · LIMITS</p>
          <h4 className="mt-1 text-[16px] font-semibold text-white">Derivative as a Limit — Session Notes</h4>

          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="col-span-2">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/30">Core idea</p>
              <div className="mt-2 rounded-xl border border-white/10 bg-white/[0.04] p-3">
                <div className="aspect-[1.7] rounded-lg bg-[#1b2f2b] p-2">
                  <svg viewBox="0 0 200 90" className="h-full w-full">
                    <line x1="10" y1="45" x2="190" y2="45" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <line x1="100" y1="10" x2="100" y2="80" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                    <path d="M18 72 C 60 68, 95 50, 125 32 C 155 18, 175 12, 188 10" fill="none" stroke="#fbbf24" strokeWidth="2" />
                  </svg>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-white/60">
                  Secant slope → tangent slope as h→0. The board kept the graph live while we asked “what does this quotient
                  really measure?”
                </p>
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-white/30">Action items</p>
              <ul className="mt-2 space-y-2 text-[11px] leading-snug text-white/70">
                {[
                  'Write the limit definition for f(x)=x² at a=2',
                  'Pick h = 0.1, 0.01 and compare secant vs tangent',
                  'Sketch the error bound |secant − tangent|',
                  'Re-derive using your book: p. 102, Ex. 3',
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-1 h-3 w-3 shrink-0 rounded border border-white/15 bg-white/5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-[11px] text-white/50">
            <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-black shadow-sm">Questions</span>
            <span>Ask Studyus about any line</span>
            <span className="ml-auto text-white/30">↗</span>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Three-column adapted — dark glass, no lucide icons ─── */
function UndetectableGrid() {
  const items = [
    {
      title: 'No extra busywork.',
      body: 'Tutor captures the thread so you stay on the idea — not on filing notes or hunting screenshots.',
      preview: (
        <div className="flex h-full items-center justify-center bg-[#f6f6f3] p-3">
          <div className="w-full rounded-xl border border-black/5 bg-white p-3 shadow-sm">
            <div className="flex items-center justify-between text-[11px] font-medium text-black">
              <span>Meeting participants (4)</span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-medium text-emerald-700">● No bots detected</span>
            </div>
            <div className="mt-2 space-y-2">
              {[
                { name: 'You', detail: 'you@studyus.local · Owner' },
                { name: 'Tutor', detail: 'Board · Active' },
                { name: 'Notes', detail: 'Auto-captured' },
              ].map((p) => (
                <div key={p.name} className="flex items-center gap-2 rounded-lg border border-black/5 bg-[#fafafa] px-2 py-1.5 text-black">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-black text-[10px] text-white">{p.name[0]}</span>
                  <span className="text-[11px] font-medium">{p.name}</span>
                  <span className="ml-auto text-[9px] text-black/40">{p.detail}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Lives on the board.',
      body: 'Explanations appear where you’re already looking — not as a hidden helper you have to copy from.',
      preview: (
        <div className="flex h-full items-center justify-center bg-[#eef1ff] p-3">
          <div className="relative w-full overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
            <div className="grid grid-cols-2 divide-x divide-black/5">
              <div className="bg-[#f8faff] p-3">
                <p className="text-[10px] font-medium text-black/40">Visible to you</p>
                <div className="mt-2 rounded-lg border border-emerald-200 bg-white p-2">
                  <p className="text-[10px] font-medium text-black">AI Response</p>
                  <p className="mt-1 text-[10px] leading-snug text-black/60">Add a check for missing data…</p>
                  <div className="mt-2 rounded bg-black/5 p-1 font-mono text-[8px] text-black">import axios from ‘axios’</div>
                </div>
              </div>
              <div className="bg-white p-3">
                <p className="text-[10px] font-medium text-black/40">Clear on board</p>
                <div className="mt-2 rounded-lg border border-black/5 bg-[#fafafa] p-2">
                  <p className="text-[10px] font-medium text-black">Notes</p>
                  <div className="mt-1 h-10 rounded bg-gradient-to-br from-slate-50 to-slate-100" />
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-black/10" />
          </div>
        </div>
      ),
    },
    {
      title: 'Follows your focus.',
      body: 'Pan, zoom, ask about any line. The board stays where your eyes are — always in place.',
      preview: (
        <div className="flex h-full flex-col items-center justify-center bg-[#fff6f0] p-3">
          <div className="relative w-full overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
            <div className="h-16 bg-gradient-to-br from-violet-500 via-fuchsia-400 to-amber-200 p-2">
              <div className="rounded-lg bg-white/90 p-2 shadow-sm">
                <div className="h-2 w-16 rounded bg-black/10" />
                <div className="mt-1 grid grid-cols-3 gap-1">
                  <div className="h-8 rounded bg-black/5" />
                  <div className="h-8 rounded bg-black/5" />
                  <div className="h-8 rounded bg-amber-100" />
                </div>
              </div>
            </div>
            <div className="flex justify-center gap-1 bg-white p-2">
              {['⌘', '↑', '↓', '←', '→'].map((k) => (
                <span
                  key={k}
                  className="grid h-6 w-7 place-items-center rounded border border-black/10 bg-white text-[10px] text-black shadow-sm"
                >
                  {k}
                </span>
              ))}
            </div>
          </div>
        </div>
      ),
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.title}>
          <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl">
            <div className="aspect-[1.25] overflow-hidden">{item.preview}</div>
          </div>
          <h4 className="mt-4 text-[15px] font-semibold leading-tight text-white">{item.title}</h4>
          <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{item.body}</p>
        </div>
      ))}
    </div>
  )
}

/* ─── Stats strip — dark glass ─── */
function StatsStrip() {
  return (
    <div className="grid gap-8 rounded-[24px] border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_32px_rgba(0,0,0,0.25)] backdrop-blur-xl sm:grid-cols-[1.1fr_1.4fr] sm:p-8">
      <div className="overflow-hidden rounded-[16px] border border-white/10 bg-black/20 p-3 shadow-sm backdrop-blur">
        <div className="flex items-center gap-2 text-[11px] font-medium text-white/70">
          <span className="h-2 w-2 rounded-full bg-violet-400" /> Studyus session
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-lg bg-[#1b2f2b] p-2 text-white ring-1 ring-white/10">
            <p className="font-mono text-[9px] opacity-60">BOARD</p>
            <div className="mt-1 h-12 rounded bg-white/5" />
          </div>
          <div className="rounded-lg bg-white p-2 ring-1 ring-black/5">
            <p className="font-mono text-[9px] text-black/40">CHAT</p>
            <div className="mt-1 space-y-1">
              <div className="h-1.5 rounded bg-black/10" />
              <div className="h-1.5 w-3/4 rounded bg-black/5" />
            </div>
          </div>
          <div className="rounded-lg bg-[#eef2ff] p-2">
            <p className="font-mono text-[9px] text-black/40">NOTES</p>
            <div className="mt-1 h-12 rounded bg-white" />
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-[20px] font-semibold leading-tight tracking-tight text-white">Real-time, curriculum-aware</h3>
        <div className="mt-6 grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
          {[
            {
              k: '3',
              label: 'Formats',
              sub: 'Multiple-choice, free-response, proofs — same rubric, new items.',
            },
            {
              k: '500ms',
              label: 'Visual feedback',
              sub: 'Board updates as you ask. No waiting for a batch.',
            },
            { k: '100%', label: 'Your book', sub: 'Every drill respects the PDF you uploaded.' },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-[22px] font-semibold leading-none tracking-tight text-white">{s.k}</div>
              <div className="mt-1 text-[11px] font-medium tracking-wide text-white">{s.label}</div>
              <div className="mt-1 text-[11px] leading-snug text-white/50">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─── Dark FAQ ─── */
function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string
  answer: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-4 text-left"
        aria-expanded={isOpen}
      >
        <span className="text-[14px] font-medium text-white">{question}</span>
        <span
          className={`grid h-6 w-6 place-items-center rounded-full border text-white/40 transition ${isOpen ? 'rotate-180 border-white/20 bg-white text-black' : 'border-white/10'}`}
        >
          ⌄
        </span>
      </button>
      {isOpen && <div className="pb-4 text-[13px] leading-relaxed text-white/60">{answer}</div>}
    </div>
  )
}

export default function About({ onNavigate }: { onNavigate: (target: Section) => void }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0)

  return (
    <>
      {/* ── Dark hero + interactive demo — stays on video ── */}
      <section id="about-us" className="relative z-[1] px-5 py-16 text-white sm:px-8 sm:py-20 md:px-10">
        <div className="mx-auto max-w-5xl">
          <SectionLabel>About Us</SectionLabel>
          <h2
            className="max-w-3xl font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[52px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Built so understanding comes first.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Studyus is an AI tutor that teaches the way strong teachers do: draw it out, practice it hard, and stay inside the
            material you already trust. No generic syllabus. No busywork for its own sake.
          </p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Try the live board below — drag to pan, pinch to zoom, or{' '}
            <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[11px]">⌘</span> + scroll. Ask about any line.
          </p>

          <div className="mt-10">
            <ChalkboardViewport />
          </div>
          <p className="mt-3 text-center font-mono text-[11px] text-white/40">
            Demo board · Derivative as a limit · Drag & pinch — page stays put.
          </p>
        </div>
      </section>

      {/* ── Product content — transparent over video, glass cards (no white sheet) ── */}
      <section className="relative z-[1] px-5 pb-12 sm:px-8 md:px-10">
        <div className="mx-auto max-w-[1120px]">
          {/* ── Headline + Notion grid ── */}
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/30">The tutor that draws</p>
            <h2 className="mx-auto mt-3 max-w-[18ch] text-[30px] font-semibold leading-[1.05] tracking-tight text-white sm:text-[40px]">
              AI where your team already studies.
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/60">
              Not a chatbot beside your work — a board that works with it. Every explanation, drill and note lives where you
              look.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <FeatureCard label="See the idea · Chalkboard" title="Turn explanations into drawings.">
              <ChalkboardMiniMock />
            </FeatureCard>
            <FeatureCard label="Ask anything · Grounded" title="Get answers, with the step shown.">
              <AskAnythingMock />
            </FeatureCard>
            <FeatureCard label="Practice · Assessments" title="Keep work moving 24/7 with drills.">
              <PracticeMock />
            </FeatureCard>
            <FeatureCard label="Personal · Curriculum" title="Your book is the syllabus.">
              <CurriculumMock />
            </FeatureCard>
          </div>

          {/* ── How it helps (Cluely two-up) ── */}
          <div className="mt-10">
            <div className="text-center">
              <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[36px]">
                How Studyus helps while you learn
              </h2>
              <p className="mx-auto mt-2 max-w-[52ch] text-[13px] leading-relaxed text-white/50">
                Two quick moves — listen to understand, then show on the board when you ask.
              </p>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <ListenCard />
              <AssistCard />
            </div>
          </div>

          {/* ── Instant notes showcase ── */}
          <div className="mt-16 sm:mt-20">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[36px]">
                Instant notes, without lifting a pen
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                The easiest way to keep beautiful, shareable notes. Studyus captures the steps you actually took.
              </p>
            </div>
            <div className="mt-8">
              <InstantNotesShowcase />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px]">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-white/70 shadow-sm backdrop-blur">
                Export to PDF
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-white/70 shadow-sm backdrop-blur">
                Timeline view
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-white/70 shadow-sm backdrop-blur">
                Share with class
              </span>
            </div>
          </div>

          {/* ── Three-column features ── */}
          <div className="mt-16 sm:mt-20">
            <div className="mx-auto max-w-[640px] text-center">
              <h2 className="text-[28px] font-semibold leading-tight tracking-tight text-white sm:text-[36px]">
                Invisible when you don’t need it. There when you do.
              </h2>
              <p className="mt-2 text-[13px] leading-relaxed text-white/50">
                Three small decisions so the tutor never breaks your flow.
              </p>
            </div>
            <div className="mt-8">
              <UndetectableGrid />
            </div>
          </div>

          {/* ── Stats strip ── */}
          <div className="mt-10">
            <StatsStrip />
            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-white/60 ring-1 ring-white/5">
                Works with any PDF
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-white/60 ring-1 ring-white/5">
                SAT · AP · University courses
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-white/60 ring-1 ring-white/5">
                Free-form learning welcome
              </span>
            </div>
          </div>

          {/* ── FAQ (dark) ── */}
          <div className="mx-auto mt-16 max-w-[760px] sm:mt-20">
            <h3 className="text-[22px] font-semibold tracking-tight text-white sm:text-[28px]">Frequently asked questions</h3>
            <div className="mt-6">
              {FAQS.map((faq, idx) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === idx}
                  onToggle={() => setOpenFAQ(openFAQ === idx ? null : idx)}
                />
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-white px-4 py-2 text-[13px] font-medium text-black">Try Studyus free</span>
              <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-[13px] font-medium text-white backdrop-blur">
                Download for Windows · 15 MB
              </span>
            </div>
          </div>
        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  )
}
