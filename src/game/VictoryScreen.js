// VictoryScreen.js - Congratulations screen after Level 4
import * as THREE from 'three';

export class VictoryScreen {
    constructor(container, audioManager, onReturnHome) {
        this.container = container;
        this.audioManager = audioManager;
        this.onReturnHome = onReturnHome;
        this.isVisible = false;
        this.videoElement = null;
        this.screenElement = null;
    }
    
    show() {
        if (this.isVisible) return;
        
        console.log('🎉 Showing victory screen');
        this.isVisible = true;
        
        // Create full-screen overlay
        this.createVictoryOverlay();
        
        // Play congratulations music
        this.playVictoryMusic();
        
        // Start congratulations video
        this.playVictoryVideo();
        
        // Add return to home button after delay
        setTimeout(() => {
            this.addReturnHomeButton();
        }, 3000); // Show button after 3 seconds
    }
    
    createVictoryOverlay() {
        // Create full-screen green overlay
        this.screenElement = document.createElement('div');
        this.screenElement.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(45deg, #2d5a27, #4a7c59);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: 'Arial', sans-serif;
        `;
        
        // Add title
        const title = document.createElement('h1');
        title.textContent = '🎉 CONGRATULATIONS! 🎉';
        title.style.cssText = `
            color: #fff;
            font-size: 4rem;
            text-align: center;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
            animation: pulse 2s infinite;
        `;
        
        // Add Green Frog Labs message
        const gflMessage = document.createElement('p');
        gflMessage.textContent = 'Green Frog Labs wish you Congratulations';
        gflMessage.style.cssText = `
            color: #4CAF50;
            font-size: 2.5rem;
            text-align: center;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
            font-weight: bold;
            letter-spacing: 1px;
        `;
        
        // Add subtitle
        const subtitle = document.createElement('p');
        subtitle.textContent = 'You have completed all levels!';
        subtitle.style.cssText = `
            color: #fff;
            font-size: 2rem;
            text-align: center;
            margin-bottom: 3rem;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        `;
        
        // Create video container
        const videoContainer = document.createElement('div');
        videoContainer.style.cssText = `
            position: relative;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            margin-bottom: 2rem;
        `;
        
        // ✅ FIXED: Add all elements including Green Frog Labs message
        this.screenElement.appendChild(title);
        this.screenElement.appendChild(gflMessage);
        this.screenElement.appendChild(subtitle);
        this.screenElement.appendChild(videoContainer);
        
        // Add CSS animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(20px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .fade-in {
                animation: fadeIn 1s ease-out;
            }
            
            .victory-button {
                background: linear-gradient(45deg, #ff6b35, #f7931e);
                border: none;
                color: white;
                padding: 15px 30px;
                font-size: 1.5rem;
                border-radius: 10px;
                cursor: pointer;
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
                transition: all 0.3s ease;
                font-weight: bold;
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .victory-button:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 20px rgba(0,0,0,0.3);
                background: linear-gradient(45deg, #ff8a65, #ffb74d);
            }
            
            .victory-button:active {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
        
        this.container.appendChild(this.screenElement);
        this.screenElement.classList.add('fade-in');
        
        console.log('✅ Victory overlay created with Green Frog Labs message');
    }
    
    playVictoryVideo() {
        try {
            // Create video element
            this.videoElement = document.createElement('video');
            this.videoElement.style.cssText = `
                width: 600px;
                height: 400px;
                max-width: 80vw;
                max-height: 50vh;
                border-radius: 10px;
            `;
            
            // Set video properties
            this.videoElement.src = '/congratulationsvideo.mp4';
            this.videoElement.autoplay = true;
            this.videoElement.loop = true;
            this.videoElement.muted = false; // We want audio from video too
            this.videoElement.controls = false;
            
            // Handle video events
            this.videoElement.addEventListener('loadstart', () => {
                console.log('🎬 Loading congratulations video...');
            });
            
            this.videoElement.addEventListener('canplay', () => {
                console.log('🎬 Congratulations video ready to play');
            });
            
            this.videoElement.addEventListener('error', (e) => {
                console.warn('⚠️ Video failed to load:', e);
                this.showFallbackMessage();
            });
            
            // Add video to container
            const videoContainer = this.screenElement.querySelector('div');
            videoContainer.appendChild(this.videoElement);
            
            console.log('✅ Victory video element created');
            
        } catch (error) {
            console.warn('⚠️ Failed to create video element:', error);
            this.showFallbackMessage();
        }
    }
    
    showFallbackMessage() {
        // If video fails, show a nice animated message instead
        const fallback = document.createElement('div');
        fallback.style.cssText = `
            width: 600px;
            height: 400px;
            max-width: 80vw;
            max-height: 50vh;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 3rem;
            text-align: center;
            animation: pulse 2s infinite;
        `;
        fallback.innerHTML = '🐸<br>VICTORY!<br>🏆';
        
        const videoContainer = this.screenElement.querySelector('div');
        videoContainer.appendChild(fallback);
    }
    
    playVictoryMusic() {
        try {
            // Stop current music
            if (this.audioManager) {
                this.audioManager.stopMusic();
                
                // Load and play congratulations music
                this.loadCongratulationsMusic();
            }
        } catch (error) {
            console.warn('⚠️ Failed to play victory music:', error);
        }
    }
    
    async loadCongratulationsMusic() {
        try {
            // Create audio element directly for victory music
            this.victoryAudio = new Audio('/audio/CongratulationsMusic.mp3');
            this.victoryAudio.loop = true;
            this.victoryAudio.volume = 0.7;
            
            // Handle audio events
            this.victoryAudio.addEventListener('canplaythrough', () => {
                console.log('🎵 Congratulations music loaded');
                this.victoryAudio.play().catch(e => {
                    console.warn('⚠️ Congratulations music autoplay blocked:', e);
                    // Add click listener to enable audio
                    this.addAudioEnableListener();
                });
            });
            
            this.victoryAudio.addEventListener('error', (e) => {
                console.warn('⚠️ Failed to load congratulations music:', e);
            });
            
            // Start loading
            this.victoryAudio.load();
            
        } catch (error) {
            console.warn('⚠️ Failed to create victory audio:', error);
        }
    }
    
    addAudioEnableListener() {
        const enableAudio = () => {
            if (this.victoryAudio) {
                this.victoryAudio.play().then(() => {
                    console.log('🎵 Victory music started after user interaction');
                }).catch(e => console.warn('⚠️ Victory music still failed:', e));
            }
            
            // Remove listener after first interaction
            this.screenElement.removeEventListener('click', enableAudio);
        };
        
        this.screenElement.addEventListener('click', enableAudio, { once: true });
        
        // Add hint text
        const hint = document.createElement('p');
        hint.textContent = 'Click anywhere to enable music';
        hint.style.cssText = `
            color: rgba(255,255,255,0.8);
            font-size: 1rem;
            text-align: center;
            margin-top: 1rem;
            font-style: italic;
        `;
        this.screenElement.appendChild(hint);
    }
    
    addReturnHomeButton() {
        if (!this.screenElement) return;
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            margin-top: 2rem;
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
            justify-content: center;
        `;
        
        // Green Froggy Website button
        const websiteButton = document.createElement('button');
        websiteButton.textContent = '🌐 Visit Green Froggy';
        websiteButton.className = 'victory-button';
        websiteButton.style.background = 'linear-gradient(45deg, #4CAF50, #8BC34A)';
        websiteButton.addEventListener('click', () => {
            console.log('🌐 Opening Green Froggy website');
            window.open('https://www.green-froggy.com/', '_blank');
        });
        
        // Play Again button
        const playAgainButton = document.createElement('button');
        playAgainButton.textContent = '🔄 Play Again';
        playAgainButton.className = 'victory-button';
        playAgainButton.style.background = 'linear-gradient(45deg, #ff6b35, #f7931e)';
        playAgainButton.addEventListener('click', () => {
            this.playAgain();
        });
        
        // Return to Game Menu button
        const gameMenuButton = document.createElement('button');
        gameMenuButton.textContent = '🎮 Game Menu';
        gameMenuButton.className = 'victory-button';
        gameMenuButton.style.background = 'linear-gradient(45deg, #9C27B0, #E91E63)';
        gameMenuButton.addEventListener('click', () => {
            this.returnToHome();
        });
        
        buttonContainer.appendChild(websiteButton);
    
        this.screenElement.appendChild(buttonContainer);
        
        console.log('✅ Victory buttons added');
    }
    
    returnToHome() {
        console.log('🏠 Returning to home screen');
        
        // Stop victory music and video
        this.cleanup();
        
        // Call the callback to return to home
        if (this.onReturnHome) {
            this.onReturnHome();
        }
    }
    
    playAgain() {
        console.log('🔄 Starting new game');
        
        // Stop victory music and video
        this.cleanup();
        
        // Reload the page to restart the game
        window.location.reload();
    }
    
    hide() {
        if (!this.isVisible) return;
        
        console.log('🎉 Hiding victory screen');
        this.cleanup();
    }
    
    cleanup() {
        this.isVisible = false;
        
        // Stop and cleanup video
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.src = '';
            this.videoElement = null;
        }
        
        // Stop and cleanup victory music
        if (this.victoryAudio) {
            this.victoryAudio.pause();
            this.victoryAudio.src = '';
            this.victoryAudio = null;
        }
        
        // Remove screen element
        if (this.screenElement) {
            this.screenElement.remove();
            this.screenElement = null;
        }
        
        console.log('✅ Victory screen cleaned up');
    }
    
    // Public method to check if victory screen is showing
    isShowing() {
        return this.isVisible;
    }
}