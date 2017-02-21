'use strict';

// Enable chromereload by uncommenting this line:
import './lib/livereload'
import { getPageInfo } from './sites'

let behaveTabs = []

const isInjected = tabId =>
  chrome.tabs.executeScript(tabId, {
    code: `
      if (!window.behaveStarted && !window.behaveInjected)
        chrome.runtime.sendMessage({ action: 'GET_FRAME_INFO', url: document.URL }, function (response) { window.behaveStarted = response; });
      else if (window.behaveStarted && window.behaveInjected)
        chrome.runtime.sendMessage({ action: 'RESTART_BEHAVE', url: document.URL });
      window.behaveInjected = true;
      `,
    allFrames: true,
    runAt: 'document_start'
  }, () => {})

const injectBehave = (name, tabId, frameId, cb) =>
  chrome.tabs.executeScript(tabId, { file: `/scripts/${name}.js`, frameId: frameId || 0,runAt: 'document_idle' }, () => {
    chrome.tabs.insertCSS(tabId, { file: `/styles/${name}.css`, frameId: frameId || 0, runAt: 'document_idle' }, cb)
  })

const startBehaveFilter = (tabId, frameId, pageInfo, action) =>
  chrome.tabs.sendMessage(tabId, { action, pageInfo }, { frameId })

const tabUrlChanged = (tabId, url) => {
  let currentTab = behaveTabs.filter(tab => tab.tabId === tabId)[0]
  return !currentTab || currentTab.url !== url
}

const updateBehaveTabs = (tabId, toUpdate) =>
  behaveTabs = behaveTabs.map(tab => {
    if (tab.tabId === tabId) return {...tab,...toUpdate}
    return tab
  })

const removeBehaveTabs = tabId =>
  behaveTabs = behaveTabs.filter(tab => tab.tabId !== tabId)

const updateComments = toxicity =>
  behaveTabs.forEach(tab => {
    const { tabId, frameId } = tab
    chrome.tabs.sendMessage(tabId, { action: 'TOXICITY_CHANGED', toxicity }, { frameId })
  })

const onMessage = (request, sender, sendResponse) => {
  const { action, url } = request
  const { tab, frameId } = sender
  const pageInfo = getPageInfo(url)

  if (action === 'GET_FRAME_INFO' && pageInfo.domain) {
    sendResponse(true)
    injectBehave('behave', tab.id, frameId, () => startBehaveFilter(tab.id, frameId, pageInfo, 'START_BEHAVE'))
    behaveTabs.push({ frameId, tabId: tab.id, url })
  } else if (action === 'RESTART_BEHAVE' && pageInfo.domain && tabUrlChanged(tab.id, url)) {
    updateBehaveTabs(tab.id, { url })
  }

  switch(action) {
    case 'GET_TOXICITY':
      return sendResponse({ toxicity: localStorage.toxicity || 0.5 })
    case 'UPDATE_TOXICITY':
      localStorage.toxicity = request.toxicity
      return updateComments(request.toxicity)
    default: return
  }
}

chrome.extension.onMessage.addListener(onMessage)

chrome.tabs.onRemoved.addListener(removeBehaveTabs)

chrome.tabs.onUpdated.addListener(isInjected)
