import { useEffect, useRef, useState } from 'react'
import { useInertialScroll } from './useInertialScroll'
import Pricing from './Pricing'
import About from './About'
import Scrollbar from './Scrollbar'

type Section = 'intro' | 'about' | 'pricing'

const VIDEO_URL =
  'https://res.cloudinary.com/xxewz7ta/video/upload/v1786971407/a.mp4'
const SENSITIVITY = 0.8

const navigation = ['Studyus', 'About Us', 'Pricing']
const initialSlides = [
  'Welcome. Meet Studyus, the AI Tutor who knows you.',
  'Are you an university student struggling at Calculus or Linear Algebra? Or a highschooler that needs personalized guidance on standardized tests?',
  'Worry not, we got you covered. Download Studyus using the button below, or scroll down to learn more about the app!',
]
const questions = [
  'I am an university student. How would you help me learn Calculus?',
  'I am a high schooler preparing for a standardized test. Which tests are you offering assistance in?',
  'I just want to learn for fun. Is it okay?',
]
const responses = [
  "Studyus offers you, the learner, everything to help you truly learn by intuition. Our agents can build anything, from 2D graphs and charts to even experiments to help you learn. Most amazingly, you won't even have to take notes. Studyus does the job for you!",
  'For now, we offer assistance in two standardized tests: SAT and AP (for the time being, only Calculus AB & BC and Physics). We also offer unlimited free mock test generations mirroring the exact similar rubrics of the SAT and AP.',
  "More than okay! Every learner is more than welcome to use our app. You don't necessarily have to be a university student or a test preparer to use it.",
]

function useTypewriter(text: string, speed = 24, startDelay = 350, resetKey = 0) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    let intervalId: number | undefined

    const delayId = window.setTimeout(() => {
      let index = 0
      intervalId = window.setInterval(() => {
        index += 1
        setDisplayed(text.slice(0, index))
        if (index >= text.length) {
          window.clearInterval(intervalId)
          setDone(true)
        }
      }, speed)
    }, startDelay)

    return () => {
      window.clearTimeout(delayId)
      if (intervalId !== undefined) window.clearInterval(intervalId)
    }
  }, [text, speed, startDelay, resetKey])

  return { displayed, done }
}

function BackgroundVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const previousX = useRef<number | null>(null)
  const targetTime = useRef(0)
  const seeking = useRef(false)

  const requestSeek = () => {
    const video = videoRef.current
    if (!video || seeking.current || !Number.isFinite(video.duration)) return
    if (Math.abs(video.currentTime - targetTime.current) < 0.01) return
    seeking.current = true
    video.currentTime = targetTime.current
  }

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const video = videoRef.current
      if (previousX.current === null) {
        previousX.current = event.clientX
        return
      }

      const delta = event.clientX - previousX.current
      previousX.current = event.clientX
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return

      const offset = (delta / window.innerWidth) * SENSITIVITY * video.duration
      targetTime.current = Math.min(
        video.duration,
        Math.max(0, targetTime.current + offset),
      )
      requestSeek()
    }

    const resetMouse = () => {
      previousX.current = null
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseleave', resetMouse)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseleave', resetMouse)
    }
  }, [])

  return (
    <video
      ref={videoRef}
      className="fixed inset-0 z-0 h-full w-full object-cover object-[70%_center]"
      src={VIDEO_URL}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      onLoadedMetadata={() => {
        const video = videoRef.current
        if (video) targetTime.current = video.currentTime
      }}
      onSeeked={() => {
        const video = videoRef.current
        seeking.current = false
        if (video && Math.abs(video.currentTime - targetTime.current) >= 0.01) {
          requestSeek()
        }
      }}
    />
  )
}

