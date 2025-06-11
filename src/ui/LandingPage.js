export class LandingPage {
    constructor() {
        this.currentImageIndex = 0;
        this.imageCount = 7; // landing.png through landing7.png
        this.isVisible = true;
        this.eventListeners = {};
        this.audioManager = null;
        this.infoModalVisible = false;
        
        this.init();
    }
    
    init() {
        this.createLandingHTML();
        this.selectRandomImage(); // Start with random image
        this.setupEventListeners();
        // Remove auto-cycling - now only dice button changes image
        this.initializeAudio();
    }
    
    createLandingHTML() {
        // Create landing page overlay
        const landingHTML = `
            <div id="landing-page" class="landing-overlay">
                <div class="landing-content">
                    <div class="landing-image-container">
                        <img id="landing-image" src="" alt="3D Green Froggy" />
                        <!-- Removed image indicator counter -->
                    </div>
                    
                    <div class="landing-info">
                        <h1 class="landing-title"> GREEN FROGGY</h1>
                        <p class="landing-subtitle">Cross the road without getting hit!</p>
                        
                        <div class="landing-controls">
                            <div class="control-item">
                                <span class="control-key">↑ ↓ ← →</span>
                                <span class="control-desc">Move Frog</span>
                            </div>
                            <div class="control-item">
                                <span class="control-key">SPACE</span>
                                <span class="control-desc">Start Game</span>
                            </div>
                        </div>
                        
                        <div class="landing-actions">
                            <button id="start-game-btn" class="landing-btn primary">
                                <span>PRESS SPACE TO START</span>
                                <div class="btn-glow"></div>
                            </button>
                            
                            <div class="landing-navigation">
                                <button id="random-image" class="nav-btn" title="Shuffle Image">🎲</button>
                                <button id="info-button" class="nav-btn info-btn" title="Game Info & Levels">
                                    <span class="info-icon">ℹ️</span>
                                </button>
                                <button id="audio-toggle" class="nav-btn audio-btn" title="Toggle Music">
                                    <span class="audio-icon">🔊</span>
                                </button>
                            </div>
                        </div>
                        
                        <div class="landing-footer">
                            <p>Built with Three.js • Modern Web Technology</p>
                            <div class="version-info">v1.1.1</div>
                        </div>
                    </div>
                </div>
                
                <!-- Animated background -->
                <div class="landing-bg-animation">
                    <div class="bg-element bg-car"></div>
                    <div class="bg-element bg-car delayed"></div>
                    <div class="bg-element bg-car delayed-2"></div>
                </div>
                
                <!-- Info Modal -->
                <div id="info-modal" class="info-modal hidden">
                    <div class="info-modal-content">
                        <div class="info-modal-header">
                            <h2>🐸 Modern 3D Green Froggy - Game Info</h2>
                            <button id="close-info-modal" class="close-btn">✖</button>
                        </div>
                        
                        <div class="info-modal-body">
                            <div class="game-description">
                                <p>
                                    Help the frog cross dangerous roads and rivers in this modern 3D homage of the classic 1981 arcade game!
                                    Navigate through multiple unique levels, from corporate headquarters to space colonies.
                                    Avoid cars, ride logs, and reach the lily pads safely!
                                </p>
                            </div>
                            
                            <div class="controls-section">
                                <h3>🎮 Controls</h3>
                                <div class="controls-grid">
                                    <div class="control-row">
                                        <span class="key">WASD or Arrow Keys</span>
                                        <span class="action">Move</span>
                                    </div>
                                    <div class="control-row">
                                        <span class="key">Space</span>
                                        <span class="action">Tongue Attack</span>
                                    </div>
                                    <div class="control-row">
                                        <span class="key">C</span>
                                        <span class="action">Croak</span>
                                    </div>
                                    <div class="control-row">
                                        <span class="key">P</span>
                                        <span class="action">Pause</span>
                                    </div>
                                    <div class="control-row">
                                        <span class="key">R</span>
                                        <span class="action">Restart (when game over)</span>
                                    </div>
                                    <div class="control-row mobile">
                                        <span class="key">Swipe</span>
                                        <span class="action">Move (Mobile)</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="levels-section">
                                <h3>🌍 Game Levels</h3>
                                <div class="levels-grid">
                                    <div class="level-card ready">
                                        <div class="level-number">1</div>
                                        <h4>Green Frog Labs HQ</h4>
                                        <p>Corporate headquarters with urban roads and rivers - A 3D homage of the original 1981 game</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🏢 Corporate</span>
                                            <span class="feature-tag">🚗 Urban Traffic</span>
                                            <span class="feature-tag">🏞️ Rivers</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Inspired by:</span>
                                            <span class="inspiration-game">Frogger (1981) - Original Arcade</span>
                                        </div>
                                        <div class="level-status ready">✅ Ready to Play</div>
                                    </div>
                                    
                                    <div class="level-card ready">
                                        <div class="level-number">2</div>
                                        <h4>InfoWars Jungle Base</h4>
                                        <p>Dense jungle swamp with muddy paths, crocodiles, and conspiracy theories</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🌿 Jungle</span>
                                            <span class="feature-tag">🐊 Crocodiles</span>
                                            <span class="feature-tag">📡 Info Base</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Inspired by:</span>
                                            <span class="inspiration-game">Frogger 2: Swampy's Revenge (2000)</span>
                                        </div>
                                        <div class="level-status ready">✅ Ready to Play</div>
                                    </div>
                                    
                                    <div class="level-card ready">
                                        <div class="level-number">3</div>
                                        <h4>SpaceX Mars Colony</h4>
                                        <p>Red planet surface with rovers, aliens, and space technology</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🚀 Space</span>
                                            <span class="feature-tag">👽 Aliens</span>
                                            <span class="feature-tag">🪐 Mars</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Inspired by:</span>
                                            <span class="inspiration-game">Frogger 3D (2011) & Frogger Beyond (2002)</span>
                                        </div>
                                        <div class="level-status ready">✅ Ready to Play</div>
                                    </div>
                                    
                                    <div class="level-card ready">
                                        <div class="level-number">4</div>
                                        <h4>White House Washington D.C.</h4>
                                        <p>Political power center with government vehicles and patriotic themes</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🏛️ Government</span>
                                            <span class="feature-tag">🇺🇸 Patriotic</span>
                                            <span class="feature-tag">🚔 Security</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Inspired by:</span>
                                            <span class="inspiration-game">Original Frogger Concepts</span>
                                        </div>
                                        <div class="level-status ready">✅ Ready to Play</div>
                                    </div>
                                    
                                    <div class="level-card planned">
                                        <div class="level-number">5</div>
                                        <h4>AGI Data Center</h4>
                                        <p>Futuristic AI facility with robotic vehicles and digital hazards</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🤖 AI</span>
                                            <span class="feature-tag">💻 Digital</span>
                                            <span class="feature-tag">⚡ Electric</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Inspired by:</span>
                                            <span class="inspiration-game">Cyberpunk Frogger Concepts</span>
                                        </div>
                                        <div class="level-status planned">🔮 Planned</div>
                                    </div>
                                    
                                    <div class="level-card future">
                                        <div class="level-number">6</div>
                                        <h4>Ancient Egypt Pyramids</h4>
                                        <p>Desert sands with chariots, sphinx guardians, and ancient mysteries</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🏺 Ancient</span>
                                            <span class="feature-tag">🐪 Desert</span>
                                            <span class="feature-tag">👑 Pharaoh</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Theme:</span>
                                            <span class="inspiration-game">Historical Adventure</span>
                                        </div>
                                        <div class="level-status future">🔭 Future</div>
                                    </div>
                                    
                                    <div class="level-card future">
                                        <div class="level-number">7</div>
                                        <h4>Medieval Castle Siege</h4>
                                        <p>Knight battles with catapults, dragons, and medieval chaos</p>
                                        <div class="level-features">
                                            <span class="feature-tag">⚔️ Medieval</span>
                                            <span class="feature-tag">🐉 Dragons</span>
                                            <span class="feature-tag">🏰 Castle</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Theme:</span>
                                            <span class="inspiration-game">Fantasy Adventure</span>
                                        </div>
                                        <div class="level-status future">🔭 Future</div>
                                    </div>
                                    
                                    <div class="level-card future">
                                        <div class="level-number">8</div>
                                        <h4>Wild West Frontier</h4>
                                        <p>Cowboy town with stagecoaches, tumbleweeds, and saloon shootouts</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🤠 Western</span>
                                            <span class="feature-tag">🐎 Horses</span>
                                            <span class="feature-tag">🌵 Desert</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Theme:</span>
                                            <span class="inspiration-game">Wild West Adventure</span>
                                        </div>
                                        <div class="level-status future">🔭 Future</div>
                                    </div>
                                    
                                    <div class="level-card future">
                                        <div class="level-number">9</div>
                                        <h4>Underwater Atlantis</h4>
                                        <p>Lost city beneath the waves with sea creatures and ancient technology</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🌊 Ocean</span>
                                            <span class="feature-tag">🐠 Sea Life</span>
                                            <span class="feature-tag">🔱 Atlantis</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Theme:</span>
                                            <span class="inspiration-game">Mythical Adventure</span>
                                        </div>
                                        <div class="level-status future">🔭 Future</div>
                                    </div>
                                    
                                    <div class="level-card future">
                                        <div class="level-number">10</div>
                                        <h4>Cyberpunk Neo-Tokyo</h4>
                                        <p>Neon-lit metropolis with hovercars, holograms, and cyber-enhanced chaos</p>
                                        <div class="level-features">
                                            <span class="feature-tag">🌃 Cyberpunk</span>
                                            <span class="feature-tag">🚁 Hovercars</span>
                                            <span class="feature-tag">💫 Neon</span>
                                        </div>
                                        <div class="level-inspiration">
                                            <span class="inspiration-label">Theme:</span>
                                            <span class="inspiration-game">Futuristic Adventure</span>
                                        </div>
                                        <div class="level-status future">🔭 Future</div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="features-section">
                                <h3>✨ Features</h3>
                                <div class="features-list">
                                    <div class="feature">🎨 Custom low-poly 3D frog with hop animations</div>
                                    <div class="feature">🚗 Memory-efficient vehicle system with shared geometries</div>
                                    <div class="feature">🎵 Dynamic audio system with level-specific music</div>
                                    <div class="feature">📱 Mobile-friendly touch controls</div>
                                    <div class="feature">🎮 Classic arcade gameplay with modern 3D graphics</div>
                                    <div class="feature">🏆 Progressive difficulty across multiple unique worlds</div>
                                    <div class="feature">🌍 10 planned levels spanning different eras and themes</div>
                                    <div class="feature">🎭 Unique characters and vehicles for each level</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="info-modal-footer">
                            <button id="start-from-info" class="landing-btn primary">
                                <span>🎮 START PLAYING</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Insert at the beginning of body
        document.body.insertAdjacentHTML('afterbegin', landingHTML);
        
        // Add the CSS (same as before but without image indicator styles)
        this.addLandingStyles();
    }
    
    addLandingStyles() {
        const styles = `
            <style id="landing-styles">
                .landing-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100vw;
                    height: 100vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
                    z-index: 1000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: 'Arial', sans-serif;
                    overflow: hidden;
                }
                
                .landing-content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 60px;
                    max-width: 1200px;
                    width: 90%;
                    align-items: center;
                    z-index: 2;
                }
                
                .landing-image-container {
                    position: relative;
                    text-align: center;
                }
                
                #landing-image {
                    max-width: 100%;
                    max-height: 70vh;
                    border-radius: 20px;
                    box-shadow: 0 20px 60px rgba(0, 255, 150, 0.3);
                    transition: all 0.5s ease;
                    filter: brightness(1.1) contrast(1.1);
                }
                
                #landing-image:hover {
                    transform: scale(1.02);
                    box-shadow: 0 25px 80px rgba(0, 255, 150, 0.4);
                }
                
                .landing-info {
                    color: white;
                    text-align: center;
                }
                
                .landing-title {
                    font-size: 4rem;
                    font-weight: bold;
                    margin-bottom: 10px;
                    background: linear-gradient(45deg, #00ff96, #00d4ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    text-shadow: 0 0 30px rgba(0, 255, 150, 0.5);
                    animation: titlePulse 3s ease-in-out infinite;
                }
                
                @keyframes titlePulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.05); }
                }
                
                .landing-subtitle {
                    font-size: 1.5rem;
                    margin-bottom: 40px;
                    color: #b8b8b8;
                    animation: fadeInUp 1s ease 0.5s both;
                }
                
                .landing-controls {
                    display: flex;
                    justify-content: center;
                    gap: 30px;
                    margin-bottom: 40px;
                    animation: fadeInUp 1s ease 0.7s both;
                }
                
                .control-item {
                    text-align: center;
                }
                
                .control-key {
                    display: block;
                    background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
                    border: 2px solid #00ff96;
                    border-radius: 10px;
                    padding: 12px 16px;
                    font-weight: bold;
                    color: #00ff96;
                    margin-bottom: 8px;
                    box-shadow: 0 5px 15px rgba(0, 255, 150, 0.2);
                    transition: all 0.3s ease;
                }
                
                .control-key:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(0, 255, 150, 0.4);
                }
                
                .control-desc {
                    color: #cccccc;
                    font-size: 0.9rem;
                }
                
                .landing-actions {
                    animation: fadeInUp 1s ease 1s both;
                }
                
                .landing-btn {
                    position: relative;
                    background: linear-gradient(45deg, #00ff96, #00d4ff);
                    color: #000;
                    border: none;
                    padding: 20px 40px;
                    font-size: 1.4rem;
                    font-weight: bold;
                    border-radius: 50px;
                    cursor: pointer;
                    margin-bottom: 30px;
                    overflow: hidden;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .landing-btn:hover {
                    transform: translateY(-3px);
                    box-shadow: 0 10px 30px rgba(0, 255, 150, 0.4);
                }
                
                .btn-glow {
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
                    animation: btnGlow 2s infinite;
                }
                
                @keyframes btnGlow {
                    0% { left: -100%; }
                    100% { left: 100%; }
                }
                
                .landing-navigation {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-bottom: 30px;
                }
                
                .nav-btn {
                    width: 50px;
                    height: 50px;
                    border: 2px solid #00ff96;
                    background: rgba(0, 255, 150, 0.1);
                    color: #00ff96;
                    border-radius: 50%;
                    font-size: 1.2rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .nav-btn:hover {
                    background: #00ff96;
                    color: #000;
                    transform: scale(1.1);
                }
                
                .info-btn {
                    border-color: #ffd700;
                    background: rgba(255, 215, 0, 0.1);
                    color: #ffd700;
                }
                
                .info-btn:hover {
                    background: #ffd700;
                    color: #000;
                }
                
                .audio-btn {
                    position: relative;
                }
                
                .audio-btn.muted {
                    background: rgba(255, 0, 0, 0.2);
                    border-color: #ff6666;
                    color: #ff6666;
                }
                
                .audio-btn.muted:hover {
                    background: #ff6666;
                    color: #000;
                }
                
                .audio-icon {
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                }
                
                .audio-btn.muted .audio-icon::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 2px;
                    height: 60%;
                    background: currentColor;
                    transform: translate(-50%, -50%) rotate(45deg);
                    pointer-events: none;
                }
                
                .landing-footer {
                    color: #888;
                    font-size: 0.9rem;
                    animation: fadeInUp 1s ease 1.2s both;
                }
                
                .version-info {
                    margin-top: 10px;
                    color: #00ff96;
                    font-weight: bold;
                }
                
                .landing-bg-animation {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    opacity: 0.1;
                }
                
                .bg-element {
                    position: absolute;
                    width: 60px;
                    height: 30px;
                    background: linear-gradient(45deg, #00ff96, #00d4ff);
                    border-radius: 5px;
                    animation: bgMove 10s linear infinite;
                }
                
                .bg-car {
                    top: 20%;
                    left: -100px;
                }
                
                .bg-car.delayed {
                    top: 50%;
                    animation-delay: -3s;
                }
                
                .bg-car.delayed-2 {
                    top: 80%;
                    animation-delay: -6s;
                }
                
                @keyframes bgMove {
                    0% { left: -100px; }
                    100% { left: calc(100vw + 100px); }
                }
                
                /* Info Modal Styles */
                .info-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.9);
                    z-index: 1001;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 1;
                    transition: opacity 0.3s ease;
                }
                
                .info-modal.hidden {
                    opacity: 0;
                    pointer-events: none;
                }
                
                .info-modal-content {
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border: 2px solid #00ff96;
                    border-radius: 20px;
                    max-width: 90vw;
                    max-height: 90vh;
                    width: 900px;
                    overflow-y: auto;
                    color: white;
                    box-shadow: 0 20px 60px rgba(0, 255, 150, 0.3);
                }
                
                .info-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 30px;
                    border-bottom: 1px solid #00ff96;
                }
                
                .info-modal-header h2 {
                    margin: 0;
                    color: #00ff96;
                    font-size: 1.8rem;
                }
                
                .close-btn {
                    background: none;
                    border: 2px solid #ff6666;
                    color: #ff6666;
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                }
                
                .close-btn:hover {
                    background: #ff6666;
                    color: #000;
                }
                
                .info-modal-body {
                    padding: 30px;
                }
                
                .game-description {
                    margin-bottom: 30px;
                    font-size: 1.1rem;
                    line-height: 1.6;
                    color: #cccccc;
                }
                
                .controls-section, .levels-section, .features-section {
                    margin-bottom: 30px;
                }
                
                .controls-section h3, .levels-section h3, .features-section h3 {
                    color: #00ff96;
                    font-size: 1.5rem;
                    margin-bottom: 15px;
                    border-bottom: 1px solid #00ff96;
                    padding-bottom: 5px;
                }
                
                .controls-grid {
                    display: grid;
                    gap: 10px;
                }
                
                .control-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px 15px;
                    background: rgba(0, 255, 150, 0.1);
                    border-radius: 10px;
                    border: 1px solid rgba(0, 255, 150, 0.3);
                }
                
                .control-row.mobile {
                    border-color: rgba(255, 215, 0, 0.3);
                    background: rgba(255, 215, 0, 0.1);
                }
                
                .control-row .key {
                    font-weight: bold;
                    color: #00ff96;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 5px 10px;
                    border-radius: 5px;
                    min-width: 80px;
                    text-align: center;
                }
                
                .control-row.mobile .key {
                    color: #ffd700;
                }
                
                /* Enhanced Levels Grid */
                .levels-grid {
                    display: grid;
                    gap: 20px;
                    max-height: 500px;
                    overflow-y: auto;
                    padding-right: 10px;
                }
                
                /* Scrollbar styling */
                .levels-grid::-webkit-scrollbar {
                    width: 8px;
                }
                
                .levels-grid::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 4px;
                }
                
                .levels-grid::-webkit-scrollbar-thumb {
                    background: rgba(0, 255, 150, 0.5);
                    border-radius: 4px;
                }
                
                .levels-grid::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 255, 150, 0.7);
                }
                
                .level-card {
                    padding: 20px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 15px;
                    border: 2px solid rgba(255, 255, 255, 0.1);
                    transition: all 0.3s ease;
                }
                
                .level-card.ready {
                    border-color: #00ff96;
                    box-shadow: 0 0 20px rgba(0, 255, 150, 0.3);
                }
                
                .level-card.planned {
                    border-color: #ffd700;
                    box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
                }
                
                .level-card.future {
                    border-color: rgba(128, 128, 128, 0.3);
                    opacity: 0.8;
                }
                
                .level-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                }
                
                .level-card.future:hover {
                    border-color: rgba(255, 255, 255, 0.4);
                    opacity: 1;
                }
                
                .level-number {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(45deg, #00ff96, #00d4ff);
                    color: #000;
                    border-radius: 50%;
                    text-align: center;
                    line-height: 40px;
                    font-weight: bold;
                    font-size: 1.2rem;
                    margin-bottom: 10px;
                }
                
                .level-card.planned .level-number {
                    background: linear-gradient(45deg, #ffd700, #ffaa00);
                }
                
                .level-card.future .level-number {
                    background: linear-gradient(45deg, #888888, #aaaaaa);
                }
                
                .level-card h4 {
                    margin: 10px 0;
                    color: #fff;
                    font-size: 1.3rem;
                }
                
                .level-card p {
                    color: #ccc;
                    margin-bottom: 15px;
                    line-height: 1.4;
                }
                
                .level-features {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 5px;
                    margin-bottom: 15px;
                }
                
                .feature-tag {
                    background: rgba(0, 255, 150, 0.2);
                    color: #00ff96;
                    padding: 3px 8px;
                    border-radius: 12px;
                    font-size: 0.8rem;
                    border: 1px solid rgba(0, 255, 150, 0.3);
                }
                
                .level-card.planned .feature-tag {
                    background: rgba(255, 215, 0, 0.2);
                    color: #ffd700;
                    border-color: rgba(255, 215, 0, 0.3);
                }
                
                .level-card.future .feature-tag {
                    background: rgba(128, 128, 128, 0.2);
                    color: #aaaaaa;
                    border-color: rgba(128, 128, 128, 0.3);
                }
                
                .level-inspiration {
                    margin-bottom: 15px;
                    padding: 8px 12px;
                    background: rgba(255, 215, 0, 0.1);
                    border-radius: 8px;
                    border-left: 3px solid #ffd700;
                    font-size: 0.9rem;
                }
                
                .inspiration-label {
                    color: #ffd700;
                    font-weight: bold;
                    margin-right: 5px;
                }
                
                .inspiration-game {
                    color: #ffeb99;
                    font-style: italic;
                }
                
                .level-status {
                    font-weight: bold;
                    padding: 5px 10px;
                    border-radius: 20px;
                    font-size: 0.9rem;
                }
                
                .level-status.ready {
                    background: rgba(0, 255, 0, 0.2);
                    color: #00ff00;
                    border: 1px solid #00ff00;
                }
                
                .level-status.planned {
                    background: rgba(255, 215, 0, 0.2);
                    color: #ffd700;
                    border: 1px solid #ffd700;
                }
                
                .level-status.future {
                    background: rgba(128, 128, 128, 0.2);
                    color: #aaaaaa;
                    border: 1px solid #aaaaaa;
                }
                
                .features-list {
                    display: grid;
                    gap: 10px;
                }
                
                .feature {
                    padding: 10px 15px;
                    background: rgba(0, 255, 150, 0.1);
                    border-radius: 10px;
                    border-left: 4px solid #00ff96;
                }
                
                .info-modal-footer {
                    padding: 20px 30px;
                    border-top: 1px solid #00ff96;
                    text-align: center;
                }
                
                @keyframes fadeInUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                /* Mobile responsiveness */
                @media (max-width: 768px) {
                    .landing-content {
                        grid-template-columns: 1fr;
                        gap: 30px;
                        text-align: center;
                    }
                    
                    .landing-title {
                        font-size: 2.5rem;
                    }
                    
                    .landing-controls {
                        flex-direction: column;
                        gap: 15px;
                    }
                    
                    .control-item {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 15px;
                    }
                    
                    .control-key {
                        margin-bottom: 0;
                    }
                    
                    .info-modal-content {
                        width: 95vw;
                        max-height: 95vh;
                    }
                    
                    .info-modal-header {
                        padding: 15px 20px;
                    }
                    
                    .info-modal-body {
                        padding: 20px;
                    }
                    
                    .info-modal-header h2 {
                        font-size: 1.4rem;
                    }
                    
                    .level-features {
                        justify-content: center;
                    }
                    
                    .levels-grid {
                        max-height: 400px;
                    }
                }
                
                /* Hidden state */
                .landing-overlay.hidden {
                    transform: translateY(-100%);
                    transition: transform 0.8s ease-in-out;
                }
            </style>
        `;
        
        document.head.insertAdjacentHTML('beforeend', styles);
    }
    
    async initializeAudio() {
        try {
            // Dynamically import AudioManager to avoid loading issues
            const { AudioManager } = await import('../audio/AudioManager.js');
            this.audioManager = new AudioManager();
            
            // 🎵 UPDATED: Play PatriotFrog.mp3 on landing page
            setTimeout(() => {
                if (this.audioManager.isInitialized) {
                    console.log('🎵 Starting PatriotFrog music on landing page');
                    this.audioManager.playMusic('landing'); // ✅ Play landing music instead of background
                    this.updateAudioButton();
                }
            }, 1000);
            
        } catch (error) {
            console.warn('Failed to initialize audio on landing page:', error);
        }
    }
    
    updateAudioButton() {
        const audioBtn = document.getElementById('audio-toggle');
        const audioIcon = audioBtn?.querySelector('.audio-icon');
        
        if (audioBtn && audioIcon) {
            if (this.audioManager && this.audioManager.isMuted) {
                audioBtn.classList.add('muted');
                audioIcon.textContent = '🔇';
                audioBtn.title = 'Unmute Music';
            } else {
                audioBtn.classList.remove('muted');
                audioIcon.textContent = '🔊';
                audioBtn.title = 'Toggle Music';
            }
        }
    }
    
    // Start audio on first user interaction
    enableAudioOnInteraction() {
        if (this.audioManager && this.audioManager.isInitialized && !this.audioManager.userInteracted) {
            console.log('🎵 Enabling audio context...');
            
            // Enable audio context first
            this.audioManager.enableAudioContext().then(() => {
                // 🎵 UPDATED: Play PatriotFrog instead of background music
                setTimeout(() => {
                    if (!this.audioManager.isMuted && this.audioManager.userInteracted) {
                        console.log('🎵 Playing PatriotFrog after user interaction');
                        this.audioManager.playMusic('landing'); // ✅ Play landing music
                    }
                    this.updateAudioButton();
                }, 300);
            }).catch(error => {
                console.warn('Failed to enable audio:', error);
            });
        }
    }
    
    selectRandomImage() {
        // Pick a random image different from current one
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.imageCount) + 1;
        } while (newIndex === this.currentImageIndex && this.imageCount > 1);
        
        this.currentImageIndex = newIndex;
        this.updateImage();
    }
    
    updateImage() {
        const imageElement = document.getElementById('landing-image');
        
        if (imageElement) {
            const imageName = this.currentImageIndex === 1 ? 'landing.png' : `landing${this.currentImageIndex}.png`;
            imageElement.src = `./${imageName}`;
        }
    }
    
    showInfoModal() {
        this.infoModalVisible = true;
        const modal = document.getElementById('info-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
    
    hideInfoModal() {
        this.infoModalVisible = false;
        const modal = document.getElementById('info-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
    }
    
    setupEventListeners() {
        // Spacebar to start game
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && this.isVisible && !this.infoModalVisible) {
                event.preventDefault();
                this.enableAudioOnInteraction(); // Enable audio on first interaction
                this.startGame();
            }
            
            // Escape to close info modal
            if (event.code === 'Escape' && this.infoModalVisible) {
                this.hideInfoModal();
            }
        });
        
        // Button clicks
        document.getElementById('start-game-btn')?.addEventListener('click', () => {
            this.enableAudioOnInteraction(); // Enable audio on first interaction
            this.startGame();
        });
        
        // 🎲 Dice button - shuffle to random image
        document.getElementById('random-image')?.addEventListener('click', () => {
            this.enableAudioOnInteraction(); // Enable audio on any interaction
            this.selectRandomImage(); // Now shuffles instead of cycling
        });
        
        // Info button
        document.getElementById('info-button')?.addEventListener('click', () => {
            this.enableAudioOnInteraction(); // Enable audio on any interaction
            this.showInfoModal();
        });
        
        // Info modal controls
        document.getElementById('close-info-modal')?.addEventListener('click', () => {
            this.hideInfoModal();
        });
        
        document.getElementById('start-from-info')?.addEventListener('click', () => {
            this.hideInfoModal();
            this.startGame();
        });
        
        // Click outside modal to close
        document.getElementById('info-modal')?.addEventListener('click', (event) => {
            if (event.target.id === 'info-modal') {
                this.hideInfoModal();
            }
        });
        
        // Audio toggle
        document.getElementById('audio-toggle')?.addEventListener('click', () => {
            this.enableAudioOnInteraction(); // Enable audio context first
            
            if (this.audioManager) {
                this.audioManager.toggleMute();
                this.updateAudioButton();
                
                // 🎵 UPDATED: If unmuting, play PatriotFrog instead of background
                if (!this.audioManager.isMuted) {
                    setTimeout(() => {
                        console.log('🎵 Resuming PatriotFrog after unmute');
                        this.audioManager.playMusic('landing'); // ✅ Play landing music
                    }, 100);
                }
            }
        });
        
        // Prevent default space behavior on landing page
        document.addEventListener('keydown', (event) => {
            if (event.code === 'Space' && this.isVisible && !this.infoModalVisible) {
                event.preventDefault();
            }
        });
    }
    
    startGame() {
        this.isVisible = false;
        
        // 🎵 UPDATED: Smooth transition from PatriotFrog to FeelingFroggish
        console.log('🎵 Transitioning from PatriotFrog to FeelingFroggish...');
        if (this.audioManager) {
            // Use the new switchMusic method for smooth transition
            this.audioManager.switchMusic('background', 800, 300); // Fade out over 800ms, wait 300ms, then fade in
        }
        
        const landingElement = document.getElementById('landing-page');
        
        if (landingElement) {
            landingElement.classList.add('hidden');
            
            // Wait for animation to complete, then remove from DOM
            setTimeout(() => {
                landingElement.remove();
                document.getElementById('landing-styles')?.remove();
                
                // Pass audio manager to game
                this.emit('gameStart', { audioManager: this.audioManager });
            }, 800);
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
}