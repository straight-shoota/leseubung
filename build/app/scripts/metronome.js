function Metronome() {
  this.settings = {
    tempo: 80,
    skip_rate: 0,
  }

  this.context = new AudioContext()

  this.clickIndicator = document.querySelector(".click-indicator")

  this.tick = function() {
    if(Math.random() >= this.settings.skip_rate){
      this.playClick();
    }
    var self = this;
    var delay = 36000 / this.settings.tempo;

    this.timeout = setTimeout(function() { self.tick(); }, delay);
  }

  this.stop = function(){
    clearTimeout(this.timeout);
  }

  this.playClick = function(){
    delay = .8

    var oscillator = this.context.createOscillator()
    oscillator.type = "sine"
    oscillator.frequency = 880
    oscillator.start(0)

    var gain = this.context.createGain()

    oscillator.connect(gain)
    gain.connect(this.context.destination)

    this.clickIndicator.style.backgroundColor = "red";
    var indicator = this.clickIndicator;
    setTimeout(function(){
      indicator.style.backgroundColor = "grey"
    }, delay * 100 * 2);

    gain.gain.exponentialRampToValueAtTime(
        0.00001, this.context.currentTime + delay
      )
  }
}

function $$(id) { return document.getElementById(id); };
function $val(id) { return $$(id).value; };

readSettings = function() {
  window.metronome.settings.tempo = $val('tempo')
  window.metronome.settings.skip_rate = $val('skip-rate') / 100
}

window.metronome = new Metronome()

initialize = function() {
  readSettings();

  $$('tempo').addEventListener("change", readSettings);
  $$("skip-rate").addEventListener("change", readSettings);

  $button = $$("start-stop")
  $button.addEventListener("click", function(event) {
    event.preventDefault();
    if($button.innerHTML == "Start"){
      window.metronome.tick();
      $button.innerHTML = "Stop";
    }else{
      window.metronome.stop();
      $button.innerHTML = "Start";
    }
    return false;
  });
  $$('metronome-form').addEventListener('submit', function(event) {
    event.preventDefault();
    readSettings();
    return false;
  });
}


window.addEventListener("load", initialize);

