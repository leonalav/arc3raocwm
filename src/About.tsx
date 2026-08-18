import { useState } from 'react'
import type { ReactNode } from 'react'
import Footer, { type Section } from './Footer'
import ChalkboardViewport from './components/board/ChalkboardViewport'

/**
 * About Us section.
 *
 * Typography-forward layout. Content centers on three product pillars:
 *  – Virtual chalkboard & visualizations
 *  – Adaptive test generation
 *  – Curriculum built from your own materials
 */

/* ─── How we work ─── */
const PRINCIPLES: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'See it, then solve it',
    body: 'Abstract ideas land faster when you can watch them move. The chalkboard turns explanations into graphs, histograms, and interactive visuals you can poke at until they click.',
  },
  {
    n: '02',
    title: 'Practice that matches the real thing',
    body: 'Mock tests should feel like the exam, not a watered-down quiz. From multiple choice to full proofs, Studyus generates practice at the depth you actually need.',
  },
  {
    n: '03',
    title: 'Your books, your pace',
    body: 'Upload the PDF you already study from. The tutor rebuilds itself around that curriculum so every lesson, diagram, and drill stays inside the material you trust.',
  },
]

/* ─── FAQ ─── */
const FAQS: { question: string; answer: string }[] = [
  {
    question: 'What is the virtual chalkboard?',
    answer:
      'It is an interactive workspace inside Studyus. As you work through a topic, the tutor can draw graphs, histograms, and other visualizations so you learn by seeing the structure—not only by reading text.',
  },
  {
    question: 'What kinds of tests can Studyus generate?',
    answer:
      'Everything from short multiple-choice sets to free-response and proof-style questions. You can drill a single idea or sit a longer mock that mirrors the pace of a real exam.',
  },
  {
    question: 'Can I use my own textbook or course notes?',
    answer:
      'Yes. Upload a PDF of the book or materials you already study with. Studyus shapes explanations, practice, and review around that curriculum so the tutor stays familiar to how you learn.',
  },
  {
    question: 'Who is Studyus built for?',
    answer:
      'University students grinding through courses like Calculus or Linear Algebra, high schoolers preparing for exams such as the SAT or AP, and anyone who simply wants a sharper way to learn.',
  },
  {
    question: 'Do I still need to take notes myself?',
    answer:
      'Studyus captures the thread of what you cover so you can stay focused on understanding. You spend less time filing and more time thinking.',
  },
  {
    question: 'Is Studyus only for test prep?',
    answer:
      'No. Test generation is one pillar. Plenty of learners use the chalkboard and curriculum tools just to understand ideas more deeply—with no exam on the calendar.',
  },
]

/* ─── Components ─── */

/** Empty media frame — no caption bar. */
function DemoSlot() {
  return (
    <div className="aspect-video border border-white/15 bg-white/[0.04]" />
  )
}

