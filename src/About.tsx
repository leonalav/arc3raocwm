import type { ReactNode } from 'react'

/**
 * About Us section.
 *
 * Typography-forward in the spirit of Notion and Cluely: one big statement,
 * a short lede, editorial numbered principles, and clean empty frames reserved
 * for product demos (no fabricated screenshots or placeholder product UI).
 */

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

function DemoSlot({ slot, note }: { slot: string; note: string }) {
  return (
    <figure className="border border-white/20 bg-black/40">
      <div className="flex aspect-video items-center justify-center">
        <span className="select-none text-[13px] uppercase tracking-[0.2em] text-white/30">
          Product demo
        </span>
      </div>
      <figcaption className="flex items-center justify-between border-t border-white/20 px-4 py-3 text-[12px] uppercase tracking-[0.16em] text-white/40">
        <span>{slot}</span>
        <span>{note}</span>
      </figcaption>
    </figure>
  )
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3 py-8 sm:flex-row sm:gap-8">
      {children}
    </div>
  )
}

export default function About() {
  return (
    <section
      id="about-us"
      className="relative z-[1] min-h-screen px-5 py-24 text-white sm:px-8 sm:py-32 md:px-10"
    >
      <div className="mx-auto max-w-5xl">
        <p className="mb-6 text-[12px] uppercase tracking-[0.2em] text-white/60">
          About Us
        </p>
        <h2 className="max-w-3xl font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[52px]">
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

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <DemoSlot slot="Slot 01" note="How it works" />
          <DemoSlot slot="Slot 02" note="In the app" />
          <DemoSlot slot="Slot 03" note="For learners" />
        </div>

        <div className="mt-20 border-t border-white/20">
          <p className="pt-6 text-[12px] uppercase tracking-[0.2em] text-white/60">
            How we work
          </p>
          <div className="divide-y divide-white/15">
            {PRINCIPLES.map((principle) => (
              <Row key={principle.n}>
                <span className="w-8 shrink-0 font-heading text-[13px] text-white/40">
                  {principle.n}
                </span>
                <div className="flex-1">
                  <h3 className="font-heading text-[22px] leading-tight">
                    {principle.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">
                    {principle.body}
                  </p>
                </div>
              </Row>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
