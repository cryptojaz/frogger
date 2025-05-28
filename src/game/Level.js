// LEVEL 2: JUNGLE SWAMP - Dense jungle with muddy water, vines, and snapping crocodiles
// Features: Faster gameplay, crocodiles, lily pads, jungle temple, vine decorations

import * as THREE from 'three';
import { Car, Log, Turtle, Crocodile, Cybertruck, Taxi, Bus } from './Vehicle.js';

export class Level {
    constructor(scene, levelNumber, worldWidth, worldDepth) {
        this.scene = scene;
        this.levelNumber = levelNumber;
        this.worldWidth = worldWidth;
        this.worldDepth = worldDepth;
        
        // Screen dimensions - extended for seamless feel
        this.screenWidth = 80;
        this.playableWidth = worldWidth;
        
        // Level objects
        this.terrain = [];
        this.obstacles = [];
        this.goals = [];
        this.decorations = [];
        
        // Cached materials
        this.sharedMaterials = Level.getSharedMaterials();
        
        // Texture loader for decorative images
        this.textureLoader = new THREE.TextureLoader();
        
        console.log(`🏗️ Enhanced Level ${levelNumber} manager created`);
    }
    
    static getSharedMaterials() {
        if (!Level._cachedMaterials) {
            console.log('🎨 Creating materials ONCE and caching forever...');
            
            Level._cachedMaterials = {
                // Level 1 - City materials
                grass: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                road: new THREE.MeshLambertMaterial({ color: 0x2a2a2a }),
                water: new THREE.MeshLambertMaterial({ color: 0x1a5490, transparent: true, opacity: 0.8 }),
                sidewalk: new THREE.MeshLambertMaterial({ color: 0xcccccc }),
                cityGround: new THREE.MeshLambertMaterial({ color: 0x444444 }),
                goalBuilding: new THREE.MeshLambertMaterial({ color: 0x4a90e2 }),
                goalGlow: new THREE.MeshLambertMaterial({ 
                    color: 0x00ff88, 
                    emissive: 0x004422,
                    emissiveIntensity: 0.4
                }),
                
                // Level 2 - Jungle materials
                jungleGrass: new THREE.MeshLambertMaterial({ color: 0x1a4a1a }), // Dark jungle green
                jungleRoad: new THREE.MeshLambertMaterial({ color: 0x4a3728 }), // Muddy brown path
                swampWater: new THREE.MeshLambertMaterial({ color: 0x3d4a1a, transparent: true, opacity: 0.9 }), // Murky green
                junglePath: new THREE.MeshLambertMaterial({ color: 0x5a4a3a }), // Brown jungle path
                jungleGround: new THREE.MeshLambertMaterial({ color: 0x2a3a1a }), // Dark jungle floor
                
                // Jungle temple materials
                templeStone: new THREE.MeshLambertMaterial({ color: 0x6a5a4a }), // Ancient stone
                templeMoss: new THREE.MeshLambertMaterial({ color: 0x2a4a1a }), // Mossy green
                templeGlow: new THREE.MeshLambertMaterial({ 
                    color: 0xffd700, 
                    emissive: 0x664400,
                    emissiveIntensity: 0.5
                }),
                
                // Shared materials
                boundaryMarker: new THREE.MeshLambertMaterial({ color: 0x999999, transparent: true, opacity: 0.3 }),
                yellowLine: new THREE.MeshLambertMaterial({ color: 0xFFFF00, emissive: 0x222200 }),
                whiteLine: new THREE.MeshLambertMaterial({ color: 0xFFFFFF, emissive: 0x111111 }),
                building1: new THREE.MeshLambertMaterial({ color: 0x555555 }),
                building2: new THREE.MeshLambertMaterial({ color: 0x666666 }),
                building3: new THREE.MeshLambertMaterial({ color: 0x777777 }),
                trunk: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
                foliage: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                jungleFoliage: new THREE.MeshLambertMaterial({ color: 0x1a4a1a }), // Darker jungle leaves
                vineGreen: new THREE.MeshLambertMaterial({ color: 0x2d5a2d }), // Vine color
                windowLit: new THREE.MeshLambertMaterial({ 
                    color: 0xffffaa, 
                    emissive: 0x444422,
                    emissiveIntensity: 0.3
                }),
                windowDark: new THREE.MeshLambertMaterial({ color: 0x222244 })
            };
            
            console.log('✅ Materials cached forever');
        }
        
        return Level._cachedMaterials;
    }
    
    dispose() {
        console.log(`🧹 Disposing Level ${this.levelNumber} - keeping shared materials...`);
        
        [...this.terrain, ...this.decorations, ...this.goals].forEach(obj => {
            this.scene.remove(obj);
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material && obj.material.map) {
                obj.material.map.dispose();
            }
        });
        
        this.obstacles.forEach(obstacle => {
            if (obstacle.dispose) obstacle.dispose();
        });
        
        this.terrain = [];
        this.obstacles = [];
        this.goals = [];
        this.decorations = [];
        
