/**
 * Web Audio API Синтезатор аналогового радиоприемника
 * Генерирует процедурный звук настройки радио (шипение эфира + свист гетеродина)
 * Работает исключительно на клиенте в десктопном режиме без загрузки внешних файлов.
 */

class RadioAudioEngine {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private noiseGain: GainNode | null = null;
  private whistleOsc: OscillatorNode | null = null;
  private whistleGain: GainNode | null = null;
  private masterGain: GainNode | null = null;

  private isMuted: boolean = false;
  private isInitialized: boolean = false;
  private stopTimeout: NodeJS.Timeout | null = null;

  public init() {
    if (typeof window === "undefined" || this.isInitialized) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      this.ctx = new AudioCtx();

      // Мастер-громкость (деликатный фоновый уровень)
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      // --- 1. ШИПЕНИЕ ЭФИРА (White/Pink Noise + Bandpass) ---
      const sampleRate = this.ctx.sampleRate;
      const bufferSize = sampleRate * 2; // 2 секунды зацикленного шума
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Генерация мягкого розово-белого шума с легким спадом высоких частот
      let b0 = 0, b1 = 0, b2 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        output[i] = (b0 + b1 + b2 + white * 0.4) * 0.15;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = noiseBuffer;
      this.noiseNode.loop = true;

      // Полосовой фильтр для радиочастотного шипения (характерный звук между станциями)
      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.frequency.setValueAtTime(1600, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(2.2, this.ctx.currentTime);

      this.noiseGain = this.ctx.createGain();
      this.noiseGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.noiseNode.connect(bandpass);
      bandpass.connect(this.noiseGain);
      this.noiseGain.connect(this.masterGain);
      this.noiseNode.start(0);

      // --- 2. СВИСТ ГЕТЕРОДИНА (Heterodyne Whistle / Тон несущей частоты) ---
      this.whistleOsc = this.ctx.createOscillator();
      this.whistleOsc.type = "sine";
      this.whistleOsc.frequency.setValueAtTime(800, this.ctx.currentTime);

      this.whistleGain = this.ctx.createGain();
      this.whistleGain.gain.setValueAtTime(0, this.ctx.currentTime);

      this.whistleOsc.connect(this.whistleGain);
      this.whistleGain.connect(this.masterGain);
      this.whistleOsc.start(0);

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
   * Вызывается при движении мыши над областью настройки
   * @param xRatio Положение курсора от 0 до 1 по ширине надписи
   * @param speed Нормализованная скорость движения курсора (0..1)
   */
  public triggerTuning(xRatio: number, speed: number) {
    if (this.isMuted) return;
    this.ensureRunning();
    if (!this.ctx || !this.noiseGain || !this.whistleGain || !this.whistleOsc) return;

    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
      this.stopTimeout = null;
    }

    const now = this.ctx.currentTime;

    // Расчет частоты свиста гетеродина:
    // Аутентичный ретро-эффект перехода через частоты (перепады высоты тона)
    const baseFreq = 480;
    // Частотная модуляция с несколькими «станциями» вдоль шкалы
    const sweep = Math.sin(xRatio * Math.PI * 5);
    const whistleFreq = Math.min(2400, Math.max(300, baseFreq + Math.abs(sweep) * 1200 + (xRatio * 400)));

    this.whistleOsc.frequency.setTargetAtTime(whistleFreq, now, 0.03);

    // Громкость зависит от активности и скорости мыши
    const activeBoost = Math.min(1, Math.max(0.2, speed * 1.5));
    const targetNoiseVol = 0.45 * activeBoost;
    // Свист звучит тоньше и чуть тише шипения, создавая винтажный фон
    const targetWhistleVol = 0.18 * activeBoost;

    this.noiseGain.gain.setTargetAtTime(targetNoiseVol, now, 0.04);
    this.whistleGain.gain.setTargetAtTime(targetWhistleVol, now, 0.04);

    // Таймер плавного затухания, если мышь остановилась
    this.stopTimeout = setTimeout(() => {
      this.fadeStop();
    }, 140);
  }

  public fadeStop() {
    if (!this.ctx || !this.noiseGain || !this.whistleGain) return;
    const now = this.ctx.currentTime;
    this.noiseGain.gain.setTargetAtTime(0, now, 0.12);
    this.whistleGain.gain.setTargetAtTime(0, now, 0.10);
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.fadeStop();
    } else {
      this.ensureRunning();
    }
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public destroy() {
    if (this.stopTimeout) {
      clearTimeout(this.stopTimeout);
    }
    try {
      this.whistleOsc?.stop();
      this.noiseNode?.stop();
      this.ctx?.close();
    } catch {}
    this.isInitialized = false;
  }
}

export const radioAudio = new RadioAudioEngine();
