normalizeBarString = (s, key=null) ->
  tunesRegexp = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g
  tuneRegexp = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/
  keyRegexp = /(.*) exp (.*)/
  EMPTY_HISTORY = {
    C: '=',
    D: '=',
    E: '=',
    F: '=',
    G: '=',
    A: '=',
    B: '='
  }
  KEY_ACCIDENTALS = {
    'G': '^F',
    'D': '^F^C',
    'A': '^F^C^G',
    'E': '^F^C^G^D',
    'H': '^F^C^G^D^A',
    'F#': '^F^C^G^D^A',
    'F': '_B',
    'B': '_B_E',
    'Eb': '_B_E_A',
    'Ab': '_B_E_A_D',
    'Db': '_B_E_A_D_G',
    'Gb': '_B_E_A_D_G_C',
  }
  tunes = s.split(tunesRegexp)

  key ||= 'C'
  history = EMPTY_HISTORY

  process = (s) ->
    match = tuneRegexp.exec(s)
    # next if it is a filler betwen tunes (note length, pause etc.)
    return s unless match

    [accidental, tune, octave] = [match[1], match[2], match[3]]
    origAcc = accidental

    if history[tune.toUpperCase()] == accidental
      accidental = ''

    history[tune.toUpperCase()] = origAcc

    #console.log tune, [origAcc, accidental, tune, octave], history

    [accidental, tune, octave].join('')

  # add system accidentals to history
  keyMatch = keyRegexp.exec(key)
  expAccidentals = ''
  if keyMatch
    key = keyMatch[1]
    expAccidentals = keyMatch[2]

  if KEY_ACCIDENTALS[key]
    process(tune) for tune in KEY_ACCIDENTALS[key].split(tunesRegexp)

  process(tune) for tune in expAccidentals.split(tunesRegexp)

  # not process the tunes
  processed = (process(tune) for tune in tunes)
  processed.join('')

module.exports = normalizeBarString unless module == undefined
