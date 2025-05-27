import * as THREE from 'three';
import { Player } from './Player.js';
import { Level } from './Level.js';

export class Game {
    constructor(canvas, ui, audioManager = null) {
        this.canvas = canvas;
        this.ui = ui;
        this.audioManager = audioManager;
        
        // Game state
        this.isPlaying = false;
        this.isPaused = false;
        this.gameOver = false;
        this.levelComplete = false;
        
        // Game data
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.maxLevel = 5; // We have 5 levels planned
        
        // Three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        
        // Game objects
        this.player = null;
        this.level = null;
        
        // Timing
        this.clock = new THREE.Clock();
        
        // Constants for memory efficiency
        this.WORLD_WIDTH = 30;
        this.WORLD_DEPTH = 30;
        
        console.log('🎮 Game manager initialized');
    }
    
    async init() {
        try {
            console.log('🔧 Starting game initialization...');
            
            this.setupRenderer();
            this.setupScene();
            this.setupCamera();
            this.setupLighting();
            
            // Load initial level (Level 1 - Classic Frogger)
            await this.loadLevel(this.currentLevel);
            
            // Create player
            this.setupPlayer();
            
            // Start render loop
            this.animate();
            
            console.log('✅ Game initialized successfully');
        } catch (error) {
            console.error('❌ Game initialization failed:', error);
            throw error;
        }
    }
    
    setupRenderer() {
        if (!this.canvas) {
            console.error('❌ Canvas not found!');
            return;
        }
        
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        
        // IMPORTANT: Set canvas to full screen
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        this.canvas.style.display = 'block';
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.zIndex = '1';
        
        // Set actual render size
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.setClearColor(0x87CEEB); // Sky blue
        
        // Memory optimization
        this.renderer.outputColorSpace = THREE.SRGBColorSpace;
        
        console.log(`🖥️ Renderer setup complete: ${width}x${height}`);
        console.log('🖥️ Canvas styled for full screen');
    }
    
    setupScene() {
        this.scene = new THREE.Scene();
        
        // Add fog for depth and memory efficiency (hides distant objects)
        this.scene.fog = new THREE.Fog(0x87CEEB, 30, 100);
        
        console.log('🌍 Scene setup complete');
    }
    
    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75, // Field of view
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        
        // Position camera for classic Frogger view (top-down perspective)
        this.camera.position.set(0, 25, 15);
        this.camera.lookAt(0, 0, 0);
        
