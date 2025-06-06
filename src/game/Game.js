import * as THREE from 'three';
import { Player } from './Player.js';
import { Level } from './Level.js';
import { LevelConfigManager } from './LevelConfig.js';
// Add this line to the imports at the top of Game.js
import { LevelFactory } from './LevelFactory.js';
import { VictoryScreen } from './VictoryScreen.js';


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
        
                // ✅ ADD: Missing level loading state properties
                this.isLoadingLevel = false;
                this.levelLoadPromise = null;
                this.lastLoadedLevel = null;

                
        // Game data
        this.score = 0;
        this.lives = 3;
        this.currentLevel = 1;
        this.maxLevel = 5; // We have 5 levels planned
        
        this.levelShortcutBuffer = ''; // ✅ NEW: For "level2" typing shortcut

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
        
        this.isTabVisible = true;
        this.lastVisibleTime = Date.now();
        this.maxDeltaTime = 1/30; // Cap deltaTime to 30fps equivalent
        
        // ✅ NEW: Setup visibility change listeners
        this.setupVisibilityHandlers();
        
            // Add victory screen
    this.victoryScreen = new VictoryScreen(
        document.body,
        this.audioManager,
        () => this.returnToMainMenu()
    );
        console.log('🎮 Game manager initialized with tab backgrounding protection');

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
            
            this.setupLevelShortcuts();
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
    

      // ✅ NEW: Add this method to Game.js
      setupVisibilityHandlers() {
        // Handle page visibility changes
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                console.log('👁️ Tab went background - pausing updates');
                this.isTabVisible = false;
                this.lastVisibleTime = Date.now();
                
                // Pause audio when tab goes background
                if (this.audioManager) {
                    this.audioManager.pauseMusic();
                }
            } else {
                console.log('👁️ Tab returned to foreground - resuming updates');
                this.isTabVisible = true;
                
                // Calculate how long we were away
                const timeAway = Date.now() - this.lastVisibleTime;
                console.log(`⏰ Tab was away for ${timeAway}ms`);
                
                // If away for more than 5 seconds, reset the level
                if (timeAway > 5000) {
                    console.log('🔄 Long absence detected - resetting vehicle patterns');
                    this.resetVehiclePatterns();
                }
                
                // Reset the clock to prevent huge deltaTime
                this.clock.getDelta(); // This call resets the clock
                
                // Resume audio when tab comes back
                if (this.audioManager && !this.audioManager.isMuted) {
                    this.audioManager.resumeMusic();
                }
            }
        });
        
        // Also handle window focus/blur as backup
        window.addEventListener('blur', () => {
            this.isTabVisible = false;
            this.lastVisibleTime = Date.now();
        });
        
        window.addEventListener('focus', () => {
            if (!this.isTabVisible) {
                this.isTabVisible = true;
                const timeAway = Date.now() - this.lastVisibleTime;
                if (timeAway > 3000) {
                    console.log('🔄 Focus returned after long absence - resetting patterns');
                    this.resetVehiclePatterns();
                }
                this.clock.getDelta(); // Reset clock
            }
        });
    }
    
    // ✅ NEW: Add this method to Game.js
    resetVehiclePatterns() {
        if (!this.level) return;
        
        console.log('🚗 Resetting vehicle patterns to fix tab backgrounding issues...');
        
        // Get current obstacles
        const obstacles = this.level.getObstacles();
        
        // Reset all vehicle positions to proper spacing
        obstacles.forEach((obstacle, index) => {
            const laneObstacles = obstacles.filter(o => 
                Math.abs(o.position.z - obstacle.position.z) < 1
            );
            
            // Find which lane this obstacle is in
            const laneIndex = laneObstacles.indexOf(obstacle);
            const totalInLane = laneObstacles.length;
            
            // Recalculate proper spacing
            const direction = obstacle.velocity.x > 0 ? 1 : -1;
            const spacing = 17; // Standard spacing
            const screenBound = 40; // Extended screen bound
            
            // Reset to proper position in the lane
            const newX = direction > 0 ? 
                -screenBound + (laneIndex * spacing) :
                screenBound - (laneIndex * spacing);
            
            obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
            
            console.log(`🔄 Reset ${obstacle.type} to position ${newX}`);
        });
        
        console.log('✅ Vehicle patterns reset complete');
    }
    
