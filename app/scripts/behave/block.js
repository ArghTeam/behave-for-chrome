import * as Toxicity from './toxicity'
import { hideCommentBlock, showCommentBlock, setBlockEmoji } from './fake-comment'

const BEHAVE_ATTR = 'behave'
const TOXICITY_ATTR = 'behave-toxicity'

let commentBlocks = []

const chunkArray =  (array,  n) => {
  if ( !array.length ) return []
  return [ array.slice( 0, n ) ].concat( chunkArray(array.slice(n), n) )
}

const setBlocksToxicity = blocks => {
  chrome.extension.sendMessage({ action: 'GET_TOXICITY' },
    response => {
      blocks.forEach(block => {
        const { element, toxicity } = block
        if (toxicity >= response.toxicity) {
          setBlockEmoji(element, toxicity)
        } else {
          showCommentBlock(element)
          setBlockEmoji(element, toxicity)
        }
        element.setAttribute(TOXICITY_ATTR, toxicity)
        element.setAttribute(BEHAVE_ATTR, 'loaded')
      })
    }
  )
}

export const onToxicityChanged = toxicity => {
  commentBlocks.forEach(block => {
    const { element, text, type } = block
    const blockToxicity = element.getAttribute(TOXICITY_ATTR)

    if (!blockToxicity) return
    if (parseFloat(blockToxicity) >= toxicity) {
      hideCommentBlock(element, type, text)
      setBlockEmoji(element, toxicity)
    } else {
      showCommentBlock(element)
    }
  })
}

const getViewPortBlocks = () => {
  const displayHeight = document.documentElement.clientHeight

  const viewPortBlocks = commentBlocks.filter(block => {
      const { element } = block
      const { top } = element.getBoundingClientRect()
      const inViewPort = (top > 0 && top <= displayHeight)
      const initial = element.getAttribute(BEHAVE_ATTR) === 'init'

      if (initial && inViewPort) element.setAttribute(BEHAVE_ATTR, 'loading')

      return initial && inViewPort
    }) || []

  return viewPortBlocks
}

export const getToxicity = () => {
  const viewPortBlocks = getViewPortBlocks(commentBlocks)
  const chunkedBlocks = chunkArray(viewPortBlocks, 5)

  chunkedBlocks.forEach(chunk => {
    if (chunk && chunk.length) {
      Toxicity.getToxicity(chunk, result => {
        setBlocksToxicity(result);
      })
    }
  })
}

const getCommentText = (block, selector) => {
  const textElement = block.querySelector(selector)
  if (textElement) {
    const text = textElement.innerText
    return text ? text.replace(/\s+/g, ' ').trim() : null
  }
  return null
}

const getCommentBlockInfo = (block, type, config) => {
  if (block) {
    block.setAttribute(BEHAVE_ATTR, 'init')
    return {
      element: block,
      text: getCommentText(block, config.containerContent[type].text),
      type: type
    }
  }
  return null
}

const appendCommentBlocks = (blocks = [], type, config, cb) => {
  blocks.forEach(block => {
    const blockInfo = getCommentBlockInfo(block, type, config)
    if (blockInfo) {
      hideCommentBlock(block, type, blockInfo.text)
      commentBlocks.push(blockInfo)
    }
  })
  return cb(commentBlocks)
}

export const getContentBlocks = (target, type, config) => {
  const newCommentBlocks = target.querySelectorAll(config.containerContent[type].block)
  return appendCommentBlocks(newCommentBlocks, type, config, getToxicity)
}

export const removeBlocks = () => commentBlocks = []
