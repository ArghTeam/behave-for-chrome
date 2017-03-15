import * as Blocks from './block'
import * as Site from '../sites'

const OBSERVER_CONFIG = { subtree: true, childList: true }
const ON_STOP_SCROLL_TIMEOUT = 500


let observers = {}

let pageInfo = null
let started = false
let onScrollTimer = null
let observerTimeout = null
let targetElement = null

let tryToContainerCount = 0

const startObserver = config => {
  clearTimeout(observerTimeout)
  const { selector } = config
  const foundedTargetElement = document.querySelector(selector)

  if (!Site.checkPaths(document.URL) || tryToContainerCount > 50) return tryToContainerCount = 0

  if (!foundedTargetElement || targetElement === foundedTargetElement) {
    tryToContainerCount += 1
    observerTimeout = setTimeout(() => startObserver(config), 100)
    return
  }

  targetElement = foundedTargetElement

  Blocks.getContentBlocks(targetElement, 'comment', pageInfo)

  observers[selector] = new MutationObserver(function(mutations) {
    mutations.forEach(mutation => {
      if ('childList' === mutation.type && mutation.addedNodes.length) {
        mutation.addedNodes.forEach(() => Blocks.getContentBlocks(targetElement, 'comment', pageInfo))
      }
    })
  })

  observers[selector].observe(targetElement, OBSERVER_CONFIG);
}

export const onScroll = () => {
  clearTimeout(onScrollTimer)
  onScrollTimer = setTimeout(Blocks.getToxicity, ON_STOP_SCROLL_TIMEOUT)
}

export const start = info => {
  if (!info || started) return

  started = true
  pageInfo = info

  window.addEventListener('scroll', onScroll, false)
  pageInfo.pageContainers.forEach(startObserver)
}

export const restart = info => {
  started = false
  Blocks.removeBlocks()
  window.removeEventListener('scroll', onScroll, false)
  stop()
  start(info)
}

export const stop = () => {
  for (let key in observers) {
    if (observers.hasOwnProperty(key)) observers[key].disconnect()
  }
  observers = {}
}

export const updateToxicity = toxicity => Blocks.onToxicityChanged(toxicity)