function Navbar({
  onNavigate,
}: {
  onNavigate: (target: Section) => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)

  const navTarget: Record<string, Section | undefined> = {
    Studyus: 'intro',
    'About Us': 'about',
    Pricing: 'pricing',
  }

  const go = (target: Section) => {
    setMenuOpen(false)
    onNavigate(target)
  }

  return (
    <>
      <nav className="fixed top-0 z-10 flex w-full items-center justify-between px-5 py-4 text-white sm:px-8 sm:py-5">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            go('intro')
          }}
          className="flex items-center gap-3 text-white"
          aria-label="Studyus home"
        >
          <span
            className="text-[21px] tracking-tight sm:text-[26px]"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Studyus®
          </span>
          <span
            className="select-none text-[25px] tracking-[-0.02em] text-white sm:text-[30px]"
            aria-hidden="true"
          >
            ✳︎
          </span>
        </a>

        <div className="absolute left-1/2 hidden -translate-x-1/2 items-center text-[23px] text-white md:flex">
          {navigation.map((item, index) => {
            const target = navTarget[item]
            return (
              <span key={item}>
                {target ? (
                  <a
                    href={target === 'pricing' ? '#pricing' : target === 'about' ? '#about-us' : '#'}
                    onClick={(e) => {
                      e.preventDefault()
                      go(target)
                    }}
                    className="transition-opacity hover:opacity-60"
                  >
                    {item}
                  </a>
                ) : (
                  <a
                    href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
                    className="transition-opacity hover:opacity-60"
                  >
                    {item}
                  </a>
                )}
                {index < navigation.length - 1 && ', '}
              </span>
            )
          })}
        </div>

        <a
          href="#download"
          onClick={(e) => {
            e.preventDefault()
            go('intro')
          }}
          className="hidden text-[23px] text-white underline underline-offset-2 transition-opacity hover:opacity-60 md:block"
        >
          Try Studyus free
        </a>

        <button
          type="button"
          className="relative z-20 flex flex-col gap-[5px] p-1 md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span className={`h-[2px] w-6 bg-white transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`h-[2px] w-6 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`h-[2px] w-6 bg-white transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </nav>

      <div
        className={`fixed inset-0 z-[9] flex flex-col justify-center gap-8 bg-black/90 px-8 text-white transition-opacity duration-300 md:hidden ${
          menuOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!menuOpen}
      >
        {navigation.map((item) => {
          const target = navTarget[item]
          return target ? (
            <a
              key={item}
              href={target === 'pricing' ? '#pricing' : target === 'about' ? '#about-us' : '#'}
              className="text-[32px] font-medium text-white"
              onClick={(e) => {
                e.preventDefault()
                go(target)
              }}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item}
            </a>
          ) : (
            <a
              key={item}
              href={`#${item.toLowerCase().replaceAll(' ', '-')}`}
              className="text-[32px] font-medium text-white"
              onClick={() => setMenuOpen(false)}
              tabIndex={menuOpen ? 0 : -1}
            >
              {item}
            </a>
          )
        })}
        <a
          href="#download"
          className="text-[32px] font-medium text-white underline underline-offset-2"
          onClick={(e) => {
            e.preventDefault()
            go('intro')
          }}
          tabIndex={menuOpen ? 0 : -1}
        >
          Try Studyus free
        </a>
      </div>
    </>
  )
}

function WindowsIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M1 2.35 7.35 1.5v6.08H1V2.35Zm7.2-.97L15 0.5v7.08H8.2v-6.2ZM1 8.42h6.35v6.08L1 13.65V8.42Zm7.2 0H15v7.08l-6.8-.91V8.42Z" />
    </svg>
  )
}

