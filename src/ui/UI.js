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
    
    // ✅ Create frog progress indicator in HUD
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
        document.getElementById('start-btn')?.addEventListener('click', () => {
            this.emit('startGame');
        });
        
        // Restart button
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.emit('restartGame');
        });
        
        // Continue button - Now properly handles Level 2
        document.getElementById('continue-btn')?.addEventListener('click', () => {
            this.handleContinueGame();
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space') {
                if (!this.elements.startMessage.classList.contains('hidden')) {
                    this.emit('startGame');
                } else if (!this.elements.gameOverMessage.classList.contains('hidden')) {
                    this.emit('restartGame');
                } else if (!this.elements.levelCompleteMessage.classList.contains('hidden')) {
                    this.handleContinueGame();
                } else if (!document.getElementById('frog-rescued-message')?.classList.contains('hidden')) {
                    this.hideFrogRescued();
                    this.emit('continueNextFrog');
                }
                event.preventDefault();
            }
        });
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
    
    // ✅ ADDED: Missing hideAllMessages method
    hideAllMessages() {
        this.elements.startMessage.classList.add('hidden');
        this.elements.gameOverMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideFrogRescued();
        this.hideLevel2ComingSoon();
        this.hideLevel3ComingSoon();
    }
    
    // Screen management
    showStartScreen() {
        this.elements.startMessage.classList.remove('hidden');
        this.elements.gameOverMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideFrogRescued();
        this.hideLevel2ComingSoon();
        this.hideLevel3ComingSoon();
    }
    
    hideStartScreen() {
        this.elements.startMessage.classList.add('hidden');
    }
    
    showGameOver(finalScore) {
        this.elements.finalScore.textContent = finalScore;
        this.elements.gameOverMessage.classList.remove('hidden');
        this.elements.startMessage.classList.add('hidden');
        this.elements.levelCompleteMessage.classList.add('hidden');
        this.hideFrogRescued();
        this.hideLevel2ComingSoon();
        this.hideLevel3ComingSoon();
    }
    
    hideGameOver() {
        this.elements.gameOverMessage.classList.add('hidden');
    }
    

    
    hideLevelComplete() {
        this.elements.levelCompleteMessage.classList.add('hidden');
    }
    
    // ✅ Frog rescue system
    showFrogRescued(currentFrogs, totalFrogs) {
        this.hideAllMessages();
        
        let frogRescuedElement = document.getElementById('frog-rescued-message');
        
        if (!frogRescuedElement) {
            frogRescuedElement = this.createFrogRescuedElement();
        }
        
        // Update the message content
        const messageContent = frogRescuedElement.querySelector('.message-content');
        messageContent.innerHTML = `
            <div class="frog-emoji">🐸</div>
            <h2>Frog Rescued!</h2>
            <p>You reached the goal safely!</p>
            <div class="progress-info">
                <p><strong>${currentFrogs}/${totalFrogs} Frogs Saved</strong></p>
                ${currentFrogs < totalFrogs ? 
                    `<p>Need ${totalFrogs - currentFrogs} more frog${totalFrogs - currentFrogs > 1 ? 's' : ''} to complete the level!</p>` : 
                    '<p>All frogs saved! Level complete!</p>'
                }
            </div>
            <p><em>Returning to start...</em></p>
        `;
        
        frogRescuedElement.classList.remove('hidden');
        console.log(`🐸 Showing frog rescued message: ${currentFrogs}/${totalFrogs}`);
    }
    
    createFrogRescuedElement() {
        const frogRescuedDiv = document.createElement('div');
        frogRescuedDiv.id = 'frog-rescued-message';
        frogRescuedDiv.className = 'message-overlay hidden';
        
        frogRescuedDiv.innerHTML = `
            <div class="message-content">
                <!-- Content will be dynamically updated -->
            </div>
        `;
        
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
        
        // Add styles if not already added
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
        
        document.body.appendChild(frogRescuedDiv);
        return frogRescuedDiv;
    }
    
    hideFrogRescued() {
        const frogRescuedElement = document.getElementById('frog-rescued-message');
        if (frogRescuedElement) {
            frogRescuedElement.classList.add('hidden');
        }
    }
    
    // HUD management
    showHUD() {
        this.elements.hud.style.display = 'flex';
    }
    
    hideHUD() {
        this.elements.hud.style.display = 'none';
    }
    
    // HUD updates
    updateLives(lives) {
        this.elements.livesCount.textContent = lives;
        
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
        
        if (score > previousScore) {
            this.animateElement(this.elements.scoreCount.parentElement);
        }
    }
    
