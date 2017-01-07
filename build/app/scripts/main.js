var $$, $val, TUNES_REGEXP, TUNE_REGEXP, abc_editor, default_pitches, downloadABC, downloadPNG, downloadSVG, downloadTextContent, filename, generate, initialize, initializeToggle, initializeWidthSetting, random, randomize_pitch, setCaretPosition;

abc_editor = new ABCJS.Editor("composition", {
  paper_id: "paper",
  warnings_id: "warnings"
});

default_pitches = ['c', 'c', 'd', 'e', 'f', 'g', 'a', 'b'];

TUNES_REGEXP = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g;

TUNE_REGEXP = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/g;

$$ = function(id) {
  return document.getElementById(id);
};

$val = function(id) {
  return $$(id).value;
};

random = function(array) {
  return array[Math.floor(Math.random() * array.length)];
};

randomize_pitch = function(pattern, pitches) {
  return pattern.replace(/c/g, function() {
    return random(pitches);
  });
};

generate = function() {
  var $clef, $composition, bar, barString, bars_per_row, clef, count, front_matter, i, j, k, key, l, m, meter, o, pattern, pattern_count, pattern_length, patterns, patterns_per_bar, patterns_per_row, pitches, random_pitch, ref, ref1, ref2, row, rows, staffwidth, text, unit;
  patterns = $val('patterns').split(/\n/).filter(function(n) {
    return n.replace(/\s+/g, '').length > 0;
  });
  count = $val('count_count');
  meter = $val('meter_count');
  $clef = $$('clef');
  clef = $clef.options[$clef.selectedIndex].value;
  console.log(clef);
  key = $val('key');
  unit = $val('unit_count');
  pattern_length = $val('pattern_length');
  pattern_count = $val('pattern_count');
  rows = $val('row_count');
  bars_per_row = $val('bars_per_row');
  random_pitch = $$('random_pitch').checked;
  pitches = $val('pitches').match(TUNES_REGEXP);
  patterns_per_bar = count / meter * pattern_length / pattern_count;
  patterns_per_row = 12;
  staffwidth = $val('staffwidth');
  abc_editor.paramChanged({
    staffwidth: staffwidth
  });
  front_matter = "M:" + count + "/" + meter + "\nL:1/" + unit + "\nK:" + key + " clef=" + clef;
  text = [front_matter];
  console.log(patterns);
  for (i = l = 1, ref = rows; 1 <= ref ? l <= ref : l >= ref; i = 1 <= ref ? ++l : --l) {
    row = [];
    for (j = m = 1, ref1 = bars_per_row; 1 <= ref1 ? m <= ref1 : m >= ref1; j = 1 <= ref1 ? ++m : --m) {
      bar = [];
      for (k = o = 1, ref2 = patterns_per_bar; 1 <= ref2 ? o <= ref2 : o >= ref2; k = 1 <= ref2 ? ++o : --o) {
        pattern = random(patterns);
        if (random_pitch) {
          pattern = randomize_pitch(pattern, pitches);
        }
        bar.push(pattern);
      }
      barString = bar.join(' ');
      barString = normalizeBarString(barString, key);
      row.push(barString);
    }
    text.push("y " + (row.join(' | ')) + " |");
  }
  console.log(text.join("\n"));
  $composition = $$('composition');
  $composition.value = (text.join("\n")) + "|";
  setCaretPosition($composition, 0);
  return abc_editor.fireChanged();
};

initialize = function() {
  initializeToggle();
  return initializeWidthSetting();
};

initializeToggle = function() {
  return $$('toggle-handler').addEventListener('click', function() {
    var $e;
    $e = $$('composition');
    if ($e.style.display === 'block') {
      $e.style.display = 'none';
      return $$('toggle-handler').innerHTML = 'ABC Noten anzeigen';
    } else {
      $e.style.display = 'block';
      return $$('toggle-handler').innerHTML = 'ABC Noten verbergen';
    }
  });
};

