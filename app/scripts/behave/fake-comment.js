import * as Emoji from './emoji'
import * as SuggestScorePopup from './suggest-score-popup'

const HOLDER_SELECTOR = '.argh-fakeContent'
const HOLDER_OVERLAY_SELECTOR = '.argh-overlay'
const HOLDER_SHOW_BUTTON_SELECTOR = '.argh-overlay > a'
const HOLDER_EMOJI_SELECTOR = '.argh-emojis'
const COMMENT_HOLDER_CLASS = 'argh-fakeContent'
const COMMENT_HOLDER_ACTIVE_CLASS = 'argh-active'


const COMMENT_CONTROLS_CLASS = 'argh-controls'
const COMMENT_CONTROLS_SELECTOR = '.argh-controls'
const COMMENT_CONTROLS_HIDE_SELECTOR = 'a[name="argh-controls-hide_comment"]'
const COMMENT_CONTROLS_IMPROVE_SCORE_SELECTOR = 'a[name="argh-controls-improve_score"]'
const COMMENT_CONTROLS_EMOJI_SELECTOR = 'div[name="argh-controls-emoji"]'


const SHOW_OVERLAY_TIMEOUT = 300
const HIDE_OVERLAY_TIMEOUT = 300

const getFakeCommentHolderHTML = classModifier => `
    <span class="argh-fakeAvatar ${classModifier}"></span>
    <div class="argh-fakeHolder">
      <span class="argh-fakeName"></span>
      <span class="argh-fakeText"></span>
    </div>
    <div class="argh-emojis"></div>
    <div class="argh-overlay">
      <span class="argh-copy">Hidden by Behave!</span>
      <a href="#0" class="yt-uix-button yt-uix-button-default yt-uix-button-size-default"><span class="yt-uix-button-content">Show comment</span></a>
    </div>
`
const getFakeCommentControlsHTML = classModifier => `
  <a name="argh-controls-hide_comment" class="argh-controls__item" href="#0">Hide</a>
  <a name="argh-controls-improve_score" class="argh-controls__item" href="#0">Improve score</a>
  <div name="argh-controls-emoji" class="argh-controls__item"></div>
`

const getFakeHolder = block => block ? block.querySelector(HOLDER_SELECTOR) : null

const createFakeCommentHolderElement = type => {
  if (type !== 'comment') return null
  const holder = document.createElement('div')
  holder.classList.add(COMMENT_HOLDER_CLASS)
  holder.innerHTML = getFakeCommentHolderHTML()
  return holder
}

const createFakeCommentControlsElement = type => {
  if (type !== 'comment') return null
  const holder = document.createElement('div')
  holder.classList.add(COMMENT_CONTROLS_CLASS)
  holder.innerHTML = getFakeCommentControlsHTML()
  return holder
}

const setCommentBlockPosition = block => {
  if (!block.style.position) {
    block.style.position = 'relative'
  }
}

const toggleOverlayEvent = (block, holder) => {
  let mouseOver = false
  holder.onmouseover = () => {
    mouseOver = true
    setTimeout(() => {
      const unblocked = block.getAttribute('behave') === 'loaded' && block.getAttribute('behave-toxicity')

      if (mouseOver && unblocked) {
        holder.classList.add(COMMENT_HOLDER_ACTIVE_CLASS)
      }
    }, SHOW_OVERLAY_TIMEOUT)
  }
  holder.onmouseout = (e) => {
    mouseOver = false
    setTimeout(() => {
      const from = e.toElement || e.relatedTarget
      if (holder.contains(from) || from === holder) return
      holder.classList.remove(COMMENT_HOLDER_ACTIVE_CLASS)
    }, HIDE_OVERLAY_TIMEOUT)
  }
}

const toggleControlsEvent = (block, type) => {
  let mouseOver = false
  let controls = null
  block.onmouseover = () => {
    mouseOver = true
    setTimeout(() => {
      const unblocked = block.getAttribute('behave') === 'loaded' && block.getAttribute('behave-toxicity')
      if (mouseOver && unblocked && !window.behavePopoover) {
        toggleControls(block, true)
      }
    }, SHOW_OVERLAY_TIMEOUT)
  }
  block.onmouseout = (e) => {
    mouseOver = false
    setTimeout(() => {
      const from = e.toElement || e.relatedTarget
      if (block.contains(from) || from === block || window.behavePopoover) return
      toggleControls(block, false)
    }, HIDE_OVERLAY_TIMEOUT)
  }
}

const toggleControls = (block, toggle) => {
  const controls = block.querySelector(COMMENT_CONTROLS_SELECTOR)
  if (controls)
    controls.style.display = toggle ? 'flex' : 'none'
}

export const setBlockEmoji = (block, toxicity) => {
  if (toxicity === undefined) {
    toxicity = parseFloat(block.getAttribute('behave-toxicity'))
  }

  const controlsEmoji = block.querySelector(COMMENT_CONTROLS_EMOJI_SELECTOR)
  if (controlsEmoji) {
    controlsEmoji.innerHTML = Emoji.getEmoji(toxicity)
  }

  const holder = getFakeHolder(block)
  if (holder) {
    const emojiBlock = holder.querySelector(HOLDER_EMOJI_SELECTOR)
    if (emojiBlock) {
      if (emojiBlock.getAttribute('behave-emojies')) return
      const additionalEmojies = Emoji.isExtremeEmoji(toxicity) ? '' : Emoji.getFewAdditionalEmojies(toxicity)
      emojiBlock.innerHTML = `${Emoji.getEmoji(toxicity)}${additionalEmojies}`
      emojiBlock.setAttribute('behave-emojies', 'true')
    }
  }
}

export const hideCommentBlock = (block, type, text) => {
  let holder = getFakeHolder(block)

  if (holder) {
    return holder.style.display = 'flex'
  }

  setCommentBlockPosition(block)

  holder = createFakeCommentHolderElement(type)
  block.insertBefore(holder, block.firstChild)

  const controls = createFakeCommentControlsElement(type)
  block.insertBefore(controls, block.firstChild)

  const hideButton = block.querySelector(COMMENT_CONTROLS_HIDE_SELECTOR)
  const improveButton = block.querySelector(COMMENT_CONTROLS_IMPROVE_SCORE_SELECTOR)
  const showButton = holder.querySelector(HOLDER_SHOW_BUTTON_SELECTOR)
  const overlay = holder.querySelector(HOLDER_OVERLAY_SELECTOR)

  toggleControlsEvent(block)

  if (improveButton) improveButton.addEventListener('click', e => e.preventDefault() & SuggestScorePopup.onShowPopup(e, block, type, text, () => toggleControls(block, false)))
  if (hideButton) hideButton.addEventListener('click', e => e.preventDefault() & hideCommentBlock(block, type, text) & setBlockEmoji(block))
  if (overlay) toggleOverlayEvent(block, holder)
  if (showButton) showButton.addEventListener('click', e => e.preventDefault() & showCommentBlock(block, holder))
}

export const showCommentBlock = (block, holder) => {
  holder = holder || getFakeHolder(block)
  if (!holder) return
  holder.style.display = 'none'
}
