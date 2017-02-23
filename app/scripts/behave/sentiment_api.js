"use strict"

import { makeSignedRequest } from './google_api'

const ANALYZE_API_DOMAIN = 'https://commentanalyzer.googleapis.com'
const ANALYZE_API_ANALYZE_COMMENT = `${ANALYZE_API_DOMAIN}/v1alpha1/comments:analyze`
// const ANALYZE_API_SUGGEST_COMMENT = `${ANALYZE_API_DOMAIN}/v1alpha1/comments:suggestscore`

const ATTRIBUTE_NAME = 'TOXICITY_FAST'


const analyzeComment = data =>
  new Promise((resolve, reject) =>{
    makeSignedRequest(ANALYZE_API_ANALYZE_COMMENT, data, (result) =>{
      if (result.error) return reject(result.error)
      resolve(result)
    })
  })


const analyze = text => {
  let data = {
    comment: {
      text: text
    },
    requestedAttributes: {},
    doNotStore: false
  }

  data.requestedAttributes[ATTRIBUTE_NAME] = {}

  return analyzeComment(data)
}


export const getToxicityScore = text => 
  analyze(text).then(result =>{
    if (result.attributeScores) {
      return result.attributeScores[ATTRIBUTE_NAME].summaryScore.value
    }
    return 0
  })