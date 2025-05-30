export class AudioManager {
    constructor() {
        this.sounds = {};
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.isMuted = false;
        this.currentMusic = null;
        this.isInitialized = false;
        this.userInteracted = false;
        
           // ✅ NEW: Autoplay handling
    this.pendingMusic = null;
    this.autoplayListenerAdded = false;
    
        // Audio context for better control
        this.audioContext = null;
        this.gainNode = null;
        
        this.initializeAudio();
    }
    
    async initializeAudio() {
        try {
            // Don't create AudioContext until user interaction
            // Load all music tracks with proper paths
            await this.loadMusic('landing', this.getAudioPath('PatriotFrog.mp3'));      // 🎵 Landing page music
            await this.loadMusic('background', this.getAudioPath('FeelingFroggish.mp3')); // 🎵 Level 1 music
            await this.loadMusic('level2', this.getAudioPath('Level2song.mp3'));        // 🎵 NEW: Level 2 music
            
            // Load SFX
            await this.loadSFX('jump', this.getAudioPath('jump.mp3'));
            await this.loadSFX('lose', this.getAudioPath('lose.mp3'));
            await this.loadSFX('levelfinish', this.getAudioPath('levelfinish.mp3'));
            
            this.isInitialized = true;
            console.log('🎵 Audio system initialized with Level 2 music support');
            
        } catch (error) {
            console.warn('Audio initialization failed:', error);
        }
    }
    
    // ✅ NEW: Get proper audio path for both dev and production
    getAudioPath(filename) {
        // Check if we're in development or production
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const baseUrl = window.location.origin;
        
        // For Vite dev server, audio files are in public/audio/
        // For production, they should be in the root audio/ directory
        if (isDev) {
            return `${baseUrl}/audio/${filename}`;
        } else {
            // Production path - adjust based on your deployment structure
            return `${baseUrl}/audio/${filename}`;
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
                    console.log(`🎵 Music loaded: ${name} (${url})`);
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
            
            return new Promise((resolve, reject) => {
                audio.addEventListener('canplaythrough', () => {
                    this.sounds[name] = audio;
                    console.log(`🎵 SFX loaded: ${name}`);
                    resolve(audio);
                });
                
                audio.addEventListener('error', (e) => {
                    console.warn(`Failed to load SFX: ${url}`, e);
                    reject(e);
                });
                
                // Start loading
                audio.load();
            });
            
        } catch (error) {
            console.warn(`Failed to load SFX ${name}:`, error);
        }
    }
    
// In AudioManager.js - Replace the playMusic() method:

playMusic(name = 'background') {
    if (!this.isInitialized || this.isMuted || !this.sounds[name]) {
        console.warn(`🎵 Cannot play music '${name}': ${!this.isInitialized ? 'not initialized' : this.isMuted ? 'muted' : 'sound not found'}`);
        return;
    }
    
    try {
        // ✅ FIXED: Always enable audio context first
        this.enableAudioContext();
        
        // Stop current music
        this.stopMusic();
        
        const music = this.sounds[name];
        music.currentTime = 0;
        music.volume = this.musicVolume;
        
        // ✅ FIXED: Better error handling for production autoplay policy
        const playPromise = music.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    this.currentMusic = music;
                    console.log(`🎵 ${name} music started successfully`);
                })
                .catch(error => {
                    console.warn(`🎵 Music autoplay blocked for ${name}:`, error.message);
                    
                    // ✅ NEW: Store the music to play after user interaction
                    this.pendingMusic = { name, music };
                    
                    // ✅ NEW: Set up one-time click listener to enable music
                    if (!this.autoplayListenerAdded) {
                        this.setupAutoplayUnblock();
                    }
                });
        }
        
    } catch (error) {
        console.warn(`Failed to play music ${name}:`, error);
    }
}