// 1. FIXED: Mars rocks repositioned away from road and river
createMarsRocks() {
    console.log('🪨 Creating Mars rocks away from gameplay areas...');
    
    // ✅ REPOSITIONED: Rocks ONLY in background/side areas, NOT on road/river
    const rockPositions = [
        // ✅ FAR BACKGROUND (behind goal area)
        { x: -30, z: -40 }, { x: -25, z: -45 }, { x: -35, z: -35 },
        { x: 30, z: -40 }, { x: 25, z: -45 }, { x: 35, z: -35 },
        
        // ✅ FAR LEFT SIDE (away from playable area)
        { x: -60, z: 20 }, { x: -65, z: 15 }, { x: -58, z: 25 },
        { x: -70, z: 10 }, { x: -75, z: 5 }, { x: -68, z: 30 },
        { x: -55, z: 0 }, { x: -60, z: -15 }, { x: -65, z: -25 },
        
        // ✅ FAR RIGHT SIDE (away from playable area)
        { x: 60, z: 20 }, { x: 65, z: 15 }, { x: 58, z: 25 },
        { x: 70, z: 10 }, { x: 75, z: 5 }, { x: 68, z: 30 },
        { x: 55, z: 0 }, { x: 60, z: -15 }, { x: 65, z: -25 },
        
        // ✅ EXTREME CORNERS (very far from gameplay)
        { x: -80, z: 40 }, { x: 80, z: 40 }, { x: -80, z: -50 }, { x: 80, z: -50 },
        
        // ✅ STARTING AREA SIDES (behind starting grass)
        { x: -45, z: 35 }, { x: 45, z: 35 }, { x: -50, z: 40 }, { x: 50, z: 40 }
    ];
    
    rockPositions.forEach((pos, index) => {
        const rockSize = 1.5 + (index % 5) * 0.8;
        
        let rockGeometry;
        if (index % 3 === 0) {
            rockGeometry = new THREE.SphereGeometry(rockSize, 8, 6);
        } else if (index % 3 === 1) {
            rockGeometry = new THREE.BoxGeometry(rockSize * 1.2, rockSize * 0.8, rockSize * 1.1);
        } else {
            rockGeometry = new THREE.DodecahedronGeometry(rockSize * 0.9);
        }
        
        const rock = new THREE.Mesh(rockGeometry, this.sharedMaterials.marsRock);
        rock.position.set(pos.x, rockSize * 0.6, pos.z);
        
        rock.rotation.x = Math.random() * Math.PI;
        rock.rotation.y = Math.random() * Math.PI;
        rock.rotation.z = Math.random() * Math.PI;
        
        const scaleVariation = 0.8 + Math.random() * 0.4;
        rock.scale.set(scaleVariation, scaleVariation * 0.8, scaleVariation);
        
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        this.decorations.push(rock);
        this.scene.add(rock);
    });
    
    console.log(`✅ Created ${rockPositions.length} Mars rocks positioned safely away from gameplay areas`);
}

// 2. FIXED: Opaque domes without support poles
createSpaceDomes() {
    console.log('🛸 Creating bigger opaque space domes...');
    
    const domePositions = [
        { x: -50, z: 35, size: 12 },
        { x: 50, z: 35, size: 10 },
        { x: -45, z: -30, size: 14 },
        { x: 45, z: -30, size: 11 },
        { x: 0, z: 40, size: 8 },
        { x: 0, z: -35, size: 9 }
    ];
    
    domePositions.forEach((pos) => {
        const domeGeometry = new THREE.SphereGeometry(pos.size, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        
        // ✅ FIXED: Opaque dome material
        const opaqueDomeMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xcccccc,
            transparent: false,  // ✅ REMOVED: transparency
            opacity: 1.0         // ✅ SOLID: fully opaque
        });
        
        const dome = new THREE.Mesh(domeGeometry, opaqueDomeMaterial);
        dome.position.set(pos.x, pos.size * 0.6, pos.z);
        dome.castShadow = true;
        dome.receiveShadow = true;
        
        this.decorations.push(dome);
        this.scene.add(dome);
        
        // ✅ REMOVED: No more support structures/poles
    });
    
    console.log('✅ Created opaque space domes without support poles');
}

// FIXED setupLevelShortcuts method for Game.js
// Replace your existing setupLevelShortcuts() method with this:

setupLevelShortcuts() {
    console.log('🔧 Setting up enhanced level shortcuts...');
    
    document.addEventListener('keydown', (event) => {
        // Only work during active gameplay
        if (!this.isPlaying || this.gameOver || this.levelComplete) return;
        
        // Add typed character to buffer (convert to lowercase)
        if (event.key.length === 1) {
            this.levelShortcutBuffer += event.key.toLowerCase();
            
            // Keep only last 10 characters
            if (this.levelShortcutBuffer.length > 10) {
                this.levelShortcutBuffer = this.levelShortcutBuffer.slice(-10);
            }
            
            console.log(`📝 Shortcut buffer: "${this.levelShortcutBuffer}" (Level ${this.currentLevel})`);
            
// UPDATE the shortcut checking section in your setupLevelShortcuts() method:

// Check for shortcuts based on current level
if (this.currentLevel === 1 && this.levelShortcutBuffer.includes('level2')) {
    console.log('🌿 Level 2 shortcut activated!');
    this.levelShortcutBuffer = '';
    this.debugJumpToLevel2();
    
} else if (this.currentLevel === 2 && this.levelShortcutBuffer.includes('level3')) {
    console.log('🚀 Level 3 shortcut activated!');
    this.levelShortcutBuffer = '';
    this.debugJumpToLevel3();
    
} else if (this.currentLevel === 3 && this.levelShortcutBuffer.includes('level4')) {
    console.log('🏛️ Level 4 shortcut activated!');
    this.levelShortcutBuffer = '';
    this.debugJumpToLevel4();
    
} else if (this.currentLevel === 4 && this.levelShortcutBuffer.includes('level5')) {
    console.log('🎉 Level 5 shortcut activated - showing victory screen!');
    this.levelShortcutBuffer = '';
    this.debugJumpToLevel5(); // This now shows victory screen
}

// ✅ UPDATED: Victory shortcut instead of emergency Level 5
if (this.levelShortcutBuffer.includes('victory')) {
    console.log('🏆 Victory shortcut activated!');
    this.levelShortcutBuffer = '';
    this.victoryScreen.show();
}
        }
        
        // Clear buffer on Escape key
        if (event.key === 'Escape') {
            this.levelShortcutBuffer = '';
            console.log('🧹 Shortcut buffer cleared');
        }
    });
    
    console.log('✅ Enhanced level shortcuts ready (Levels 1-5)');
}

