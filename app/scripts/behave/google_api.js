const getAccessToken = () =>
  new Promise((resolve, reject) =>{
    chrome.identity.getAuthToken({/* details */}, accessToken => {
      if (chrome.runtime.lastError) return reject(chrome.runtime.lastError)
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
          if (result.error && result.error.code === 401 && retry) {
            return chrome.identity.removeCachedAuthToken(
              { 'token': accessToken },
              () => makeSignedRequest(url, data, callback, false)
            )
          }
          return callback(result)
        }
      )
  )
