assert = (a, b) ->
  if a == b
    console.log "OK: #{a} = #{b}"
  else
    # error
    console.log "Failure: \n#{a} !=\n#{b}"


assertNormalize = (dirty, expect, key=null) ->
  console.log "normalize #{dirty} key #{key}"
  assert normalize_bar_string(dirty, key), expect

# no change
assertNormalize 'C/2_EC/2 zE F/2=F/2_E/2^F/2 z=F', 'C/2_EC/2 zE F/2=F/2_E/2^F/2 z=F'
assertNormalize 'z3/2=F/2 _E2 z/2=F/2^F/2^F/2 z/2_B_B/2', 'z3/2F/2 _E2 z/2F/2^F/2F/2 z/2_BB/2'
assertNormalize 'z/2_E3/2 z3/2_B/2 _E2 C/2=F3/2', 'z/2_E3/2 z3/2_B/2 E2 C/2F3/2'
assertNormalize 'z/2_E3/2 z3/2_B/2 _E2 C/2=F3/2', 'z/2_E3/2 z3/2_B/2 E2 C/2=F3/2', 'G'
assertNormalize 'z2 z^F/2C/2 ^F/2C/2_B/2C/2 z2', 'z2 z^F/2C/2 F/2C/2_B/2C/2 z2'
assertNormalize 'A B C', 'A B C'
assertNormalize 'A ^A ^A', 'A ^A A'
assertNormalize 'A ^A A ^A', 'A ^A A ^A'
assertNormalize '^A =A', '^A =A'
assertNormalize '=A =A', 'A A'
assertNormalize '=A =A', '=A A', 'Eb'
assertNormalize '^F ^F ^F', '^F F F'
assertNormalize '^F ^F ^F', 'F F F', 'G'
assertNormalize '^F', 'F', 'G'
assertNormalize '^F', '^F', 'G#'

assertNormalize '^F =F ^F ^F _B _B', 'F =F ^F F _B B', 'C exp ^f _d ^e'

#assertNormalize 'y G/2C/2G G/2=F=F/2 z/2G/2_B ^FC', 'y G/2C/2G G/2=F=F/2 z/2G/2_B ^FC'
#assertNormalize '=F/2_E3/2 z_E z=F/2_E/2 z2', '=F/2_E3/2 z_E z=F/2_E/2 z2'
#assertNormalize '=F_E/2G/2 z/2C3/2 =F3/2G/2 ^F3/2C/2', '=F_E/2G/2 z/2C3/2 =F3/2G/2 ^F3/2C/2'
#assertNormalize '_E/2^F/2C/2_E/2 G/2G/2_E/2=F/2 _E/2=F3/2 z/2_E3/2', '_E/2^F/2C/2_E/2 G/2G/2_E/2=F/2 _E/2=F3/2 z/2_E3/2'