// Update this method in UI.js:
updateLevel(level) {
    if (this.elements.levelCount) {
        const levelNames = {
            1: "1: Metaverse City",
            2: "2: Jungle Swamp",
            3: "3: Mars Colony", // ✅ Add Mars Colony
            4: "4: Washington D.C.",
            5: "5: Coming Soon"
        };
        
        this.elements.levelCount.textContent = levelNames[level] || level.toString();
    }
    
    // ✅ Update start message for Level 3
    if (level === 3 && this.elements.startMessage) {
        const titleElement = this.elements.startMessage.querySelector('h2');
        const descElements = this.elements.startMessage.querySelectorAll('p');
        
        if (titleElement) {
            titleElement.textContent = 'Level 3: Mars Colony';
        }
        if (descElements[0]) {
            descElements[0].textContent = 'Use arrow keys to move - FASTEST gameplay yet!';
        }
        if (descElements[1]) {
            descElements[1].textContent = 'Save 6 frogs! Dodge alien vehicles and ride cybertaxis to reach SpaceX HQ!';
        }
    }
}

// Update this method in UI.js:
handleContinueGame() {
    const currentLevel = parseInt(this.elements.levelCount.textContent.match(/\d+/)?.[0]) || 1;
    const nextLevel = currentLevel + 1;
    
    if (nextLevel === 2) {
        console.log('🌿 Progressing to Level 2: Jungle Swamp');
        this.emit('continueGame');
    } else if (nextLevel === 3) {
        console.log('🚀 Progressing to Level 3: Mars Colony');
        this.emit('continueGame'); // ✅ Actually progress to Level 3
    } else if (nextLevel === 4) {
        // Level 3 → Level 4: Show coming soon
        this.showLevel4ComingSoon();
    } else {
        // Future levels: Default to coming soon
        this.showLevelComingSoon(nextLevel);
    }
}

