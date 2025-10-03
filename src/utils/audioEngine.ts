export class AudioEngine {
  private audioContext: AudioContext | null = null;
  private gainNode: GainNode | null = null;

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    } catch (error) {
      console.error('Failed to initialize audio:', error);
    }
  }

  async ensureAudioContext() {
    if (!this.audioContext) {
      this.initializeAudio();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  playNote(frequency: number, duration: number = 0.5) {
    if (!this.audioContext || !this.gainNode) {
      console.warn('Audio context not available');
      return;
    }

    this.ensureAudioContext();

    const oscillator = this.audioContext.createOscillator();
    const noteGain = this.audioContext.createGain();

    oscillator.connect(noteGain);
    noteGain.connect(this.gainNode);

    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = 'sine';

    noteGain.gain.setValueAtTime(0, this.audioContext.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
    noteGain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);

    oscillator.onended = () => {
      oscillator.disconnect();
      noteGain.disconnect();
    };
  }

  playChord(frequencies: number[], duration: number = 1) {
    frequencies.forEach(freq => this.playNote(freq, duration));
  }

  setVolume(volume: number) {
    if (this.gainNode && this.audioContext) {
      this.gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    }
  }
}

export const audioEngine = new AudioEngine();