// ✅ ALSO ADD: Enhanced debugJumpToLevel2 method with better error handling
async debugJumpToLevel2() {
    console.log('🚀 FIXED: Jumping to Level 2: Jungle Swamp via shortcut...');
    
    // ✅ PREVENT: Multiple calls
    if (this.isLoadingLevel) {
        console.warn('⚠️ Level already loading, ignoring Level 2 shortcut');
        return;
    }
    
    this.isLoadingLevel = true;
    this.isPlaying = false; // Stop gameplay immediately
    
    try {
        this.currentLevel = 2;
        this.frogsRescued = 0;
        this.totalFrogsNeeded = 5; // Level 2 has 5 frogs
        this.clearSavedFrogImages();
        
        // Stop current music completely before switching
        if (this.audioManager) {
            console.log('🛑 Stopping current music for Level 2 shortcut');
            this.audioManager.stopMusic();
            
            // Wait a moment for clean stop, then start Level 2 music
            setTimeout(() => {
                console.log('🎵 Starting Level 2 music via shortcut');
                this.audioManager.playLevelMusic(2);
            }, 200);
        }
        
        // ✅ FORCE CLEAN: Dispose current level completely
        if (this.level) {
            console.log('🧹 Force disposing current level for Level 2 shortcut...');
            this.level.dispose();
            this.level = null;
            
            // Wait for cleanup
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // ✅ LOAD: Level 2 using the old system (since Level 2 uses Level.js)
        console.log('🏗️ Loading Level 2 using old Level.js system...');
        this.level = new Level(this.scene, 2, this.WORLD_WIDTH, this.WORLD_DEPTH);
        await this.level.create();
        this.lastLoadedLevel = 2;
        
        // Reset player
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 17);
        }
        
        // Update UI
        this.ui.updateLevel(this.currentLevel);
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        
        this.isLoadingLevel = false;
        this.isPlaying = true;
        
        console.log('✅ FIXED: Successfully jumped to Level 2');
        
    } catch (error) {
        console.error('❌ FAILED: Level 2 shortcut error:', error);
        this.isLoadingLevel = false;
        this.isPlaying = true; // Resume current level
    }
}

// 5. ADD: debugJumpToLevel3 method
async debugJumpToLevel3() {
    console.log('🚀 Jumping to Level 3: Mars Colony via shortcut...');
    this.currentLevel = 3;
    this.frogsRescued = 0;
    this.totalFrogsNeeded = 6; // Level 3 has 6 frogs
    this.clearSavedFrogImages();
    
    // Stop current music completely before switching
    if (this.audioManager) {
        console.log('🛑 Stopping current music for Level 3 shortcut');
        this.audioManager.stopMusic();
        
        // Wait a moment for clean stop, then start Level 3 music
        setTimeout(() => {
            console.log('🎵 Starting Level 3 music via shortcut');
            this.audioManager.playLevelMusic(3);
        }, 200);
    }
    
    // Load Level 3
    if (this.level) {
        this.level.dispose();
        this.level = null;
    }
    
    await this.loadLevel(3);
    
    // Reset player
    if (this.player) {
        this.player.ridingLog = null;
        this.player.setPosition(0, 0, 17);
    }
    
    // Update UI
    this.ui.updateLevel(this.currentLevel);
    this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
    
    this.isPlaying = true;
}
async debugJumpToLevel4() {
    console.log('🏛️ Jumping to Level 4: Washington D.C. via shortcut...');
    
    // Prevent multiple calls
    if (this.isLoadingLevel) {
        console.warn('⚠️ Level already loading, ignoring Level 4 shortcut');
        return;
    }
    
    this.isLoadingLevel = true;
    this.isPlaying = false;
    
    try {
        this.currentLevel = 4;
        this.frogsRescued = 0;
        this.totalFrogsNeeded = 7; // Level 4 has 7 frogs
        this.clearSavedFrogImages();
        
        // Stop current music and start Level 4 music
        if (this.audioManager) {
            console.log('🛑 Stopping current music for Level 4 shortcut');
            this.audioManager.stopMusic();
            
            setTimeout(() => {
                console.log('🎵 Starting Level 4 music via shortcut');
                this.audioManager.playLevelMusic(4);
            }, 200);
        }
        
        // Force clean current level
        if (this.level) {
            console.log('🧹 Force disposing current level for Level 4 shortcut...');
            this.level.dispose();
            this.level = null;
            
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // Load Level 4 using new system
        console.log('🏗️ Loading Level 4 using new LevelFactory system...');
        await this.loadLevel(4);
        this.lastLoadedLevel = 4;
        
        // Reset player
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 17);
        }
        
        // Update UI
        this.ui.updateLevel(this.currentLevel);
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        
        this.isLoadingLevel = false;
        this.isPlaying = true;
        
        console.log('✅ Successfully jumped to Level 4: Washington D.C.');
        
    } catch (error) {
        console.error('❌ Level 4 shortcut error:', error);
        this.isLoadingLevel = false;
        this.isPlaying = true;
    }
}