        console.log(`✅ Level disposed - shared materials preserved`);
    }
    
    async create() {
        console.log(`🏗️ Creating Level ${this.levelNumber}...`);
        
        switch (this.levelNumber) {
            case 1:
                await this.createLevel1_RefinedCity();
                break;
            case 2:
                await this.createLevel2_JungleSwamp();
                break;
            default:
                await this.createLevel1_RefinedCity();
        }
        
        console.log(`✅ Level ${this.levelNumber} created`);
    }
    
    // ✅ UPDATED: Use pepesoldier.png instead of frogger.png
    // ===== LEVEL 1: REFINED CITY =====
    async createLevel1_RefinedCity() {
        console.log('🌆 Creating refined city Frogger');
        
        this.createPolishedCityFoundation();
        this.createFullWidthStartingArea();
        this.createFullWidthRoadSection();
        this.createSafeMedianStrip();
        this.createFullWidthRiverSection();
        this.createGoalBuildingArea();
        
        this.createRoadVehicles();
        this.createStableRiverLogs();
        
        this.createSubtleBoundaries();
        this.createCornerBuildings();
        this.createBackgroundCityBuildings();
        
        await this.createSidewalkTrees();
        await this.createBottomGrassTrees();
        await this.createEnhancedFroggerDecorations(); // ✅ This now loads pepesoldier.png
        
        console.log('✅ Refined city created');
    }
    
    // ===== LEVEL 2: JUNGLE SWAMP =====
    async createLevel2_JungleSwamp() {
        console.log('🌿 Creating Jungle Swamp level');
        
        // Foundation
        this.createJungleFoundation();
        
        // Game layout with jungle theming
        this.createJungleStartingArea();      // Dense jungle grass
        this.createMuddyRoadSection();        // Muddy jungle path
        this.createJungleMedianStrip();       // Safe jungle clearing
        this.createSwampWaterSection();       // Murky swamp water
        this.createJungleTempleArea();        // Ancient temple goal
        
        // Obstacles (faster gameplay)
        this.createJungleVehicles();          // 1.5x speed vehicles
        this.createSwampObstacles();          // Crocodiles and lily pads
        
        // Environment
        this.createSubtleBoundaries();
        this.createJungleTrees();
        this.createVineDecorations();
        
        console.log('✅ Jungle Swamp created with faster gameplay');
    }
    
    createJungleFoundation() {
        console.log('🌿 Creating jungle foundation...');
        
        const groundSize = 140;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const jungleGround = new THREE.Mesh(groundGeometry, this.sharedMaterials.jungleGround);
        jungleGround.rotation.x = -Math.PI / 2;
        jungleGround.position.set(0, -0.1, 0);
        jungleGround.receiveShadow = true;
        this.decorations.push(jungleGround);
        this.scene.add(jungleGround);
        
        console.log('✅ Jungle foundation complete');
    }
    
    createJungleStartingArea() {
        console.log('🌱 Creating jungle starting area...');
        
        const grassGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const startGrass = new THREE.Mesh(grassGeometry, this.sharedMaterials.jungleGrass);
        startGrass.rotation.x = -Math.PI / 2;
        startGrass.position.set(0, 0, 16);
        startGrass.receiveShadow = true;
        this.terrain.push(startGrass);
        this.scene.add(startGrass);
        
        console.log('✅ Jungle starting area created');
    }
    
    createMuddyRoadSection() {
        console.log('🛤️ Creating muddy jungle road...');
        
        const roadGeometry = new THREE.PlaneGeometry(this.screenWidth, 10);
        const road = new THREE.Mesh(roadGeometry, this.sharedMaterials.jungleRoad);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 9);
        road.receiveShadow = true;
        this.terrain.push(road);
        this.scene.add(road);
        
        // Add muddy tire tracks instead of lane markings
        this.createMuddyTracks();
        
        console.log('✅ Muddy road section created');
    }
    
    createMuddyTracks() {
        // Create muddy tire track patterns
        const trackGeometry = new THREE.PlaneGeometry(this.screenWidth, 0.3);
        
        // Left tire tracks
        const leftTrack1 = new THREE.Mesh(trackGeometry, this.sharedMaterials.jungleGround);
        leftTrack1.rotation.x = -Math.PI / 2;
        leftTrack1.position.set(0, 0.01, 7);
        this.decorations.push(leftTrack1);
        this.scene.add(leftTrack1);
        
        const leftTrack2 = new THREE.Mesh(trackGeometry, this.sharedMaterials.jungleGround);
        leftTrack2.rotation.x = -Math.PI / 2;
        leftTrack2.position.set(0, 0.01, 11);
        this.decorations.push(leftTrack2);
        this.scene.add(leftTrack2);
    }
    
    createJungleMedianStrip() {
        console.log('🌿 Creating jungle clearing...');
        
        const medianGeometry = new THREE.PlaneGeometry(this.screenWidth, 6);
        const medianPath = new THREE.Mesh(medianGeometry, this.sharedMaterials.junglePath);
        medianPath.rotation.x = -Math.PI / 2;
        medianPath.position.set(0, 0.05, 1);
        medianPath.receiveShadow = true;
        this.terrain.push(medianPath);
        this.scene.add(medianPath);
        
        console.log('✅ Jungle clearing created');
    }
    
    createSwampWaterSection() {
        console.log('🐊 Creating swamp water section...');
        
        const extendedWaterWidth = this.screenWidth + 20;
        const waterGeometry = new THREE.PlaneGeometry(extendedWaterWidth, 12);
        const swampWater = new THREE.Mesh(waterGeometry, this.sharedMaterials.swampWater);
        swampWater.rotation.x = -Math.PI / 2;
        swampWater.position.set(0, -0.05, -8);
        this.terrain.push(swampWater);
        this.scene.add(swampWater);
        
        console.log('✅ Swamp water section created');
    }
    
    createJungleTempleArea() {
        console.log('🏛️ Creating jungle temple area...');
        
        const goalPathGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const goalPath = new THREE.Mesh(goalPathGeometry, this.sharedMaterials.junglePath);
        goalPath.rotation.x = -Math.PI / 2;
        goalPath.position.set(0, 0, -14);
        goalPath.receiveShadow = true;
        this.terrain.push(goalPath);
        this.scene.add(goalPath);
        
        // Create jungle temple
        const templeGeometry = new THREE.BoxGeometry(12, 8, 4);
        const temple = new THREE.Mesh(templeGeometry, this.sharedMaterials.templeStone);
        temple.position.set(0, 4, -16);
        temple.castShadow = true;
        temple.receiveShadow = true;
        
        // Add temple decorations
        this.addTempleDecorations(temple);
        
        // Add temple glow
        const templeGlowGeometry = new THREE.PlaneGeometry(8, 2);
        const templeGlow = new THREE.Mesh(templeGlowGeometry, this.sharedMaterials.templeGlow);
        templeGlow.position.set(0, -1, 2.01);
        temple.add(templeGlow);
        
        this.goals.push(temple);
        this.decorations.push(temple);
        this.scene.add(temple);
        
        console.log('✅ Jungle temple area created');
    }
    
    addTempleDecorations(temple) {
        // Add moss patches to temple
        const mossGeometry = new THREE.PlaneGeometry(3, 2);
        
        // Left moss patch
        const leftMoss = new THREE.Mesh(mossGeometry, this.sharedMaterials.templeMoss);
        leftMoss.position.set(-3, 0, 2.01);
        temple.add(leftMoss);
        
        // Right moss patch
        const rightMoss = new THREE.Mesh(mossGeometry, this.sharedMaterials.templeMoss);
        rightMoss.position.set(3, 0, 2.01);
        temple.add(rightMoss);
        
        // Add temple pillars
        for (let i = -1; i <= 1; i += 2) {
            const pillarGeometry = new THREE.CylinderGeometry(0.5, 0.6, 6, 8);
            const pillar = new THREE.Mesh(pillarGeometry, this.sharedMaterials.templeStone);
            pillar.position.set(i * 4, -1, 1.5);
            temple.add(pillar);
        }
    }
    
    // Enhanced vehicles with 1.5x speed multiplier
    createJungleVehicles() {
        console.log('🚗 Creating faster jungle vehicles...');
        
        const lanePositions = [13, 11, 9, 7, 5];
        const laneDirections = [1, -1, 1, -1, 1];
        // 1.5x speed multiplier for jungle level
        const laneSpeeds = [2.3, 3.0, 5.3, 6.0, 2.7]; // All speeds increased by 1.5x
        
        lanePositions.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            const numVehicles = 4;
            
            for (let i = 0; i < numVehicles; i++) {
                let vehicle;
                const random = Math.random();
                if (random < 0.35) {
                    vehicle = new Cybertruck(this.scene);
                } else if (random < 0.7) {
                    vehicle = new Taxi(this.scene);
                } else {
                    vehicle = new Bus(this.scene);
                }
                
                vehicle.create();
                
                const extendedSpacing = 15;
                const extendedBounds = this.screenWidth/2 + 10;
                const startX = direction > 0 ? 
                    -extendedBounds + (i * extendedSpacing) : 
                    extendedBounds - (i * extendedSpacing);
                
                vehicle.setPosition(startX, 0.3, z);
                vehicle.setVelocity(direction * speed, 0, 0);
                this.obstacles.push(vehicle);
            }
        });
        
        console.log(`✅ ${this.obstacles.length} faster jungle vehicles created`);
    }
    
    // Swamp obstacles: Crocodiles (dangerous) and Lily Pads (rideable)
    createSwampObstacles() {
        console.log('🐊 Creating swamp obstacles...');
        
        const swampLanes = [-12, -10, -8, -6, -4];
        const laneDirections = [-1, 1, -1, 1, -1];
        // 1.5x speed for swamp obstacles
        const laneSpeeds = [3.8, 3.3, 1.8, 1.4, 1.7];
        
        swampLanes.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            
            // Alternate between crocodiles and lily pads
            if (laneIndex % 2 === 0) {
                // Crocodile lanes (dangerous)
                this.createCrocodileLane(z, direction, speed);
            } else {
                // Lily pad lanes (rideable)
                this.createLilyPadLane(z, direction, speed);
            }
        });
        
        console.log('✅ Swamp obstacles created with crocodiles and lily pads');
    }
    
    createCrocodileLane(z, direction, speed) {
        const numCrocs = 2; // Fewer crocodiles, more spacing
        
        for (let i = 0; i < numCrocs; i++) {
            const crocodile = new Crocodile(this.scene);
            crocodile.create();
            
            const spacing = 20; // More spacing between dangerous crocodiles
            const extendedBounds = this.screenWidth/2 + 10;
            const startX = direction > 0 ? 
                -extendedBounds + (i * spacing) : 
                extendedBounds - (i * spacing);
            
            crocodile.setPosition(startX, 0.1, z);
            crocodile.setVelocity(direction * speed, 0, 0);
            crocodile.isRideable = false; // Crocodiles are dangerous!
            crocodile.isSnapping = true; // Add snapping behavior
            
            this.obstacles.push(crocodile);
        }
    }
    
    createLilyPadLane(z, direction, speed) {
        const numPads = 3;
        
        for (let i = 0; i < numPads; i++) {
            // Create lily pad (using Log class but with different appearance)
            const lilyPad = new Log(this.scene);
            lilyPad.create();
            
            // Modify appearance to look like lily pad
            if (lilyPad.mesh) {
                lilyPad.mesh.scale.set(1, 0.3, 1.5); // Flatter, wider
                lilyPad.mesh.material.color.setHex(0x2d5a2d); // Green lily pad color
            }
            
            const spacing = 14;
            const extendedBounds = this.screenWidth/2 + 10;
            const startX = direction > 0 ? 
                -extendedBounds + (i * spacing) : 
                extendedBounds - (i * spacing);
            
            lilyPad.setPosition(startX, 0.1, z);
            lilyPad.setVelocity(direction * speed, 0, 0);
            lilyPad.isRideable = true; // Lily pads are safe to ride
            lilyPad.type = 'lilypad';
            
            this.obstacles.push(lilyPad);
        }
    }
    
    createJungleTrees() {
        console.log('🌳 Creating dense jungle trees...');
        
        const jungleTreePositions = [
            // Around starting area
            { x: -25, z: 16 }, { x: -22, z: 14 }, { x: -28, z: 18 },
            { x: 25, z: 16 }, { x: 22, z: 14 }, { x: 28, z: 18 },
            
            // Around temple area
            { x: -this.playableWidth/2 - 3, z: -16 },
            { x: this.playableWidth/2 + 3, z: -16 },
            
            // Dense jungle backdrop
            { x: -35, z: -25 }, { x: -30, z: -20 }, { x: -25, z: -30 },
            { x: 35, z: -25 }, { x: 30, z: -20 }, { x: 25, z: -30 },
            { x: -40, z: 0 }, { x: 40, z: 0 }, { x: -35, z: 25 }, { x: 35, z: 25 }
        ];
        
        jungleTreePositions.forEach((pos, index) => {
            // Create larger jungle trees
            const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.5, 4, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 2, pos.z);
            trunk.castShadow = true;
            
            // Larger, denser foliage for jungle feel
            const foliageSize = 2.5 + (index % 4) * 0.3;
            const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
            const foliage = new THREE.Mesh(foliageGeometry, this.sharedMaterials.jungleFoliage);
            foliage.position.set(pos.x, 5.5, pos.z);
            foliage.scale.set(1.2, 0.8, 1.2); // Wider, flatter jungle canopy
            foliage.castShadow = true;
            
            this.decorations.push(trunk);
            this.decorations.push(foliage);
            this.scene.add(trunk);
            this.scene.add(foliage);
        });
        
        console.log('✅ Dense jungle trees created');
    }
    
    createVineDecorations() {
        console.log('🌿 Creating hanging vines...');
        
        const vinePositions = [
            { x: -20, z: -10 }, { x: -15, z: -5 }, { x: -10, z: -15 },
            { x: 20, z: -10 }, { x: 15, z: -5 }, { x: 10, z: -15 },
            { x: -12, z: 8 }, { x: 12, z: 8 }, { x: 0, z: -25 }
        ];
        
        vinePositions.forEach((pos) => {
            // Create hanging vine
            const vineGeometry = new THREE.CylinderGeometry(0.1, 0.15, 6, 6);
            const vine = new THREE.Mesh(vineGeometry, this.sharedMaterials.vineGreen);
            vine.position.set(pos.x, 3, pos.z);
            vine.castShadow = true;
            
            // Add vine leaves
            const leafGeometry = new THREE.SphereGeometry(0.3, 6, 4);
            for (let i = 0; i < 3; i++) {
                const leaf = new THREE.Mesh(leafGeometry, this.sharedMaterials.jungleFoliage);
                leaf.position.set(
                    Math.random() * 0.4 - 0.2,
                    -1 - i * 1.5,
                    Math.random() * 0.4 - 0.2
                );
                leaf.scale.set(0.8, 0.5, 0.8);
                vine.add(leaf);
            }
            
            this.decorations.push(vine);
            this.scene.add(vine);
        });
        
        console.log('✅ Hanging vines created');
    }
    
    // ===== SHARED METHODS (used by both levels) =====
    
    createSubtleBoundaries() {
        console.log('🚧 Creating subtle boundary markers...');
        
        const boundaryWidth = 0.5;
        const playDepth = 36;
        
        const leftBoundary = new THREE.PlaneGeometry(boundaryWidth, playDepth);
        const leftMarker = new THREE.Mesh(leftBoundary, this.sharedMaterials.boundaryMarker);
        leftMarker.rotation.x = -Math.PI / 2;
        leftMarker.position.set(-this.playableWidth/2 - 0.25, 0.01, 0);
        this.decorations.push(leftMarker);
        this.scene.add(leftMarker);
        
        const rightBoundary = new THREE.PlaneGeometry(boundaryWidth, playDepth);
        const rightMarker = new THREE.Mesh(rightBoundary, this.sharedMaterials.boundaryMarker);
        rightMarker.rotation.x = -Math.PI / 2;
        rightMarker.position.set(this.playableWidth/2 + 0.25, 0.01, 0);
        this.decorations.push(rightMarker);
        this.scene.add(rightMarker);
        
        console.log('✅ Subtle boundaries created');
    }
    // ✅ SIMPLE CONTINUOUS SPAWNING: The correct algorithm
    update(deltaTime) {
        this.obstacles.forEach(obstacle => {
            obstacle.update(deltaTime);
            
            // ✅ THE KEY: Immediate repositioning with no gaps
            const screenBound = this.screenWidth / 2;
            
            if (obstacle.velocity.x > 0) {
                // Moving right: When it goes past right edge, move it to left edge
                if (obstacle.position.x > screenBound + 5) {
                    obstacle.setPosition(-screenBound - 5, obstacle.position.y, obstacle.position.z);
                }
            } else if (obstacle.velocity.x < 0) {
                // Moving left: When it goes past left edge, move it to right edge
                if (obstacle.position.x < -screenBound - 5) {
                    obstacle.setPosition(screenBound + 5, obstacle.position.y, obstacle.position.z);
                }
            }
        });
        
        // Goal glow animation
        const time = Date.now() * 0.001;
        this.goals.forEach(goal => {
            if (goal.children && goal.children[0]) {
                const glow = goal.children[0];
                glow.material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2;
            }
        });
        
        // Vine swaying for Level 2
        if (this.levelNumber === 2) {
            this.decorations.forEach(decoration => {
                if (decoration.material === this.sharedMaterials.vineGreen) {
                    const swayAmount = 0.05;
                    const swaySpeed = 1.5;
                    decoration.rotation.z = Math.sin(time * swaySpeed) * swayAmount;
                }
            });
        }
    }

    getObstacles() {
        return this.obstacles;
    }
    
    getGoals() {
        return this.goals;
    }
    
    // ===== LEVEL 1 METHODS (keeping existing city level intact) =====
    
    createPolishedCityFoundation() {
        const groundSize = 140;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const cityGround = new THREE.Mesh(groundGeometry, this.sharedMaterials.cityGround);
        cityGround.rotation.x = -Math.PI / 2;
        cityGround.position.set(0, -0.1, 0);
        cityGround.receiveShadow = true;
        this.decorations.push(cityGround);
        this.scene.add(cityGround);
    }
    
    createFullWidthStartingArea() {
        const grassGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const startGrass = new THREE.Mesh(grassGeometry, this.sharedMaterials.grass);
        startGrass.rotation.x = -Math.PI / 2;
        startGrass.position.set(0, 0, 16);
        startGrass.receiveShadow = true;
        this.terrain.push(startGrass);
        this.scene.add(startGrass);
    }
    

    
