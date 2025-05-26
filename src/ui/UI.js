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
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Start button
        document.getElementById('start-btn').addEventListener('click', () => {
            this.emit('startGame');
        });
        
        // Restart button
        document.getElementById('restart-btn').addEventListener('click', () => {
            this.emit('restartGame');
        });
        
        // Continue button - MODIFIED FOR TEMPORARY MESSAGE
        document.getElementById('continue-btn').addEventListener('click', () => {
            // Instead of emitting continueGame, show Level 2 coming soon message
            this.showLevel2ComingSoon();
        });
        
        // Keyboard shortcut for start/restart
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                if (!this.elements.startMessage.classList.contains('hidden')) {
                    this.emit('startGame');
                } else if (!this.elements.gameOverMessage.classList.contains('hidden')) {
                    this.emit('restartGame');
                } else if (!this.elements.levelCompleteMessage.classList.contains('hidden')) {
                    // MODIFIED: Show Level 2 coming soon instead of continuing
                    this.showLevel2ComingSoon();
                }
                event.preventDefault();
            }
        });
    }
    
    // NEW METHOD: Show Level 2 Coming Soon message
    showLevel2ComingSoon() {
        console.log('🚧 Showing Level 2 coming soon message');
        
        // Hide the level complete message first
        this.hideLevelComplete();
        
        // Create or get the coming soon message element
        let comingSoonElement = document.getElementById('level2-coming-soon');
        
        if (!comingSoonElement) {
            comingSoonElement = this.createLevel2ComingSoonElement();
        }
        
        // Show the message
        comingSoonElement.classList.remove('hidden');
        
        // Announce to screen readers
        this.announceToScreenReader('Level 2 is coming soon! For now, enjoy perfecting Level 1.');
    }
    
    // NEW METHOD: Create Level 2 Coming Soon UI element
    createLevel2ComingSoonElement() {
        const comingSoonDiv = document.createElement('div');
        comingSoonDiv.id = 'level2-coming-soon';
        comingSoonDiv.className = 'message-overlay hidden';
        
        comingSoonDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">🚧</div>
                <h2>Level 2 Coming Soon!</h2>
                <div class="coming-soon-details">
                    <p>🌿 <strong>Jungle Swamp</strong> level is under development</p>
                    <p>🐍 New obstacles: Vines, snakes, and crocodiles</p>
                    <p>🌊 Dynamic water levels and moving platforms</p>
                    <p>⚡ Special power-ups and bonus areas</p>
                </div>
                <div class="temporary-options">
                    <p><em>For now, you can:</em></p>
                    <div class="option-buttons">
                        <button id="restart-level1-btn" class="option-btn primary">
                            🔄 Play Level 1 Again
                        </button>
                        <button id="perfect-score-btn" class="option-btn secondary">
                            🏆 Try for Perfect Score
                        </button>
                    </div>
                </div>
                <div class="development-note">
                    <small>💡 <strong>Dev Note:</strong> This allows us to test Level 1 thoroughly before building Level 2!</small>
                </div>
            </div>
        `;
        
        // Add CSS styles
        comingSoonDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 20, 40, 0.95);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            color: white;
            font-family: 'Arial', sans-serif;
        `;
        
        // Style the message content
        const messageContent = comingSoonDiv.querySelector('.message-content');
        if (messageContent) {
            messageContent.style.cssText = `
                background: linear-gradient(135deg, #1a4b5c, #2d7a4f);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 2px solid #00ffaa;
            `;
        }
        
        // Style elements
        const styles = `
            .message-icon { font-size: 4em; margin-bottom: 20px; }
            .coming-soon-details { margin: 20px 0; padding: 20px; background: rgba(0,0,0,0.2); border-radius: 10px; }
            .coming-soon-details p { margin: 8px 0; }
            .temporary-options { margin: 25px 0; }
            .option-buttons { display: flex; gap: 15px; justify-content: center; margin-top: 15px; }
            .option-btn { 
                padding: 12px 20px; 
                border: none; 
                border-radius: 8px; 
                cursor: pointer; 
                font-size: 14px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .option-btn.primary { background: #00ff88; color: #003322; }
            .option-btn.secondary { background: #4488ff; color: white; }
            .option-btn:hover { transform: scale(1.05); }
            .development-note { margin-top: 20px; padding: 15px; background: rgba(255,165,0,0.1); border-radius: 8px; }
        `;
        
        // Add styles to head if not already added
        if (!document.getElementById('level2-coming-soon-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'level2-coming-soon-styles';
            styleSheet.textContent = styles;
            document.head.appendChild(styleSheet);
        }
        
        // Add event listeners for the new buttons
        comingSoonDiv.addEventListener('click', (e) => {
            if (e.target.id === 'restart-level1-btn') {
                this.hideLevel2ComingSoon();
                this.emit('restartGame');
                this.showNotification('🔄 Restarting Level 1 - Good luck!', 'success');
            } else if (e.target.id === 'perfect-score-btn') {
                this.hideLevel2ComingSoon();
                this.emit('restartGame');
                this.showNotification('🏆 Go for the perfect score! Collect all bonuses!', 'info');
            }
        });
        
        // Add to body
        document.body.appendChild(comingSoonDiv);
        
        return comingSoonDiv;
    }
    
    // NEW METHOD: Hide Level 2 Coming Soon message
    hideLevel2ComingSoon() {
        const comingSoonElement = document.getElementById('level2-coming-soon');
        if (comingSoonElement) {
            comingSoonElement.classList.add('hidden');
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
        this.hideLevel2ComingSoon(); // Hide coming soon message
    }
    
    hideStartScreen() {
        this.elements.startMessage.classList.add('hidden');
    }
    
    showGameOver(finalScore) {
        this.elements.finalScore.textContent = finalScore;
        this.elements.gameOverMessage.classList.remove('hidden');
        this.elements.startMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideLevel2ComingSoon(); // Hide coming soon message
    }
    
    hideGameOver() {
        this.elements.gameOverMessage.classList.add('hidden');
    }
    
    showLevelComplete(nextLevel) {
        this.elements.nextLevel.textContent = nextLevel;
        this.elements.levelCompleteMessage.classList.remove('hidden');
        this.elements.startMessage.classList.add('hidden');
        this.elements.gameOverMessage.classList.add('hidden');
        this.hideLevel2ComingSoon(); // Make sure coming soon is hidden
    }
    
    hideLevelComplete() {
        this.elements.levelCompleteMessage.classList.add('hidden');
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
                document.body.removeChild(notification);
            }, 300);
        }, duration);
    }
    
    // Utility methods
    setLoadingState(isLoading) {
        const loadingElement = document.getElementById('loading');
        if (isLoading) {
            loadingElement.classList.remove('hidden');
        } else {
            loadingElement.classList.add('hidden');
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
            document.body.removeChild(announcement);
        }, 1000);
    }
    
    // DEVELOPMENT HELPER: Method to easily restore normal level progression later
    enableLevel2Progression() {
        console.log('🔧 Enabling Level 2 progression (for future use)');
        
        // When ready to enable Level 2, replace the continue button event listener:
        document.getElementById('continue-btn').removeEventListener('click', this.showLevel2ComingSoon);
        document.getElementById('continue-btn').addEventListener('click', () => {
            this.emit('continueGame');
        });
        
        // Also update spacebar handler
        this.showNotification('Level 2 progression enabled!', 'success');
    }
}