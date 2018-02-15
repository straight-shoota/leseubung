abc_editor = new ABCJS.Editor("composition", {
  paper_id: "paper",
  warnings_id: "warnings"
})
default_pitches = ['c', 'c', 'd', 'e', 'f', 'g', 'a', 'b']
TUNES_REGEXP = /((?:_{0,2}|\^{0,2}|=)[a-hA-H][,']*)/g
TUNE_REGEXP = /(_{0,2}|\^{0,2}|=)([a-gA-G])([,']*)/g

# helper
$$ = (id) -> document.getElementById(id)
$val = (id) -> $$(id).value

random = (array) ->
  array[Math.floor(Math.random() * array.length)]

randomize_pitch = (pattern, pitches) ->
  pattern.replace(/c/g, () -> random(pitches))

generate = () ->
  settings = readSettings()
  console.log("readSettings", settings)

  abc_editor.paramChanged(
    {staffwidth: staffwidth}
  )
  #bars_per_row = Math.floor(patterns_per_row / patterns_per_bar)
  front_matter = "M:#{settings.count}/#{settings.meter}\nL:1/#{settings.unit}\nK:#{settings.key} clef=#{settings.clef}"
  text = [front_matter]
  console.log settings.patterns
  for i in [1..settings.rows]
    row = []
    for j in [1..settings.bars_per_row]
      bar = []
      for k in [1..settings.patterns_per_bar]
        pattern = random(settings.patterns)
        if(settings.random_pitch)
          pattern = randomize_pitch(pattern, settings.pitches)
        bar.push(pattern)

      barString = bar.join(' ')
      barString = normalizeBarString(barString, settings.key)
      row.push(barString)
    # empty space at begin of row,
    # beam at end
    text.push("y #{row.join(' | ')} |")
  console.log text.join("\n")

  $composition = $$('composition')
  # double beam at the end
  $composition.value = "#{text.join("\n")}|"
  setCaretPosition($composition, 0)
  abc_editor.fireChanged()

  storeSettingsToLocation(settings)

initialize = () ->
  initializeToggle()
  initializeWidthSetting()
  initializeSettings()

  generate()

initializeToggle = () ->
  $$('toggle-handler').addEventListener 'click', () ->
    $e = $$('composition')
    if $e.style.display == 'block'
      $e.style.display = 'none'
      $$('toggle-handler').innerHTML = 'ABC Noten anzeigen'
    else
      $e.style.display = 'block'
      $$('toggle-handler').innerHTML = 'ABC Noten verbergen'

initializeWidthSetting = () ->
  $$('staffwidth').value = 1100 if window.innerWidth > 1600

window.addEventListener 'load', initialize
window.addEventListener 'popstate', (popstate) ->
  settings = popstate.state
  return if settings == undefined
  applySettings(settings)
  generate()

$$('download-svg').addEventListener 'click', (e) ->
  e.preventDefault()
  downloadSVG()

$$('download-png').addEventListener 'click', (e) ->
  e.preventDefault()
  downloadPNG()

$$('download-abc').addEventListener 'click', (e) ->
  e.preventDefault()
  downloadABC()

$$('generate').addEventListener 'click', (e) ->
  e.preventDefault()
  generate()

$$('leseübung-form').addEventListener 'submit', (e) ->
  e.preventDefault()
  generate()

filename = (ext) ->
  onetimestring = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').substring(0,19)
  "leseübung_#{onetimestring}.#{ext}"

downloadPNG = () ->
  options = {
    backgroundColor: 'white',
    scale: 4
  }
  saveSvgAsPng(
      document.querySelector( "#paper > svg" ),
      filename('png'),
      options
    )

downloadTextContent = (data, filename, mime_type) ->
  data_uri = "data:#{mime_type};utf8,#{encodeURIComponent(data)}"
  console.log data
  a = document.createElement('a')
  a.href = data_uri
  a.download = filename
  a.target = '_blank'

  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

downloadSVG = () ->
  svg = document.querySelector( "#paper > svg" )
  xml  = new XMLSerializer().serializeToString(svg)
  downloadTextContent(xml, filename('svg'), 'image/svg+xml')

downloadABC = () ->
  abcdata = $val('composition')
  abcdata = ["%abc-2.1", abcdata].join "\n"
  downloadTextContent(abcdata, filename('abc'), 'text/vnd.abc')

setCaretPosition = (elem, caretPos) ->
  if (elem.createTextRange)
    range = elem.createTextRange()
    range.move('character', caretPos)
  else
    if (elem.selectionStart != undefined && elem.offsetParent != null)
      elem.setSelectionRange(caretPos, caretPos)