function Hero() {
  const [actionsVisible, setActionsVisible] = useState(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [responseSlides, setResponseSlides] = useState<string[]>([])
  const [generatingQuestions, setGeneratingQuestions] = useState<number[]>([])
  const [generationKey, setGenerationKey] = useState(0)
  const slides = [...initialSlides, ...responseSlides]
  const currentText = slides[activeSlide] ?? slides[0]
  const { displayed, done } = useTypewriter(currentText, 24, 350, generationKey)

  useEffect(() => {
    const timeout = window.setTimeout(() => setActionsVisible(true), 400)
    return () => window.clearTimeout(timeout)
  }, [])

  useEffect(() => {
    if (!done || activeSlide >= initialSlides.length) return
    const timeout = window.setTimeout(() => {
      setActiveSlide((current) => (current + 1) % initialSlides.length)
    }, 3200)
    return () => window.clearTimeout(timeout)
  }, [activeSlide, done])

  useEffect(() => {
    if (!done) return
    const completedQuestion = responses.indexOf(currentText)
    if (completedQuestion >= 0) {
      setGeneratingQuestions((current) =>
        current.filter((question) => question !== completedQuestion),
      )
    }
  }, [currentText, done])

  const answerQuestion = (questionIndex: number) => {
    const response = responses[questionIndex]
    setGeneratingQuestions((current) =>
      current.includes(questionIndex) ? current : [...current, questionIndex],
    )

    const existingIndex = responseSlides.indexOf(response)
    if (existingIndex >= 0) {
      setActiveSlide(initialSlides.length + existingIndex)
      setGenerationKey((current) => current + 1)
      return
    }
    setResponseSlides((current) => [...current, response])
    setActiveSlide(initialSlides.length + responseSlides.length)
    setGenerationKey((current) => current + 1)
  }

  return (
    <main className="relative z-[1] flex h-screen flex-col justify-end overflow-hidden px-5 pb-8 sm:px-8 sm:pb-12 md:justify-center md:px-10 md:pb-0">
      <div className="relative z-10 max-w-2xl">
        <div className="mb-5 min-h-[120px] sm:mb-6 sm:min-h-[105px]" aria-live="polite">
          <p
            key={`${activeSlide}-${currentText}`}
            className="carousel-slide text-white"
            style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.35, fontWeight: 400 }}
            aria-label={currentText}
          >
            <span aria-hidden="true">{displayed}</span>
            {!done && (
              <span
                className="typewriter-cursor ml-[2px] inline-block h-[1.05em] w-[2px] align-middle bg-white"
                aria-hidden="true"
              />
            )}
          </p>
          <div className="mt-4 flex items-center gap-2" aria-label="Carousel navigation">
            {initialSlides.map((slide, index) => (
              <button
                key={`${slide}-${index}`}
                type="button"
                className={`h-[5px] rounded-full bg-white transition-all duration-300 ${
                  index === activeSlide ? 'w-6 opacity-100' : 'w-[5px] opacity-50 hover:opacity-80'
                }`}
                onClick={() => setActiveSlide(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === activeSlide ? 'true' : undefined}
              />
            ))}
          </div>
        </div>

        <div
          className="flex flex-col items-start gap-2"
          style={{
            opacity: actionsVisible ? 1 : 0,
            transform: actionsVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease, transform 0.4s ease',
          }}
        >
          {questions.map((question, index) => {
            const isGenerating = generatingQuestions.includes(index)
            return (
              <button
                key={question}
                type="button"
                className={`inline-flex max-w-full items-center justify-center rounded-full border px-4 py-[0.45em] text-left text-[13px] leading-tight transition-colors duration-200 sm:px-5 sm:text-[15px] ${
                  isGenerating
                    ? 'cursor-wait border-white/20 bg-white/45 text-black/50'
                    : 'border-black/10 bg-white text-black hover:bg-black hover:text-white'
                }`}
                onClick={() => answerQuestion(index)}
                disabled={isGenerating}
                aria-busy={isGenerating}
              >
                {question}
              </button>
            )
          })}
          <a
            id="download"
            href="#download"
            className="mt-1 inline-flex items-center gap-2 rounded-full border border-white bg-transparent px-4 py-[0.45em] text-[13px] text-white transition-colors duration-200 hover:bg-white hover:text-black sm:gap-3 sm:px-5 sm:text-[15px]"
            aria-label="Download Studyus for Windows, 15 megabytes"
          >
            <WindowsIcon />
            <span>Download for Windows · 15MB</span>
          </a>
        </div>
      </div>
    </main>
  )
}

export default function App() {
  useInertialScroll()

  const [section, setSection] = useState<Section>('intro')
  const [fading, setFading] = useState(false)

  const navigate = (target: Section) => {
    if (target === section || fading) return
    setFading(true)
    window.setTimeout(() => {
      setSection(target)
      window.scrollTo(0, 0)
      requestAnimationFrame(() => requestAnimationFrame(() => setFading(false)))
    }, 500)
  }

  return (
    <div className="min-h-full w-full">
      <BackgroundVideo />
      <Navbar onNavigate={navigate} />
      <Scrollbar />
      <div
        className="relative z-[1]"
        style={{
          opacity: fading ? 0 : 1,
          transition: 'opacity 500ms ease',
        }}
      >
        {section === 'intro' ? (
          <Hero />
        ) : section === 'about' ? (
          <About onNavigate={navigate} />
        ) : (
          <Pricing onNavigate={navigate} />
        )}
      </div>
    </div>
  )
}