initializeWidthSetting = function() {
  if (window.innerWidth > 1600) {
    return $$('staffwidth').value = 1100;
  }
};

window.addEventListener('load', initialize);

window.addEventListener('load', generate);

$$('download-svg').addEventListener('click', function(e) {
  e.preventDefault();
  return downloadSVG();
});

$$('download-png').addEventListener('click', function(e) {
  e.preventDefault();
  return downloadPNG();
});

$$('download-abc').addEventListener('click', function(e) {
  e.preventDefault();
  return downloadABC();
});

$$('generate').addEventListener('click', function(e) {
  e.preventDefault();
  return generate();
});

$$('leseübung-form').addEventListener('submit', function(e) {
  e.preventDefault();
  return generate();
});

filename = function(ext) {
  var onetimestring;
  onetimestring = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').substring(0, 19);
  return "leseübung_" + onetimestring + "." + ext;
};

downloadPNG = function() {
  var options;
  options = {
    backgroundColor: 'white',
    scale: 4
  };
  return saveSvgAsPng(document.querySelector("#paper > svg"), filename('png'), options);
};

downloadTextContent = function(data, filename, mime_type) {
  var a, data_uri;
  data_uri = "data:" + mime_type + ";utf8," + (encodeURIComponent(data));
  console.log(data);
  a = document.createElement('a');
  a.href = data_uri;
  a.download = filename;
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  return document.body.removeChild(a);
};

downloadSVG = function() {
  var svg, xml;
  svg = document.querySelector("#paper > svg");
  xml = new XMLSerializer().serializeToString(svg);
  return downloadTextContent(xml, filename('svg'), 'image/svg+xml');
};

downloadABC = function() {
  var abcdata;
  abcdata = $val('composition');
  abcdata = ["%abc-2.1", abcdata].join("\n");
  return downloadTextContent(abcdata, filename('abc'), 'text/vnd.abc');
};

setCaretPosition = function(elem, caretPos) {
  var range;
  if (elem.createTextRange) {
    range = elem.createTextRange();
    return range.move('character', caretPos);
  } else {
    if (elem.selectionStart !== void 0 && elem.offsetParent !== null) {
      return elem.setSelectionRange(caretPos, caretPos);
    }
  }
};

var normalizeBarString;

normalizeBarString = function(s, key) {
  var EMPTY_HISTORY, KEY_ACCIDENTALS, history, i, len, process, processed, ref, tune, tuneRegexp, tunes, tunesRegexp;
  if (key == null) {
    key = null;
  }
  tunesRegexp = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g;
  tuneRegexp = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/g;
  EMPTY_HISTORY = {
    C: '=',
    D: '=',
    E: '=',
    F: '=',
    G: '=',
    A: '=',
    B: '='
  };
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
    '_G': '_B_E_A_D_G_C'
  };
  tunes = s.split(tunesRegexp);
  key || (key = 'C');
  history = EMPTY_HISTORY;
  process = function(s) {
    var accidental, match, octave, origAcc, ref, tune;
    match = tuneRegexp.exec(s);
    if (!match) {
      return s;
    }
    ref = [match[1], match[2], match[3]], accidental = ref[0], tune = ref[1], octave = ref[2];
    origAcc = accidental;
    if (history[tune.toUpperCase()] === accidental) {
      accidental = '';
    }
    history[tune.toUpperCase()] = origAcc;
    return [accidental, tune, octave].join('');
  };
  if (KEY_ACCIDENTALS[key]) {
    ref = KEY_ACCIDENTALS[key].split(tunesRegexp);
    for (i = 0, len = ref.length; i < len; i++) {
      tune = ref[i];
      process(tune);
    }
  }
  processed = (function() {
    var j, len1, results;
    results = [];
    for (j = 0, len1 = tunes.length; j < len1; j++) {
      tune = tunes[j];
      results.push(process(tune));
    }
    return results;
  })();
  return processed.join('');
};

if (module !== void 0) {
  module.exports = normalizeBarString;
}