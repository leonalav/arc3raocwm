import type { BoardDoc, Block } from './boards'
import type { WidgetIntent } from '../lib/widgets/types'
import type { VisualizationIntent } from '../lib/visualization/types'

/**
 * Marketing demo board — written notes with a light touch of product surface:
 * one graph, two widgets, woven into the lesson (not a catalog dump).
 */

let seq = 0
const id = (p: string) => `${p}-${++seq}`

function widget(intent: WidgetIntent): Block {
  return { id: id('w'), kind: 'widget', intent }
}

function visualization(intent: VisualizationIntent): Block {
  return { id: id('v'), kind: 'visualization', intent }
}

const tangentGraph: VisualizationIntent = {
  type: 'function',
  title: 'f(x) = x² at x = 1',
  domainX: [-0.5, 2.8],
  rangeY: [-0.5, 7],
  expressions: [
    { id: 'f', expression: 'x^2', label: 'f(x) = x²', color: '#7dd3fc' },
  ],
  annotations: [
    { kind: 'point', id: 'p', x: 1, label: '(1, 1)' },
    { kind: 'tangent', id: 't', expressionId: 'f', atX: 1, label: "f'(1) = 2" },
  ],
}

const conceptCard: WidgetIntent = {
  kind: 'concept_card',
  term: 'Derivative',
  classification: 'rate of change',
  definition: 'The instantaneous rate of change of a function at a point — the slope of the tangent line.',
  definitionLatex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
  facets: ['Slope of the tangent', 'Limit of the secant'],
}

const checkQuestion: WidgetIntent = {
  kind: 'question',
  prompt: 'As h → 0, what does the secant line become?',
  format: 'multiple_choice',
  options: [
    { id: 'a', label: 'The tangent line at that point', correct: true },
    {
      id: 'b',
      label: 'A vertical line',
      misconception: 'treats the vanishing run as a zero denominator',
    },
    {
      id: 'c',
      label: 'The x-axis',
      misconception: 'confuses the limit of the slope with the limit of the function',
    },
  ],
  explanation: 'Two points on the curve collapse onto one — the secant becomes the tangent.',
}

export const DEMO_BOARD: BoardDoc = {
  id: 'demo-derivatives',
  title: 'Derivatives from first principles',
  subtitle: 'Studyus chalkboard · live feature demo',
  domain: 'math',
  blocks: [
    {
      id: id('b'),
      kind: 'title',
      text: 'Derivatives from first principles',
    },
    {
      id: id('b'),
      kind: 'text',
      text: 'A derivative is not a formula to memorize. It is the **instantaneous rate of change** of a function at a single point — the slope of the tangent line you would draw if you could zoom in forever.',
    },

    // One concept widget — definition card, not a wall of instruments
    widget(conceptCard),

    {
      id: id('b'),
      kind: 'text',
      text: 'Start with the average rate of change on a small interval, then shrink that interval until it vanishes:',
    },
    {
      id: id('b'),
      kind: 'latex',
      tex: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
      caption: 'The difference quotient, taken to the limit.',
    },
    {
      id: id('b'),
      kind: 'bullets',
      items: [
        '**Numerator** — how much the output changed (the rise).',
        '**Denominator** — how far the input moved (the run).',
        '**Limit** — what that ratio settles to as the run goes to zero.',
      ],
    },

    // One graph — the geometric picture of the same idea
    {
      id: id('b'),
      kind: 'text',
      text: 'On the board: the curve and the tangent it is approaching at *x = 1*.',
    },
    visualization(tangentGraph),

    {
      id: id('b'),
      kind: 'text',
      text: 'Worked example. Differentiate *f(x) = x²* without any power rule — only the definition:',
    },
    {
      id: id('b'),
      kind: 'latex',
      tex: '\\frac{(x+h)^2 - x^2}{h} = \\frac{2xh + h^2}{h} = 2x + h',
      caption: 'Expand, cancel, divide. h is not zero yet.',
    },
    {
      id: id('b'),
      kind: 'text',
      text: 'Now let *h → 0*. Every term with an *h* disappears, and you are left with **2x** — the slope of the tangent at that point.',
    },
    {
      id: id('b'),
      kind: 'callout',
      text: 'Remember: derivative = slope of the tangent = limit of the secant.',
    },

    // One check widget — a single question, not a quiz stack
    widget(checkQuestion),

    {
      id: id('b'),
      kind: 'text',
      text: 'Try it yourself: if a population grows as *P(t) = t³*, what is the instantaneous growth rate at *t = 2*? Same idea — different context.',
    },
  ],
}
