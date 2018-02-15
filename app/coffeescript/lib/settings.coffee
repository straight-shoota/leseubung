storeSettingsToLocation = (settings) ->
  base = window.location.href.replace(/#.*/, "")

  settings_hash = Object.keys(settings).map((key) ->
    key + '=' + settings[key]
  ).join('&')

  url = "#{base}##{settings_hash}"
  console.log(base, url)
  history.pushState(settings, "Leseübung", url)

loadSettingsFromLocation = () ->
  result = {}
  location.hash.substring(1).split("&").forEach((part) ->
    item = part.split("=")
    result[item[0]] = decodeURIComponent(item[1])
  )
  result

initializeSettings = () ->
  if location.hash != ""
    settings = loadSettingsFromLocation()
    console.log "loaded settings", settings
    applySettings(settings)


readSettings = () ->
  settings = {}
  settings.patterns = $val('patterns').split(/\n/)
    .filter((n) -> n.replace(/\s+/g, '').length > 0)
  settings.count = $val('count_count')
  settings.meter = $val('meter_count')
  $clef = $$('clef')
  settings.clef = $clef.options[$clef.selectedIndex].value

  settings.key = $val('key')
  settings.unit = $val('unit_count')
  settings.pattern_length = $val('pattern_length')
  settings.pattern_count = $val('pattern_count')
  settings.rows = $val('row_count')
  settings.bars_per_row = $val('bars_per_row')

  settings.random_pitch = $$('random_pitch').checked
  settings.pitches = $val('pitches').match(TUNES_REGEXP)
  settings.patterns_per_bar = settings.count / settings.meter * settings.pattern_length / settings.pattern_count
  settings.patterns_per_row = 12
  settings.staffwidth = $val('staffwidth')
  settings

applySettings = (settings) ->
  $$('patterns').value = settings.patterns
  $$('count_count').value = settings.count
  $$('meter_count').value = settings.meter
  $$('clef').value = settings.clef
  $$('key').value = settings.key
  $$('unit_count').value = settings.unit
  $$('pattern_length').value = settings.pattern_length
  $$('pattern_count').value = settings.pattern_count
  $$('row_count').value = settings.rows
  $$('bars_per_row').value = settings.bars_per_row
  $$('random_pitch').value = settings.random_pitch
  $$('pitches').value = settings.pitches
  $$('staffwidth').value = settings.staffwidth