// In Level.js, update createLaneMarkings() to cover the new extended road:

// In Level.js, replace the createLaneMarkings() method:

createLaneMarkings() {
    // Update center line to match new road position (Z=8)
    const centerLineGeometry = new THREE.PlaneGeometry(this.screenWidth, 0.15);
    const centerLine = new THREE.Mesh(centerLineGeometry, this.sharedMaterials.yellowLine);
    centerLine.rotation.x = -Math.PI / 2;
    centerLine.position.set(0, 0.02, 8); // Road center at Z=8
    this.decorations.push(centerLine);
    this.scene.add(centerLine);
    
    const dashGeometry = new THREE.PlaneGeometry(1.2, 0.12);
    // FIXED: Keep lane markings ONLY on the road surface
    // Road covers Z=1 to Z=15 (height=14, center=8), so lanes should be at Z=3,5,7,9,11,13
    for (let lane = -2.5; lane <= 2.5; lane += 1) { // This creates lanes at Z=5.5,6.5,7.5,9.5,10.5
        if (lane === 0) continue; // Skip center line
        for (let i = -this.screenWidth/2; i < this.screenWidth/2; i += 3) {
            const laneZ = 8 + lane * 2; // Calculate actual Z position
            // Only create lane markings that are ON the road (Z=1 to Z=15)
            if (laneZ >= 1 && laneZ <= 15) {
                const dash = new THREE.Mesh(dashGeometry, this.sharedMaterials.whiteLine);
                dash.rotation.x = -Math.PI / 2;
                dash.position.set(i, 0.02, laneZ);
                this.decorations.push(dash);
                this.scene.add(dash);
            }
        }
    }
    
    console.log('✅ Lane markings fixed to stay only on road surface');
}

