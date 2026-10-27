// Original synthesized soundscape: low drones, a slow pulse, and metallic UI taps.
// No soundtrack samples or external audio files are used.
export class DesktopAudio {
  private context = new AudioContext();
  private master = this.context.createGain();
  private sources: AudioScheduledSourceNode[] = [];
  private disposed = false;

  constructor() {
    const ctx = this.context;
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);
    const ambience = ctx.createGain();
    ambience.gain.value = 0.55;
    ambience.connect(this.master);
    [36.71, 55, 73.42, 110.15].forEach((frequency, i) => {
      const tone = ctx.createOscillator();
      const level = ctx.createGain();
      tone.type = i === 3 ? 'triangle' : 'sine';
      tone.frequency.value = frequency;
      level.gain.value = i === 0 ? 0.12 : 0.035;
      tone.connect(level).connect(ambience);
      tone.start();
      this.sources.push(tone);
    });
    const breath = ctx.createOscillator();
    const depth = ctx.createGain();
    breath.frequency.value = 0.12;
    depth.gain.value = 0.22;
    breath.connect(depth).connect(ambience.gain);
    breath.start();
    this.sources.push(breath);
    const noise = ctx.createBuffer(1, ctx.sampleRate * 4, ctx.sampleRate);
    const data = noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      last = (last + (Math.random() * 2 - 1) * 0.02) / 1.02;
      data[i] = last * 3.5;
    }
    const texture = ctx.createBufferSource();
    const filter = ctx.createBiquadFilter();
    const level = ctx.createGain();
    texture.buffer = noise;
    texture.loop = true;
    filter.type = 'lowpass';
    filter.frequency.value = 320;
    level.gain.value = 0.035;
    texture.connect(filter).connect(level).connect(ambience);
    texture.start();
    this.sources.push(texture);
  }

  async enable() {
    await this.context.resume();
    if (!this.disposed) this.master.gain.setTargetAtTime(0.6, this.context.currentTime, 0.4);
  }

  click() {
    if (this.disposed || this.context.state !== 'running') return;
    const ctx = this.context;
    const now = ctx.currentTime;
    [180, 740, 1190].forEach((frequency, index) => {
      const tone = ctx.createOscillator();
      const envelope = ctx.createGain();
      tone.type = 'sine';
      tone.frequency.setValueAtTime(frequency, now);
      tone.frequency.exponentialRampToValueAtTime(frequency * 0.45, now + 0.15);
      envelope.gain.setValueAtTime(0, now);
      envelope.gain.linearRampToValueAtTime(index === 0 ? 0.13 : 0.025, now + 0.004);
      envelope.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
      tone.connect(envelope).connect(this.master);
      tone.start();
      tone.stop(now + 0.22);
      tone.onended = () => { tone.disconnect(); envelope.disconnect(); };
    });
  }

  setVisible(visible: boolean) {
    if (this.disposed) return;
    if (visible) void this.context.resume().catch(() => {});
    else void this.context.suspend().catch(() => {});
  }

  dispose() {
    if (this.disposed) return;
    this.disposed = true;
    this.master.gain.setTargetAtTime(0, this.context.currentTime, 0.04);
    setTimeout(() => {
      this.sources.forEach(source => source.stop());
      void this.context.close().catch(() => {});
    }, 180);
  }
}
