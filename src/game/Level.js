// POLISHED CITY LEVEL - Enhanced with Frogger decorations
// 1. Subtle gray boundaries
// 2. Safe sidewalk strip between road and river  
// 3. Stable log physics - no unwanted movement
// 4. Building area as goal instead of lily pads
// 5. Static frogger.png images on sides of GFL building
// 6. Decorative trees at bottom corners

import * as THREE from 'three';
import { Car, Log, Turtle, Crocodile, Cybertruck, Taxi, Bus } from './Vehicle.js';

export class Level {
    constructor(scene, levelNumber, worldWidth, worldDepth) {
        this.scene = scene;
        this.levelNumber = levelNumber;
        this.worldWidth = worldWidth;
        this.worldDepth = worldDepth;
        
        // Screen dimensions
        this.screenWidth = 60;
        this.playableWidth = worldWidth;
        
        // Level objects
        this.terrain = [];
        this.obstacles = [];
        this.goals = [];
        this.decorations = [];
        
        // Cached materials
        this.sharedMaterials = Level.getSharedMaterials();
        
        // Texture loader for frogger images
        this.textureLoader = new THREE.TextureLoader();
        
        console.log(`🏗️ Enhanced Level ${levelNumber} manager created`);
    }
    
    static getSharedMaterials() {
        if (!Level._cachedMaterials) {
            console.log('🎨 Creating materials ONCE and caching forever...');
            
            Level._cachedMaterials = {
                // Core terrain
                grass: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                road: new THREE.MeshLambertMaterial({ color: 0x2a2a2a }),
                water: new THREE.MeshLambertMaterial({ color: 0x1a5490, transparent: true, opacity: 0.8 }),
                sidewalk: new THREE.MeshLambertMaterial({ color: 0xcccccc }),
                
                // City foundation
                cityGround: new THREE.MeshLambertMaterial({ color: 0x444444 }),
                
                // ✅ SUBTLE BOUNDARY MARKERS (much less obvious)
                boundaryMarker: new THREE.MeshLambertMaterial({ color: 0x999999, transparent: true, opacity: 0.3 }),
                
                // Lane markings
                yellowLine: new THREE.MeshLambertMaterial({ color: 0xFFFF00, emissive: 0x222200 }),
                whiteLine: new THREE.MeshLambertMaterial({ color: 0xFFFFFF, emissive: 0x111111 }),
                
                // Buildings
                building1: new THREE.MeshLambertMaterial({ color: 0x555555 }),
                building2: new THREE.MeshLambertMaterial({ color: 0x666666 }),
                building3: new THREE.MeshLambertMaterial({ color: 0x777777 }),
                
                // ✅ GOAL AREA (building zone)
                goalBuilding: new THREE.MeshLambertMaterial({ color: 0x4a90e2 }), // Blue goal building
                goalGlow: new THREE.MeshLambertMaterial({ 
                    color: 0x00ff88, 
                    emissive: 0x004422,
                    emissiveIntensity: 0.4
                }),
                
                // Trees
                trunk: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
                foliage: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                
                // Windows
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
            // Dispose textures if they exist
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
        console.log(`🏗️ Creating enhanced Level ${this.levelNumber}...`);
        
        switch (this.levelNumber) {
            case 1:
                await this.createLevel1_EnhancedCity();
                break;
            default:
                await this.createLevel1_EnhancedCity();
        }
        
        console.log(`✅ Enhanced Level ${this.levelNumber} created`);
    }
    
    async createLevel1_EnhancedCity() {
        console.log('🌆 Creating enhanced city Frogger with decorative elements');
        
        // Foundation
        this.createPolishedCityFoundation();
        
        // ✅ PROPER GAME LAYOUT WITH SAFE MEDIAN
        this.createStartingArea();           // Bottom: Starting grass
        this.createRoadSection();           // Road with cars
        this.createSafeMedianStrip();       // ✅ SAFE SIDEWALK between road & river
        this.createRiverSection();          // River with logs
        this.createGoalBuildingArea();      // ✅ TOP: Goal building area instead of lily pads
        
        // Obstacles
        this.createRoadVehicles();
        this.createStableRiverLogs();       // ✅ STABLE LOG PHYSICS
        
        // Environment
        this.createSubtleBoundaries();      // ✅ SUBTLE gray boundaries
        this.createCornerBuildings();
        this.createCornerTrees();
        
        // ✅ NEW: Enhanced decorations
        await this.createBottomTrees();     // Trees at bottom corners
        await this.createFroggerDecorations(); // Static frogger images by GFL building
        
        console.log('✅ Enhanced city created with frogger decorations and bottom trees');
    }
    
    createPolishedCityFoundation() {
        console.log('🏗️ Creating polished city foundation...');
        
        // Large city ground
        const groundSize = 120;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const cityGround = new THREE.Mesh(groundGeometry, this.sharedMaterials.cityGround);
        cityGround.rotation.x = -Math.PI / 2;
        cityGround.position.set(0, -0.1, 0);
        cityGround.receiveShadow = true;
        this.decorations.push(cityGround);
        this.scene.add(cityGround);
        
        console.log('✅ City foundation complete');
    }
    
    // ✅ SUBTLE BOUNDARY MARKERS (much smaller and transparent)
    createSubtleBoundaries() {
        console.log('🚧 Creating subtle boundary markers...');
        
        const boundaryWidth = 0.5; // Much smaller than before
        const playDepth = 36;
        
        // Left boundary - SUBTLE
        const leftBoundary = new THREE.PlaneGeometry(boundaryWidth, playDepth);
        const leftMarker = new THREE.Mesh(leftBoundary, this.sharedMaterials.boundaryMarker);
        leftMarker.rotation.x = -Math.PI / 2;
        leftMarker.position.set(-this.playableWidth/2 - 0.25, 0.01, 0);
        this.decorations.push(leftMarker);
        this.scene.add(leftMarker);
        
        // Right boundary - SUBTLE
        const rightBoundary = new THREE.PlaneGeometry(boundaryWidth, playDepth);
        const rightMarker = new THREE.Mesh(rightBoundary, this.sharedMaterials.boundaryMarker);
        rightMarker.rotation.x = -Math.PI / 2;
        rightMarker.position.set(this.playableWidth/2 + 0.25, 0.01, 0);
        this.decorations.push(rightMarker);
        this.scene.add(rightMarker);
        
        console.log('✅ Subtle boundaries created - much less obvious');
    }
    
    createStartingArea() {
        // Starting grass (full screen width)
        const grassGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const startGrass = new THREE.Mesh(grassGeometry, this.sharedMaterials.grass);
        startGrass.rotation.x = -Math.PI / 2;
        startGrass.position.set(0, 0, 14);
        startGrass.receiveShadow = true;
        this.terrain.push(startGrass);
        this.scene.add(startGrass);
        
        console.log('✅ Starting area created');
    }
    
    createRoadSection() {
        // Road (full screen width)
        const roadGeometry = new THREE.PlaneGeometry(this.screenWidth, 10);
        const road = new THREE.Mesh(roadGeometry, this.sharedMaterials.road);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 5);
        road.receiveShadow = true;
        this.terrain.push(road);
        this.scene.add(road);
        
        // Lane markings
        this.createLaneMarkings();
        
        console.log('✅ Road section created');
    }
    
    createLaneMarkings() {
        // Center line
        const centerLineGeometry = new THREE.PlaneGeometry(this.screenWidth, 0.15);
        const centerLine = new THREE.Mesh(centerLineGeometry, this.sharedMaterials.yellowLine);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.set(0, 0.02, 5);
        this.decorations.push(centerLine);
        this.scene.add(centerLine);
        
        // Dashed white lines
        const dashGeometry = new THREE.PlaneGeometry(1.2, 0.12);
        for (let lane = -1.5; lane <= 1.5; lane += 1) {
            if (lane === 0) continue;
            
            for (let i = -this.screenWidth/2; i < this.screenWidth/2; i += 3) {
                const dash = new THREE.Mesh(dashGeometry, this.sharedMaterials.whiteLine);
                dash.rotation.x = -Math.PI / 2;
                dash.position.set(i, 0.02, 5 + lane * 2);
                this.decorations.push(dash);
                this.scene.add(dash);
            }
        }
    }
    
    // ✅ SAFE MEDIAN STRIP - Wide path for left/right movement
    createSafeMedianStrip() {
        console.log('🚶 Creating wide safe median path for left/right movement...');
        
        // MUCH WIDER safe sidewalk strip (full screen width) for proper safe zone
        const medianGeometry = new THREE.PlaneGeometry(this.screenWidth, 6); // Made 6 units wide
        const medianSidewalk = new THREE.Mesh(medianGeometry, this.sharedMaterials.sidewalk);
        medianSidewalk.rotation.x = -Math.PI / 2;
        medianSidewalk.position.set(0, 0.05, -2); // Positioned between road and river
        medianSidewalk.receiveShadow = true;
        this.terrain.push(medianSidewalk);
        this.scene.add(medianSidewalk);
        
        console.log('✅ Wide safe median path created - frog can move left/right safely');
    }
    
    createRiverSection() {
        // River (full screen width) - MOVED FURTHER DOWN
        const riverGeometry = new THREE.PlaneGeometry(this.screenWidth, 8);
        const river = new THREE.Mesh(riverGeometry, this.sharedMaterials.water);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, -0.05, -8); // Moved further down for clear separation
        this.terrain.push(river);
        this.scene.add(river);
        
        console.log('✅ River section created with proper separation');
    }
    
