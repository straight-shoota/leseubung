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
  var $composition, bar, barString, front_matter, i, j, k, l, m, n, pattern, ref, ref1, ref2, row, settings, text;
  settings = readSettings();
  console.log("readSettings", settings);
  abc_editor.paramChanged({
    staffwidth: staffwidth
  });
  front_matter = "M:" + settings.count + "/" + settings.meter + "\nL:1/" + settings.unit + "\nK:" + settings.key + " clef=" + settings.clef;
  text = [front_matter];
  console.log(settings.patterns);
  for (i = l = 1, ref = settings.rows; 1 <= ref ? l <= ref : l >= ref; i = 1 <= ref ? ++l : --l) {
    row = [];
    for (j = m = 1, ref1 = settings.bars_per_row; 1 <= ref1 ? m <= ref1 : m >= ref1; j = 1 <= ref1 ? ++m : --m) {
      bar = [];
      for (k = n = 1, ref2 = settings.patterns_per_bar; 1 <= ref2 ? n <= ref2 : n >= ref2; k = 1 <= ref2 ? ++n : --n) {
        pattern = random(settings.patterns);
        if (settings.random_pitch) {
          pattern = randomize_pitch(pattern, settings.pitches);
        }
        bar.push(pattern);
      }
      barString = bar.join(' ');
      barString = normalizeBarString(barString, settings.key);
      row.push(barString);
    }
    text.push("y " + (row.join(' | ')) + " |");
  }
  console.log(text.join("\n"));
  $composition = $$('composition');
  $composition.value = (text.join("\n")) + "|";
  setCaretPosition($composition, 0);
  abc_editor.fireChanged();
  return storeSettingsToLocation(settings);
};

initialize = function() {
  initializeToggle();
  initializeWidthSetting();
  initializeSettings();
  return generate();
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
  var EMPTY_HISTORY, KEY_ACCIDENTALS, expAccidentals, history, i, j, keyMatch, keyRegexp, len, len1, process, processed, ref, ref1, tune, tuneRegexp, tunes, tunesRegexp;
  if (key == null) {
    key = null;
  }
  tunesRegexp = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g;
  tuneRegexp = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/;
  keyRegexp = /(.*) exp (.*)/;
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
    'F#': '^F^C^G^D^A',
    'F': '_B',
    'B': '_B_E',
    'Eb': '_B_E_A',
    'Ab': '_B_E_A_D',
    'Db': '_B_E_A_D_G',
    'Gb': '_B_E_A_D_G_C'
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
  keyMatch = keyRegexp.exec(key);
  expAccidentals = '';
  if (keyMatch) {
    key = keyMatch[1];
    expAccidentals = keyMatch[2];
  }
  if (KEY_ACCIDENTALS[key]) {
    ref = KEY_ACCIDENTALS[key].split(tunesRegexp);
    for (i = 0, len = ref.length; i < len; i++) {
      tune = ref[i];
      process(tune);
    }
  }
  ref1 = expAccidentals.split(tunesRegexp);
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    tune = ref1[j];
    process(tune);
  }
  processed = (function() {
    var k, len2, results;
    results = [];
    for (k = 0, len2 = tunes.length; k < len2; k++) {
      tune = tunes[k];
      results.push(process(tune));
    }
    return results;
  })();
  return processed.join('');
};

var applySettings, initializeSettings, loadSettingsFromLocation, readSettings, storeSettingsToLocation;

storeSettingsToLocation = function(settings) {
  var base, settings_hash, url;
  base = window.location.href.replace(/#.*/, "");
  settings_hash = Object.keys(settings).map(function(key) {
    return key + '=' + settings[key];
  }).join('&');
  url = base + "#" + settings_hash;
  console.log(base, url);
  return history.pushState(settings, "Leseübung", url);
};

loadSettingsFromLocation = function() {
  var result;
  result = {};
  location.hash.substring(1).split("&").forEach(function(part) {
    var item;
    item = part.split("=");
    return result[item[0]] = decodeURIComponent(item[1]);
  });
  return result;
};

initializeSettings = function() {
  var settings;
  if (location.hash !== "") {
    settings = loadSettingsFromLocation();
    console.log("loaded settings", settings);
    return applySettings(settings);
  }
};

readSettings = function() {
  var $clef, settings;
  settings = {};
  settings.patterns = $val('patterns').split(/\n/).filter(function(n) {
    return n.replace(/\s+/g, '').length > 0;
  });
  settings.count = $val('count_count');
  settings.meter = $val('meter_count');
  $clef = $$('clef');
  settings.clef = $clef.options[$clef.selectedIndex].value;
  settings.key = $val('key');
  settings.unit = $val('unit_count');
  settings.pattern_length = $val('pattern_length');
  settings.pattern_count = $val('pattern_count');
  settings.rows = $val('row_count');
  settings.bars_per_row = $val('bars_per_row');
  settings.random_pitch = $$('random_pitch').checked;
  settings.pitches = $val('pitches').match(TUNES_REGEXP);
  settings.patterns_per_bar = settings.count / settings.meter * settings.pattern_length / settings.pattern_count;
  settings.patterns_per_row = 12;
  settings.staffwidth = $val('staffwidth');
  return settings;
};

applySettings = function(settings) {
  $$('patterns').value = settings.patterns;
  $$('count_count').value = settings.count;
  $$('meter_count').value = settings.meter;
  $$('clef').value = settings.clef;
  $$('key').value = settings.key;
  $$('unit_count').value = settings.unit;
  $$('pattern_length').value = settings.pattern_length;
  $$('pattern_count').value = settings.pattern_count;
  $$('row_count').value = settings.rows;
  $$('bars_per_row').value = settings.bars_per_row;
  $$('random_pitch').value = settings.random_pitch;
  $$('pitches').value = settings.pitches;
  return $$('staffwidth').value = settings.staffwidth;
};
