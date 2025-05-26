export class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.isMuted = false;
        this.currentMusic = null;
        this.isInitialized = false;
        this.userInteracted = false;
        
        // Audio context for better control
        this.audioContext = null;
        this.gainNode = null;
        
        this.initializeAudio();
    }
    
    async initializeAudio() {
        try {
            // Don't create AudioContext until user interaction
            // Just load the audio files for now
            await this.loadMusic('background', './audio/FeelingFroggish.mp3');
            
            // Load sound effects
            await this.loadSFX('jump', './public/audio/jump.mp3');
            await this.loadSFX('lose', './public/audio/lose.mp3');
            await this.loadSFX('levelfinish', './public/audio/levelfinish.mp3');
            
            this.isInitialized = true;
            console.log('🎵 Audio system initialized (waiting for user interaction)');
            
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }
    
    // Call this on first user interaction
    async enableAudioContext() {
        if (this.userInteracted) return;
        
        try {
            // Create audio context after user gesture
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.gainNode = this.audioContext.createGain();
            this.gainNode.connect(this.audioContext.destination);
            
            // Resume if suspended
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            this.userInteracted = true;
            console.log('🎵 Audio context enabled after user interaction');
            
        } catch (error) {
            console.warn('Failed to enable audio context:', error);
        }
    }
    
    async loadMusic(name, url) {
        try {
            const audio = new Audio(url);
            audio.loop = true;
            audio.volume = this.musicVolume;
            audio.preload = 'auto';
            
            // Handle loading states
            return new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', () => {
                    this.sounds[name] = audio;
                    resolve(audio);
                });
                
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load audio: ${url}`, e);
                    reject(e);
                });
                
                // Start loading
                audio.load();
            });
            
        } catch (error) {
            console.warn(`Failed to load music ${name}:`, error);
        }
    }
    
    async loadSFX(name, url) {
        try {
            const audio = new Audio(url);
            audio.volume = this.sfxVolume;
            audio.preload = 'auto';
            
            this.sounds[name] = audio;
            console.log(`🎵 SFX loaded: ${name}`);
            
        } catch (error) {
            console.warn(`Failed to load SFX ${name}:`, error);
        }
    }
    
    playMusic(name = 'background') {
        if (!this.isInitialized || this.isMuted || !this.sounds[name]) return;
        
        try {
            // Enable audio context on first play attempt
            this.enableAudioContext();
            
            // Stop current music
            this.stopMusic();
            
            const music = this.sounds[name];
            music.currentTime = 0;
            music.volume = this.musicVolume;
            
            // Play with proper error handling
            const playPromise = music.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.currentMusic = music;
                        console.log('🎵 Background music started');
                    })
                    .catch(error => {
                        console.warn('Music play failed:', error);
                        // Don't set currentMusic if play failed
                    });
            }
            
        } catch (error) {
            console.warn('Failed to play music:', error);
        }
    }
    
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.pause();
            this.currentMusic.currentTime = 0;
            this.currentMusic = null;
        }
    }
    
    pauseMusic() {
        if (this.currentMusic && !this.currentMusic.paused) {
            this.currentMusic.pause();
        }
    }
    
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.paused && !this.isMuted) {
            this.currentMusic.play().catch(e => console.warn('Music resume failed:', e));
        }
    }
    
    playSFX(name) {
        if (!this.isInitialized || this.isMuted || !this.sounds[name]) return;
        
        try {
            const sfx = this.sounds[name].cloneNode();
            sfx.volume = this.sfxVolume;
            sfx.play().catch(e => console.warn('SFX play failed:', e));
        } catch (error) {
            console.warn(`Failed to play SFX ${name}:`, error);
        }
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        
        if (this.isMuted) {
            this.pauseMusic();
        } else {
            this.resumeMusic();
        }
        
        // Update volume for all sounds
        Object.values(this.sounds).forEach(audio => {
            audio.muted = this.isMuted;
        });
        
        return this.isMuted;
    }
    
    setMusicVolume(volume) {
        this.musicVolume = Math.max(0, Math.min(1, volume));
        
        if (this.currentMusic) {
            this.currentMusic.volume = this.musicVolume;
        }
    }
    
    setSFXVolume(volume) {
        this.sfxVolume = Math.max(0, Math.min(1, volume));
    }
    
    // Fade music in/out for smooth transitions
    fadeMusic(targetVolume, duration = 1000) {
        if (!this.currentMusic) return;
        
        const startVolume = this.currentMusic.volume;
        const volumeChange = targetVolume - startVolume;
        const steps = 50;
        const stepTime = duration / steps;
        const stepVolume = volumeChange / steps;
        
        let currentStep = 0;
        
        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = startVolume + (stepVolume * currentStep);
            
            if (this.currentMusic) {
                this.currentMusic.volume = Math.max(0, Math.min(1, newVolume));
            }
            
            if (currentStep >= steps) {
                clearInterval(fadeInterval);
                if (targetVolume === 0) {
                    this.stopMusic();
                }
            }
        }, stepTime);
    }
    
    // Get audio info for UI display
    getAudioState() {
        return {
            isMuted: this.isMuted,
            isPlaying: this.currentMusic && !this.currentMusic.paused,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            currentTrack: this.currentMusic ? 'FeelingFroggish' : null,
            isInitialized: this.isInitialized
        };
    }
    
    // Browser compatibility check
    isAudioSupported() {
        return !!(window.Audio && window.AudioContext || window.webkitAudioContext);
    }
}