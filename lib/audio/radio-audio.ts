/**
 * Web Audio API: Синтезатор аналогового радиоприемника
 * - Настоящее сочное шипение эфира (Static Hiss + Crackle)
 * - Свист гетеродина (Heterodyne Whistle) с физикой нулевых биений
 * - Попадание на радиоволну (Station Lock-in): шипение затихает, пробивается чистый радио-эфир/аккорд
 */

interface RadioStation {
  pos: number;
  frequencies: number[];
}

const STATIONS: RadioStation[] = [
  // Станция 1: буква «А» (~0.18) — теплая тональность
  { pos: 0.18, frequencies: [261.63, 329.63, 392.00] }, // C-E-G
  // Станция 2: буква «Е» (~0.50) — фирменная частота 104.2 FM Радиоточка
  { pos: 0.50, frequencies: [349.23, 440.00, 523.25] }, // F-A-C
  // Станция 3: буква «И» (~0.82) — звонкий эфир
  { pos: 0.82, frequencies: [293.66, 369.99, 440.00] }, // D-F#-A
];

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;

  // 1. Шипение эфира
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private noiseFilter: BiquadFilterNode | null = null;

  // 2. Свист гетеродина
  private whistleOsc: OscillatorNode | null = null;
  private whistleGain: GainNode | null = null;

  // 3. Станция (попадание на волну)
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

      // Мастер-громкость
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // =========================================================================
      // 1. ШИПЕНИЕ ЭФИРА (Шум + Треск статики)
      // =========================================================================
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2;
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const data = noiseBuffer.getChannelData(0);

      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Розовый шум
        b0 = 0.99886 * b0 + white * 0.0555;
        b1 = 0.99332 * b1 + white * 0.0750;
        b2 = 0.96900 * b2 + white * 0.1538;
        let sample = (b0 + b1 + b2 + white * 0.7) * 0.28;

        // Импульсы статического потрескивания радио
        if (Math.random() < 0.003) {
          sample += (Math.random() - 0.5) * 1.8;
        }
        data[i] = sample;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      this.noiseFilter = this.ctx.createBiquadFilter();
      this.noiseFilter.type = "bandpass";
      this.noiseFilter.frequency.setValueAtTime(2400, this.ctx.currentTime);
      this.noiseFilter.Q.setValueAtTime(1.4, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.noiseNode.connect(this.noiseFilter);
      this.noiseFilter.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseNode.start(0);

      // =========================================================================
      // 2. СВИСТ ГЕТЕРОДИНА (Свист ручки настройки)
      // =========================================================================
      this.whistleOsc = this.ctx.createOscillator();
      this.whistleOsc.type = "sine";
      this.whistleOsc.frequency.setValueAtTime(1000, this.ctx.currentTime);

      this.whistleGain = this.ctx.createGain();
      this.whistleGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.whistleOsc.connect(this.whistleGain);
      this.whistleGain.connect(this.masterGain);
      this.whistleOsc.start(0);

      // =========================================================================
      // 3. ЗВУК ПОПАДАНИЯ НА ВОЛНУ (Чистый сигнал станции)
      // =========================================================================
      this.stationMasterGain = this.ctx.createGain();
      this.stationMasterGain.gain.setValueAtTime(0, this.ctx.currentTime);

      const stationFilter = this.ctx.createBiquadFilter();
      stationFilter.type = "lowpass";
      stationFilter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      this.stationMasterGain.connect(stationFilter);
      stationFilter.connect(this.masterGain);

      // 3 гармоники для чистого ретро-аккорда радиостанции
      for (let i = 0; i < 3; i++) {
        const osc = this.ctx.createOscillator();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);

        const g = this.ctx.createGain();
        g.gain.setValueAtTime(i === 0 ? 0.4 : 0.2, this.ctx.currentTime);

        osc.connect(g);
        g.connect(this.stationMasterGain);
        osc.start(0);

        this.stationOscs.push(osc);
        this.stationGains.push(g);
      }

      this.isInitialized = true;
    } catch {
      // Игнорируем ошибки в неподдерживаемых средах
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
   * Вызывается при движении мыши (кручение верньера/ручки частот)
   * @param xRatio Положение курсора 0..1 по ширине надписи МАРКЕТИНГ
   * @param speed Скорость движения
   */
  public triggerTuning(xRatio: number, speed: number) {
    this.ensureRunning();
    if (
      !this.ctx ||
      !this.noiseGain ||
      !this.whistleGain ||
      !this.whistleOsc ||
      !this.stationMasterGain ||
      !this.noiseFilter
    ) {
      return;
    }

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    const now = this.ctx.currentTime;
    const clampedSpeed = Math.min(1, Math.max(0.15, speed * 1.8));

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

    // Зона попадания на станцию: радиус 0.05 от центра
    const lockRadius = 0.055;
    const isLocking = minDist < lockRadius;
    const lockStrength = isLocking ? Math.pow(1 - minDist / lockRadius, 1.5) : 0;

    // 1. ШИПЕНИЕ ЭФИРА:
    // Когда крутишь в шуме — шипит громко и сочно.
    // Когда попадаешь на станцию (lockStrength > 0) — шипение резко притихает (FM capture effect)!
    const noiseFreq = 1800 + Math.sin(xRatio * Math.PI * 6) * 900;
    this.noiseFilter.frequency.setTargetAtTime(noiseFreq, now, 0.04);

    const targetNoiseVol = Math.max(0, 0.55 * clampedSpeed * (1 - lockStrength * 0.88));
    this.noiseGain.gain.setTargetAtTime(targetNoiseVol, now, 0.04);

    // 2. СВИСТ ГЕТЕРОДИНА (Carrier whistle):
    // Физика гетеродинного биения: при приближении к станции частота свиста стремительно
    // падает до нуля (zero-beat), а при отдалении поднимается до 2000 Гц!
    if (minDist < 0.12) {
      const zeroBeatRatio = Math.min(1, minDist / 0.12);
      // Свист падает от 1800 Гц до 60 Гц
      const whistleFreq = Math.max(60, zeroBeatRatio * 1800);
      this.whistleOsc.frequency.setTargetAtTime(whistleFreq, now, 0.03);

      // Громкость свиста максимальна на подступах к станции, и исчезает точно на волне!
      const whistleVol = Math.sin(zeroBeatRatio * Math.PI) * 0.28 * clampedSpeed;
      this.whistleGain.gain.setTargetAtTime(whistleVol, now, 0.03);
    } else {
      // Между станциями — легкий фоновый свист эфира
      const idleWhistle = 900 + Math.abs(Math.sin(xRatio * 12)) * 1200;
      this.whistleOsc.frequency.setTargetAtTime(idleWhistle, now, 0.05);
      this.whistleGain.gain.setTargetAtTime(0.08 * clampedSpeed, now, 0.05);
    }

    // 3. ЗВУК ПОПАДАНИЯ НА ВОЛНУ (Станция поймана!):
    if (lockStrength > 0.05) {
      // Настраиваем осцилляторы на аккорд пойманной станции
      for (let i = 0; i < this.stationOscs.length; i++) {
        const targetFreq = nearestStation.frequencies[i] || 440;
        this.stationOscs[i].frequency.setTargetAtTime(targetFreq, now, 0.04);
      }

      // Чистый объемный звук радиостанции
      const stationVol = lockStrength * 0.42;
      this.stationMasterGain.gain.setTargetAtTime(stationVol, now, 0.04);
    } else {
      this.stationMasterGain.gain.setTargetAtTime(0, now, 0.06);
    }

    // Плавное затухание при остановке мыши
    this.stopTimeout = setTimeout(() => {
      this.fadeStop();
    }, 150);
  }

  public fadeStop() {
    if (!this.ctx || !this.noiseGain || !this.whistleGain || !this.stationMasterGain) return;
    const now = this.ctx.currentTime;
    this.noiseGain.gain.setTargetAtTime(0, now, 0.14);
    this.whistleGain.gain.setTargetAtTime(0, now, 0.10);
    this.stationMasterGain.gain.setTargetAtTime(0, now, 0.16);
  }

  public destroy() {
    if (this.stopTimeout) clearTimeout(this.stopTimeout);
    try {
      this.noiseNode?.stop();
      this.whistleOsc?.stop();
      this.stationOscs.forEach((o) => o.stop());
      this.ctx?.close();
    } catch {}
    this.isInitialized = false;
  }
}

export const radioAudio = new RadioAudioEngine();
