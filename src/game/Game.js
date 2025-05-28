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
        
        // ✅ NEW: Classic Frogger multi-frog system
        this.frogsRescued = 0; // Current frogs rescued in this level
        this.totalFrogsNeeded = 4; // Need 4 frogs to complete each level
        this.savedFrogImages = []; // Visual frog indicators
        
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
        
        console.log('🎮 Game manager initialized with classic Frogger multi-frog system');
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
    
    // ✅ UPDATED RESTART - Reset frog progress
    async restartGame() {
        console.log('🔄 Simple restart - resetting all frog progress...');
        
        // Reset game state
        this.isPlaying = false;
        this.gameOver = false;
        this.levelComplete = false;
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        
        // ✅ Reset frog rescue progress
        this.frogsRescued = 0;
        this.clearSavedFrogImages();
        
        // ✅ Clear riding state on restart
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 17);
        }
        
        // Simple level disposal and reload
        if (this.level) {
            this.level.dispose();
            this.level = null;
        }
        
        // Load fresh level
        await this.loadLevel(1);
        
        // Update UI
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateLevel(this.currentLevel);
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        this.ui.hideGameOver();
        
        this.startGame();
        
        console.log('✅ Simple restart complete with frog progress reset');
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
            
            // ✅ Add saved frog images to the new level
            await this.addSavedFrogImages();
            
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
            this.player.setPosition(0, 0, 17);
            
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
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        
        console.log('🎮 Game started! Rendering should begin...');
    }
    
    // ✅ UPDATED: Handle level progression with frog system
    async nextLevel() {
        if (this.currentLevel >= this.maxLevel) {
            // Game completed!
            this.endGame(true);
            return;
        }
        
        this.currentLevel++;
        this.levelComplete = false;
        
        // ✅ Reset frog progress for new level
        this.frogsRescued = 0;
        this.clearSavedFrogImages();
        
        // Load next level
        await this.loadLevel(this.currentLevel);
        
        // Reset player position and clear riding state
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 17);
        }
        
        // Update UI
        this.ui.updateLevel(this.currentLevel);
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        this.ui.hideLevelComplete();
        
        this.isPlaying = true;
        
        console.log(`🆙 Advanced to level ${this.currentLevel} with fresh frog progress`);
    }
    
    // ✅ ENHANCED MOVE PLAYER - Supports stable log physics
    movePlayer(dx, dy, dz) {
        if (!this.isPlaying || this.gameOver || this.levelComplete || !this.player) return;
        
    // ✅ NEW: If on log, update the offset instead of absolute position
    if (this.player.ridingLog) {
        this.player.logOffset += dx; // Update position relative to log
        console.log(`🪵 Frog moved on log - new offset: ${this.player.logOffset.toFixed(2)}`);
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
        const roadZone = playerPos.z >= 1 && playerPos.z <= 14;           // Road area
        const safeMedianZone = playerPos.z >= -5 && playerPos.z <= 3;     // ✅ Wide safe median (6 units)
        const waterZone = playerPos.z >= -12 && playerPos.z <= -2;        // ✅ Water area (adjusted for new positions)
        const startZone = playerPos.z >= 14;                              // Starting grass
        const goalZone = playerPos.z <= -13;                              // ✅ GFL goal building area
        
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
                        
                        // ✅ NEW: Anchor frog to log but allow movement
                        if (!this.player.ridingLog || this.player.ridingLog !== ridingLog) {
                            // First time on this log - store relative position
                            this.player.logOffset = this.player.position.x - obstacle.position.x;
                            console.log(`🪵 Frog hopped onto log at offset: ${this.player.logOffset.toFixed(2)}`);
                        }
                        
                        // Keep frog at same relative position on the log (this happens every frame)
                        this.player.position.x = obstacle.position.x + this.player.logOffset;
                        this.updatePlayerBounds();
                        
                        // Store riding state for input handling
                        this.player.ridingLog = ridingLog;
                        
                        console.log(`🪵 Frog riding log at relative position`);
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
    
    // ✅ UPDATED WIN CONDITION with multi-frog system
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
                    this.frogRescued();
                    return;
                }
            }
        }
    }
    
    // ✅ NEW: Handle individual frog rescue
    async frogRescued() {
        this.isPlaying = false; // Pause game
        this.frogsRescued++;
        
        // Award rescue bonus
        this.score += 50;
        this.ui.updateScore(this.score);
        
        // Play rescue sound
        if (this.audioManager) {
            this.audioManager.playSFX('levelfinish');
        }
        
        // Add visual frog to goal area
        await this.addFrogImage();
        
        // Update UI progress
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        
        if (this.frogsRescued >= this.totalFrogsNeeded) {
            // All frogs rescued - complete level!
            this.levelCompleted();
        } else {
            // More frogs needed - show rescue message and reset
            this.ui.showFrogRescued(this.frogsRescued, this.totalFrogsNeeded);
            
            // Auto-reset after a short delay
            setTimeout(() => {
                this.resetForNextFrog();
            }, 2000);
        }
        
        console.log(`🐸 Frog ${this.frogsRescued}/${this.totalFrogsNeeded} rescued!`);
    }
    
    // ✅ NEW: Reset player for next frog rescue
    resetForNextFrog() {
        // ✅ Clear riding state
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 17);
        }
        
        this.ui.hideFrogRescued();
        this.isPlaying = true;
        
        console.log('🔄 Reset for next frog rescue');
    }
    
    // ✅ NEW: Add visual frog image to goal area
    async addFrogImage() {
        try {
            const texture = await this.loadTexture('/gflmemer.png');
            
            const frogMaterial = new THREE.MeshLambertMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1
            });
            
            const frogGeometry = new THREE.PlaneGeometry(2, 2);
            const frogImage = new THREE.Mesh(frogGeometry, frogMaterial);
            
            // Position frogs in front of GFL building
            const xPositions = [-6, -2, 2, 6]; // Spread across building front
            const xPos = xPositions[this.frogsRescued - 1] || 0;
            
            frogImage.position.set(xPos, 1, -15);
            frogImage.castShadow = false;
            frogImage.receiveShadow = false;
            
            this.savedFrogImages.push(frogImage);
            this.scene.add(frogImage);
            
            console.log(`✅ Added frog image ${this.frogsRescued} at position ${xPos}`);
            
        } catch (error) {
            console.warn('⚠️ Could not load gflmemer.png, using placeholder');
            this.addPlaceholderFrog();
        }
    }