    // ✅ GOAL BUILDING AREA with GFL letters
    createGoalBuildingArea() {
        console.log('🏢 Creating goal building area with GFL letters...');
        
        // Goal sidewalk area (full screen width)
        const goalSidewalkGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const goalSidewalk = new THREE.Mesh(goalSidewalkGeometry, this.sharedMaterials.sidewalk);
        goalSidewalk.rotation.x = -Math.PI / 2;
        goalSidewalk.position.set(0, 0, -14);
        goalSidewalk.receiveShadow = true;
        this.terrain.push(goalSidewalk);
        this.scene.add(goalSidewalk);
        
        // Goal building with glowing effect
        const goalBuildingGeometry = new THREE.BoxGeometry(12, 8, 4);
        const goalBuilding = new THREE.Mesh(goalBuildingGeometry, this.sharedMaterials.goalBuilding);
        goalBuilding.position.set(0, 4, -16);
        goalBuilding.castShadow = true;
        goalBuilding.receiveShadow = true;
        
        // ✅ ADD GFL LETTERS to building
        this.addGFLLetters(goalBuilding);
        
        // Add glowing goal indicator on building
        const goalGlowGeometry = new THREE.PlaneGeometry(8, 2);
        const goalGlow = new THREE.Mesh(goalGlowGeometry, this.sharedMaterials.goalGlow);
        goalGlow.position.set(0, -1, 2.01); // Below the letters
        goalBuilding.add(goalGlow);
        
        this.goals.push(goalBuilding); // This is what the frog needs to reach
        this.decorations.push(goalBuilding);
        this.scene.add(goalBuilding);
        
        console.log('✅ Goal building with GFL letters created');
    }
    
