import * as THREE from 'three';
import { Game } from './game/Game.js';
import { UI } from './ui/UI.js';
import { LandingPage } from './ui/LandingPage.js';

let game = null;
let ui = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 Modern 3D Frogger starting...');
    
    // Check if we should show landing page first
    const skipLanding = new URLSearchParams(window.location.search).get('skipLanding') === 'true';
    
    if (skipLanding) {
        // Skip landing page and go straight to game
        console.log('🔧 Skipping landing page');
        initializeGame();
    } else {
        // Show landing page first
        const landingPage = new LandingPage();
        
        // Listen for game start from landing page
        landingPage.on('gameStart', (data) => {
            initializeGame(data.audioManager);
        });
    }
});

function initializeGame(audioManager = null) {
    console.log('🚀 Initializing game...');
    
    // Get canvas - using your HTML structure
    const canvas = document.getElementById('game-canvas');
    
    if (!canvas) {
        console.error('❌ Canvas #game-canvas not found!');
        return;
    }
    
    // Create UI instance - this handles all the start screen logic
    ui = new UI();
    
    // Set up UI event listeners
    ui.on('startGame', () => {
        console.log('🎮 Start game event from UI');
        if (game) {
            game.startGame();
        }
    });
    
    ui.on('restartGame', () => {
        console.log('🔄 Restart game event from UI');
        if (game) {
            game.restartGame();
        }
    });
    
    ui.on('continueGame', () => {
        console.log('➡️ Continue game event from UI');
        if (game) {
            game.nextLevel();
        }
    });
    
    // Create game UI interface that matches your UI.js
    const gameUI = {
        updateScore: (score) => {
            ui.updateScore(score);
        },
        updateLives: (lives) => {
            ui.updateLives(lives);
        },
        updateLevel: (level) => {
            ui.updateLevel(level);
        },
        showStartScreen: () => {
            ui.showStartScreen();
        },
        hideStartScreen: () => {
            ui.hideStartScreen();
        },
        showHUD: () => {
            ui.showHUD();
        },
        showGameOver: (finalScore) => {
            ui.showGameOver(finalScore);
        },
        hideGameOver: () => {
            ui.hideGameOver();
        },
        showLevelComplete: (nextLevel) => {
            ui.showLevelComplete(nextLevel);
        },
        hideLevelComplete: () => {
            ui.hideLevelComplete();
        }
    };

    // Create and initialize the game
    game = new Game(canvas, gameUI, audioManager);
    
    game.init().then(() => {
        console.log('✅ Game initialization completed!');
        
        // Set up control event listeners
        setupControls(game);
        
        // Handle window resize
        window.addEventListener('resize', () => {
            game.handleResize();
        });
        
        // Show start screen and wait for user to click start
        ui.showStartScreen();
        
        console.log('🎮 Game ready - click START GAME or press SPACE to begin');
        
    }).catch(error => {
        console.error('❌ Failed to initialize game:', error);
        ui.showNotification('Failed to load game: ' + error.message, 'error');
    });
}

function setupControls(game) {
    console.log('🎮 Setting up controls...');
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
        // Skip if game isn't playing
        if (!game || !game.isPlaying) return;
        
        const moveDistance = 2;
        
        switch (event.code) {
            case 'ArrowUp':
            case 'KeyW':
                game.movePlayer(0, 0, -moveDistance);
                event.preventDefault();
                break;
            case 'ArrowDown':
            case 'KeyS':
                game.movePlayer(0, 0, moveDistance);
                event.preventDefault();
                break;
            case 'ArrowLeft':
            case 'KeyA':
                game.movePlayer(-moveDistance, 0, 0);
                event.preventDefault();
                break;
            case 'ArrowRight':
            case 'KeyD':
                game.movePlayer(moveDistance, 0, 0);
                event.preventDefault();
                break;
            case 'Space':
                // Only use for abilities if game is playing
                if (game.isPlaying) {
                    game.useTongueAttack();
                    event.preventDefault();
                }
                // Space for start screen is handled by UI.js
                break;
            case 'KeyC':
                if (game.isPlaying) {
                    game.useCroak();
                    event.preventDefault();
                }
                break;
        }
    });

    // Touch controls for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    const minSwipeDistance = 50;

    document.addEventListener('touchstart', (event) => {
        if (!game || !game.isPlaying) return;
        
        const touch = event.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
    });

    document.addEventListener('touchend', (event) => {
        if (!game || !game.isPlaying) return;
        
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;
        
        // Determine swipe direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            // Horizontal swipe
            if (Math.abs(deltaX) > minSwipeDistance) {
                const moveDistance = 2;
                if (deltaX > 0) {
                    game.movePlayer(moveDistance, 0, 0); // Right
                } else {
                    game.movePlayer(-moveDistance, 0, 0); // Left
                }
            }
        } else {
            // Vertical swipe
            if (Math.abs(deltaY) > minSwipeDistance) {
                const moveDistance = 2;
                if (deltaY > 0) {
                    game.movePlayer(0, 0, moveDistance); // Down
                } else {
                    game.movePlayer(0, 0, -moveDistance); // Up
                }
            }
        }
    });

    // Game state controls
    document.addEventListener('keydown', (event) => {
        if (!game) return;
        
        switch (event.code) {
            case 'KeyR':
                if (game.gameOver) {
                    game.restartGame();
                }
                break;
            case 'KeyN':
                if (game.levelComplete) {
                    game.nextLevel();
                }
                break;
            case 'KeyP':
                if (game.isPlaying) {
                    game.togglePause();
                }
                break;
        }
    });

    console.log('✅ Controls setup complete');
}

// Debug helper
window.debugGame = {
    skipLanding: () => {
        window.location.href = window.location.pathname + '?skipLanding=true';
    },
    startGame: () => {
        if (game) game.startGame();
    },
    hideStartScreen: () => {
        if (ui) ui.hideStartScreen();
    }
};