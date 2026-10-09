/**
 * Модуль аудио отключен по требованию пользователя
 */

class RadioAudioEngine {
  public init() {}
  public ensureRunning() {}
  public triggerTuning(_xRatio: number, _speed: number) {}
  public fadeStop() {}
  public destroy() {}
}

export const radioAudio = new RadioAudioEngine();