// Update this method in UI.js:
showLevelComplete(nextLevel) {
    this.hideAllMessages();
    this.elements.levelCompleteMessage.classList.remove('hidden');
    
    if (this.elements.nextLevel) {
        this.elements.nextLevel.textContent = nextLevel.toString();
    }
    
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        if (nextLevel === 2) {
            continueBtn.textContent = 'ENTER JUNGLE SWAMP';
            continueBtn.disabled = false;
        } else if (nextLevel === 3) {
            continueBtn.textContent = 'ENTER MARS COLONY'; // ✅ Enable Level 3
            continueBtn.disabled = false;
        } else if (nextLevel === 4) {
            continueBtn.textContent = 'ENTER WASHINGTON D.C.';
            continueBtn.disabled = true;
        } else {
            continueBtn.textContent = 'CONTINUE';
            continueBtn.disabled = false;
        }
    }
    
    // Update level complete message text
    const levelCompleteTitle = document.querySelector('#level-complete-message h2');
    if (levelCompleteTitle) {
        if (nextLevel === 2) {
            levelCompleteTitle.textContent = 'LEVEL COMPLETE! You made it to GFL HQ!';
        } else if (nextLevel === 3) {
            levelCompleteTitle.textContent = 'JUNGLE CONQUERED! Welcome to Mars!';
        } else {
            levelCompleteTitle.textContent = 'LEVEL COMPLETE!';
        }
    }
    
    console.log(`📱 Level complete screen shown for level ${nextLevel}`);
}
    
    // ✅ Frog progress indicator
    updateFrogProgress(currentFrogs, totalFrogs) {
        const frogCountElement = document.getElementById('frog-count');
        if (frogCountElement) {
            frogCountElement.textContent = `${currentFrogs}/${totalFrogs}`;
            
            if (currentFrogs > 0) {
                frogCountElement.style.color = currentFrogs >= totalFrogs ? '#00ff00' : '#ffaa00';
                this.animateElement(frogCountElement.parentElement);
            } else {
                frogCountElement.style.color = '#ffffff';
            }
        }
    }
    
    // Animation helper
    animateElement(element) {
        if (!element) return;
        
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
    
    // ✅ Level 2 Coming Soon (kept for future use)
    showLevel2ComingSoon() {
        console.log('🚧 Showing Level 2 coming soon message');
        this.hideAllMessages();
        
        let comingSoonElement = document.getElementById('level2-coming-soon');
        
        if (!comingSoonElement) {
            comingSoonElement = this.createLevel2ComingSoonElement();
        }
        
        comingSoonElement.classList.remove('hidden');
    }
    
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
                    <p>🐊 New obstacles: Crocodiles and lily pads</p>
                    <p>🏛️ Ancient temple as the finish line</p>
                    <p>⚡ Faster gameplay for increased difficulty</p>
                </div>
                <div class="temporary-options">
                    <button id="replay-city-btn" class="option-btn primary">
                        🏙️ Replay City Level
                    </button>
                </div>
            </div>
        `;
        
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
        
        // Event listener for replay button
        comingSoonDiv.addEventListener('click', (e) => {
            if (e.target.id === 'replay-city-btn') {
                this.hideLevel2ComingSoon();
                this.emit('restartGame');
                this.showNotification('🏙️ Back to the City!', 'success');
            }
        });
        
        document.body.appendChild(comingSoonDiv);
        return comingSoonDiv;
    }
    
    hideLevel2ComingSoon() {
        const comingSoonElement = document.getElementById('level2-coming-soon');
        if (comingSoonElement) {
            comingSoonElement.classList.add('hidden');
        }
    }
    
    // ✅ Level 3 Coming Soon
    showLevel3ComingSoon() {
        console.log('🚧 Showing Level 3 coming soon message');
        this.hideAllMessages();
        
        let comingSoonElement = document.getElementById('level3-coming-soon');
        
        if (!comingSoonElement) {
            comingSoonElement = this.createLevel3ComingSoonElement();
        }
        
        comingSoonElement.classList.remove('hidden');
    }
    
    createLevel3ComingSoonElement() {
        const comingSoonDiv = document.createElement('div');
        comingSoonDiv.id = 'level3-coming-soon';
        comingSoonDiv.className = 'message-overlay hidden';
        
        comingSoonDiv.innerHTML = `
            <div class="message-content">
                <div class="message-icon">🚧</div>
                <h2>Level 3 Coming Soon!</h2>
                <div class="coming-soon-details">
                    <p>🌃 <strong>Futuristic City</strong> level is under development</p>
                    <p>🚁 New obstacles: Hovercars and laser grids</p>
                    <p>⚡ Even faster gameplay with new challenges</p>
                </div>
                <div class="temporary-options">
                    <button id="restart-game-btn" class="option-btn primary">
                        🔄 Restart Game
                    </button>
                </div>
            </div>
        `;
        
        comingSoonDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(30, 30, 60, 0.95), rgba(50, 50, 80, 0.95));
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
            color: white;
            font-family: 'Arial', sans-serif;
        `;
        
        const messageContent = comingSoonDiv.querySelector('.message-content');
        if (messageContent) {
            messageContent.style.cssText = `
                background: linear-gradient(135deg, #2a2a4a, #3a3a5a);
                padding: 40px;
                border-radius: 20px;
                text-align: center;
                max-width: 500px;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                border: 2px solid #4a4a7a;
            `;
        }
        
        // Event listener for restart button
        comingSoonDiv.addEventListener('click', (e) => {
            if (e.target.id === 'restart-game-btn') {
                this.hideLevel3ComingSoon();
                this.emit('restartGame');
                this.showNotification('🔄 Restarting game!', 'success');
            }
        });
        
        document.body.appendChild(comingSoonDiv);
        return comingSoonDiv;
    }
    
    hideLevel3ComingSoon() {
        const comingSoonElement = document.getElementById('level3-coming-soon');
        if (comingSoonElement) {
            comingSoonElement.classList.add('hidden');
        }
    }
    
    // Generic coming soon for future levels
    showLevelComingSoon(levelNumber) {
        console.log(`🚧 Level ${levelNumber} coming soon`);
        this.showNotification(`Level ${levelNumber} is still in development!`, 'info', 4000);
        
        setTimeout(() => {
            this.emit('restartGame');
        }, 2000);
    }
}