// ✅ VIBRANT PNG FIX: Force color saturation and proper orientation
async addFrogImage() {
    try {
        const texture = await this.loadTexture('/gflmemer.png');
        
        // ✅ TEXTURE SETTINGS: Force vibrant colors with correct orientation
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        // ✅ REMOVED: flipY = false (was causing upside down image)
        
        // ✅ VIBRANT MATERIAL: Boost saturation
        const frogMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            toneMapped: false,  // Prevents tone mapping that can wash out colors
            opacity: 1.0
        });
        
        const frogWidth = 3;
        const frogHeight = 3;
        const frogGeometry = new THREE.PlaneGeometry(frogWidth, frogHeight);
        const frogImage = new THREE.Mesh(frogGeometry, frogMaterial);
        
        const xPositions = [-6, -2, 2, 6];
        const xPos = xPositions[this.frogsRescued - 1] || 0;
        
        frogImage.position.set(xPos, 1.5, -13);
        frogImage.castShadow = false;
        frogImage.receiveShadow = false;
        
        this.savedFrogImages.push(frogImage);
        this.scene.add(frogImage);
        
        console.log(`✅ Added RIGHT-SIDE-UP vibrant frog image ${this.frogsRescued}`);
        
    } catch (error) {
        console.warn('⚠️ Could not load gflmemer.png, using placeholder');
        this.addPlaceholderFrog();
    }
}

