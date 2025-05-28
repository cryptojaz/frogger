
export class UI {
    constructor() {
        this.eventListeners = {};
        this.elements = {
            startMessage: document.getElementById('start-message'),
            gameOverMessage: document.getElementById('game-over-message'),
            levelCompleteMessage: document.getElementById('level-complete-message'),
            hud: document.getElementById('hud'),
            livesCount: document.getElementById('lives-count'),
            scoreCount: document.getElementById('score-count'),
            levelCount: document.getElementById('level-count'),
            finalScore: document.getElementById('final-score'),
            nextLevel: document.getElementById('next-level')
        };
        
        // ✅ Create frog progress indicator
        this.createFrogProgressIndicator();
        
        this.setupEventListeners();
    }
    
    // ✅ NEW: Create frog progress indicator in HUD
    createFrogProgressIndicator() {
        const hudElement = this.elements.hud;
        
        // Create frog progress container
        const frogProgressDiv = document.createElement('div');
        frogProgressDiv.className = 'stat';
        frogProgressDiv.id = 'frog-progress';
        frogProgressDiv.innerHTML = `
            <span>Frogs: </span>
            <span id="frog-count">0/4</span>
        `;
        
        // Add to HUD
        hudElement.appendChild(frogProgressDiv);
        
        console.log('✅ Frog progress indicator added to HUD');
    }
    
    setupEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.emit('startGame');
        });
        
        // Restart button - handle async
        document.getElementById('restart-btn').addEventListener('click', async () => {
            this.emit('restartGame');
        });
        
        // Continue button - Show Level 2 Coming Soon
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.handleContinueGame();
        });
        
        // Keyboard shortcut for start/restart
        document.addEventListener('keydown', async (event) => {
            if (event.code === 'Space') {
                if (!this.elements.startMessage.classList.contains('hidden')) {
                    this.emit('startGame');
                } else if (!this.elements.gameOverMessage.classList.contains('hidden')) {
                    this.emit('restartGame');
                } else if (!this.elements.levelCompleteMessage.classList.contains('hidden')) {
                    // Show Level 2 Coming Soon
                    this.handleContinueGame();
                } else if (!document.getElementById('frog-rescued-message')?.classList.contains('hidden')) {
                    // ✅ NEW: Space to continue after frog rescue
                    this.hideFrogRescued();
                    this.emit('continueNextFrog');
                }
                event.preventDefault();
            }
        });
    }
    
    // UPDATED: Show Level 2 Coming Soon instead of progressing to Level 2
    handleContinueGame() {
        const currentLevel = parseInt(this.elements.levelCount.textContent) || 1;
        const nextLevel = currentLevel + 1;
        
        if (nextLevel === 2) {
            // Level 1 → Level 2: Show Level 2 Coming Soon (Level 2 not ready yet)
            this.showLevel2ComingSoon();
        } else if (nextLevel === 3) {
            // Level 2 → Level 3: Show coming soon (Level 3 doesn't exist yet)
            this.showLevel3ComingSoon();
        } else {
            // Future levels: Default to coming soon
            this.showLevelComingSoon(nextLevel);
        }
    }
    
    // Event system
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }
    
    // Screen management
    showStartScreen() {
        this.elements.startMessage.classList.remove('hidden');
        this.elements.gameOverMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideFrogRescued(); // ✅ Hide frog rescued message
        this.hideLevel2ComingSoon(); // Hide Level 2 coming soon message
        this.hideLevel3ComingSoon(); // Hide Level 3 coming soon message
    }
    
    hideStartScreen() {
        this.elements.startMessage.classList.add('hidden');
    }
    
    showGameOver(finalScore) {
        this.elements.finalScore.textContent = finalScore;
        this.elements.gameOverMessage.classList.remove('hidden');
        this.elements.startMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideFrogRescued(); // ✅ Hide frog rescued message
        this.hideLevel2ComingSoon(); // Hide Level 2 coming soon message
        this.hideLevel3ComingSoon(); // Hide Level 3 coming soon message
    }
    
    hideGameOver() {
        this.elements.gameOverMessage.classList.add('hidden');
    }
    
    showLevelComplete(nextLevel) {
        // Update the message based on the level
        const levelCompleteMessage = this.elements.levelCompleteMessage;
        const nextLevelSpan = this.elements.nextLevel;
        const continueBtn = document.getElementById('continue-btn');
        
        if (nextLevel === 2) {
            // Level 1 completed, Level 2 not ready yet
            levelCompleteMessage.querySelector('h2').textContent = 'ALL FROGS SAVED! Level 1 Complete!';
            nextLevelSpan.textContent = nextLevel;
            continueBtn.textContent = 'CONTINUE TO JUNGLE';
            continueBtn.style.background = '#2d7a4f'; // Jungle green theme
        } else if (nextLevel === 3) {
            // Level 2 completed, going to Level 3 (will show coming soon)
            levelCompleteMessage.querySelector('h2').textContent = 'ALL FROGS RESCUED! Jungle Conquered!';
            nextLevelSpan.textContent = nextLevel;
            continueBtn.textContent = 'EXPLORE OCEAN DEPTHS';
            continueBtn.style.background = '#1a5490'; // Ocean blue theme
        } else {
            // Default message for other levels
            levelCompleteMessage.querySelector('h2').textContent = 'ALL FROGS SAVED! Level Complete!';
            nextLevelSpan.textContent = nextLevel;
            continueBtn.textContent = 'CONTINUE';
            continueBtn.style.background = '#4a90e2'; // Default blue
        }
        
        this.elements.levelCompleteMessage.classList.remove('hidden');
        this.elements.startMessage.classList.add('hidden');
        this.elements.gameOverMessage.classList.add('hidden');
        this.hideFrogRescued(); // ✅ Hide frog rescued message
        this.hideLevel2ComingSoon(); // Hide Level 2 coming soon message
        this.hideLevel3ComingSoon(); // Make sure Level 3 coming soon is hidden
    }
    
    hideLevelComplete() {
        this.elements.levelCompleteMessage.classList.add('hidden');
    }
    
    // ✅ NEW: Show individual frog rescue message
    showFrogRescued(currentFrogs, totalFrogs) {
        // Hide other messages
        this.elements.startMessage.classList.add('hidden');
        this.elements.gameOverMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideLevel2ComingSoon();
        this.hideLevel3ComingSoon();
        
        // Create or get the frog rescued message element
        let frogRescuedElement = document.getElementById('frog-rescued-message');
        
        if (!frogRescuedElement) {
            frogRescuedElement = this.createFrogRescuedElement();
        }
        
        // Update the message content
        const messageContent = frogRescuedElement.querySelector('.message-content');
        messageContent.innerHTML = `
            <div class="frog-emoji">🐸</div>
            <h2>Frog Rescued!</h2>
            <p>You reached GFL HQ safely!</p>
            <div class="progress-info">
                <p><strong>${currentFrogs}/${totalFrogs} Frogs Saved</strong></p>
                ${currentFrogs < totalFrogs ? 
                    `<p>Need ${totalFrogs - currentFrogs} more frog${totalFrogs - currentFrogs > 1 ? 's' : ''} to complete the level!</p>` : 
                    '<p>All frogs saved! Level complete!</p>'
                }
            </div>
            <p><em>Returning to start...</em></p>
        `;
        
        // Show the message
        frogRescuedElement.classList.remove('hidden');
        
        console.log(`🐸 Showing frog rescued message: ${currentFrogs}/${totalFrogs}`);
    }
    
    // ✅ NEW: Create frog rescued UI element
    createFrogRescuedElement() {
        const frogRescuedDiv = document.createElement('div');
        frogRescuedDiv.id = 'frog-rescued-message';
        frogRescuedDiv.className = 'message-overlay hidden';
        
        frogRescuedDiv.innerHTML = `
            <div class="message-content">
                <!-- Content will be dynamically updated -->
            </div>
        `;
        
        // Add CSS styles
        frogRescuedDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 150, 0, 0.9);
            backdrop-filter: blur(3px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1500;
            color: white;
            font-family: 'Arial', sans-serif;
        `;
        
        // Style the message content
        const messageContent = frogRescuedDiv.querySelector('.message-content');
        if (messageContent) {
            messageContent.style.cssText = `
                background: linear-gradient(135deg, #228B22, #32CD32);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 450px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 3px solid #00ff00;
            `;
        }
        
        // Add styles to head if not already added
        if (!document.getElementById('frog-rescued-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'frog-rescued-styles';
            styleSheet.textContent = `
                .frog-emoji { font-size: 4em; margin-bottom: 20px; }
                .progress-info { 
                    margin: 20px 0; 
                    padding: 15px; 
                    background: rgba(0,0,0,0.2); 
                    border-radius: 10px; 
                }
                .progress-info p { margin: 8px 0; }
            `;
            document.head.appendChild(styleSheet);
        }
        
        // Add to body
        document.body.appendChild(frogRescuedDiv);
        
        return frogRescuedDiv;
    }
    
    // ✅ NEW: Hide frog rescued message
    hideFrogRescued() {
        const frogRescuedElement = document.getElementById('frog-rescued-message');
        if (frogRescuedElement) {
            frogRescuedElement.classList.add('hidden');
        }
    }
    
    showHUD() {
        this.elements.hud.style.display = 'flex';
    }
    
    hideHUD() {
        this.elements.hud.style.display = 'none';
    }
    
    // HUD updates
    updateLives(lives) {
        this.elements.livesCount.textContent = lives;
        
        // Add visual feedback for life loss
        if (lives < 3) {
            this.elements.livesCount.style.color = lives === 1 ? '#ff0000' : '#ff6600';
            this.animateElement(this.elements.livesCount.parentElement);
        } else {
            this.elements.livesCount.style.color = '#00ff00';
        }
    }
    
    updateScore(score) {
        const previousScore = parseInt(this.elements.scoreCount.textContent) || 0;
        this.elements.scoreCount.textContent = score;
        
        // Animate score increase
        if (score > previousScore) {
            this.animateElement(this.elements.scoreCount.parentElement);
        }
    }
    
    updateLevel(level) {
        this.elements.levelCount.textContent = level;
        this.animateElement(this.elements.levelCount.parentElement);
        
        // Update start screen message based on level
        this.updateStartScreenForLevel(level);
    }
    
    // ✅ NEW: Update frog progress indicator
    updateFrogProgress(currentFrogs, totalFrogs) {
        const frogCountElement = document.getElementById('frog-count');
        if (frogCountElement) {
            frogCountElement.textContent = `${currentFrogs}/${totalFrogs}`;
            
            // Add visual feedback for frog rescue
            if (currentFrogs > 0) {
                frogCountElement.style.color = currentFrogs >= totalFrogs ? '#00ff00' : '#ffaa00';
                this.animateElement(frogCountElement.parentElement);
            }
        }
    }
    
    updateStartScreenForLevel(level) {
        const startMessage = this.elements.startMessage;
        const h2 = startMessage.querySelector('h2');
        const instructions = startMessage.querySelectorAll('p');
        
        if (level === 1) {
            h2.textContent = 'Level 1: Metaverse City';
            if (instructions[0]) instructions[0].textContent = 'Use arrow keys to move';
            if (instructions[1]) instructions[1].textContent = 'Save 4 frogs! Reach GFL HQ without getting hit by cars and navigate onto the logs!';
        } else if (level === 2) {
            h2.textContent = 'Level 2: Jungle Swamp';
            if (instructions[0]) instructions[0].textContent = 'Use arrow keys to move - FASTER gameplay!';
            if (instructions[1]) instructions[1].textContent = 'Save 4 frogs! Avoid snapping crocodiles and ride lily pads to reach the ancient temple!';
        } else {
            h2.textContent = `Level ${level}: Unknown Territory`;
            if (instructions[0]) instructions[0].textContent = 'Use arrow keys to move';
            if (instructions[1]) instructions[1].textContent = 'Save 4 frogs! Survive and reach the goal!';
        }
    }
    
    // Animation helpers
    animateElement(element) {
        element.style.transform = 'scale(1.2)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Notification system
    showNotification(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#ff4444' : type === 'success' ? '#44ff44' : '#4444ff'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-weight: bold;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, duration);
    }
    
    // Utility methods
    setLoadingState(isLoading) {
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            if (isLoading) {
                loadingElement.classList.remove('hidden');
            } else {
                loadingElement.classList.add('hidden');
            }
        }
    }
    
    // Mobile responsiveness helpers
    adaptForMobile() {
        if (window.innerWidth < 768) {
            // Add mobile-specific UI adaptations
            this.elements.hud.style.flexDirection = 'column';
            this.elements.hud.style.gap = '10px';
            
            // Make buttons larger for touch
            const buttons = document.querySelectorAll('button');
            buttons.forEach(button => {
                button.style.padding = '20px 30px';
                button.style.fontSize = '1.4em';
            });
        }
    }
    
    // Accessibility helpers
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (announcement.parentNode) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }
    
    // Level-specific UI enhancements
    showJungleTransition() {
        this.showNotification('🌿 Entering the dangerous Jungle Swamp!', 'info', 4000);
        
        // Add jungle-themed styling temporarily
        document.body.style.background = 'linear-gradient(135deg, #1a4b5c, #2d7a4f)';
        
        setTimeout(() => {
            document.body.style.background = ''; // Reset after transition
        }, 5000);
    }
    
    // Show helpful tips for each level
    showLevelTips(level) {
        let tipMessage = '';
        
        switch (level) {
            case 1:
                tipMessage = '💡 Tip: You need to save 4 frogs! Stay on logs in the water section to survive!';
                break;
            case 2:
                tipMessage = '⚠️ Jungle Tip: Save 4 frogs! Crocodiles are dangerous, but lily pads are safe to ride!';
                break;
            default:
                tipMessage = '🎮 Save 4 frogs to complete the level!';
        }
        
        this.showNotification(tipMessage, 'info', 5000);
    }
    
    // NEW: Level 2 Coming Soon Message (after completing Level 1)
    showLevel2ComingSoon() {
        console.log('🚧 Showing Level 2 coming soon message');
        
        // Hide the level complete message first
        this.hideLevelComplete();
        this.hideFrogRescued();
        
        // Create or get the coming soon message element
        let comingSoonElement = document.getElementById('level2-coming-soon');
        
        if (!comingSoonElement) {
            comingSoonElement = this.createLevel2ComingSoonElement();
        }
        
        // Show the message
        comingSoonElement.classList.remove('hidden');
        
        // Announce to screen readers
        this.announceToScreenReader('Level 2 is coming soon! The Jungle Swamp awaits...');
    }
    
    // NEW: Create Level 2 Coming Soon UI element
    createLevel2ComingSoonElement() {
        const comingSoonDiv = document.createElement('div');
        comingSoonDiv.id = 'level2-coming-soon';
        comingSoonDiv.className = 'message-overlay hidden';
        
        comingSoonDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">🌿</div>
                <h2>Level 2 Coming Soon!</h2>
                <div class="coming-soon-details">
                    <p>🌿 <strong>Jungle Swamp</strong> level is under development</p>
                    <p>🐊 New obstacles: Crocodiles, quicksand, and swamp water</p>
                    <p>🍃 Lily pads to jump on and jungle vines to swing</p>
                    <p>🏛️ Ancient temple as the finish line</p>
                    <p>⚡ 1.5x speed multiplier for increased difficulty</p>
                </div>
                <div class="temporary-options">
                    <p><em>For now, you can:</em></p>
                    <div class="option-buttons">
                        <button id="replay-city-btn" class="option-btn primary">
                            🏙️ Replay City Level
                        </button>
                    </div>
                </div>
                <div class="development-note">
                    <small>💡 <strong>Dev Note:</strong> You've conquered the city! Level 2 will add jungle dangers and faster gameplay.</small>
                </div>
            </div>
        `;
        
        // Add CSS styles with jungle theme
        comingSoonDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(20, 60, 30, 0.95), rgba(40, 80, 40, 0.95));
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            color: white;
            font-family: 'Arial', sans-serif;
        `;
        
        // Style the message content with jungle theme
        const messageContent = comingSoonDiv.querySelector('.message-content');
        if (messageContent) {
            messageContent.style.cssText = `
                background: linear-gradient(135deg, #2d4a1f, #3d5a2f);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 2px solid #4d7c44;
            `;
        }
        
        // Add styles to head if not already added
        if (!document.getElementById('level2-coming-soon-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'level2-coming-soon-styles';
            styleSheet.textContent = `
                .message-icon { font-size: 4em; margin-bottom: 20px; }
                .coming-soon-details { margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px; }
                .coming-soon-details p { margin: 8px 0; }
                .temporary-options { margin: 25px 0; }
                .option-buttons { display: flex; gap: 15px; justify-content: center; margin-top: 15px; }
                .option-btn { 
                    padding: 15px 25px; 
                    border: none; 
                    border-radius: 8px; 
                    cursor: pointer; 
                    font-size: 16px;
                    font-weight: bold;
                    transition: all 0.3s ease;
                }
                .option-btn.primary { background: #2d7a4f; color: white; }
                .option-btn.primary:hover { background: #3d8a5f; transform: scale(1.05); }
                .development-note { margin-top: 20px; padding: 15px; background: rgba(0,100,150,0.2); border-radius: 8px; }
            `;
            document.head.appendChild(styleSheet);
        }
        
        // Add event listeners for the new buttons
        comingSoonDiv.addEventListener('click', (e) => {
            if (e.target.id === 'replay-city-btn') {
                this.hideLevel2ComingSoon();
                // Keep level at 1 and restart
                this.elements.levelCount.textContent = '1';
                this.emit('restartGame');
                this.showNotification('🏙️ Back to the City!', 'success');
            }
        });
        
        // Add to body
        document.body.appendChild(comingSoonDiv);
        
        return comingSoonDiv;
    }
    
    // NEW: Hide Level 3 Coming Soon message
    hideLevel3ComingSoon() {
        const comingSoonElement = document.getElementById('level3-coming-soon');
        if (comingSoonElement) {
            comingSoonElement.classList.add('hidden');
        }
    }
    
    // Generic coming soon handler for future levels
    showLevelComingSoon(levelNumber) {
        console.log(`🚧 Level ${levelNumber} coming soon`);
        this.showNotification(`Level ${levelNumber} is still in development!`, 'info', 4000);
        
        // For now, just restart the game
        setTimeout(() => {
            this.emit('restartGame');
        }, 2000);
    }
}