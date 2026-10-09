/**
 * Web Audio API: Синтезатор аналогового FM-радио
 * - Настоящее аналоговое шипение эфира (Static White/Pink Noise) без свиста
 * - Модуляция тембра шипения по шкале частот
 * - Мягкое затихание шума и проявление чистого радио-эфира при попадании на волну станции
 */

interface RadioStation {
  pos: number;
  frequencies: number[];
}

const STATIONS: RadioStation[] = [
  // Станция 1: (~0.18)
  { pos: 0.18, frequencies: [261.63, 329.63, 392.00] }, // C-E-G
  // Станция 2: (~0.50)
  { pos: 0.50, frequencies: [349.23, 440.00, 523.25] }, // F-A-C
  // Станция 3: (~0.82)
  { pos: 0.82, frequencies: [293.66, 369.99, 440.00] }, // D-F#-A
];

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // Шипение эфира
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  // Звук пойманной радиостанции
  private stationOscs: OscillatorNode[] = [];
  private stationGains: GainNode[] = [];
  private stationMasterGain: GainNode | null = null;

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

      // Мастер-громкость (деликатная, ненавязчивая)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // =========================================================================
      // 1. АНАЛОГОВОЕ ШИПЕНИЕ ЭФИРА (Теплый мягкий розовый шум, тихий фоновый шепот)
      // =========================================================================
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Мягкий розовый шум со сглаживанием резких пиков
        b0 = 0.99886 * b0 + white * 0.045;
        b1 = 0.99332 * b1 + white * 0.060;
        b2 = 0.96900 * b2 + white * 0.120;
        // Тихий, комфортный уровень сигнала без резких щелчков
        const sample = (b0 + b1 + b2 + white * 0.3) * 0.14;
        data[i] = sample;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Мягкий полосовой фильтр для создания теплого лампового тембра эфира
      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.setValueAtTime(1200, this.ctx.currentTime);
      this.noiseFilter.Q.setValueAtTime(0.85, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseNode.start(0);

      // =========================================================================
      // 2. ЗВУК ПОЙМАННОЙ СТАНЦИИ (Теплый чистый радио-эфир)
      // =========================================================================
      this.stationMasterGain = this.ctx.createGain();
      this.stationMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      const stationFilter = this.ctx.createBiquadFilter();
      stationFilter.type = "lowpass";
      stationFilter.frequency.setValueAtTime(2800, this.ctx.currentTime);
      this.stationMasterGain.connect(stationFilter);
      stationFilter.connect(this.masterGain);

      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(i === 0 ? 0.35 : 0.18, this.ctx.currentTime);

        osc.connect(g);
        g.connect(this.stationMasterGain);
        osc.start(0);

        this.stationOscs.push(osc);
        this.stationGains.push(g);
      }

      this.isInitialized = true;
    } catch {
      // Игнорируем ошибки неподдерживаемых сред
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
   * Вызывается при движении мыши по надписи
   * @param xRatio Положение 0..1 по ширине надписи
   * @param speed Скорость перемещения
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
    const clampedSpeed = Math.min(1, Math.max(0.15, speed * 1.6));

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
    const lockRadius = 0.05;
    const isLocking = minDist < lockRadius;
    const lockStrength = isLocking ? Math.pow(1 - minDist / lockRadius, 1.4) : 0;

    // 1. ШИПЕНИЕ ЭФИРА:
    // Теплый тембр шума мягко смещается по шкале (800 Гц - 1800 Гц), без резкого свиста и звона
    const noiseFreq = 850 + xRatio * 950;
    this.noiseFilter.frequency.setTargetAtTime(noiseFreq, now, 0.05);

    // Уровень шипения: деликатный шепот (max ~0.14), чтобы не раздражать слух
    // При попадании на станцию шум мягко затихает (FM quieting)
    const targetNoiseVol = Math.max(0, 0.14 * clampedSpeed * (1 - lockStrength * 0.95));
    this.noiseGain.gain.setTargetAtTime(targetNoiseVol, now, 0.04);

    // 2. ЗВУК СТАНЦИИ:
    // При точном попадании мягко проявляется теплый гармонический аккорд
    if (lockStrength > 0.05) {
      for (let i = 0; i < this.stationOscs.length; i++) {
        const targetFreq = nearestStation.frequencies[i] || 440;
        this.stationOscs[i].frequency.setTargetAtTime(targetFreq, now, 0.04);
      }
      const stationVol = lockStrength * 0.25;
      this.stationMasterGain.gain.setTargetAtTime(stationVol, now, 0.04);
    } else {
      this.stationMasterGain.gain.setTargetAtTime(0, now, 0.06);
    }

    // Затухание при остановке мыши
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
      this.stationOscs.forEach((o) => o.stop());
      this.ctx?.close();
    } catch {}
    this.isInitialized = false;
  }
}

export const radioAudio = new RadioAudioEngine();
