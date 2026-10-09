/**
 * Web Audio API: Синтезатор лампового FM-радиоприемника
 * - Мягкое аналоговое шипение эфира без свиста
 * - Ламповая сатурация (WaveShaperNode soft clipping) для теплого, бархатистого звука
 * - Аналоговый Wow & Flutter (LFO детонация лампы 0.9 Гц)
 * - Теплый ретро-эквалайзер лампового динамика (220 Гц теплота + мягкий срез верхов)
 */

interface RadioStation {
  pos: number;
  notes: number[];
}

const STATIONS: RadioStation[] = [
  // Станция 1: (~0.18) Теплый мажорный аккорд F-A-C
  { pos: 0.18, notes: [174.61, 220.00, 261.63, 349.23] },
  // Станция 2: (~0.50) Фирменный позывной «Радиоточка» A-C#-E-A
  { pos: 0.50, notes: [220.00, 277.18, 329.63, 440.00] },
  // Станция 3: (~0.82) Звонкий ретро-эфир D-F#-A
  { pos: 0.82, notes: [146.83, 220.00, 293.66, 369.99] },
];

/**
 * Кривая лампового насыщения (асимметричный мягкий клиппинг с обогащением четными гармониками)
 */
function createTubeCurve(amount = 20, samples = 2048): Float32Array {
  const curve = new Float32Array(samples);
  const k = amount;
  for (let i = 0; i < samples; ++i) {
    const x = (i * 2) / samples - 1;
    if (x < 0) {
      // Мягкое компрессирование отрицательной полуволны
      curve[i] = -Math.pow(Math.abs(x), 0.88);
    } else {
      // Ламповое мягкое насыщение положительной полуволны
      curve[i] = ((Math.PI + k) * x) / (Math.PI + k * Math.abs(x));
    }
  }
  return curve;
}

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // 1. Аналоговое шипение эфира
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  // 2. Ламповый тракт станции
  private tubeShaper: WaveShaperNode | null = null;
  private stationMasterGain: GainNode | null = null;
  private stationOscs: OscillatorNode[] = [];
  private stationGains: GainNode[] = [];

  // 3. Аналоговый Wow & Flutter (LFO детонация частоты лампы)
  private lfoOsc: OscillatorNode | null = null;
  private lfoGain: GainNode | null = null;

  private isInitialized = false;
  private stopTimeout: NodeJS.Timeout | null = null;

  public init() {
    if (typeof window === "undefined" || this.isInitialized) return;

    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Мастер-выход
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.38, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // =========================================================================
      // 1. АНАЛОГОВОЕ ШИПЕНИЕ ЭФИРА (Теплый шум без свиста)
      // =========================================================================
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.0750;
        b2 = 0.96900 * b2 + white * 0.1538;
        let sample = (b0 + b1 + b2 + white * 0.55) * 0.28;

        // Редкие статические микро-разряды радио
        if (Math.random() < 0.002) {
          sample += (Math.random() - 0.5) * 1.4;
        }
        data[i] = sample;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.setValueAtTime(2000, this.ctx.currentTime);
      this.noiseFilter.Q.setValueAtTime(1.1, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseNode.start(0);

      // =========================================================================
      // 2. ЛАМПОВЫЙ КАСКАД УСИЛЕНИЯ СТАНЦИИ (Tube Saturation + Lowpass)
      // =========================================================================
      this.tubeShaper = this.ctx.createWaveShaper();
      this.tubeShaper.curve = createTubeCurve(18) as unknown as Float32Array<ArrayBuffer>;
      this.tubeShaper.oversample = "2x";

      // Теплый эквалайзер лампового радиоприемника
      const tubeLowpass = this.ctx.createBiquadFilter();
      tubeLowpass.type = "lowpass";
      tubeLowpass.frequency.setValueAtTime(2200, this.ctx.currentTime);

      const bassWarmth = this.ctx.createBiquadFilter();
      bassWarmth.type = "peaking";
      bassWarmth.frequency.setValueAtTime(240, this.ctx.currentTime);
      bassWarmth.gain.setValueAtTime(4.0, this.ctx.currentTime); // Теплый ламповый низ
      bassWarmth.Q.setValueAtTime(1.0, this.ctx.currentTime);

      this.stationMasterGain = this.ctx.createGain();
      this.stationMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      // Соединение лампового тракта:
      // Oscs -> tubeShaper -> tubeLowpass -> bassWarmth -> stationMasterGain -> masterGain
      this.tubeShaper.connect(tubeLowpass);
      tubeLowpass.connect(bassWarmth);
      bassWarmth.connect(this.stationMasterGain);
      this.stationMasterGain.connect(this.masterGain);

      // =========================================================================
      // 3. АНАЛОГОВЫЙ WOW & FLUTTER (Живая детонация частоты радиолампы)
      // =========================================================================
      this.lfoOsc = this.ctx.createOscillator();
      this.lfoOsc.type = "sine";
      this.lfoOsc.frequency.setValueAtTime(0.85, this.ctx.currentTime); // 0.85 Гц легкое колыхание

      this.lfoGain = this.ctx.createGain();
      this.lfoGain.gain.setValueAtTime(1.8, this.ctx.currentTime); // Детонация на ~1.8 Гц
      this.lfoOsc.connect(this.lfoGain);
      this.lfoOsc.start(0);

      // 4 осциллятора для объемного теплого аккорда
      for (let i = 0; i < 4; i++) {
        const osc = this.ctx.createOscillator();
        // Теплые синусоиды и треугольные волны для аналогового тела
        osc.type = i % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);

        // Подключаем LFO к частоте каждого осциллятора для ламповой "живости"
        this.lfoGain.connect(osc.frequency);

        const g = this.ctx.createGain();
        const baseVol = i === 0 ? 0.32 : i === 1 ? 0.22 : 0.16;
        g.gain.setValueAtTime(baseVol, this.ctx.currentTime);

        osc.connect(g);
        g.connect(this.tubeShaper);
        osc.start(0);

        this.stationOscs.push(osc);
        this.stationGains.push(g);
      }

      this.isInitialized = true;
    } catch {
      // Игнорируем в неподдерживаемых браузерах
    }
  }

  public ensureRunning() {
    if (!this.isInitialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Вызывается при движении мыши по баннеру
   */
  public triggerTuning(xRatio: number, speed: number) {
    this.ensureRunning();
    if (!this.ctx || !this.noiseGain || !this.stationMasterGain || !this.noiseFilter) {
      return;
    }

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    const now = this.ctx.currentTime;
    const clampedSpeed = Math.min(1, Math.max(0.18, speed * 1.5));

    // Находим ближайшую станцию
    let nearestStation = STATIONS[0];
    let minDist = 999;
    for (const st of STATIONS) {
      const d = Math.abs(xRatio - st.pos);
      if (d < minDist) {
        minDist = d;
        nearestStation = st;
      }
    }

    // Зона попадания на станцию
    const lockRadius = 0.055;
    const isLocking = minDist < lockRadius;
    const lockStrength = isLocking ? Math.pow(1 - minDist / lockRadius, 1.4) : 0;

    // 1. АНАЛОГОВОЕ ШИПЕНИЕ ЭФИРА:
    const noiseFreq = 1300 + xRatio * 1700;
    this.noiseFilter.frequency.setTargetAtTime(noiseFreq, now, 0.05);

    // При захвате станции шум бархатно затихает
    const targetNoiseVol = Math.max(0, 0.48 * clampedSpeed * (1 - lockStrength * 0.94));
    this.noiseGain.gain.setTargetAtTime(targetNoiseVol, now, 0.04);

    // 2. ЛАМПОВЫЙ ЭФИР СТАНЦИИ:
    if (lockStrength > 0.04) {
      for (let i = 0; i < this.stationOscs.length; i++) {
        const targetFreq = nearestStation.notes[i] || 220;
        this.stationOscs[i].frequency.setTargetAtTime(targetFreq, now, 0.04);
      }
      // Теплый глубокий звук
      const stationVol = lockStrength * 0.42;
      this.stationMasterGain.gain.setTargetAtTime(stationVol, now, 0.04);
    } else {
      this.stationMasterGain.gain.setTargetAtTime(0, now, 0.06);
    }

    // Плавное затухание при остановке мыши
    this.stopTimeout = setTimeout(() => {
      this.fadeStop();
    }, 140);
  }

  public fadeStop() {
    if (!this.ctx || !this.noiseGain || !this.stationMasterGain) return;
    const now = this.ctx.currentTime;
    this.noiseGain.gain.setTargetAtTime(0, now, 0.14);
    this.stationMasterGain.gain.setTargetAtTime(0, now, 0.16);
  }

  public destroy() {
    if (this.stopTimeout) clearTimeout(this.stopTimeout);
    try {
      this.noiseNode?.stop();
      this.lfoOsc?.stop();
      this.stationOscs.forEach((o) => o.stop());
      this.ctx?.close();
    } catch {}
    this.isInitialized = false;
  }
}

export const radioAudio = new RadioAudioEngine();
