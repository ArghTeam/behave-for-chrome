import emoji from 'node-emoji';

const EMOJIES = [
  ':innocent:',
  ':smiley:',
  ':blush:',
  ':slightly_smiling_face:',
  ':neutral_face:',
  ':confused:',
  ':unamused:',
  ':angry:',
  ':rage:',
  ':hankey:',
  ':skull:'
]

const EMOJI_DESCRIPTIONS = [
  'Hide \'em all', //'I\'m too young to die',
  'Take a peak', //'Hey, not too rough',
  'Open the door a bit wider', //'Hurt me plenty',
  'I\'ve been around the block', //'Ultra-Violence',
  'OK, show me everything', //'Nightmare!',
  'OK, show me everything', //'Doomed'
]

const _EMOJIES_AMOUNT = EMOJIES.length - 1
const EMOJI_DESCRIPTIONS_AMOUNT = EMOJI_DESCRIPTIONS.length - 1

//Add few more emojies from this list depending on score
const ADDITIONAL_EMOJIES = [
  [':pouting_cat:', ':cat:', ':smiley_cat:', ':smirk_cat:'],
  [':horse:', ':sweat_drops:',':bomb:', ':zap:',':boom:',':warning:',':monkey:',':fire:', ':interrobang:',':exclamation:',':x:', ':hot_pepper:', ':rotating_light:']
]
const ADDITIONAL_EMOJIES_AMOUNT = ADDITIONAL_EMOJIES.length
const MAX_ADDITIONAL_EMOJIES = 4

export const getEmoji = score => {
  if (score === 1) return emoji.get(EMOJIES[_EMOJIES_AMOUNT])
  let index = parseInt(score * _EMOJIES_AMOUNT)
  return emoji.get(EMOJIES[index])
}

export const getEmojiDescriptionByScore = score => {
  const index = parseInt(score * EMOJI_DESCRIPTIONS_AMOUNT)
  return EMOJI_DESCRIPTIONS[index]
}

export const isExtremeEmoji = score => {
  let index = parseInt(score * _EMOJIES_AMOUNT)
  return index === 0 || index === _EMOJIES_AMOUNT
}

/*
 Select few (or zero) emojies of possible ADDITIONAL_EMOJIES
 1. Detect index of ADDITIONAL_EMOJIES by score
 2. Detect how many emojies in given string
 3. Get random number (N) betweet 0 and number of possible add emojies
 4. Fetch N emojies from string in random order
 */
export const getFewAdditionalEmojies = score => {
  let index = score === 1 ? ADDITIONAL_EMOJIES_AMOUNT - 1 : parseInt(score * ADDITIONAL_EMOJIES_AMOUNT)
  let emojies = ADDITIONAL_EMOJIES[index].slice(0) // clone array of emojies
  let n = Math.round(Math.random() * MAX_ADDITIONAL_EMOJIES)
  if (!n) return ''

  let str = ''
  for (let i = 0; i < n; i++) {
    let rnd = Math.round(Math.random() * (emojies.length - 1))
    let e = emoji.get(emojies[rnd])
    emojies.splice(rnd, 1) // remove selected emoji from array
    str += e
  }
  return str
}
