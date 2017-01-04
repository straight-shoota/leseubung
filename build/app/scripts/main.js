var $$, $val, abc_editor, default_pitches, downloadPNG, downloadSVG, filename, generate, initializeToggle, random, randomize_pitch, setCaretPosition;

abc_editor = new ABCJS.Editor("composition", {
  paper_id: "paper",
  warnings_id: "warnings"
});

default_pitches = ['c', 'c', 'd', 'e', 'f', 'g', 'a', 'b'];

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
  var $clef, $composition, bar, bars_per_row, clef, count, front_matter, i, j, k, key, l, m, meter, o, pattern, pattern_count, pattern_length, patterns, patterns_per_bar, patterns_per_row, pitches, random_pitch, ref, ref1, ref2, row, rows, staffwidth, text, unit;
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
  pitches = $val('pitches');
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
      row.push(bar.join(' '));
    }
    text.push("y " + (row.join(' | ')) + " |");
  }
  console.log(text.join("\n"));
  $composition = $$('composition');
  $composition.value = (text.join("\n")) + "|";
  setCaretPosition($composition, 0);
  return abc_editor.fireChanged();
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

window.addEventListener('load', initializeToggle);

window.addEventListener('load', generate);

$$('download-svg').addEventListener('click', function(e) {
  e.preventDefault();
  return downloadSVG();
});

$$('download-png').addEventListener('click', function(e) {
  e.preventDefault();
  return downloadPNG();
});

$$('generate').addEventListener('click', function(e) {
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

downloadSVG = function() {
  var a, data, svg, xml;
  svg = document.querySelector("#paper > svg");
  xml = new XMLSerializer().serializeToString(svg);
  data = "data:image/svg+xml;utf8," + xml;
  console.log(data);
  a = document.createElement('a');
  a.href = data;
  a.download = filename('svg');
  a.target = '_blank';
  document.body.appendChild(a);
  a.click();
  return document.body.removeChild(a);
};

setCaretPosition = function(elem, caretPos) {
  var range;
  if (elem.createTextRange) {
    range = elem.createTextRange();
    return range.move('character', caretPos);
  } else {
    if (elem.selectionStart !== void 0) {
      return elem.setSelectionRange(caretPos, caretPos);
    }
  }
};
