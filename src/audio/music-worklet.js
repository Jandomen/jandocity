class ChiptuneProcessor extends AudioWorkletProcessor {
  constructor() {
    super()
    this.track = null
    this.phase = 0
    this.step = 0
    this.bassStep = 0
    this.sampleCount = 0
    this.samplesPerStep = 0
    this.bassPhase = 0
    this.port.onmessage = (e) => {
      if (e.data.track) {
        this.track = e.data.track
        this.step = 0
        this.bassStep = 0
        this.sampleCount = 0
        this.phase = 0
        this.bassPhase = 0
        const tickSec = 60 / this.track.bpm / 2
        this.samplesPerStep = Math.floor(tickSec * sampleRate)
      }
      if (e.data.volume !== undefined) this.volume = e.data.volume
    }
    this.volume = 0.26
  }
  process(inputs, outputs) {
    const output = outputs[0]
    const ch = output[0]
    if (!ch || !this.track) return true
    const base = this.track.base
    const melody = this.track.melody
    const bass = this.track.bass
    for (let i = 0; i < ch.length; i++) {
      if (this.sampleCount % this.samplesPerStep === 0 && this.sampleCount !== 0) {
        this.step++
        if (this.step % 2 === 0) this.bassStep++
      }
      const semi = melody[this.step % melody.length]
      const bSemi = bass[this.bassStep % bass.length]
      const freq = base * Math.pow(2, semi / 12)
      const bFreq = (base * 0.5) * Math.pow(2, bSemi / 12)
      // square wave melody + sine bass mix
      this.phase += freq / sampleRate
      if (this.phase >= 1) this.phase -= 1
      this.bassPhase += bFreq / sampleRate
      if (this.bassPhase >= 1) this.bassPhase -= 1
      const mel = this.phase < 0.5 ? 1 : -1
      const bs = Math.sin(this.bassPhase * 2 * Math.PI)
      // envelope simple por step
      const posInStep = this.sampleCount % this.samplesPerStep
      const env = posInStep < this.samplesPerStep * 0.85 ? 1 : (1 - (posInStep - this.samplesPerStep*0.85)/(this.samplesPerStep*0.15))
      ch[i] = (mel * 0.22 + bs * 0.08) * env * this.volume
      this.sampleCount++
    }
    return true
  }
}
registerProcessor('chiptune-processor', ChiptuneProcessor)
