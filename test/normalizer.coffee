assert = (a, b) ->
  if a == b
    console.log "OK: #{a} = #{b}"
  else
    # error
    console.log "Failure: \n#{a} !=\n#{b}"

normalize = (s) ->
  tunesRegexp = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g
  tuneRegexp = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/g
  tunes = s.split(tunesRegexp)

  history = {}

  process = (s) ->
    match = tuneRegexp.exec(s)
    # next if it is a filler betwen tunes (note length, pause etc.)
    return s unless match

    [accidental, tune, octave] = [match[1], match[2], match[3]]
    origAcc = accidental

    if history[tune] == accidental
      accidental = ''

    history[tune] = accidental

    #console.log tune, [origAcc, accidental, tune, octave], history

    [accidental, tune, octave].join('')

  processed = (process(tune) for tune in tunes)
  processed.join('')




# no change
assert normalize('C/2_EC/2 zE F/2=F/2_E/2^F/2 z=F'), 'C/2_EC/2 zE F/2=F/2_E/2^F/2 z=F'
assert normalize('z3/2=F/2 _E2 z/2=F/2^F/2^F/2 z/2_B_B/2'), 'z3/2=F/2 _E2 z/2F/2^F/2F/2 z/2_BB/2'
assert normalize('z/2_E3/2 z3/2_B/2 _E2 C/2=F3/2'), 'z/2_E3/2 z3/2_B/2 E2 C/2=F3/2'
assert normalize('z2 z^F/2C/2 ^F/2C/2_B/2C/2 z2'), 'z2 z^F/2C/2 F/2C/2_B/2C/2 z2'
assert normalize('A B C'), 'A B C'
assert normalize('A ^A ^A'), 'A ^A A'
assert normalize('A ^A A ^A'), 'A ^A A ^A'
assert normalize('^A =A'), '^A =A'
assert normalize('=A =A'), '=A A'
#assert normalize('y G/2C/2G G/2=F=F/2 z/2G/2_B ^FC'), 'y G/2C/2G G/2=F=F/2 z/2G/2_B ^FC'
#assert normalize('=F/2_E3/2 z_E z=F/2_E/2 z2'), '=F/2_E3/2 z_E z=F/2_E/2 z2'
#assert normalize('=F_E/2G/2 z/2C3/2 =F3/2G/2 ^F3/2C/2'), '=F_E/2G/2 z/2C3/2 =F3/2G/2 ^F3/2C/2'
#assert normalize('_E/2^F/2C/2_E/2 G/2G/2_E/2=F/2 _E/2=F3/2 z/2_E3/2'), '_E/2^F/2C/2_E/2 G/2G/2_E/2=F/2 _E/2=F3/2 z/2_E3/2'
