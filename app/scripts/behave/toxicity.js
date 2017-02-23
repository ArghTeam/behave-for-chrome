let ports = []

const generatePortId = () => {
  const id = '' + Math.random().toString(16).slice(2)
  if (ports.indexOf(id) < 0) {
    ports.push(id)
    return id
  }
  return generatePortId()
}

const getBlockToxicity = (block, callback) => {
  const id = generatePortId()
  const port = chrome.runtime.connect({ name: id })
  port.postMessage({ action: 'GET_BLOCK_TOXICITY', text: block.text, id })
  port.onMessage.addListener((message, sender) => {
    if (message.action === 'GET_BLOCK_TOXICITY_RESULT' && sender.name === id) {
      sender.disconnect()
      ports = ports.filter(p => p !== sender.name)
      return callback(message.score)
    }
  })
}

export const getToxicity = (blocks, callback) => {
  let promises = blocks.map(block => {
    return new Promise(resolve => {
      getBlockToxicity(block, score => {
        block.toxicity = score
        resolve(block)
      })
    })
  })
  Promise.all(promises).then(callback)
}

const getSuggestScore = (data, callback) => {
  const id = generatePortId()
  const port = chrome.runtime.connect({ name: id })
  port.postMessage({ action: 'GET_SUGGEST_SCORE', data, id })
  port.onMessage.addListener((message, sender) => {
    if (message.action === 'GET_SUGGEST_SCORE_RESULT' && sender.name === id) {
      sender.disconnect()
      ports = ports.filter(p => p !== sender.name)
      return callback(message.result)
    }
  })
}

export const suggestScore = (data, callback) => getSuggestScore(data, callback)