import { useMemo, useRef, useState } from 'react'
import {
  Chalkboard,
  THEMES,
  FONTS,
  type BoardTheme,
  type Stroke,
} from './Chalkboard'
import { BoardToolbar, type PanelId, type PenTool } from './BoardToolbar'
import {
  ChatDock,
  SettingsPanel,
  type ChatAttachment,
  type ChatMsg,
} from './BoardPanels'
import { DEMO_BOARD } from '../../data/demoBoard'
import type { VisualizationState } from '../../lib/visualization/types'
import type { WidgetState } from '../../lib/widgets/types'
import type { BoardDoc, Block } from '../../data/boards'

/**
 * Live Chalkboard feature mount for the marketing site.
 * Mirrors the app shell: full-bleed board + top toolbar + AI Response dock.
 * Demo content is written notes (no widget grid).
 */
export default function ChalkboardViewport() {
  const [theme, setTheme] = useState<BoardTheme>(
    () => THEMES.find((t) => t.id === 'classic') ?? THEMES[0],
  )
  // App defaults: Gloria Hallelujah handwriting at 100% scale.
  const [fontId, setFontId] = useState('gloria')
  const [fontScale, setFontScale] = useState(1)
  const [latex, setLatex] = useState(true)
  const fontCss = FONTS.find((f) => f.id === fontId)?.css ?? FONTS[0].css

  const [board, setBoard] = useState<BoardDoc>(DEMO_BOARD)
  const [strokesKey] = useState('demo')
  const strokes = useMemo<Stroke[]>(() => [], [])
  const clearInkRef = useRef<() => void>(() => {})

  const [panel, setPanel] = useState<PanelId>(null)
  const [penTool, setPenTool] = useState<PenTool>('pen')
  const [penColor, setPenColor] = useState('#fbbf24')
  const [recording, setRecording] = useState(false)

  const [chatOpen, setChatOpen] = useState(true)
  const [chatCollapsed, setChatCollapsed] = useState(false)
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      id: 1,
      role: 'tutor',
      text: 'I put the core idea on the board — the derivative as the limit of the secant. Read the notes, then ask me about any line that does not click.',
    },
  ])
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])
  const nextId = useRef(2)

  const patchBlockState = (blockId: string, patch: (block: Block) => Block) => {
    setBoard((current) => ({
      ...current,
      blocks: mapBlocks(current.blocks, blockId, patch),
    }))
  }

  const handleSend = (text: string, imageData?: string) => {
    const content = text.trim()
    if (!content && !imageData) return
    const userMsg: ChatMsg = {
      id: nextId.current++,
      role: 'user',
      text: content || '(image attached)',
      imageData,
    }
    setMessages((list) => [...list, userMsg])
    setAttachments([])
    window.setTimeout(() => {
      setMessages((list) => [
        ...list,
        {
          id: nextId.current++,
          role: 'tutor',
          text: 'In the full app I would answer on this board and keep writing notes with you. Here you are seeing the real chalkboard shell — try panning the notes or asking another question.',
        },
      ])
    }, 700)
  }

  return (
    <div
      className="board-chrome overflow-hidden border border-white/15"
      data-nopan
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* Full-bleed chalkboard — no black inset frame.
          data-nopan + stopPropagation: isolate demo interactions from the
          page-level inertial scroll. Without this a click inside the chat dock
          could be interpreted as an anchor glide and jump to #about-us. */}
      <div
        className="relative aspect-[16/10] w-full min-h-[480px] overflow-hidden sm:min-h-[560px] md:min-h-[680px]"
        data-nopan
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onWheel={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0">
          <Chalkboard
            board={board}
            theme={theme}
            fontCss={fontCss}
            fontScale={fontScale}
            writing={false}
            latex={latex}
            onAsk={(selection, question) => {
              handleSend(`About "${selection}": ${question}`)
            }}
            annotating={panel === 'annotate'}
            penColor={penColor}
            penTool={penTool}
            strokesKey={strokesKey}
            initialStrokes={strokes}
            initialView={{ x: 48, y: 36, s: 1 }}
            onClearRef={(fn) => {
              clearInkRef.current = fn
            }}
            onBlockStateChange={(blockId, state: VisualizationState) => {
              patchBlockState(blockId, (block) =>
                block.kind === 'visualization' ? { ...block, state } : block,
              )
            }}
            onWidgetStateChange={(blockId, state: WidgetState) => {
              patchBlockState(blockId, (block) =>
                block.kind === 'widget' ? { ...block, state } : block,
              )
            }}
          />
        </div>

        <BoardToolbar
          active={panel}
          onToggle={(p) => {
            if (p === 'chat') {
              if (!chatOpen) {
                setChatOpen(true)
                setChatCollapsed(false)
              } else if (chatCollapsed) {
                setChatCollapsed(false)
              } else {
                setChatOpen(false)
              }
              setPanel(null)
              return
            }
            if (p === 'threads') {
              setPanel(null)
              return
            }
            setPanel(p)
          }}
          recording={recording}
          onRecord={() => setRecording((r) => !r)}
          onExport={() => {
            /* marketing mount */
          }}
          threadCount={1}
          onStop={() => {
            /* marketing mount */
          }}
          penTool={penTool}
          setPenTool={setPenTool}
          penColor={penColor}
          setPenColor={setPenColor}
          onClearInk={() => clearInkRef.current()}
          chatCount={messages.filter((m) => m.role === 'tutor').length}
        />

        {panel === 'settings' && (
          <SettingsPanel
            theme={theme}
            setTheme={setTheme}
            fontId={fontId}
            setFontId={setFontId}
            fontScale={fontScale}
            setFontScale={setFontScale}
            latex={latex}
            setLatex={setLatex}
            onClose={() => setPanel(null)}
          />
        )}

        {chatOpen && (
          <ChatDock
            messages={messages}
            onSend={handleSend}
            onRevertMessage={(messageId) => {
              setMessages((list) => {
                const idx = list.findIndex((m) => m.id === messageId)
                if (idx < 0) return list
                return list.slice(0, idx)
              })
            }}
            collapsed={chatCollapsed}
            setCollapsed={setChatCollapsed}
            onClose={() => setChatOpen(false)}
            typing={false}
            agentStatus="idle"
            activity={null}
            attachments={attachments}
            onAddAttachment={(kind, name, url, mimeType, textContent) => {
              const placeholder =
                name ||
                {
                  file: `file-${Date.now()}.txt`,
                  image: `image-${Date.now()}.png`,
                  audio: `voice-${Date.now()}.m4a`,
                  code: `snippet-${Date.now()}.txt`,
                }[kind]
              setAttachments((list) => [
                ...list,
                { name: placeholder, kind, url, mimeType, textContent },
              ])
            }}
            onClearAttachments={() => setAttachments([])}
            onRemoveAttachment={(index) => {
              setAttachments((list) => list.filter((_, i) => i !== index))
            }}
            onSpeakLast={() => {
              /* marketing mount */
            }}
            rewinding={false}
          />
        )}
      </div>
    </div>
  )
}

function mapBlocks(blocks: Block[], blockId: string, patch: (block: Block) => Block): Block[] {
  return blocks.map((block) => {
    if (block.id === blockId) return patch(block)
    if (block.kind === 'row') {
      return { ...block, children: mapBlocks(block.children, blockId, patch) }
    }
    return block
  })
}
