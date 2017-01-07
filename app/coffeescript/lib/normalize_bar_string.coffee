normalizeBarString = (s, key=null) ->
  tunesRegexp = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g
  tuneRegexp = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/g
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
    '^F': '^F^C^G^D^A',
    'F': '_B',
    'B': '_B_E',
    '_E': '_B_E_A',
    '_A': '_B_E_A_D',
    '_D': '_B_E_A_D_G',
    '_G': '_B_E_A_D_G_C',
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

  if KEY_ACCIDENTALS[key]
    process(tune) for tune in KEY_ACCIDENTALS[key].split(tunesRegexp)
  processed = (process(tune) for tune in tunes)
  processed.join('')

module.exports = normalizeBarString unless module == undefined
