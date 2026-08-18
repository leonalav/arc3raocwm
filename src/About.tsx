import { useState } from 'react'
import type { ReactNode } from 'react'
import Footer, { type Section } from './Footer'

/**
 * About Us section.
 *
 * Typography-forward scaffolding inspired by Notion and Cluely.
 * Features:
 *  – Large editorial headings
 *  – Feature grid with demo slots (no placeholder product content)
 *  – Principles section (real design principles)
 *  – FAQ accordion (empty slots for real questions)
 *  – Footer (Cluely-style, with the requested columns removed)
 *  – Background video is preserved (handled by App.tsx)
 */

/* ─── Principles (real, not fabricated) ─── */
const PRINCIPLES: { n: string; title: string; body: string }[] = [
  {
    n: '01',
    title: 'Teach by intuition',
    body: 'We explain the why before the how. Every answer can become a graph, a chart, or an experiment you can poke at.',
  },
  {
    n: '02',
    title: 'No busywork',
    body: 'Notes, flashcards, and mock tests are generated for you. Your job is to think, not to file.',
  },
  {
    n: '03',
    title: 'For every learner',
    body: 'University students, test takers, and the just-curious are all welcome. The tutor adapts to you, not the other way around.',
  },
]

/* ─── Feature slots (scaffolding — no fake product descriptions) ─── */
const FEATURES: { label: string; title: string }[] = [
  { label: 'Feature 01', title: '' },
  { label: 'Feature 02', title: '' },
  { label: 'Feature 03', title: '' },
]

/* ─── FAQ slots (scaffolding — no fake questions) ─── */
const FAQS: { question: string }[] = [
  { question: '' },
  { question: '' },
  { question: '' },
  { question: '' },
  { question: '' },
  { question: '' },
]

/* ─── Components ─── */

/** Empty demo slot frame — no placeholder text about the product. */
function DemoSlot({ label, note }: { label: string; note: string }) {
  return (
    <figure className="border border-white/15 bg-white/[0.04]">
      <div className="flex aspect-video items-center justify-center">
        {/* Empty frame — no placeholder text, no fake screenshots */}
      </div>
      <figcaption className="flex items-center justify-between border-t border-white/15 px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-white/30">
        <span>{label}</span>
        <span>{note}</span>
      </figcaption>
    </figure>
  )
}

/** Feature card for the grid — mirrors Notion's feature cards. */
function FeatureCard({ feature }: { feature: { label: string; title: string } }) {
  return (
    <div className="border border-white/15 bg-white/[0.04] p-6 sm:p-7">
      <p className="text-[11px] uppercase tracking-[0.2em] text-white/40">
        {feature.label}
      </p>
      {feature.title && (
        <h3 className="mt-3 font-heading text-[20px] leading-tight text-white">
          {feature.title}
        </h3>
      )}
      <div className="mt-5">
        <DemoSlot label={feature.label} note="Demo" />
      </div>
    </div>
  )
}

/** FAQ accordion item — mirrors Cluely's FAQ section. */
function FAQItem({
  question,
  isOpen,
  onToggle,
}: {
  question: string
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border-b border-white/15">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left text-[17px] text-white"
        aria-expanded={isOpen}
      >
        <span>{question || 'Question'}</span>
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
          {/* Empty — no placeholder answer */}
        </div>
      )}
    </div>
  )
}

/** Section label — small uppercase label like Notion and Cluely use. */
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
            Studyus began with a simple observation: the moment an idea finally
            clicks is the moment most note taking stops. We wanted to keep that
            moment, and lose everything around it.
          </p>
          <p className="mt-4 max-w-2xl text-[17px] leading-relaxed text-white/80">
            We are a small team of educators and engineers who use the tutor
            ourselves every day. Our focus is one thing: helping you learn by
            intuition, not by memorization.
          </p>

          {/* Hero demo slot */}
          <div className="mt-14">
            <DemoSlot label="Product Demo" note="Overview" />
          </div>

          {/* ── Feature grid (Notion-style "AI where your team works") ── */}
          <div className="mt-24 border-t border-white/15 pt-12">
            <SectionLabel>Features</SectionLabel>
            <h3
              className="max-w-2xl font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[52px]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              AI where your team works.
            </h3>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.label} feature={feature} />
              ))}
            </div>
          </div>

          {/* ── How we work (numbered principles) ── */}
          <div className="mt-24 border-t border-white/15 pt-12">
            <SectionLabel>How we work</SectionLabel>
            <div className="divide-y divide-white/10">
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

          {/* ── FAQ (Cluely-style accordion) ── */}
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
                  key={index}
                  question={faq.question}
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

      {/* ── Footer ── */}
      <Footer onNavigate={onNavigate} />
    </>
  )
}