// ✅ NEW: Add method to handle autoplay unblocking
setupAutoplayUnblock() {
    this.autoplayListenerAdded = true;
    
    const enableMusicOnInteraction = () => {
        console.log('🎵 User interaction detected - enabling music...');
        
        // Enable audio context
        this.enableAudioContext();
        
        // Play pending music if any
        if (this.pendingMusic) {
            console.log(`🎵 Playing pending music: ${this.pendingMusic.name}`);
            
            const playPromise = this.pendingMusic.music.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        this.currentMusic = this.pendingMusic.music;
                        console.log(`🎵 ${this.pendingMusic.name} music started after user interaction`);
                        this.pendingMusic = null;
                    })
                    .catch(e => console.warn('Music still failed after interaction:', e));
            }
        }
        
        // Remove listeners after first interaction
        document.removeEventListener('click', enableMusicOnInteraction);
        document.removeEventListener('keydown', enableMusicOnInteraction);
        document.removeEventListener('touchstart', enableMusicOnInteraction);
    };
    
    // Listen for any user interaction
    document.addEventListener('click', enableMusicOnInteraction, { once: true });
    document.addEventListener('keydown', enableMusicOnInteraction, { once: true });
    document.addEventListener('touchstart', enableMusicOnInteraction, { once: true });
    
    console.log('🎵 Autoplay unblock listeners added - music will start on first user interaction');
}
    
    // ✅ NEW: Play level-specific music
    playLevelMusic(levelNumber) {
        let musicName;
        
        switch(levelNumber) {
            case 1:
                musicName = 'background'; // FeelingFroggish.mp3
                break;
            case 2:
                musicName = 'level2'; // Level2song.mp3
                break;
            default:
                musicName = 'background'; // Fallback to Level 1 music
        }
        
        console.log(`🎵 Playing music for Level ${levelNumber}: ${musicName}`);
        this.playMusic(musicName);
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
        if (!this.isInitialized || this.isMuted || !this.sounds[name]) {
            console.warn(`🎵 Cannot play SFX '${name}': ${!this.isInitialized ? 'not initialized' : this.isMuted ? 'muted' : 'sound not found'}`);
            return;
        }
        
        try {
            const sfx = this.sounds[name].cloneNode();
            sfx.volume = this.sfxVolume;
            sfx.play().catch(e => console.warn(`SFX '${name}' play failed:`, e));
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
    
    // ✅ ENHANCED: Smooth transition between level music
    switchToLevelMusic(levelNumber, fadeOutDuration = 800, fadeInDelay = 300) {
        let musicName;
        
        switch(levelNumber) {
            case 1:
                musicName = 'background';
                break;
            case 2:
                musicName = 'level2';
                break;
            default:
                musicName = 'background';
        }
        
        if (!this.sounds[musicName]) {
            console.warn(`Cannot switch to music for Level ${levelNumber}: track '${musicName}' not found`);
            return;
        }
        
        console.log(`🎵 Switching to Level ${levelNumber} music: ${musicName}`);
        
        // Fade out current music
        if (this.currentMusic) {
            this.fadeMusic(0, fadeOutDuration);
            
            // After fade out, start new music
            setTimeout(() => {
                this.playMusic(musicName);
            }, fadeOutDuration + fadeInDelay);
        } else {
            // No current music, just start new one
            this.playMusic(musicName);
        }
    }
    
    // 🎵 Smooth transition between music tracks (kept for compatibility)
    switchMusic(newTrackName, fadeOutDuration = 500, fadeInDelay = 200) {
        if (!this.sounds[newTrackName]) {
            console.warn(`Cannot switch to music '${newTrackName}': track not found`);
            return;
        }
        
        console.log(`🎵 Switching music to: ${newTrackName}`);
        
        // Fade out current music
        if (this.currentMusic) {
            this.fadeMusic(0, fadeOutDuration);
            
            // After fade out, start new music
            setTimeout(() => {
                this.playMusic(newTrackName);
            }, fadeOutDuration + fadeInDelay);
        } else {
            // No current music, just start new one
            this.playMusic(newTrackName);
        }
    }
    
    // Get audio info for UI display
    getAudioState() {
        return {
            isMuted: this.isMuted,
            isPlaying: this.currentMusic && !this.currentMusic.paused,
            musicVolume: this.musicVolume,
            sfxVolume: this.sfxVolume,
            currentTrack: this.getCurrentTrackName(),
            isInitialized: this.isInitialized,
            loadedSounds: Object.keys(this.sounds)
        };
    }
    
    // Get current track name for debugging
    getCurrentTrackName() {
        if (!this.currentMusic) return null;
        
        // Find which track is currently playing
        for (const [name, audio] of Object.entries(this.sounds)) {
            if (audio === this.currentMusic) {
                return name;
            }
        }
        return 'unknown';
    }
    
    // Browser compatibility check
    isAudioSupported() {
        return !!(window.Audio && window.AudioContext || window.webkitAudioContext);
    }
}