/** FAQ accordion item. */
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
    <div className="border-b border-white/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-5 text-left text-[17px] text-white"
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg
          className={`h-4 w-4 shrink-0 text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      {isOpen && (
        <div className="pb-5 text-[15px] leading-relaxed text-white/60">
          {answer}
        </div>
      )}
    </div>
  )
}

/** Section label — small uppercase label. */
function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mb-6 text-[11px] uppercase tracking-[0.22em] text-white/40">
      {children}
    </p>
  )
}

/* ─── Main component ─── */

export default function About({ onNavigate }: { onNavigate: (target: Section) => void }) {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null)

  return (
    <>
      <section
        id="about-us"
        className="relative z-[1] min-h-screen px-5 py-24 text-white sm:px-8 sm:py-32 md:px-10"
      >
        <div className="mx-auto max-w-5xl">

          {/* ── Hero ── */}
          <SectionLabel>About Us</SectionLabel>
          <h2
            className="max-w-3xl font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[52px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Built so understanding comes first.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Studyus is an AI tutor that teaches the way strong teachers do:
            draw it out, practice it hard, and stay inside the material you
            already trust. No generic syllabus. No busywork for its own sake.
          </p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Whether you are deep in a university course, prepping for a
            standardized exam, or learning for the joy of it, the goal is the
            same—help you learn by intuition, not by memorization.
          </p>

          <div className="mt-14">
            <ChalkboardViewport />
          </div>

          {/* ── Feature deep dives ── */}
          <div className="mt-24 border-t border-white/15 pt-12">
            <SectionLabel>Product</SectionLabel>
            <div className="mt-4 space-y-20">
              <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    01 · Chalkboard
                  </p>
                  <h3
                    className="mt-4 font-heading text-[28px] leading-[1.1] tracking-tight sm:text-[36px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Study on a board that can draw the idea.
                  </h3>
                  <p className="mt-5 text-[16px] leading-relaxed text-white/70">
                    When a concept will not settle, seeing it often does the job
                    that another paragraph cannot. Studyus sketches graphs,
                    histograms, and structured visualizations as you go—so
                    derivatives, distributions, and proofs stop feeling abstract.
                  </p>
                  <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                    You are not staring at a wall of chat. You are working
                    beside a board that keeps pace with the question you just asked.
                  </p>
                </div>
                <DemoSlot />
              </div>

              <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                <div className="md:order-2">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    02 · Assessments
                  </p>
                  <h3
                    className="mt-4 font-heading text-[28px] leading-[1.1] tracking-tight sm:text-[36px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Practice every format the exam can throw at you.
                  </h3>
                  <p className="mt-5 text-[16px] leading-relaxed text-white/70">
                    Generate tight drills or full-length mocks. Multiple choice
                    when you need speed. Free response when you need structure.
                    Proof-based questions when you need rigor.
                  </p>
                  <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                    The point is not more questions—it is the right pressure at
                    the right depth, so exam day feels familiar instead of new.
                  </p>
                </div>
                <div className="md:order-1">
                  <DemoSlot />
                </div>
              </div>

              <div className="grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                    03 · Curriculum
                  </p>
                  <h3
                    className="mt-4 font-heading text-[28px] leading-[1.1] tracking-tight sm:text-[36px]"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    Upload the book. We revolve around you.
                  </h3>
                  <p className="mt-5 text-[16px] leading-relaxed text-white/70">
                    Bring any PDF textbook or course packet. Studyus designs the
                    experience around that source—the definitions you were
                    assigned, the chapter order you already follow, the problems
                    your class actually cares about.
                  </p>
                  <p className="mt-4 text-[16px] leading-relaxed text-white/70">
                    Your curriculum. Your rules. Our system adapts to the
                    learner and the material, not the other way around.
                  </p>
                </div>
                <DemoSlot />
              </div>
            </div>
          </div>

          {/* ── How we work ── */}
          <div className="mt-24 border-t border-white/15 pt-12">
            <SectionLabel>How we work</SectionLabel>
            <h3
              className="max-w-2xl font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[44px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Principles behind the tutor.
            </h3>
            <div className="mt-4 divide-y divide-white/10">
              {PRINCIPLES.map((principle) => (
                <div
                  key={principle.n}
                  className="flex flex-col gap-3 py-8 sm:flex-row sm:gap-8"
                >
                  <span
                    className="w-8 shrink-0 font-heading text-[13px] text-white/30"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {principle.n}
                  </span>
                  <div className="flex-1">
                    <h3
                      className="font-heading text-[22px] leading-tight text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {principle.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/65">
                      {principle.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div className="mt-24 border-t border-white/15 pt-12">
            <SectionLabel>Frequently asked questions</SectionLabel>
            <h3
              className="max-w-2xl font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[52px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              FAQ
            </h3>
            <div className="mt-10">
              {FAQS.map((faq, index) => (
                <FAQItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openFAQ === index}
                  onToggle={() =>
                    setOpenFAQ(openFAQ === index ? null : index)
                  }
                />
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer onNavigate={onNavigate} />
    </>
  )
}
