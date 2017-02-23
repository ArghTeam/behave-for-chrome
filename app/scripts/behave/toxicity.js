// const BASE_URL = 'https://comments.api.argh.team'

// const getMessages = blocks => blocks.map(block => block.text)


// export const getToxicity = (blocks, callback) => {
//   const messages = { messages: getMessages(blocks) }

//   fetch(`${BASE_URL}/api/scores`,
//     {
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       },
//       method: 'POST',
//       body: JSON.stringify(messages)
//     })
//     .then(res => res.json())
//     .then(data => {
//       const { scores } = data
//       scores.map((score, index) => {
//         blocks[index].toxicity = score
//       })
//       return callback(blocks)
//     })
// }

export const getToxicity = (blocks, callback) => {
  let promises = blocks.map(block =>{
    return new Promise(resolve =>{
      chrome.extension.sendMessage({ action: 'GET_MESSAGE_TOXICITY', data: block.text }, (response) => {
        console.log('Response', response)
        block.toxicity = response
        resolve(block)
      })
    })
    // return getToxicityScore(block.text).then(score => block.toxicity = score)
  })


  Promise.all(promises).then(data => {console.log('DATA', data); callback(blocks)})
  
  // callback(blocks)
}