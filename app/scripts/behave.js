import * as Page from './behave/page'

const backgroundMessagesHandler = message => {
  const { action, pageInfo, toxicity } = message

  switch (action) {
    case 'START_BEHAVE':
      return Page.start(pageInfo)
    case 'RESTART_BEHAVE':
      return Page.restart(pageInfo)
    case 'TOXICITY_CHANGED':
      return Page.updateToxicity(toxicity)
    default: return
  }
}

chrome.runtime.onMessage.addListener(backgroundMessagesHandler)