// REPLACE your existing debugJumpToLevel5() method in Game.js with this:

async debugJumpToLevel5() {
    console.log('🎉 Level 5 shortcut activated - showing victory screen instead!');
    
    // Since Level 5 doesn't exist yet, show victory screen
    this.isPlaying = false;
    
    // Award bonus points for using the shortcut
    this.score += 500;
    this.ui.updateScore(this.score);
    
    // Stop current music
    if (this.audioManager) {
        this.audioManager.stopMusic();
    }
    
    // Show victory screen
    console.log('🏆 Showing victory screen via Level 5 shortcut');
    this.victoryScreen.show();
}


async setFrogCountForLevel(level) {
    try {
        // ✅ DYNAMIC IMPORT: Handle the import properly
        const { LevelConfigManager } = await import('./LevelConfig.js');
        const config = LevelConfigManager.getConfig(level);
        
        if (config && config.frogsNeeded) {
            this.totalFrogsNeeded = config.frogsNeeded;
            console.log(`🐸 Level ${level}: ${this.totalFrogsNeeded} frogs needed (from config)`);
        } else {
            // ✅ FALLBACK: Manual assignment if config fails
            const manualFrogCounts = {
                1: 4,
                2: 5, 
                3: 6,
                4: 7, // ✅ FIXED: Level 4 should have 7 frogs
                5: 8
            };
            
            this.totalFrogsNeeded = manualFrogCounts[level] || 4;
            console.log(`🐸 Level ${level}: ${this.totalFrogsNeeded} frogs needed (manual fallback)`);
        }
    } catch (error) {
        console.warn(`⚠️ Could not load config for Level ${level}, using manual assignment`);
        
        // ✅ EMERGENCY FALLBACK: Manual assignment
        const emergencyFrogCounts = {
            1: 4,
            2: 5,
            3: 6, 
            4: 7, // ✅ FIXED: Level 4 = 7 frogs
            5: 8
        };
        
        this.totalFrogsNeeded = emergencyFrogCounts[level] || 4;
        console.log(`🐸 Emergency: Level ${level} set to ${this.totalFrogsNeeded} frogs`);
    }
}
// ADD this method to Game.js:
async forceCleanCurrentLevel() {
    console.log(`🧹 Force cleaning Level ${this.currentLevel}...`);
    
    // Stop all animations and updates
    this.isPlaying = false;
    this.isPaused = false;
    
    // Clear player riding state
    if (this.player) {
        this.player.ridingLog = null;
    }
    
    // Dispose current level with extra cleanup
    if (this.level) {
        try {
            this.level.dispose();
            console.log(`✅ Level ${this.currentLevel} disposed`);
        } catch (error) {
            console.warn(`⚠️ Error disposing level:`, error);
        }
        this.level = null;
    }
    
    // Force garbage collection hint
    if (window.gc) {
        window.gc();
    }
    
    // Wait for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 200));
    
    console.log(`✅ Level cleanup complete`);
}