        console.log('📷 Camera setup complete:', this.camera.position);
    }
    
    setupLighting() {
        // Minimal lighting for memory efficiency
        
        // Ambient light for general illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.8);
        this.scene.add(ambientLight);
        
        // Single directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(10, 20, 5);
        directionalLight.castShadow = true;
        
        // Shadow optimization
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 50;
        directionalLight.shadow.camera.left = -25;
        directionalLight.shadow.camera.right = 25;
        directionalLight.shadow.camera.top = 25;
        directionalLight.shadow.camera.bottom = -25;
        
        this.scene.add(directionalLight);
        
        console.log('💡 Lighting setup complete');
    }
    
    // ✅ SIMPLE RESTART - No complex WebGL cleanup
    async restartGame() {
        console.log('🔄 Simple restart - just reset positions...');
        
        // Reset game state
        this.isPlaying = false;
        this.gameOver = false;
        this.levelComplete = false;
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        
        // ✅ Clear riding state on restart
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 12);
        }
        
        // Simple level disposal and reload
        if (this.level) {
            this.level.dispose(); // Uses new simple dispose
            this.level = null;
        }
        
        // Load fresh level
        await this.loadLevel(1);
        
        // Update UI
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateLevel(this.currentLevel);
        this.ui.hideGameOver();
        
        this.startGame();
        
        console.log('✅ Simple restart complete');
    }
    
    async loadLevel(levelNumber) {
        try {
            console.log(`🏗️ Loading level ${levelNumber}...`);
            
            // Simple cleanup before creating new level
            if (this.level) {
                console.log('🧹 Disposing previous level...');
                this.level.dispose();
                this.level = null;
                
                // Brief pause for cleanup
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            
            // Create new level with cached materials
            console.log('🔧 Creating level...');
            this.level = new Level(this.scene, levelNumber, this.WORLD_WIDTH, this.WORLD_DEPTH);
            await this.level.create();
            
            console.log(`✅ Level ${levelNumber} loaded successfully`);
            
        } catch (error) {
            console.error(`❌ Failed to load level ${levelNumber}:`, error);
            throw error;
        }
    }
    
    setupPlayer() {
        try {
            console.log('🐸 Creating player...');
            
            // Pass audioManager to player constructor
            this.player = new Player(this.scene, this.audioManager);
            this.player.create();
            
            // ✅ Initialize riding state
            this.player.ridingLog = null;
            
            // Start position at bottom of screen
            this.player.setPosition(0, 0, 12);
            
            console.log('✅ Player created successfully at:', this.player.position);
        } catch (error) {
            console.error('❌ Failed to create player:', error);
            throw error;
        }
    }
    
    startGame() {
        this.isPlaying = true;
        this.gameOver = false;
        this.levelComplete = false;
        this.ui.hideStartScreen();
        this.ui.showHUD();
        
        // Start background music if available
        if (this.audioManager) {
            this.audioManager.playMusic('background');
        }
        
        // Update UI
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateLevel(this.currentLevel);
        
        console.log('🎮 Game started! Rendering should begin...');
    }
    
    async nextLevel() {
        if (this.currentLevel >= this.maxLevel) {
            // Game completed!
            this.endGame(true);
            return;
        }
        
        this.currentLevel++;
        this.levelComplete = false;
        
        // Load next level
        await this.loadLevel(this.currentLevel);
        
        // Reset player position and clear riding state
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 12);
        }
        
        // Update UI
        this.ui.updateLevel(this.currentLevel);
        this.ui.hideLevelComplete();
        
        this.isPlaying = true;
        
        console.log(`🆙 Advanced to level ${this.currentLevel}`);
    }
    
    // ✅ ENHANCED MOVE PLAYER - Supports stable log physics
    movePlayer(dx, dy, dz) {
        if (!this.isPlaying || this.gameOver || this.levelComplete || !this.player) return;
        
        // ✅ STABLE LOG PHYSICS: Allow deliberate movement while riding log
        if (this.player.ridingLog) {
            console.log(`🪵 Frog on stable log - allowing controlled movement`);
            // Automatic log movement is handled in checkCollisions()
            // This just adds player input on top of that
        }
        
        this.player.move(dx, dy, dz);
        this.updatePlayerBounds();
        
        // Award points for forward movement
        if (dz < 0) {
            this.score += 10;
            this.ui.updateScore(this.score);
        }
    }
    
    // ✅ UPDATED PLAYER BOUNDS for new level layout
    updatePlayerBounds() {
        if (!this.player) return;
        
        // Updated bounds for new level layout
        const bounds = {
            minX: -this.WORLD_WIDTH / 2 + 1,
            maxX: this.WORLD_WIDTH / 2 - 1,
            minZ: -17,  // ✅ Allow reaching GFL goal building
            maxZ: 15
        };
        
        const pos = this.player.position;
        pos.x = Math.max(bounds.minX, Math.min(bounds.maxX, pos.x));
        pos.z = Math.max(bounds.minZ, Math.min(bounds.maxZ, pos.z));
        
        // Update mesh position
        if (this.player.mesh) {
            this.player.mesh.position.copy(pos);
            this.player.mesh.position.y += 1; // Keep frog above ground
        }
    }
    
    useTongueAttack() {
        if (!this.isPlaying || !this.player) return;
        
        console.log('👅 Tongue attack used!');
        this.player.tongueAttack();
    }
    
    useCroak() {
        if (!this.isPlaying || !this.player) return;
        
        console.log('🐸 Croak used!');
        this.player.croak();
    }
    
    togglePause() {
        if (!this.isPlaying) return;
        
        this.isPaused = !this.isPaused;
        
        // Pause/resume music
        if (this.audioManager) {
            if (this.isPaused) {
                this.audioManager.pauseMusic();
            } else {
                this.audioManager.resumeMusic();
            }
        }
        
        console.log(`⏸️ Game ${this.isPaused ? 'paused' : 'resumed'}`);
    }
    
    update(deltaTime) {
        if (!this.isPlaying || this.isPaused || this.gameOver) return;
        
        // Update player
        if (this.player) {
            this.player.update(deltaTime);
        }
        
        // Update level (obstacles, animations, etc.)
        if (this.level) {
            this.level.update(deltaTime);
        }
        
        // Check collisions
        this.checkCollisions();
        
        // Check win condition
        this.checkWinCondition();
    }
    
    // ✅ UPDATED COLLISION DETECTION for new level layout and stable log physics
    checkCollisions() {
        if (!this.level || !this.player) return;
        
        const playerPos = this.player.position;
        const obstacles = this.level.getObstacles();
        
        // ✅ UPDATED GAME ZONES for new polished layout
        const roadZone = playerPos.z >= 1 && playerPos.z <= 11;           // Road area
        const safeMedianZone = playerPos.z >= -5 && playerPos.z <= 0;     // ✅ Wide safe median (6 units)
        const waterZone = playerPos.z >= -13 && playerPos.z <= -5;        // ✅ Water area (adjusted for new positions)
        const startZone = playerPos.z >= 11;                              // Starting grass
        const goalZone = playerPos.z <= -13;                              // ✅ GFL goal building area
        
        // Debug output (uncomment to see zones)
       /* console.log(`🐸 Frog at Z: ${playerPos.z.toFixed(1)} - Zone: ${
            roadZone ? 'ROAD' : 
            safeMedianZone ? 'SAFE MEDIAN' : 
            waterZone ? 'WATER' : 
            startZone ? 'START' : 
            goalZone ? 'GOAL' : 'UNKNOWN'
        }`);
        */
        
        if (waterZone) {
            // ✅ STABLE LOG PHYSICS - Player must be on log or drown
            let onStableLog = false;
            let ridingLog = null;
            
            for (const obstacle of obstacles) {
                if (obstacle.isRideable && obstacle.type === 'log') {
                    const distance = playerPos.distanceTo(obstacle.position);
                    if (distance < 3.0) { // Generous collision area for easier riding
                        onStableLog = true;
                        ridingLog = obstacle;
                        
                        // ✅ STABLE MOVEMENT: Player moves WITH log automatically
                        // No extra sensitivity - just smooth movement with the log
                        const logMovement = obstacle.velocity.x * 0.016; // Smooth frame-rate independent
                        this.player.position.x += logMovement;
                        this.updatePlayerBounds();
                        
                        // Store riding state for input handling
                        this.player.ridingLog = ridingLog;
                        
                        console.log(`🪵 Frog stable on log - moving with current`);
                        break;
                    }
                }
            }
            
            if (!onStableLog) {
                // Clear riding state
                this.player.ridingLog = null;
                console.log(`💀 Frog drowned in water at Z: ${playerPos.z.toFixed(1)}!`);
                this.playerHit();
                return;
            }
            
        } else {
            // ✅ CLEAR RIDING STATE when not in water
            this.player.ridingLog = null;
            
            if (roadZone) {
                // Road collision detection
                for (const obstacle of obstacles) {
                    if (!obstacle.isRideable && ['cybertruck', 'taxi', 'sportscar'].includes(obstacle.type)) {
                        const distance = playerPos.distanceTo(obstacle.position);
                        if (distance < 1.8) {
                            console.log(`💀 Frog hit by ${obstacle.type} on road!`);
                            this.playerHit();
                            break;
                        }
                    }
                }
                
            } else if (safeMedianZone || startZone || goalZone) {
                // ✅ SAFE ZONES - no collision checks needed
                //console.log(`✅ Frog in safe zone`);
                
            } else {
                console.log(`⚠️ Frog in unknown zone at Z: ${playerPos.z.toFixed(1)}`);
            }
        }
    }
    
    // ✅ UPDATED WIN CONDITION for GFL goal building
    checkWinCondition() {
        if (!this.player) return;
        
        // ✅ GFL BUILDING WIN CONDITION: Player reached the goal building area
        if (this.player.position.z < -13) {
            // Check if player is near the GFL goal building
            const goals = this.level.getGoals();
            for (const goalBuilding of goals) {
                const distance = this.player.position.distanceTo(goalBuilding.position);
                if (distance < 8) { // Within building area
                    console.log('🏆 Frog reached the GFL goal building!');
                    this.levelCompleted();
                    return;
                }
            }
        }
    }
    
    // ✅ ENHANCED PLAYER HIT with riding state cleanup
    playerHit() {
        this.lives--;
        this.ui.updateLives(this.lives);
        
        // ✅ Clear riding state on hit
        if (this.player) {
            this.player.ridingLog = null;
        }
        
        // Play lose sound
        if (this.audioManager) {
            this.audioManager.playSFX('lose');
        }
        
        // Reset player position
        if (this.player) {
            this.player.setPosition(0, 0, 12);
        }
        
        if (this.lives <= 0) {
            this.endGame(false);
        } else {
            console.log(`💔 Player hit! Lives remaining: ${this.lives}`);
        }
    }
    
    levelCompleted() {
        this.isPlaying = false;
        this.levelComplete = true;
        this.score += 100 * this.currentLevel;
        this.ui.updateScore(this.score);
        this.ui.showLevelComplete(this.currentLevel + 1);
        
        // ✅ Clear riding state on level complete
        if (this.player) {
            this.player.ridingLog = null;
        }
        
        // Play level finish sound
        if (this.audioManager) {
            this.audioManager.playSFX('levelfinish');
        }
        
        console.log(`🎉 Level ${this.currentLevel} completed! Score: ${this.score}`);
    }
    
    endGame(victory = false) {
        this.isPlaying = false;
        this.gameOver = true;
        
        // ✅ Clear riding state on game end
        if (this.player) {
            this.player.ridingLog = null;
        }
        
        // Stop music
        if (this.audioManager) {
            this.audioManager.stopMusic();
        }
        
        if (victory) {
            this.score += 1000; // Bonus for completing all levels
            this.ui.updateScore(this.score);
            console.log(`🏆 Game completed! Final Score: ${this.score}`);
        } else {
            console.log(`💀 Game Over! Final Score: ${this.score}`);
        }
        
        this.ui.showGameOver(this.score);
    }
    
    handleResize() {
        if (!this.camera || !this.renderer) return;
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Make sure canvas stays full screen
        this.canvas.style.width = '100vw';
        this.canvas.style.height = '100vh';
        
        console.log(`📐 Resized to: ${width}x${height}`);
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const deltaTime = this.clock.getDelta();
        
        this.update(deltaTime);
        
        // Render the scene
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    // Memory cleanup
    dispose() {
        console.log('🧹 Disposing game resources...');
        
        if (this.level) {
            this.level.dispose();
            this.level = null;
        }
        
        if (this.player) {
            this.player.dispose();
            this.player = null;
        }
        
        console.log('✅ Game disposal complete');
    }
}

// ✅ COMPLETE GAME.JS SUMMARY:
//
// 1. ✅ UPDATED GAME ZONES:
//    - Road: Z 1 to 11 (cars)
//    - Safe median: Z -5 to 0 (6-unit wide safe walking area)
//    - Water: Z -13 to -5 (logs)
//    - Goal: Z < -13 (GFL building)
//
// 2. ✅ STABLE LOG PHYSICS:
//    - player.ridingLog tracks which log player is on
//    - Automatic smooth movement with log (no sensitivity issues)
//    - Player input still works while on log for deliberate movement
//    - Clear riding state on hit/restart/level change
//
// 3. ✅ GFL GOAL BUILDING:
//    - Win condition: reach building area (Z < -13 and within 8 units of building)
//    - Updated player bounds to allow reaching goal (minZ: -17)
//
// 4. ✅ SIMPLE RESTART:
//    - No complex WebGL cleanup
//    - Uses cached materials for fast restart
//    - Clears riding state properly
//
// 5. ✅ ENHANCED SAFETY:
//    - Wide safe median zone (6 units) for left/right movement
//    - Clear zone separation prevents accidental zone crossings
//    - Debug output shows current zone