// And update createStableRiverLogs() to move logs away from the new median position:

// In Level.js, fix the river and log positions:

// 1. Make the river smaller and position it correctly (don't extend behind building)
createFullWidthRiverSection() {
    const extendedRiverWidth = this.screenWidth + 20;
    const riverGeometry = new THREE.PlaneGeometry(extendedRiverWidth, 12); // Back to 12 (was 18)
    const river = new THREE.Mesh(riverGeometry, this.sharedMaterials.water);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, -0.05, -8); // Back to Z=-8 (was Z=-11)
    this.terrain.push(river);
    this.scene.add(river);
    
    console.log('✅ River positioned correctly - covers Z=-14 to Z=-2');
}

// 2. Move logs DOWN to be in the visible blue water area
createStableRiverLogs() {
    // Move logs DOWN so they're in the blue water area visible near the street
    const riverLanes = [-12, -10, -8, -6, -4]; // Back to original positions
    const laneDirections = [-1, 1, -1, 1, -1];
    const laneSpeeds = [4.5, 2.2, 5.2, 2.9, 4.1];
    
    riverLanes.forEach((z, laneIndex) => {
        const direction = laneDirections[laneIndex];
        const speed = laneSpeeds[laneIndex];
        const numLogs = 6;
        const spacing = 14;
        
        for (let i = 0; i < numLogs; i++) {
            const log = new Log(this.scene);
            log.create();
            
            const bounds = this.screenWidth/2 + 10;
            const startX = direction > 0 ? 
                -bounds + (i * spacing) : 
                bounds - (i * spacing);
            
            log.setPosition(startX, 0.1, z);
            log.setVelocity(direction * speed, 0, 0);
            log.isStableLog = true;
            
            this.obstacles.push(log);
        }
    });
    
    console.log(`✅ Logs moved to correct positions: [${riverLanes.join(', ')}] - now in visible water area`);
}
// In Level.js, update the createSafeMedianStrip() method:

// 1. Make the median sidewalk smaller (move it down and make it narrower)
createSafeMedianStrip() {
    const medianGeometry = new THREE.PlaneGeometry(this.screenWidth, 3); // Reduced from 6 to 3
    const medianSidewalk = new THREE.Mesh(medianGeometry, this.sharedMaterials.sidewalk);
    medianSidewalk.rotation.x = -Math.PI / 2;
    medianSidewalk.position.set(0, 0.05, 0.5); // Moved down from Z=-2 to Z=-3.5
    medianSidewalk.receiveShadow = true;
    this.terrain.push(medianSidewalk);
    this.scene.add(medianSidewalk);
    
    console.log('✅ Sidewalk made smaller and moved down');
}

// And extend the road UP to cover where the median used to be:
createFullWidthRoadSection() {
    const roadGeometry = new THREE.PlaneGeometry(this.screenWidth, 14); // Increase height to 14
    const road = new THREE.Mesh(roadGeometry, this.sharedMaterials.road);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0, 8); // Move center up slightly to Z=8
    road.receiveShadow = true;
    this.terrain.push(road);
    this.scene.add(road);
    this.createLaneMarkings();
}
    

    
    // ✅ UPDATED: Use gflhq.png image instead of generated 3D letters, removed green glow
    createGoalBuildingArea() {
        const goalSidewalkGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const goalSidewalk = new THREE.Mesh(goalSidewalkGeometry, this.sharedMaterials.sidewalk);
        goalSidewalk.rotation.x = -Math.PI / 2;
        goalSidewalk.position.set(0, 0, -14);
        goalSidewalk.receiveShadow = true;
        this.terrain.push(goalSidewalk);
        this.scene.add(goalSidewalk);
        
        const goalBuildingGeometry = new THREE.BoxGeometry(12, 8, 4);
        const goalBuilding = new THREE.Mesh(goalBuildingGeometry, this.sharedMaterials.goalBuilding);
        goalBuilding.position.set(0, 4, -16);
        goalBuilding.castShadow = true;
        goalBuilding.receiveShadow = true;
        
        // ✅ NEW: Add gflhq.png image instead of 3D letters
        this.addGFLHQImage(goalBuilding);
        
        // ✅ REMOVED: Green glow box that was covering the building
        // const goalGlowGeometry = new THREE.PlaneGeometry(8, 2);
        // const goalGlow = new THREE.Mesh(goalGlowGeometry, this.sharedMaterials.goalGlow);
        // goalGlow.position.set(0, -1, 2.01);
        // goalBuilding.add(goalGlow);
        
        this.goals.push(goalBuilding);
        this.decorations.push(goalBuilding);
        this.scene.add(goalBuilding);
    }

    // ✅ NEW: Add GFLHQ image to building front
    async addGFLHQImage(building) {
        try {
            const gflhqTexture = await this.loadTexture('/gflhq.png');
            
            // ✅ VIBRANT IMAGE SETTINGS: Same as frog images for consistency
            gflhqTexture.colorSpace = THREE.SRGBColorSpace;
            gflhqTexture.generateMipmaps = false;
            gflhqTexture.minFilter = THREE.LinearFilter;
            gflhqTexture.magFilter = THREE.LinearFilter;
            
            const gflhqMaterial = new THREE.MeshBasicMaterial({
                map: gflhqTexture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,  // Prevents tone mapping that can wash out colors
                opacity: 1.0
            });
            
            // Size the image appropriately for the building front
            const imageWidth = 12;   // Fits nicely on 12-unit wide building
            const imageHeight = 6;  // Good proportions
            const gflhqGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
            const gflhqImage = new THREE.Mesh(gflhqGeometry, gflhqMaterial);
            
            // Position on the front face of the building
            gflhqImage.position.set(0.7, 0.8, 2.01); // Slightly in front of building face
            gflhqImage.castShadow = false;
            gflhqImage.receiveShadow = false;
            
            building.add(gflhqImage);
            console.log('✅ Added GFLHQ image to building');
            
        } catch (error) {
            console.warn('⚠️ Could not load gflhq.png, keeping building plain');
            // Building will just be plain blue without the image
        }
    }

    // ✅ SIMPLE INITIAL CREATION: Normal spacing, normal count
    createRoadVehicles() {
        const lanePositions = [13, 11, 9, 7, 5];
        const laneDirections = [1, -1, 1, -1, 1];
        const laneSpeeds = [9.5, 4.0, 3.5, 5.0, 7.8];
        
        lanePositions.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            const numVehicles = 8; // Back to normal
            const spacing = 18;    // Back to normal
            
            for (let i = 0; i < numVehicles; i++) {
                let vehicle;
                const random = Math.random();
                if (random < 0.35) {
                    vehicle = new Cybertruck(this.scene);
                } else if (random < 0.7) {
                    vehicle = new Taxi(this.scene);
                } else {
                    vehicle = new Bus(this.scene);
                }
                
                vehicle.create();
                
                const bounds = this.screenWidth/2 + 10;
                const startX = direction > 0 ? 
                    -bounds + (i * spacing) : 
                    bounds - (i * spacing);
                
                vehicle.setPosition(startX, 0.3, z);
                vehicle.setVelocity(direction * speed, 0, 0);
                this.obstacles.push(vehicle);
            }
        });
        
        console.log(`✅ Simple vehicle creation: ${this.obstacles.length} vehicles`);
    }
    
    createCornerBuildings() {
        const cornerBuildings = [
            { x: -35, z: -30, width: 12, height: 25, depth: 12, material: 'building1' },
            { x: 35, z: -30, width: 12, height: 22, depth: 12, material: 'building3' },
            { x: -35, z: 30, width: 14, height: 28, depth: 12, material: 'building2' },
            { x: 35, z: 30, width: 14, height: 24, depth: 12, material: 'building3' },
            { x: -45, z: -20, width: 8, height: 20, depth: 8, material: 'building1' },
            { x: -45, z: 0, width: 8, height: 24, depth: 8, material: 'building2' },
            { x: -45, z: 20, width: 8, height: 18, depth: 8, material: 'building3' },
            { x: 45, z: -20, width: 8, height: 22, depth: 8, material: 'building3' },
            { x: 45, z: 0, width: 8, height: 26, depth: 8, material: 'building1' },
            { x: 45, z: 20, width: 8, height: 19, depth: 8, material: 'building2' }
        ];
        
        cornerBuildings.forEach(building => {
            const buildingGeometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
            const buildingMesh = new THREE.Mesh(buildingGeometry, this.sharedMaterials[building.material]);
            buildingMesh.position.set(building.x, building.height/2, building.z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            
            this.addSimpleWindows(buildingMesh, building.width, building.height, building.depth);
            
            this.decorations.push(buildingMesh);
            this.scene.add(buildingMesh);
        });
    }
    
    createBackgroundCityBuildings() {
        const backgroundBuildings = [
            { x: -24, z: -22, width: 4, height: 8, depth: 4, material: 'building2' },
            { x: -20, z: -22, width: 3, height: 9, depth: 4, material: 'building1' },
            { x: -18, z: -22, width: 3, height: 9, depth: 4, material: 'building1' },
            { x: -15, z: -22, width: 3, height: 11, depth: 4, material: 'building3' },
            { x: -12, z: -22, width: 3, height: 12, depth: 4, material: 'building2' },
            { x: -9, z: -22, width: 3, height: 14, depth: 4, material: 'building1' },
            { x: -6, z: -22, width: 3, height: 16, depth: 4, material: 'building3' },
            { x: -3, z: -22, width: 3, height: 18, depth: 4, material: 'building2' },
            { x: 0, z: -22, width: 3, height: 17, depth: 4, material: 'building1' },
            { x: 3, z: -22, width: 3, height: 16, depth: 4, material: 'building3' },
            { x: 6, z: -22, width: 3, height: 15, depth: 4, material: 'building2' },
            { x: 9, z: -22, width: 3, height: 14, depth: 4, material: 'building1' },
            { x: 12, z: -22, width: 3, height: 13, depth: 4, material: 'building3' },
            { x: 15, z: -22, width: 3, height: 10, depth: 4, material: 'building2' },
            { x: 18, z: -22, width: 3, height: 8, depth: 4, material: 'building1' },
            { x: 20, z: -22, width: 3, height: 9, depth: 4, material: 'building3' },
            { x: 24, z: -22, width: 4, height: 7, depth: 4, material: 'building2' }
        ];
        
        backgroundBuildings.forEach(building => {
            const buildingGeometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
            const buildingMesh = new THREE.Mesh(buildingGeometry, this.sharedMaterials[building.material]);
            buildingMesh.position.set(building.x, building.height/2, building.z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            
            this.addSimpleWindows(buildingMesh, building.width, building.height, building.depth);
            
            this.decorations.push(buildingMesh);
            this.scene.add(buildingMesh);
        });
    }
    
    async createSidewalkTrees() {
        const sidewalkTreePositions = [
            { x: -this.playableWidth/2 - 3, z: -16 },
            { x: this.playableWidth/2 + 3, z: -16 }
        ];
        
        sidewalkTreePositions.forEach((pos, index) => {
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 1.5, pos.z);
            trunk.castShadow = true;
            
            const foliageSize = 2 + (index * 0.3);
            const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
            const foliage = new THREE.Mesh(foliageGeometry, this.sharedMaterials.foliage);
            foliage.position.set(pos.x, 4, pos.z);
            foliage.scale.set(1, 0.9, 1);
            foliage.castShadow = true;
            
            this.decorations.push(trunk);
            this.decorations.push(foliage);
            this.scene.add(trunk);
            this.scene.add(foliage);
        });
    }
    
    async createBottomGrassTrees() {
        const bottomGrassTreePositions = [
            { x: -25, z: 16 }, { x: -22, z: 14 }, { x: -28, z: 18 },
            { x: 25, z: 16 }, { x: 22, z: 14 }, { x: 28, z: 18 }
        ];
        
        bottomGrassTreePositions.forEach((pos, index) => {
            const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2.5, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 1.25, pos.z);
            trunk.castShadow = true;
            
            const foliageSize = 1.8 + (index % 3) * 0.2;
            const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
            const foliage = new THREE.Mesh(foliageGeometry, this.sharedMaterials.foliage);
            foliage.position.set(pos.x, 3.5, pos.z);
            foliage.scale.set(1, 0.85, 1);
            foliage.castShadow = true;
            
            this.decorations.push(trunk);
            this.decorations.push(foliage);
            this.scene.add(trunk);
            this.scene.add(foliage);
        });
    }
    async createEnhancedFroggerDecorations() {
        try {
            const pepeSoldierTexture = await this.loadTexture('/pepesoldier.png');
            
            // ✅ VIBRANT IMAGE SETTINGS: Consistent with other images
            pepeSoldierTexture.colorSpace = THREE.SRGBColorSpace;
            pepeSoldierTexture.generateMipmaps = false;
            pepeSoldierTexture.minFilter = THREE.LinearFilter;
            pepeSoldierTexture.magFilter = THREE.LinearFilter;
            
            const pepeSoldierMaterial = new THREE.MeshBasicMaterial({
                map: pepeSoldierTexture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,
                opacity: 1.0
            });
            
            const pepeSoldierGeometry = new THREE.PlaneGeometry(4, 4);
            
            const leftPepeSoldier = new THREE.Mesh(pepeSoldierGeometry, pepeSoldierMaterial.clone());
            leftPepeSoldier.position.set(-8, 2, -14);
            leftPepeSoldier.castShadow = false;
            leftPepeSoldier.receiveShadow = false;
            
            const rightPepeSoldier = new THREE.Mesh(pepeSoldierGeometry, pepeSoldierMaterial.clone());
            rightPepeSoldier.position.set(8, 2, -14);
            rightPepeSoldier.castShadow = false;
            rightPepeSoldier.receiveShadow = false;
            
            this.decorations.push(leftPepeSoldier);
            this.decorations.push(rightPepeSoldier);
            this.scene.add(leftPepeSoldier);
            this.scene.add(rightPepeSoldier);
            
            console.log('✅ Added Pepe Soldier decorations');
            
        } catch (error) {
            console.warn('⚠️ Could not load pepesoldier.png, using placeholder');
            this.createPlaceholderPepeSoldiers();
        }
    }
    
    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    console.log('✅ Texture loaded successfully');
                    resolve(texture);
                },
                (progress) => {
                    console.log('📥 Loading texture...', Math.round((progress.loaded / progress.total) * 100) + '%');
                },
                (error) => {
                    console.error('❌ Error loading texture:', error);
                    reject(error);
                }
            );
        });
    }
    
    createPlaceholderFroggers() {
        const placeholderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400,
            emissiveIntensity: 0.3
        });
        
        const placeholderGeometry = new THREE.BoxGeometry(3, 3, 3);
        
        const leftPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        leftPlaceholder.position.set(-8, 1.5, -16);
        leftPlaceholder.castShadow = false;
        leftPlaceholder.receiveShadow = false;
        
        const rightPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial.clone());
        rightPlaceholder.position.set(8, 1.5, -16);
        rightPlaceholder.castShadow = false;
        rightPlaceholder.receiveShadow = false;
        
        this.decorations.push(leftPlaceholder);
        this.decorations.push(rightPlaceholder);
        this.scene.add(leftPlaceholder);
        this.scene.add(rightPlaceholder);
    }
    
    addSimpleWindows(building, width, height, depth) {
        const windowRows = Math.floor(height / 3);
        const windowCols = Math.floor(width / 2);
        
        for (let row = 1; row < windowRows; row++) {
            for (let col = 0; col < windowCols; col++) {
                if (Math.random() > 0.4) {
                    const isLit = Math.random() > 0.5;
                    const windowGeometry = new THREE.PlaneGeometry(0.4, 0.6);
                    const windowMaterial = isLit ? this.sharedMaterials.windowLit : this.sharedMaterials.windowDark;
                    
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        (col - windowCols/2 + 0.5) * 1.2,
                        (row - windowRows/2) * 2.5,
                        depth/2 + 0.01
                    );
                    building.add(window);
                }
            }
        }
    }
}