// 1. CORE FIX: Replace your entire restartGame() method with this bulletproof version
async restartGame() {
    console.log('🔄 BULLETPROOF: Level 4 restart with persistent state...');
    
    // ✅ PREVENT: Multiple restart calls
    if (this.isLoadingLevel) {
        console.warn('⚠️ Already restarting, ignoring additional restart call');
        return;
    }
    
    this.isLoadingLevel = true;
    
    // ✅ CRITICAL: Store restart level BEFORE any state changes
    const restartLevel = this.lastLoadedLevel || this.currentLevel || 1;
    console.log(`🎯 RESTART TARGET: Level ${restartLevel}`);
    console.log(`📊 State snapshot: currentLevel=${this.currentLevel}, lastLoadedLevel=${this.lastLoadedLevel}`);
    
    // ✅ IMPORTANT: Don't change currentLevel until after successful reload
    const originalCurrentLevel = this.currentLevel;
    const originalLastLoadedLevel = this.lastLoadedLevel;
    
    try {
        // Reset only game progress, NOT level tracking
        this.isPlaying = false;
        this.gameOver = false;
        this.levelComplete = false;
        this.score = 0;
        this.lives = 3;
        this.frogsRescued = 0;
        
        // ✅ PRESERVE: Keep level state intact during restart
        console.log(`🔒 Preserving level state: Level ${restartLevel}`);
        
        // Set frog count for restart level
        await this.setFrogCountForLevel(restartLevel);
        this.clearSavedFrogImages();
        
        // Clear player state
        if (this.player) {
            this.player.ridingLog = null;
            this.player.setPosition(0, 0, 17);
        }
        
        // ✅ MUSIC FIX: Stop all audio completely before level reload
        if (this.audioManager) {
            console.log('🎵 Stopping ALL audio for clean restart...');
            this.audioManager.stopMusic();
            // Wait for audio to fully stop
            await new Promise(resolve => setTimeout(resolve, 300));
        }
        
        // ✅ FORCE: Clean level disposal with state preservation
        await this.forceCleanCurrentLevelPreserveState(restartLevel);
        
        // ✅ RELOAD: Level with explicit state management
        console.log(`🏗️ Reloading Level ${restartLevel} with state preservation...`);
        
        // Explicitly set states before loading
        this.currentLevel = restartLevel;
        this.lastLoadedLevel = restartLevel;
        
        await this.loadLevel(restartLevel);
        
        // ✅ VERIFY: Level loaded correctly
        if (this.lastLoadedLevel !== restartLevel || this.currentLevel !== restartLevel) {
            throw new Error(`State corruption detected: expected Level ${restartLevel}, got current=${this.currentLevel}, loaded=${this.lastLoadedLevel}`);
        }
        
        console.log(`✅ Restart verification passed: Level ${restartLevel}`);
        
        // ✅ MUSIC FIX: Start correct level music after successful reload
        if (this.audioManager) {
            console.log(`🎵 Starting Level ${restartLevel} music after restart...`);
            setTimeout(() => {
                this.audioManager.playLevelMusic(restartLevel);
                console.log(`🎵 Level ${restartLevel} music started`);
            }, 500); // Delay to ensure clean audio transition
        }
        
    } catch (error) {
        console.error(`❌ Restart failed for Level ${restartLevel}:`, error);
        
        // ✅ RECOVERY: Restore original state and fallback gracefully
        console.log('🚨 Attempting recovery to original state...');
        this.currentLevel = originalCurrentLevel;
        this.lastLoadedLevel = originalLastLoadedLevel;
        
        // If that fails, emergency fallback to Level 1
        if (!this.level || this.currentLevel < 1) {
            console.log('🚨 Emergency fallback to Level 1');
            this.currentLevel = 1;
            this.lastLoadedLevel = 1;
            await this.loadLevel(1);
        }
    }
    
    // Update UI with final state
    this.ui.updateScore(this.score);
    this.ui.updateLives(this.lives);
    this.ui.updateLevel(this.currentLevel);
    this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
    this.ui.hideGameOver();
    
    this.isLoadingLevel = false;
    this.startGame();
    
    console.log(`✅ RESTART COMPLETE: Level ${this.currentLevel}, Music: Level ${this.currentLevel}`);
    console.log(`📊 Final state: currentLevel=${this.currentLevel}, lastLoadedLevel=${this.lastLoadedLevel}`);
}

// 2. NEW METHOD: Clean level while preserving state
async forceCleanCurrentLevelPreserveState(preserveLevel) {
    console.log(`🧹 Force cleaning while preserving Level ${preserveLevel} state...`);
    
    // Stop animations and updates
    this.isPlaying = false;
    this.isPaused = false;
    
    // Clear player riding state
    if (this.player) {
        this.player.ridingLog = null;
    }
    
    // Dispose current level with extra cleanup
    if (this.level) {
        try {
            this.level.dispose();
            console.log(`✅ Level disposed while preserving state for Level ${preserveLevel}`);
        } catch (error) {
            console.warn(`⚠️ Error disposing level:`, error);
        }
        this.level = null;
    }
    
    // ✅ CRITICAL: Don't reset level tracking variables
    console.log(`🔒 Preserved state: Level ${preserveLevel} tracking intact`);
    
    // Wait for cleanup to complete
    await new Promise(resolve => setTimeout(resolve, 200));
}


// 6. ADD: Emergency reset method to Game.js
async emergencyReset() {
    console.log('🚨 EMERGENCY RESET - Forcing clean state...');
    
    this.isLoadingLevel = false;
    this.isPlaying = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.currentLevel = 1;
    this.lastLoadedLevel = null;
    this.frogsRescued = 0;
    
    // Force clean everything
    if (this.audioManager) {
        this.audioManager.stopMusic();
    }
    
    await this.forceCleanCurrentLevel();
    
    // Reload from scratch
    await this.loadLevel(1);
    this.lastLoadedLevel = 1;
    this.setFrogCountForLevel(1);
    
    this.ui.updateLevel(1);
    this.ui.updateFrogProgress(0, this.totalFrogsNeeded);
    
    console.log('✅ Emergency reset complete');
}

