/**
 * 藥王之塔 - 音效與交響音樂引擎
 * 支援壯闊冒險交響樂（Call to Adventure）與激烈首領對戰管弦樂（Five Armies）
 * 具備平滑淡入淡出 (Crossfade)、自動循環 (Loop) 與 Web Audio API 技能特效音
 */
class SoundEngine {
    constructor() {
        this.ctx = null;
        this.isBgmMuted = localStorage.getItem("pharmacy_tower_bgm_muted") === "true";
        this.isSfxMuted = localStorage.getItem("pharmacy_tower_sfx_muted") === "true";
        this.currentBgm = null;
        this.bgmAudio = null;
        this.pendingBgm = null;
        this.targetVolume = 0.45;

        // 原生交響樂曲庫（相對路徑適配 GitHub Pages 與本地端）
        this.bgmTracks = {
            adventure: './audio/bgm_adventure.mp3',
            village: './audio/bgm_adventure.mp3',
            mystery: './audio/bgm_adventure.mp3',
            battle: './audio/bgm_battle.mp3'
        };

        this.bgmTimer = null;
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

    resumeIfBlocked() {
        this.init();
        if (this.isBgmMuted) return;

        if (this.pendingBgm) {
            const track = this.pendingBgm;
            this.pendingBgm = null;
            this.playBGM(track);
        } else if (this.bgmAudio && this.bgmAudio.paused) {
            this.bgmAudio.play().catch(() => {});
        }
    }

    /**
     * 獨立開關背景音樂 (BGM)
     */
    toggleBGM() {
        this.isBgmMuted = !this.isBgmMuted;
        try {
            localStorage.setItem("pharmacy_tower_bgm_muted", this.isBgmMuted);
        } catch (e) {}

        if (this.isBgmMuted) {
            if (this.bgmAudio) {
                this.bgmAudio.pause();
            }
            this.stopSynthBGM();
        } else {
            const trackToPlay = this.currentBgm || 'adventure';
            this.playBGM(trackToPlay);
        }
        return this.isBgmMuted;
    }

    /**
     * 獨立開關操作音效 (SFX)
     */
    toggleSFX() {
        this.isSfxMuted = !this.isSfxMuted;
        try {
            localStorage.setItem("pharmacy_tower_sfx_muted", this.isSfxMuted);
        } catch (e) {}

        if (!this.isSfxMuted) {
            this.playClick();
        }
        return this.isSfxMuted;
    }

    // 保留相容性
    toggleMute() {
        return this.toggleBGM();
    }

    /**
     * 播放背景音樂（含平滑跨軌淡入淡出）
     * @param {string} type - 'adventure' (行進風壯闊冒險交響樂) 或 'battle' (動態打擊樂大膽管弦對戰樂)
     */
    playBGM(type = 'adventure') {
        const normalizedType = (type === 'battle') ? 'battle' : 'adventure';

        // 若已在播放相同曲目且未暫停，直接返回
        if (this.currentBgm === normalizedType && this.bgmAudio && !this.bgmAudio.paused) {
            return;
        }

        this.currentBgm = normalizedType;
        if (this.isBgmMuted) {
            if (this.bgmAudio) {
                this.bgmAudio.pause();
            }
            return;
        }

        const src = this.bgmTracks[normalizedType];
        if (!src) return;

        const oldAudio = this.bgmAudio;
        const newAudio = new Audio(src);
        newAudio.loop = true;
        newAudio.volume = 0; // 從 0 開始平滑淡入

        const playPromise = newAudio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.bgmAudio = newAudio;
                this.fadeInAudio(newAudio, this.targetVolume, 700);
                if (oldAudio && oldAudio !== newAudio) {
                    this.fadeOutAudio(oldAudio, 600);
                }
            }).catch(() => {
                // 瀏覽器 Autoplay 政策阻擋，等待使用者手勢觸發
                this.pendingBgm = normalizedType;
            });
        }
    }

    fadeInAudio(audio, targetVol, duration = 700) {
        const stepTime = 30;
        const steps = duration / stepTime;
        const stepVol = targetVol / steps;
        let current = 0;

        const timer = setInterval(() => {
            if (this.isBgmMuted || !audio) {
                if (audio) audio.volume = 0;
                clearInterval(timer);
                return;
            }
            current += stepVol;
            if (current >= targetVol) {
                audio.volume = targetVol;
                clearInterval(timer);
            } else {
                audio.volume = Math.min(targetVol, current);
            }
        }, stepTime);
    }

    fadeOutAudio(audio, duration = 600) {
        const stepTime = 30;
        const steps = duration / stepTime;
        const stepVol = audio.volume / steps;

        const timer = setInterval(() => {
            if (!audio) {
                clearInterval(timer);
                return;
            }
            if (audio.volume - stepVol <= 0.01) {
                audio.volume = 0;
                audio.pause();
                audio.currentTime = 0;
                clearInterval(timer);
            } else {
                audio.volume = Math.max(0, audio.volume - stepVol);
            }
        }, stepTime);
    }

    stopBGM() {
        if (this.bgmAudio) {
            this.bgmAudio.pause();
            this.bgmAudio.currentTime = 0;
        }
        this.stopSynthBGM();
    }

    stopSynthBGM() {
        if (this.bgmTimer) {
            clearInterval(this.bgmTimer);
            this.bgmTimer = null;
        }
    }

    // ==========================================
    // Web Audio API 技能特效與音效
    // ==========================================
    playClick() {
        if (this.isSfxMuted) return;
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
        if (this.isSfxMuted) return;
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
        if (this.isSfxMuted) return;
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
        if (this.isSfxMuted) return;
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
        if (this.isSfxMuted) return;
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
        if (this.isSfxMuted) return;
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
}

window.soundEngine = new SoundEngine();