// ✅ SAME VIBRANT SETTINGS: Update saved frog images
async addSavedFrogImages() {
    console.log(`🐸 Adding ${this.frogsRescued} saved frog images...`);
    
    this.clearSavedFrogImages();
    
    for (let i = 0; i < this.frogsRescued; i++) {
        try {
            const texture = await this.loadTexture('/gflmemer.png');
            
            // ✅ SAME VIBRANT TEXTURE SETTINGS with correct orientation
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            // ✅ REMOVED: flipY = false (was causing upside down image)
            
            const frogMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,
                opacity: 1.0
            });
            
            const frogWidth = 3;
            const frogHeight = 3;
            const frogGeometry = new THREE.PlaneGeometry(frogWidth, frogHeight);
            const frogImage = new THREE.Mesh(frogGeometry, frogMaterial);
            
            const xPositions = [-6, -2, 2, 6];
            const xPos = xPositions[i] || 0;
            
            frogImage.position.set(xPos, 1.5, -13);
            frogImage.castShadow = false;
            frogImage.receiveShadow = false;
            
            this.savedFrogImages.push(frogImage);
            this.scene.add(frogImage);
            
        } catch (error) {
            console.warn(`⚠️ Could not load frog image ${i + 1}`);
        }
    }
    
    console.log(`✅ Added ${this.savedFrogImages.length} RIGHT-SIDE-UP frog images`);
}
    
    // ✅ UPDATED: Placeholder frog if image fails to load - Fixed positioning
    addPlaceholderFrog() {
        const placeholderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400,
            emissiveIntensity: 0.3
        });
        
        const placeholderGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        
        const xPositions = [-6, -2, 2, 6];
        const xPos = xPositions[this.frogsRescued - 1] || 0;
        
        // ✅ FIXED: Same positioning as addFrogImage()
        placeholder.position.set(xPos, 1.5, -13); // Changed z from -15 to -13, y from 1 to 1.5
        
        this.savedFrogImages.push(placeholder);
        this.scene.add(placeholder);
        
        console.log(`✅ Added placeholder frog ${this.frogsRescued} at position (${xPos}, 1.5, -13)`);
    }
    
    // ✅ NEW: Clear saved frog images
    clearSavedFrogImages() {
        this.savedFrogImages.forEach(frogImage => {
            this.scene.remove(frogImage);
            if (frogImage.geometry) frogImage.geometry.dispose();
            if (frogImage.material && frogImage.material.map) {
                frogImage.material.map.dispose();
            }
        });
        this.savedFrogImages = [];
    }
    
    // ✅ NEW: Load texture helper
    loadTexture(url) {
        return new Promise((resolve, reject) => {
            const loader = new THREE.TextureLoader();
            loader.load(
                url,
                (texture) => resolve(texture),
                (progress) => console.log('📥 Loading texture...'),
                (error) => reject(error)
            );
        });
    }
    
    // ✅ NEW: Placeholder frog if image fails to load
    addPlaceholderFrog() {
        const placeholderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400,
            emissiveIntensity: 0.3
        });
        
        const placeholderGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        
        const xPositions = [-6, -2, 2, 6];
        const xPos = xPositions[this.frogsRescued - 1] || 0;
        
        placeholder.position.set(xPos, 1, -15);
        
        this.savedFrogImages.push(placeholder);
        this.scene.add(placeholder);
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
            this.player.setPosition(0, 0, 17);
        }
        
        if (this.lives <= 0) {
            this.endGame(false);
        } else {
            console.log(`💔 Player hit! Lives remaining: ${this.lives}`);
        }
    }
    
    // ✅ UPDATED: Only called when all frogs are rescued
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
        
        console.log(`🎉 Level ${this.currentLevel} completed with all ${this.totalFrogsNeeded} frogs! Score: ${this.score}`);
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
        
        // Clean up saved frog images
        this.clearSavedFrogImages();
        
        console.log('✅ Game disposal complete');
    }
}