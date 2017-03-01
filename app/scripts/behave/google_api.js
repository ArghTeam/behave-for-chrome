// callback = function (error, httpStatus, responseText)
export const makeSignedRequestXHR = (method, url, callback) =>{
  let retry = true
  const getTokenAndXhr = () =>{
    chrome.identity.getAuthToken({/* details */}, accessToken =>{
      if (chrome.runtime.lastError) {
        callback(chrome.runtime.lastError)
        return
      }

      let xhr = new XMLHttpRequest()
      xhr.open(method, url)
      xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken)
      xhr.send()

      xhr.onload = function () {
        if (this.status === 401 && retry) {
          // This status may indicate that the cached
          // access token was invalid. Retry once with
          // a fresh token.
          retry = false
          chrome.identity.removeCachedAuthToken(
              { 'token': accessToken },
              getTokenAndXhr)
          return
        }

        callback(null, this.status, this.responseText)
      }
    })
  }

  getTokenAndXhr()
}


const getAccessToken = () =>
  new Promise((resolve, reject) =>{
    chrome.identity.getAuthToken({/* details */}, accessToken => {

      //TODO: While !ext id & REMOVE COMMENT
      //if (chrome.runtime.lastError) return reject(chrome.runtime.lastError)
      resolve(accessToken)
    })
  })

export const makeSignedRequest = (url, data, callback, retry = true) =>
  getAccessToken().then(accessToken =>
    fetch(url,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken
        },
        method: 'POST',
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(
        result => {
          //TODO MOCKED! REMOVE THIS
          result = { attributeScores: {TOXICITY_FAST: { summaryScore : { value: Math.random() }}}}

          if (result.error && result.error.code === 401 && retry) {
            return chrome.identity.removeCachedAuthToken(
              { 'token': accessToken },
              makeSignedRequest(url, data, callback, false)
            )
          }
          return callback(result)
        },
        response => callback()
      )
  )
