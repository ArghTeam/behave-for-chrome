'use strict';
import * as Emoji from './behave/emoji'

const onLoad = () => {
  const toxicity = document.querySelector('#toxicity')
  const currentToxicity = document.querySelector('#currentToxicity')
  const currentToxicityDescription = document.querySelector('#currentToxicityDescription')

  const toxicityListener = () => {
    currentToxicity.innerHTML = Emoji.getEmoji(toxicity.value / 100)
    currentToxicityDescription.innerHTML = Emoji.getEmojiDescriptionByScore(toxicity.value / 100)
  }

  toxicity.addEventListener('mousedown', () => toxicity.addEventListener('mousemove', toxicityListener))
  toxicity.onchange = () => chrome.extension.sendMessage({ action: 'UPDATE_TOXICITY', toxicity: toxicity.value / 100 }) & toxicity.removeEventListener('mousemove', toxicityListener)

  chrome.extension.sendMessage({ action: 'GET_TOXICITY' },
    response => {
      toxicity.value = response.toxicity * 100
      toxicityListener(response.toxicity)
    }
  )
}


window.onload = onLoad