async loadLevel(levelNumber) {
    // Verify level number is valid
    if (levelNumber < 1 || levelNumber > this.maxLevel) {
        console.error(`❌ Invalid level number: ${levelNumber}`);
        levelNumber = 1;
    }
    
    console.log(`🏗️ Loading level ${levelNumber}...`);
    
    // ✅ RESTART FIX: Allow reloading same level during restart
    const isRestartReload = this.isLoadingLevel && this.lastLoadedLevel === levelNumber;
    
    if (this.lastLoadedLevel === levelNumber && this.level && !isRestartReload) {
        console.log(`⚠️ Level ${levelNumber} already loaded and not restarting, skipping...`);
        return;
    }
    
    try {
        // Clean up previous level only if different or restart
        if (this.level && (this.lastLoadedLevel !== levelNumber || isRestartReload)) {
            console.log('🧹 Disposing previous level for reload...');
            this.level.dispose();
            this.level = null;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // ✅ CRITICAL: Set tracking IMMEDIATELY
        this.lastLoadedLevel = levelNumber;
        this.currentLevel = levelNumber; // Ensure both are in sync
        console.log(`🎯 Set level tracking: currentLevel=${this.currentLevel}, lastLoadedLevel=${this.lastLoadedLevel}`);
        
        // ✅ Load with proper system
        if (levelNumber <= 2) {
            console.log(`🔧 Loading Level ${levelNumber} with Level.js system...`);
            this.level = new Level(this.scene, levelNumber, this.WORLD_WIDTH, this.WORLD_DEPTH);
            await this.level.create();
        } else {
            console.log(`🔧 Loading Level ${levelNumber} with LevelFactory system...`);
            const { LevelFactory } = await import('./LevelFactory.js');
            this.level = LevelFactory.createLevel(this.scene, levelNumber, this.WORLD_WIDTH, this.WORLD_DEPTH);
            await this.level.create();
        }
        
        // Add saved frog images
        await this.addSavedFrogImages();
        
        console.log(`✅ Level ${levelNumber} loaded, state: currentLevel=${this.currentLevel}, lastLoadedLevel=${this.lastLoadedLevel}`);
        
    } catch (error) {
        console.error(`❌ Failed to load level ${levelNumber}:`, error);
        // ✅ Don't corrupt state on error
        console.error(`❌ Load failed but maintaining state: currentLevel=${this.currentLevel}, lastLoadedLevel=${this.lastLoadedLevel}`);
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
        
        // ✅ MUSIC FIX: Ensure correct level music plays
        if (this.audioManager) {
            console.log(`🎵 Starting music for Level ${this.currentLevel}...`);
            // Stop any existing music first
            this.audioManager.stopMusic();
            // Start correct level music
            setTimeout(() => {
                this.audioManager.playLevelMusic(this.currentLevel);
                console.log(`🎵 Level ${this.currentLevel} music should now be playing`);
            }, 100);
        }
        
        // Update UI
        this.ui.updateScore(this.score);
        this.ui.updateLives(this.lives);
        this.ui.updateLevel(this.currentLevel);
        this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
        
        console.log(`🎮 Game started at Level ${this.currentLevel}! Music: Level ${this.currentLevel}`);
    }
// 2. REPLACE: Fix the nextLevel() method in Game.js
// 4. UPDATE: Enhanced nextLevel method to handle Level 4

// REPLACE your existing nextLevel() method in Game.js with this:
async nextLevel() {
    // Prevent double-loading levels
    if (this.isLoadingLevel) {
        console.warn('⚠️ Level already loading, ignoring nextLevel() call');
        return;
    }
    
    // ✅ VICTORY CHECK: Show victory screen after Level 4
    if (this.currentLevel >= 4) {
        console.log('🎉 Game completed! Showing victory screen...');
        this.isPlaying = false;
        
        // Stop current music
        if (this.audioManager) {
            this.audioManager.stopMusic();
        }
        
        // Show victory screen instead of continuing
        this.victoryScreen.show();
        return;
    }
    
    console.log(`🆙 Starting transition from Level ${this.currentLevel} to Level ${this.currentLevel + 1}`);
    
    // Lock level loading
    this.isLoadingLevel = true;
    this.isPlaying = false;
    this.levelComplete = false;
    
    // Force clean up current level
    await this.forceCleanCurrentLevel();
    
    // Increment level
    const previousLevel = this.currentLevel;
    this.currentLevel++;
    console.log(`📈 Level incremented from ${previousLevel} to: ${this.currentLevel}`);
    
    // Reset frog progress for new level
    this.frogsRescued = 0;
    this.clearSavedFrogImages();
    await this.setFrogCountForLevel(this.currentLevel);
    
    // Stop all audio before switching
    if (this.audioManager) {
        console.log(`🎵 Stopping all audio for Level ${this.currentLevel} transition`);
        this.audioManager.stopMusic();
        
        await new Promise(resolve => setTimeout(resolve, 800));
        
        console.log(`🎵 Starting Level ${this.currentLevel} music`);
        this.audioManager.playLevelMusic(this.currentLevel);
    }
    
    // Load new level
    try {
        await this.loadLevel(this.currentLevel);
        this.lastLoadedLevel = this.currentLevel; // ✅ CRITICAL: Update tracking
        console.log(`✅ Successfully loaded Level ${this.currentLevel}, lastLoadedLevel set to ${this.lastLoadedLevel}`);
    } catch (error) {
        console.error(`❌ Failed to load Level ${this.currentLevel}:`, error);
        this.isLoadingLevel = false;
        return;
    }
    
    // Reset player position
    if (this.player) {
        this.player.ridingLog = null;
        this.player.setPosition(0, 0, 17);
    }
    
    // Update UI
    this.ui.updateLevel(this.currentLevel);
    this.ui.updateFrogProgress(this.frogsRescued, this.totalFrogsNeeded);
    this.ui.hideLevelComplete();
    
    // Unlock and start
    this.isLoadingLevel = false;
    this.isPlaying = true;
    
    console.log(`✅ Successfully loaded Level ${this.currentLevel} with ${this.totalFrogsNeeded} frogs needed`);
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
        
                // ✅ NEW: Cap deltaTime to prevent huge jumps
                const cappedDeltaTime = Math.min(deltaTime, this.maxDeltaTime);
        
                // ✅ NEW: Skip updates if tab is not visible
                if (!this.isTabVisible) {
                    return; // Don't update game objects when tab is hidden
                }
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
    checkCollisions() {
        if (!this.level || !this.player) return;
        
        const playerPos = this.player.position;
        const obstacles = this.level.getObstacles();
        
        // ✅ UPDATED GAME ZONES for Level 4
        const roadZone = playerPos.z >= 1 && playerPos.z <= 14;           
        const safeMedianZone = playerPos.z >= -5 && playerPos.z <= 3;     
        const waterZone = playerPos.z >= -12 && playerPos.z <= -2;        
        const startZone = playerPos.z >= 14;                              
        const goalZone = playerPos.z <= -13;                              
        
        let dangerLevel = 0;
        
        if (waterZone) {
            let onStableTransport = false;
            let ridingTransport = null;
            let nearbyDanger = false;
            
            for (const obstacle of obstacles) {
                // ✅ LEVEL 4 FIX: Add patriotbus to rideable types
                const rideableTypes = [
                    'log',         // Level 1 logs
                    'gator',       // Level 2 gators  
                    'robovan',     // Level 3 robovans
                    'patriotbus'   // ✅ NEW: Level 4 patriot buses
                ];
                
                if (obstacle.isRideable && rideableTypes.includes(obstacle.type)) {
                    const distance = playerPos.distanceTo(obstacle.position);
                    if (distance < 3.0) {
                        onStableTransport = true;
                        ridingTransport = obstacle;
                        
                        if (!this.player.ridingLog || this.player.ridingLog !== ridingTransport) {
                            this.player.logOffset = this.player.position.x - obstacle.position.x;
                            console.log(`🚌 Frog hopped onto ${obstacle.type} at offset: ${this.player.logOffset.toFixed(2)}`);
                        }
                        
                        this.player.position.x = obstacle.position.x + this.player.logOffset;
                        this.updatePlayerBounds();
                        this.player.ridingLog = ridingTransport;
                        
                        console.log(`🚌 Frog riding ${obstacle.type} at relative position`);
                        break;
                    } else if (distance < 5.0) {
                        nearbyDanger = true;
                    }
                }
            }
            
            if (!onStableTransport) {
                if (nearbyDanger) {
                    dangerLevel = 1;
                } else {
                    dangerLevel = 2;
                }
                
                this.player.ridingLog = null;
                console.log(`💀 Frog drowned in Potomac River at Z: ${playerPos.z.toFixed(1)}!`);
                this.playerHit();
                
                if (this.player) {
                    this.player.updateGroundCircleColor(2);
                }
                return;
            } else {
                dangerLevel = 0;
            }
            
        } else {
            this.player.ridingLog = null;
            
            if (roadZone) {
                let nearestVehicleDistance = Infinity;
                let hitByVehicle = false;
                
                for (const obstacle of obstacles) {
                    // ✅ LEVEL 4 FIX: Add Level 4 vehicle types
                    const dangerousVehicles = [
                        'cybertruck', 'taxi', 'sportscar',           // Level 1 vehicles
                        'angryfrog', 'protestor', 'leftyvan',        // Level 2 vehicles
                        'alieninufo', 'tardigrade', 'marsprotestor', // Level 3 vehicles
                        'donkey', 'leftist', 'limo'                  // ✅ NEW: Level 4 vehicles
                    ];
                    
                    if (!obstacle.isRideable && dangerousVehicles.includes(obstacle.type)) {
                        const distance = playerPos.distanceTo(obstacle.position);
                        
                        if (distance < nearestVehicleDistance) {
                            nearestVehicleDistance = distance;
                        }
                        
                        if (distance < 1.8) {
                            console.log(`💀 Frog hit by ${obstacle.type} on D.C. road!`);
                            hitByVehicle = true;
                            dangerLevel = 2;
                            break;
                        }
                    }
                }
                
                if (!hitByVehicle) {
                    if (nearestVehicleDistance < 3.0) {
                        dangerLevel = 2;
                    } else if (nearestVehicleDistance < 5.0) {
                        dangerLevel = 1;
                    } else {
                        dangerLevel = 0;
                    }
                }
                
                if (hitByVehicle) {
                    this.playerHit();
                    return;
                }
                
            } else if (safeMedianZone || startZone || goalZone) {
                dangerLevel = 0;
            } else {
                dangerLevel = 1;
                console.log(`⚠️ Frog in unknown zone at Z: ${playerPos.z.toFixed(1)}`);
            }
        }
        
        if (this.player) {
            this.player.updateGroundCircleColor(dangerLevel);
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
    
// REPLACE the incomplete addFrogImage method in Game.js with this:
async addFrogImage() {
    try {
        const config = LevelConfigManager.getConfig(this.currentLevel);
        const imageName = config ? config.assets.frogImages : '/gflmemer.png';
        
        const texture = await this.loadTexture(imageName);
        
        // ✅ VIBRANT IMAGE SETTINGS: Same as other images
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
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
        
        const xPositions = [-6, -2, 2, 6, 0]; // Added center position for 5th frog
        const xPos = xPositions[this.frogsRescued - 1] || 0;
        
        frogImage.position.set(xPos, 1.5, -13);
        frogImage.castShadow = false;
        frogImage.receiveShadow = false;
        
        this.savedFrogImages.push(frogImage);
        this.scene.add(frogImage);
        
        console.log(`✅ Added Level ${this.currentLevel} frog image using ${imageName}`);
        
    } catch (error) {
        console.warn(`⚠️ Could not load frog image for Level ${this.currentLevel}, using placeholder`);
        this.addPlaceholderFrog();
    }
}

// REPLACE the incomplete addSavedFrogImages method in Game.js with this:
async addSavedFrogImages() {
    console.log(`🐸 Adding ${this.frogsRescued} saved frog images for Level ${this.currentLevel}...`);
    
    this.clearSavedFrogImages();
    
    for (let i = 0; i < this.frogsRescued; i++) {
        try {
            const config = LevelConfigManager.getConfig(this.currentLevel);
            const imageName = config ? config.assets.frogImages : '/gflmemer.png';
            
            const texture = await this.loadTexture(imageName);
            
            // ✅ SAME VIBRANT TEXTURE SETTINGS with correct orientation
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
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
            
            const xPositions = [-6, -2, 2, 6, 0]; // Added center position for 5th frog
            const xPos = xPositions[i] || 0;
            
            frogImage.position.set(xPos, 1.5, -13);
            frogImage.castShadow = false;
            frogImage.receiveShadow = false;
            
            this.savedFrogImages.push(frogImage);
            this.scene.add(frogImage);
            
        } catch (error) {
            console.warn(`⚠️ Could not load frog image ${i + 1} for Level ${this.currentLevel}`);
        }
    }
    
    console.log(`✅ Added ${this.savedFrogImages.length} Level ${this.currentLevel} frog images`);
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
    // ✅ ENHANCED: Update playerHit method to set red danger level
playerHit() {
    this.lives--;
    this.ui.updateLives(this.lives);
    
    // ✅ Clear riding state on hit
    if (this.player) {
        this.player.ridingLog = null;
        // ✅ NEW: Set ground circle to red for hit state
        this.player.updateGroundCircleColor(2);
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
    // REPLACE your existing endGame() method in Game.js with this:
// ADD this method to your Game.js class:

returnToMainMenu() {
    console.log('🏠 Returning to main menu from victory screen...');
    
    // Hide victory screen
    this.victoryScreen.hide();
    
    // Reset game state
    this.isPlaying = false;
    this.gameOver = false;
    this.levelComplete = false;
    this.currentLevel = 1;
    this.frogsRescued = 0;
    this.score = 0;
    this.lives = 3;
    
    // Clear saved frog images
    this.clearSavedFrogImages();
    
    // Stop any music
    if (this.audioManager) {
        this.audioManager.stopMusic();
    }
    
    // Clean up current level
    if (this.level) {
        this.level.dispose();
        this.level = null;
    }
    
    // Show start screen again
    this.ui.hideGameOver();
    this.ui.hideLevelComplete();
    this.ui.showStartScreen();
    
    // Reset UI displays
    this.ui.updateScore(this.score);
    this.ui.updateLives(this.lives);
    this.ui.updateLevel(this.currentLevel);
    this.ui.updateFrogProgress(this.frogsRescued, 4); // Default 4 frogs for Level 1
    
    console.log('✅ Returned to main menu successfully');
}

endGame(victory = false) {
    this.isPlaying = false;
    this.gameOver = true;
    
    // Clear riding state on game end
    if (this.player) {
        this.player.ridingLog = null;
    }
    
    // Stop music
    if (this.audioManager) {
        this.audioManager.stopMusic();
    }
    
    if (victory) {
        // ✅ VICTORY: Show victory screen instead of regular game over
        console.log(`🏆 Game completed! Final Score: ${this.score}`);
        this.score += 1000; // Bonus for completing all levels
        this.ui.updateScore(this.score);
        
        // Show victory screen
        this.victoryScreen.show();
    } else {
        // ✅ GAME OVER: Show regular game over screen
        console.log(`💀 Game Over! Final Score: ${this.score}`);
        this.ui.showGameOver(this.score);
    }
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