    // ✅ ADD PROPER GFL LETTERS to goal building
    addGFLLetters(building) {
        console.log('🔤 Adding proper GFL letters to goal building...');
        
        // Create text geometry for each letter
        const letterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            emissive: 0x444444,
            emissiveIntensity: 0.5
        });
        
        // Letter spacing and positioning
        const spacing = 2.5;
        const letterSize = 1.5;
        
        // Create G letter using simple geometry shapes
        this.createLetterG(building, -spacing, 1, 2.1, letterSize, letterMaterial);
        
        // Create F letter
        this.createLetterF(building, 0, 1, 2.1, letterSize, letterMaterial);
        
        // Create L letter
        this.createLetterL(building, spacing, 1, 2.1, letterSize, letterMaterial);
        
        console.log('✅ Proper GFL letters added to building');
    }
    
    createLetterG(building, x, y, z, size, material) {
        // G - Vertical left bar
        const gLeft = new THREE.BoxGeometry(0.3, size * 1.5, 0.2);
        const gLeftMesh = new THREE.Mesh(gLeft, material);
        gLeftMesh.position.set(x - size/3, y, z);
        building.add(gLeftMesh);
        
        // G - Top horizontal bar
        const gTop = new THREE.BoxGeometry(size, 0.3, 0.2);
        const gTopMesh = new THREE.Mesh(gTop, material);
        gTopMesh.position.set(x, y + size/2, z);
        building.add(gTopMesh);
        
        // G - Bottom horizontal bar
        const gBottom = new THREE.BoxGeometry(size, 0.3, 0.2);
        const gBottomMesh = new THREE.Mesh(gBottom, material);
        gBottomMesh.position.set(x, y - size/2, z);
        building.add(gBottomMesh);
        
        // G - Middle horizontal bar (shorter)
        const gMiddle = new THREE.BoxGeometry(size/2, 0.3, 0.2);
        const gMiddleMesh = new THREE.Mesh(gMiddle, material);
        gMiddleMesh.position.set(x + size/4, y - size/4, z);
        building.add(gMiddleMesh);
    }
    
    createLetterF(building, x, y, z, size, material) {
        // F - Vertical left bar
        const fLeft = new THREE.BoxGeometry(0.3, size * 1.5, 0.2);
        const fLeftMesh = new THREE.Mesh(fLeft, material);
        fLeftMesh.position.set(x - size/3, y, z);
        building.add(fLeftMesh);
        
        // F - Top horizontal bar
        const fTop = new THREE.BoxGeometry(size, 0.3, 0.2);
        const fTopMesh = new THREE.Mesh(fTop, material);
        fTopMesh.position.set(x, y + size/2, z);
        building.add(fTopMesh);
        
        // F - Middle horizontal bar
        const fMiddle = new THREE.BoxGeometry(size * 0.7, 0.3, 0.2);
        const fMiddleMesh = new THREE.Mesh(fMiddle, material);
        fMiddleMesh.position.set(x - size * 0.1, y, z);
        building.add(fMiddleMesh);
    }
    
    createLetterL(building, x, y, z, size, material) {
        // L - Vertical left bar
        const lLeft = new THREE.BoxGeometry(0.3, size * 1.5, 0.2);
        const lLeftMesh = new THREE.Mesh(lLeft, material);
        lLeftMesh.position.set(x - size/3, y, z);
        building.add(lLeftMesh);
        
        // L - Bottom horizontal bar
        const lBottom = new THREE.BoxGeometry(size, 0.3, 0.2);
        const lBottomMesh = new THREE.Mesh(lBottom, material);
        lBottomMesh.position.set(x, y - size/2, z);
        building.add(lBottomMesh);
    }
    
    // ✅ NEW: Create decorative trees at bottom corners by gray lines
    async createBottomTrees() {
        console.log('🌳 Creating decorative trees at bottom corners...');
        
        // Position trees near the gray boundary lines at the bottom
        const bottomTreePositions = [
            { x: -this.playableWidth/2 - 3, z: 16 }, // Left side of left gray line
            { x: this.playableWidth/2 + 3, z: 16 }   // Right side of right gray line
        ];
        
        bottomTreePositions.forEach((pos, index) => {
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 1.5, pos.z);
            trunk.castShadow = true;
            
            // Tree foliage - make it slightly different for each tree
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
        
        console.log('✅ Bottom corner trees created');
    }
    
    // ✅ NEW: Create static frogger decorations by GFL building
    async createFroggerDecorations() {
        console.log('🐸 Creating static frogger decorations by GFL building...');
        
        try {
            // Load frogger texture from public folder
            const froggerTexture = await this.loadTexture('/frogger.png');
            
            // Create material with the frogger texture
            const froggerMaterial = new THREE.MeshLambertMaterial({
                map: froggerTexture,
                transparent: true,
                alphaTest: 0.1
            });
            
            // Create geometry for the frogger sprites
            const froggerGeometry = new THREE.PlaneGeometry(2, 2);
            
            // Left side frogger
            const leftFrogger = new THREE.Mesh(froggerGeometry, froggerMaterial.clone());
            leftFrogger.position.set(-8, 2, -16); // Left side of GFL building
            leftFrogger.rotation.y = Math.PI / 4; // Slight angle for visual interest
            
            // Right side frogger
            const rightFrogger = new THREE.Mesh(froggerGeometry, froggerMaterial.clone());
            rightFrogger.position.set(8, 2, -16); // Right side of GFL building
            rightFrogger.rotation.y = -Math.PI / 4; // Opposite angle
            
            this.decorations.push(leftFrogger);
            this.decorations.push(rightFrogger);
            this.scene.add(leftFrogger);
            this.scene.add(rightFrogger);
            
            console.log('✅ Static frogger decorations created');
            
        } catch (error) {
            console.warn('⚠️ Could not load frogger.png texture:', error);
            console.log('Creating placeholder frogger decorations instead...');
            
            // Create simple green cube placeholders if texture fails to load
            this.createPlaceholderFroggers();
        }
    }
    
    // Helper method to load textures with promise
    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => {
                    console.log('✅ Frogger texture loaded successfully');
                    resolve(texture);
                },
                (progress) => {
                    console.log('📥 Loading frogger texture...', Math.round((progress.loaded / progress.total) * 100) + '%');
                },
                (error) => {
                    console.error('❌ Error loading frogger texture:', error);
                    reject(error);
                }
            );
        });
    }
    
    // Fallback method for placeholder froggers
    createPlaceholderFroggers() {
        console.log('🔄 Creating placeholder frogger decorations...');
        
        const placeholderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x002200
        });
        
        const placeholderGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        
        // Left placeholder
        const leftPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        leftPlaceholder.position.set(-8, 1.5, -16);
        
        // Right placeholder
        const rightPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial.clone());
        rightPlaceholder.position.set(8, 1.5, -16);
        
        this.decorations.push(leftPlaceholder);
        this.decorations.push(rightPlaceholder);
        this.scene.add(leftPlaceholder);
        this.scene.add(rightPlaceholder);
        
        console.log('✅ Placeholder frogger decorations created');
    }
    
    createRoadVehicles() {
        console.log('🚗 Creating road vehicles...');
        
        const lanePositions = [9, 7, 5, 3, 1];
        const laneDirections = [1, -1, 1, -1, 1];
        const laneSpeeds = [1.5, 2.0, 1.2, 2.5, 1.8];
        
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
        
        console.log(`✅ ${this.obstacles.length} vehicles created`);
    }
    
    // ✅ STABLE RIVER LOGS - Fixed physics, positioned for new layout
    createStableRiverLogs() {
        console.log('🪵 Creating stable river logs with fixed physics...');
        
        const riverLanes = [-12, -10, -8, -6, -4]; // Adjusted for new river position
        const laneDirections = [-1, 1, -1, 1, -1];
        const laneSpeeds = [1.0, 0.8, 1.2, 0.9, 1.1]; // Slower, more predictable speeds
        
        riverLanes.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            const numLogs = 3;
            
            for (let i = 0; i < numLogs; i++) {
                const log = new Log(this.scene);
                log.create();
                
                const spacing = 14; // More spaced out for easier gameplay
                const extendedBounds = this.screenWidth/2 + 10;
                const startX = direction > 0 ? 
                    -extendedBounds + (i * spacing) : 
                    extendedBounds - (i * spacing);
                
                log.setPosition(startX, 0.1, z);
                log.setVelocity(direction * speed, 0, 0);
                
                // ✅ MARK AS STABLE LOG for special physics handling
                log.isStableLog = true;
                
                this.obstacles.push(log);
            }
        });
        
        console.log('✅ Stable logs created with improved physics');
    }
    
    createCornerBuildings() {
        console.log('🏢 Creating corner buildings...');
        
        const cornerBuildings = [
            // Far corners - pushed way back
            { x: -25, z: -30, width: 8, height: 25, depth: 8, material: 'building1' },
            { x: 25, z: -30, width: 8, height: 22, depth: 8, material: 'building3' },
            { x: -25, z: 30, width: 10, height: 28, depth: 8, material: 'building2' },
            { x: 25, z: 30, width: 10, height: 24, depth: 8, material: 'building3' },
            
            // Side buildings
            { x: -35, z: -15, width: 6, height: 20, depth: 6, material: 'building1' },
            { x: -35, z: 0, width: 6, height: 24, depth: 6, material: 'building2' },
            { x: -35, z: 15, width: 6, height: 18, depth: 6, material: 'building3' },
            { x: 35, z: -15, width: 6, height: 22, depth: 6, material: 'building3' },
            { x: 35, z: 0, width: 6, height: 26, depth: 6, material: 'building1' },
            { x: 35, z: 15, width: 6, height: 19, depth: 6, material: 'building2' }
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
        
        console.log('✅ Corner buildings created');
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
    
    createCornerTrees() {
        console.log('🌳 Creating corner trees...');
        
        const cornerTreePositions = [
            [-20, 0, 25], [20, 0, 25],
            [-20, 0, -20], [20, 0, -20],
            [-28, 0, 10], [28, 0, 10],
            [-28, 0, -10], [28, 0, -10]
        ];
        
        cornerTreePositions.forEach(pos => {
            const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos[0], 1, pos[2]);
            trunk.castShadow = true;
            
            const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 6);
            const foliage = new THREE.Mesh(foliageGeometry, this.sharedMaterials.foliage);
            foliage.position.set(pos[0], 2.8, pos[2]);
            foliage.scale.set(1, 0.8, 1);
            foliage.castShadow = true;
            
            this.decorations.push(trunk);
            this.decorations.push(foliage);
            this.scene.add(trunk);
            this.scene.add(foliage);
        });
        
        console.log('✅ Corner trees created');
    }
    
    // ✅ ENHANCED UPDATE with stable log physics and frogger animations
    update(deltaTime) {
        // Update obstacles with stable log handling
        this.obstacles.forEach(obstacle => {
            obstacle.update(deltaTime);
            
            // Reset position for continuous flow
            const resetDistance = this.screenWidth/2 + 15;
            
            if (obstacle.velocity.x > 0 && obstacle.position.x > resetDistance) {
                obstacle.setPosition(-resetDistance, obstacle.position.y, obstacle.position.z);
            } else if (obstacle.velocity.x < 0 && obstacle.position.x < -resetDistance) {
                obstacle.setPosition(resetDistance, obstacle.position.y, obstacle.position.z);
            }
        });
        
        // Animate goal building glow
        const time = Date.now() * 0.001;
        this.goals.forEach(goalBuilding => {
            if (goalBuilding.children && goalBuilding.children[0]) {
                const glow = goalBuilding.children[0];
                glow.material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2;
            }
        });
        
        // ✅ NEW: Animate frogger decorations with subtle bobbing
        this.decorations.forEach(decoration => {
            // Check if this is a frogger decoration by looking for texture
            if (decoration.material && decoration.material.map && 
                decoration.material.map.image && 
                decoration.material.map.image.src && 
                decoration.material.map.image.src.includes('frogger.png')) {
                
                // Subtle bobbing animation
                const bobAmount = 0.1;
                const bobSpeed = 2;
                const originalY = decoration.userData.originalY || decoration.position.y;
                
                // Store original Y position if not already stored
                if (!decoration.userData.originalY) {
                    decoration.userData.originalY = decoration.position.y;
                }
                
                decoration.position.y = originalY + Math.sin(time * bobSpeed) * bobAmount;
            }
        });
    }
    
    getObstacles() {
        return this.obstacles;
    }
    
    getGoals() {
        return this.goals;
    }
}

// ✅ ENHANCED IMPROVEMENTS SUMMARY:
// 1. Subtle gray boundaries (0.5 width, 30% opacity vs thick obvious bars)
// 2. Safe median sidewalk strip between road and river
// 3. Stable log physics (marked with isStableLog flag for Game.js to handle)
// 4. Goal building area at top instead of lily pads
// 5. Slower, more predictable log speeds
// 6. Better spacing for easier gameplay
// 7. ✅ NEW: Static frogger.png images on left and right sides of GFL building
// 8. ✅ NEW: Decorative trees at bottom corners near gray boundary lines
// 9. ✅ NEW: Subtle bobbing animation for frogger decorations
// 10. ✅ NEW: Graceful fallback to placeholder cubes if texture fails to load