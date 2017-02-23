import * as emoji from './emoji'
import * as Site from '../sites'
import { suggestScore } from './toxicity'

let toggleControlsIn = null

const POPUP_CLASS = 'argh-suggest-score'
const POPUP_SELECTOR = '.argh-suggest-score'
const POPUP_SCORE_BODY_SELECTOR = '.argh-suggest-score__body'
const POPUP_SCORE_HEADING_SELECTOR = '.argh-suggest-score__heading'
const POPUP_SUCCESS_SELECTOR = '.argh-suggest-score__success'

const SUCCESS_TIMEOUT = 60000

const getImprovePopupHTML = classModifier => `
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

const getPopup = () => {
  return document.body.querySelector(POPUP_SELECTOR)
}
const createPopupElement = type => {
  if (type !== 'comment') return null
  const popup = document.createElement('div')
  popup.classList.add(POPUP_CLASS)
  popup.innerHTML = getImprovePopupHTML()
  return popup
}

const removePopupElement = popup => {
  document.body.removeChild(popup)
}

const onScoreSelect = (target, popup) => {
  const score = target.getAttribute('score')
  if (score) {
    const success = popup.querySelector(POPUP_SUCCESS_SELECTOR)
    const message = popup.getAttribute('text')
    const communityId = Site.getPageDomain(document.URL)
    success.classList.add('argh-suggest-score__success--on')

    return suggestScore({ message, score, communityId }, result => result.success ? removePopup(popup) & toggleControlsIn() : null)
  }
  return
}

const removePopup = (popup) => {
  removeClickListener(popup)
  removePopupElement(popup)
  window.behavePopoover = false
}

const clickListener = e => {
  const popup = getPopup()

  if (!popup) return

  const from = e.toElement || e.relatedTarget

  if (popup.contains(from) || from === popup) return onScoreSelect(e.target, popup)
  return removePopup(popup) & toggleControlsIn()
}

const addClickListener = popup => document.body.addEventListener('click', clickListener, false)
const removeClickListener = popup => document.body.removeEventListener('click', clickListener, false)


const addPopup = (block, type, text) => {
  const popup = createPopupElement(type)
  document.body.insertBefore(popup, document.body.lastChild)

  const blockRect = block.getBoundingClientRect()
  const popupRect = popup.getBoundingClientRect()
  const bodyRect = document.body.getBoundingClientRect()
  const targetRect = event.target.getBoundingClientRect()
  const popupTop = targetRect.top - bodyRect.top - popupRect.height - 10
  const popupLeft = blockRect.right - popupRect.width


  popup.setAttribute('style', `top: ${popupTop}px;left: ${popupLeft}px; bottom: 0`)
  popup.setAttribute('score', block.getAttribute('behave-toxicity'))
  popup.setAttribute('text', text)

  window.behavePopoover = true

  return popup
}

export const onShowPopup = (event, block, type, text, toggleControls) => {
  let popup = getPopup()

  toggleControlsIn = toggleControls

  if (popup) {
    return removePopup(popup)
  }

  popup = addPopup(block, type, text)


  setTimeout(() => addClickListener(popup), 500)

}