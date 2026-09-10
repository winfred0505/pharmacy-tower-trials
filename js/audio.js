/**
 * 藥王之塔 - Web Audio API 原生音效合成引擎
 * 無需外部音訊檔案，純程式即時合成音樂與音效
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isMuted = false;
        this.bgmOscs = [];
        this.bgmGain = null;
        this.bgmTimer = null;
        this.currentBgm = null;
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            this.stopBGM();
        } else if (this.currentBgm) {
            this.playBGM(this.currentBgm);
        }
        return this.isMuted;
    }

    playClick() {
        if (this.isMuted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }

    playSuccess() {
        if (this.isMuted) return;
        this.init();
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, this.ctx.currentTime + index * 0.08);
            gain.gain.setValueAtTime(0, this.ctx.currentTime + index * 0.08);
            gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + index * 0.08 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + index * 0.08 + 0.35);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + index * 0.08);
            osc.stop(this.ctx.currentTime + index * 0.08 + 0.35);
        });
    }

    playError() {
        if (this.isMuted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.25);
    }

    playMagic() {
        if (this.isMuted) return;
        this.init();
        const freqs = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, this.ctx.currentTime + i * 0.05);
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + i * 0.05 + 0.4);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + i * 0.05);
            osc.stop(this.ctx.currentTime + i * 0.05 + 0.4);
        });
    }

    playAttack() {
        if (this.isMuted) return;
        this.init();
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(300, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
    }

    playFanfare() {
        if (this.isMuted) return;
        this.init();
        const melody = [
            { f: 523.25, d: 0.15 },
            { f: 523.25, d: 0.15 },
            { f: 523.25, d: 0.15 },
            { f: 659.25, d: 0.45 },
            { f: 587.33, d: 0.15 },
            { f: 659.25, d: 0.15 },
            { f: 783.99, d: 0.6 }
        ];
        let now = this.ctx.currentTime;
        melody.forEach(note => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(note.f, now);
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.22, now + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + note.d);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + note.d);
            now += note.d * 0.85;
        });
    }

    playBGM(type = 'mystery') {
        this.currentBgm = type;
        if (this.isMuted) return;
        this.stopBGM();
        this.init();

        const chords = {
            village: [
                [261.63, 329.63, 392.00], // C
                [220.00, 261.63, 329.63], // Am
                [174.61, 220.00, 261.63], // F
                [196.00, 246.94, 293.66]  // G
            ],
            mystery: [
                [220.00, 261.63, 329.63], // Am
                [196.00, 246.94, 293.66], // G
                [174.61, 220.00, 261.63], // F
                [164.81, 207.65, 246.94]  // E
            ],
            battle: [
                [146.83, 174.61, 220.00], // Dm
                [130.81, 164.81, 196.00], // C
                [116.54, 146.83, 174.61], // Bb
                [110.00, 138.59, 164.81]  // A
            ]
        };

        const progression = chords[type] || chords.mystery;
        let step = 0;

        const playChord = () => {
            if (this.isMuted) return;
            const currentChord = progression[step % progression.length];
            step++;

            currentChord.forEach(f => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const filter = this.ctx.createBiquadFilter();

                osc.type = type === 'battle' ? 'sawtooth' : 'sine';
                osc.frequency.setValueAtTime(f, this.ctx.currentTime);

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(type === 'battle' ? 900 : 600, this.ctx.currentTime);

                gain.gain.setValueAtTime(0, this.ctx.currentTime);
                gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 0.6);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 2.8);

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);

                osc.start();
                osc.stop(this.ctx.currentTime + 2.9);
            });
        };

        playChord();
        this.bgmTimer = setInterval(playChord, 3000);
    }

    stopBGM() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }
}

window.soundEngine = new SoundEngine();
