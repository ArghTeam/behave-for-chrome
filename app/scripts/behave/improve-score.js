import * as emoji from './emoji'

const POPOVER_CLASS = 'argh-suggest-score'
const POPOVER_SELECTOR = '.argh-suggest-score'
const POPOVER_SCORE_BODY_SELECTOR = '.argh-suggest-score__body'
const POPOVER_SCORE_HEADING_SELECTOR = '.argh-suggest-score__heading'
const POPOVER_SUCCESS_SELECTOR = '.argh-suggest-score__success'

const SUCCESS_TIMEOUT = 60000

const getImprovePopoverHTML = classModifier => `
  <div class="argh-suggest-score__holder">
      <div class="argh-suggest-score__heading">
        Suggest new score
      </div>
      <div class="argh-suggest-score__body">
        <div score="0" class="argh-suggest-score__item">${emoji.getEmoji(0)}</div>
        <div score="0.1" class="argh-suggest-score__item">${emoji.getEmoji(0.1)}</div>
        <div score="0.2" class="argh-suggest-score__item">${emoji.getEmoji(0.2)}</div>
        <div score="0.3" class="argh-suggest-score__item">${emoji.getEmoji(0.3)}</div>
        <div score="0.4" class="argh-suggest-score__item">${emoji.getEmoji(0.4)}</div>
        <div score="0.5" class="argh-suggest-score__item">${emoji.getEmoji(0.5)}</div>
        <div score="0.6" class="argh-suggest-score__item">${emoji.getEmoji(0.6)}</div>
        <div score="0.7" class="argh-suggest-score__item">${emoji.getEmoji(0.7)}</div>
        <div score="0.8" class="argh-suggest-score__item">${emoji.getEmoji(0.8)}</div>
        <div score="0.9" class="argh-suggest-score__item">${emoji.getEmoji(0.9)}</div>
        <div score="1" class="argh-suggest-score__item">${emoji.getEmoji(1)}</div>
      </div>
      <div class="argh-suggest-score__success">
        Thank you!
      </div>
  </div>
`

const getPopover = () => {
  return document.body.querySelector(POPOVER_SELECTOR)
}
const createPopoverElement = type => {
  if (type !== 'comment') return null
  const popover = document.createElement('div')
  popover.classList.add(POPOVER_CLASS)
  popover.innerHTML = getImprovePopoverHTML()
  return popover
}

const removePopoverElement = popover => {
  document.body.removeChild(popover)
}

const onScoreSelect = (target, popover) => {
  const score = popover.getAttribute('score')
  const text = popover.getAttribute('text')
  const selectedScore = target.getAttribute('score')
  if (selectedScore) {
    const success = popover.querySelector(POPOVER_SUCCESS_SELECTOR)
    success.classList.add('argh-suggest-score__success--on')
    console.log({ score, text, selectedScore })
    return setTimeout(() => removeClickListener(popover) & removePopoverElement(popover), SUCCESS_TIMEOUT)
  }
  return
}

const clickListener = e => {
  const popover = getPopover()

  if (!popover) return

  const from = e.toElement || e.relatedTarget

  if (popover.contains(from) || from === popover) return onScoreSelect(e.target, popover)
  return removeClickListener(popover) & removePopoverElement(popover)
}

const addClickListener = popover => document.body.addEventListener('click', clickListener, false)
const removeClickListener = popover => document.body.removeEventListener('click', clickListener, false)

export const onImproveScore = (event, block, type, text) => {
  const bodyRect = document.body.getBoundingClientRect()
  const targetRect = event.target.getBoundingClientRect()

  if (getPopover()) return

  const popover = createPopoverElement(type)
  document.body.insertBefore(popover, document.body.lastChild)
  popover.setAttribute('style', `top: ${targetRect.top - bodyRect.top}px;left: ${targetRect.left}px; bottom: 0`)
  popover.setAttribute('score', block.getAttribute('behave-toxicity'))
  popover.setAttribute('text', text)

  setTimeout(() => addClickListener(popover), 500)

}