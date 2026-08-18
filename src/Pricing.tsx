import { useState } from 'react'
import Footer, { type Section } from './Footer'

type Tier = {
  name: string
  tagline: string
  monthly: number | null
  annual: number | null
  features: string[]
  cta: string
  featured: boolean
}

const TIERS: Tier[] = [
  {
    name: 'Student',
    tagline: 'For getting started.',
    monthly: null,
    annual: null,
    features: [
      '100 credits per month',
      'Limited mock test generations (2 tests/week)',
      'Community support',
    ],
    cta: 'Start free',
    featured: false,
  },
  {
    name: 'Learner',
    tagline: 'For regular learners.',
    monthly: 15,
    annual: 10,
    features: [
      '250 credits per month',
      'Extensive mock test generations (20 tests/week)',
      'Extensive community support',
      'Access to EXPERIMENTAL features',
    ],
    cta: 'Choose Learner',
    featured: true,
  },
  {
    name: 'Learner+',
    tagline: 'For power learners.',
    monthly: 30,
    annual: 20,
    features: [
      '1000 credits per month',
      'Extensive mock test generations with maximum depth and quality (50 tests/week)',
      'Priority community support',
      'Access to EXPERIMENTAL features',
      'BYOK enabled',
    ],
    cta: 'Choose Learner+',
    featured: false,
  },
]

export default function Pricing({
  onNavigate,
}: {
  onNavigate: (target: Section) => void
}) {
  const [annual, setAnnual] = useState(false)

  return (
    <>
      <section
        id="pricing"
        className="relative z-[1] min-h-screen px-5 py-24 text-white sm:px-8 sm:py-32 md:px-10"
      >
        <div className="mx-auto max-w-5xl">
          <p className="mb-6 text-[12px] uppercase tracking-[0.2em] text-white/60">
            Pricing
          </p>
          <h2 className="font-heading text-[34px] leading-[1.05] tracking-tight sm:text-[52px]">
            Choose how you learn.
          </h2>
          <p className="mt-6 max-w-2xl text-[17px] leading-relaxed text-white/80">
            Every tier includes the full Studyus tutor. Pick the plan that
            matches how much you practice.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <div
              className="inline-flex border border-white/30"
              role="group"
              aria-label="Billing period"
            >
              <button
                type="button"
                onClick={() => setAnnual(false)}
                aria-pressed={!annual}
                className={`px-4 py-2 text-[14px] ${
                  !annual ? 'bg-white text-black' : 'text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setAnnual(true)}
                aria-pressed={annual}
                className={`border-l border-white/30 px-4 py-2 text-[14px] ${
                  annual ? 'bg-white text-black' : 'text-white'
                }`}
              >
                Annual
              </button>
            </div>
            <span className="text-[13px] text-white/60">
              Annual billing saves 33% on paid tiers.
            </span>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {TIERS.map((tier) => {
              const price = tier.monthly === null ? null : annual ? tier.annual : tier.monthly
              const light = tier.featured

              return (
                <div
                  key={tier.name}
                  className={`flex flex-col p-7 sm:p-8 ${
                    light
                      ? 'bg-[#f2f0ea] text-black'
                      : 'border border-white/20 bg-black/55'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-heading text-[22px]">{tier.name}</h3>
                    {light && (
                      <span className="text-[11px] uppercase tracking-[0.16em] text-black/50">
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className={`mt-2 text-[14px] ${light ? 'text-black/60' : 'text-white/60'}`}>
                    {tier.tagline}
                  </p>

                  <div className="mt-6 flex items-baseline gap-2">
                    <span className="font-heading text-[52px] leading-none">
                      {price === null ? '$0' : `$${price}`}
                    </span>
                    <span className={`text-[14px] ${light ? 'text-black/60' : 'text-white/60'}`}>
                      {price === null ? 'forever' : '/ month'}
                    </span>
                  </div>
                  {price !== null && annual && (
                    <p className={`mt-1 text-[13px] ${light ? 'text-black/60' : 'text-white/60'}`}>
                      Billed annually
                    </p>
                  )}

                  <ul
                    className={`mt-7 flex-1 divide-y border-t pt-1 text-[15px] leading-relaxed ${
                      light
                        ? 'divide-black/10 border-black/10'
                        : 'divide-white/10 border-white/10'
                    }`}
                  >
                    {tier.features.map((feature) => (
                      <li key={feature} className="py-3">
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <a
                    href="#download"
                    className={`mt-8 inline-block border px-5 py-3 text-center text-[15px] ${
                      light
                        ? 'border-black bg-black text-white'
                        : 'border-white/40 text-white'
                    }`}
                  >
                    {tier.cta}
                  </a>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer onNavigate={onNavigate} />
    </>
  )
}
