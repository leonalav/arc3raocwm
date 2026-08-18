import type { ReactNode } from 'react'

export type Section = 'intro' | 'about' | 'pricing'

interface FooterProps {
  onNavigate: (target: Section) => void
}

/* ─── Footer link data ─── */

const PRODUCT_LINKS: { label: string; target: Section }[] = [
  { label: 'Download', target: 'intro' },
  { label: 'Pricing', target: 'pricing' },
  { label: 'About Us', target: 'about' },
]

const RESOURCE_LINKS: { label: string; target: Section; badge?: string }[] = [
  { label: 'Mobile', target: 'intro', badge: 'Soon' },
  { label: 'Blog', target: 'intro' },
  { label: 'Manifesto', target: 'about' },
]

const SUPPORT_LINKS: { label: string; target: Section }[] = [
  { label: 'Privacy Policy', target: 'intro' },
  { label: 'Terms of Service', target: 'intro' },
  { label: 'Contact Us', target: 'intro' },
]

/* ─── Components ─── */

function InlineLink({
  label,
  target,
  onNavigate,
  badge,
}: {
  label: string
  target: Section
  onNavigate: (target: Section) => void
  badge?: string
}) {
  return (
    <a
      href="#"
      onClick={(e) => {
        e.preventDefault()
        onNavigate(target)
      }}
      className="group inline-flex items-center gap-2 transition-opacity hover:opacity-100"
    >
      <span className="text-[15px] leading-relaxed text-white/70 group-hover:text-white sm:text-[17px]">
        {label}
      </span>
      {badge && (
        <span
          className="rounded-full border border-white/30 px-2 py-[2px] text-[10px] font-medium uppercase tracking-[0.14em] text-white/60 group-hover:border-white/60 group-hover:text-white"
        >
          {badge}
        </span>
      )}
    </a>
  )
}

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="text-white/40 transition-opacity hover:opacity-80"
    >
      {children}
    </a>
  )
}

/* ─── Main component ─── */

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-[1] px-5 py-20 text-white sm:px-8 sm:py-28 md:px-10">
      <div className="mx-auto max-w-5xl">
        {/* ── Brand statement ── */}
        <div className="flex items-baseline gap-3">
          <span
            className="font-heading text-[40px] leading-[1.05] tracking-[-0.02em] sm:text-[64px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Studyus<span className="text-white/40">®</span>
          </span>
          <span
            className="select-none text-[34px] tracking-[-0.02em] text-white sm:text-[52px]"
            aria-hidden="true"
          >
            ✳︎
          </span>
        </div>

        <p
          className="mt-8 max-w-2xl font-heading text-[24px] leading-[1.15] tracking-tight text-white/85 sm:text-[32px]"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          The AI tutor who knows you. Learn by intuition, not by memorization.
        </p>

        {/* ── Inline link groups ── */}
        <div className="mt-16 flex flex-col gap-8 sm:flex-row sm:gap-16">
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            {PRODUCT_LINKS.map((link) => (
              <InlineLink
                key={link.label}
                label={link.label}
                target={link.target}
                onNavigate={onNavigate}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            {RESOURCE_LINKS.map((link) => (
              <InlineLink
                key={link.label}
                label={link.label}
                target={link.target}
                onNavigate={onNavigate}
                badge={link.badge}
              />
            ))}
          </div>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-3">
            {SUPPORT_LINKS.map((link) => (
              <InlineLink
                key={link.label}
                label={link.label}
                target={link.target}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="mt-20 flex flex-col gap-4 border-t border-white/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-white/40">
            © 2026 Studyus. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <SocialIcon label="X">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="YouTube">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="Instagram">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
            </SocialIcon>
            <SocialIcon label="TikTok">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5.8 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </SocialIcon>
          </div>
        </div>
      </div>
    </footer>
  )
}
