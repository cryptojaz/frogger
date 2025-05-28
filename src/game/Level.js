// REFINED CITY LEVEL - Enhanced with subtle improvements
// 1. Full-width grass extending to bottom edge
// 2. Repositioned trees from water to sidewalk
// 3. Larger, lower-positioned frog decorations
// 4. Full-screen width for all terrain sections
// 5. Corner buildings to eliminate blue gaps
// 6. Streamlined code without added complexity

import * as THREE from 'three';
import { Car, Log, Turtle, Crocodile, Cybertruck, Taxi, Bus } from './Vehicle.js';

export class Level {
    constructor(scene, levelNumber, worldWidth, worldDepth) {
        this.scene = scene;
        this.levelNumber = levelNumber;
        this.worldWidth = worldWidth;
        this.worldDepth = worldDepth;
        
        // Screen dimensions - extended for seamless feel
        this.screenWidth = 80; // Increased for full coverage
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
                
                // Subtle boundary markers
                boundaryMarker: new THREE.MeshLambertMaterial({ color: 0x999999, transparent: true, opacity: 0.3 }),
                
                // Lane markings
                yellowLine: new THREE.MeshLambertMaterial({ color: 0xFFFF00, emissive: 0x222200 }),
                whiteLine: new THREE.MeshLambertMaterial({ color: 0xFFFFFF, emissive: 0x111111 }),
                
                // Buildings
                building1: new THREE.MeshLambertMaterial({ color: 0x555555 }),
                building2: new THREE.MeshLambertMaterial({ color: 0x666666 }),
                building3: new THREE.MeshLambertMaterial({ color: 0x777777 }),
                
                // Goal area
                goalBuilding: new THREE.MeshLambertMaterial({ color: 0x4a90e2 }),
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
        console.log(`🏗️ Creating refined Level ${this.levelNumber}...`);
        
        switch (this.levelNumber) {
            case 1:
                await this.createLevel1_RefinedCity();
                break;
            default:
                await this.createLevel1_RefinedCity();
        }
        
        console.log(`✅ Refined Level ${this.levelNumber} created`);
    }
    
    async createLevel1_RefinedCity() {
        console.log('🌆 Creating refined city Frogger');
        
        // Foundation
        this.createPolishedCityFoundation();
        
        // Game layout with full-width sections
        this.createFullWidthStartingArea();    // Extended grass to bottom
        this.createFullWidthRoadSection();     // Full-width road
        this.createSafeMedianStrip();          // Safe zone with relocated trees
        this.createFullWidthRiverSection();    // Full-width river
        this.createGoalBuildingArea();         // Goal area
        
        // Obstacles
        this.createRoadVehicles();
        this.createStableRiverLogs();
        
        // Environment enhancements
        this.createSubtleBoundaries();
        this.createCornerBuildings();          // Enhanced to fill blue gaps
        this.createBackgroundCityBuildings();  // City buildings behind GFL building
        
        // Decorative elements
        await this.createSidewalkTrees();      // Moved from water to sidewalk
        await this.createBottomGrassTrees();   // Trees on grass sides
        await this.createEnhancedFroggerDecorations(); // Larger, lower frogs
        
        console.log('✅ Refined city created with seamless coverage');
    }
    
    createPolishedCityFoundation() {
        console.log('🏗️ Creating seamless city foundation...');
        
        // Extended city ground for complete coverage
        const groundSize = 140;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const cityGround = new THREE.Mesh(groundGeometry, this.sharedMaterials.cityGround);
        cityGround.rotation.x = -Math.PI / 2;
        cityGround.position.set(0, -0.1, 0);
        cityGround.receiveShadow = true;
        this.decorations.push(cityGround);
        this.scene.add(cityGround);
        
        console.log('✅ Seamless city foundation complete');
    }
    
    createSubtleBoundaries() {
        console.log('🚧 Creating subtle boundary markers...');
        
        const boundaryWidth = 0.5;
        const playDepth = 36;
        
        // Left boundary
        const leftBoundary = new THREE.PlaneGeometry(boundaryWidth, playDepth);
        const leftMarker = new THREE.Mesh(leftBoundary, this.sharedMaterials.boundaryMarker);
        leftMarker.rotation.x = -Math.PI / 2;
        leftMarker.position.set(-this.playableWidth/2 - 0.25, 0.01, 0);
        this.decorations.push(leftMarker);
        this.scene.add(leftMarker);
        
        // Right boundary
        const rightBoundary = new THREE.PlaneGeometry(boundaryWidth, playDepth);
        const rightMarker = new THREE.Mesh(rightBoundary, this.sharedMaterials.boundaryMarker);
        rightMarker.rotation.x = -Math.PI / 2;
        rightMarker.position.set(this.playableWidth/2 + 0.25, 0.01, 0);
        this.decorations.push(rightMarker);
        this.scene.add(rightMarker);
        
        console.log('✅ Subtle boundaries created');
    }
    
    // 1. Full-width grass extending to bottom edge
    createFullWidthStartingArea() {
        console.log('🌱 Creating full-width grass extending to bottom...');
        
        const grassGeometry = new THREE.PlaneGeometry(this.screenWidth, 6); // Extended height
        const startGrass = new THREE.Mesh(grassGeometry, this.sharedMaterials.grass);
        startGrass.rotation.x = -Math.PI / 2;
        startGrass.position.set(0, 0, 15); // Moved up to extend to bottom
        startGrass.receiveShadow = true;
        this.terrain.push(startGrass);
        this.scene.add(startGrass);
        
        console.log('✅ Full-width starting grass created');
    }
    
    // 4. Full-width road spanning entire screen
    createFullWidthRoadSection() {
        console.log('🛣️ Creating full-width road section...');
        
        const roadGeometry = new THREE.PlaneGeometry(this.screenWidth, 10);
        const road = new THREE.Mesh(roadGeometry, this.sharedMaterials.road);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 5);
        road.receiveShadow = true;
        this.terrain.push(road);
        this.scene.add(road);
        
        this.createLaneMarkings();
        
        console.log('✅ Full-width road section created');
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
    
    createSafeMedianStrip() {
        console.log('🚶 Creating safe median with relocated trees...');
        
        const medianGeometry = new THREE.PlaneGeometry(this.screenWidth, 6);
        const medianSidewalk = new THREE.Mesh(medianGeometry, this.sharedMaterials.sidewalk);
        medianSidewalk.rotation.x = -Math.PI / 2;
        medianSidewalk.position.set(0, 0.05, -2);
        medianSidewalk.receiveShadow = true;
        this.terrain.push(medianSidewalk);
        this.scene.add(medianSidewalk);
        
        console.log('✅ Safe median strip created');
    }
    
    // 3. Extended river to full screen width
    createFullWidthRiverSection() {
        console.log('🌊 Creating extended full-width river section...');
        
        // Make river even wider than screen width to ensure full coverage
        const extendedRiverWidth = this.screenWidth + 20; // Extra width for seamless edges
        const riverGeometry = new THREE.PlaneGeometry(extendedRiverWidth, 8);
        const river = new THREE.Mesh(riverGeometry, this.sharedMaterials.water);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, -0.05, -8);
        this.terrain.push(river);
        this.scene.add(river);
        
        console.log('✅ Extended full-width river section created');
    }
    
    createGoalBuildingArea() {
        console.log('🏢 Creating goal building area...');
        
        const goalSidewalkGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const goalSidewalk = new THREE.Mesh(goalSidewalkGeometry, this.sharedMaterials.sidewalk);
        goalSidewalk.rotation.x = -Math.PI / 2;
        goalSidewalk.position.set(0, 0, -14);
        goalSidewalk.receiveShadow = true;
        this.terrain.push(goalSidewalk);
        this.scene.add(goalSidewalk);
        
        // Goal building with GFL letters
        const goalBuildingGeometry = new THREE.BoxGeometry(12, 8, 4);
        const goalBuilding = new THREE.Mesh(goalBuildingGeometry, this.sharedMaterials.goalBuilding);
        goalBuilding.position.set(0, 4, -16);
        goalBuilding.castShadow = true;
        goalBuilding.receiveShadow = true;
        
        this.addGFLLetters(goalBuilding);
        
        // Glowing goal indicator
        const goalGlowGeometry = new THREE.PlaneGeometry(8, 2);
        const goalGlow = new THREE.Mesh(goalGlowGeometry, this.sharedMaterials.goalGlow);
        goalGlow.position.set(0, -1, 2.01);
        goalBuilding.add(goalGlow);
        
        this.goals.push(goalBuilding);
        this.decorations.push(goalBuilding);
        this.scene.add(goalBuilding);
        
        console.log('✅ Goal building area created');
    }
    
    addGFLLetters(building) {
        const letterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            emissive: 0x444444,
            emissiveIntensity: 0.5
        });
        
        const spacing = 2.5;
        const letterSize = 1.5;
        
        // Main GFL letters
        this.createLetterG(building, -spacing, 1, 2.1, letterSize, letterMaterial);
        this.createLetterF(building, 0, 1, 2.1, letterSize, letterMaterial);
        this.createLetterL(building, spacing, 1, 2.1, letterSize, letterMaterial);
        
        // Add HQ letters below in green area - make Q same size as H
        const smallLetterSize = 1.2; // Increased from 1.0 for better visibility
        const hqSpacing = 1.8; // Slightly wider spacing for larger Q
        
        this.createLetterH(building, -hqSpacing/2, -1.5, 2.1, smallLetterSize, letterMaterial);
        this.createLetterQ(building, hqSpacing/2, -1.5, 2.1, smallLetterSize, letterMaterial);
    }
    
    createLetterG(building, x, y, z, size, material) {
        const gLeft = new THREE.BoxGeometry(0.3, size * 1.5, 0.2);
        const gLeftMesh = new THREE.Mesh(gLeft, material);
        gLeftMesh.position.set(x - size/3, y, z);
        building.add(gLeftMesh);
        
        const gTop = new THREE.BoxGeometry(size, 0.3, 0.2);
        const gTopMesh = new THREE.Mesh(gTop, material);
        gTopMesh.position.set(x, y + size/2, z);
        building.add(gTopMesh);
        
        const gBottom = new THREE.BoxGeometry(size, 0.3, 0.2);
        const gBottomMesh = new THREE.Mesh(gBottom, material);
        gBottomMesh.position.set(x, y - size/2, z);
        building.add(gBottomMesh);
        
        const gMiddle = new THREE.BoxGeometry(size/2, 0.3, 0.2);
        const gMiddleMesh = new THREE.Mesh(gMiddle, material);
        gMiddleMesh.position.set(x + size/4, y - size/4, z);
        building.add(gMiddleMesh);
    }
    
    createLetterF(building, x, y, z, size, material) {
        const fLeft = new THREE.BoxGeometry(0.3, size * 1.5, 0.2);
        const fLeftMesh = new THREE.Mesh(fLeft, material);
        fLeftMesh.position.set(x - size/3, y, z);
        building.add(fLeftMesh);
        
        const fTop = new THREE.BoxGeometry(size, 0.3, 0.2);
        const fTopMesh = new THREE.Mesh(fTop, material);
        fTopMesh.position.set(x, y + size/2, z);
        building.add(fTopMesh);
        
        const fMiddle = new THREE.BoxGeometry(size * 0.7, 0.3, 0.2);
        const fMiddleMesh = new THREE.Mesh(fMiddle, material);
        fMiddleMesh.position.set(x - size * 0.1, y, z);
        building.add(fMiddleMesh);
    }
    
    createLetterL(building, x, y, z, size, material) {
        const lLeft = new THREE.BoxGeometry(0.3, size * 1.5, 0.2);
        const lLeftMesh = new THREE.Mesh(lLeft, material);
        lLeftMesh.position.set(x - size/3, y, z);
        building.add(lLeftMesh);
        
        const lBottom = new THREE.BoxGeometry(size, 0.3, 0.2);
        const lBottomMesh = new THREE.Mesh(lBottom, material);
        lBottomMesh.position.set(x, y - size/2, z);
        building.add(lBottomMesh);
    }
    
    // 1. Trees moved to GFL building row (same z-position)
    async createSidewalkTrees() {
        console.log('🌳 Creating trees on GFL building row...');
        
        const sidewalkTreePositions = [
            { x: -this.playableWidth/2 - 3, z: -16 }, // Left side, same row as GFL building
            { x: this.playableWidth/2 + 3, z: -16 }   // Right side, same row as GFL building
        ];
        
        sidewalkTreePositions.forEach((pos, index) => {
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 3, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 1.5, pos.z);
            trunk.castShadow = true;
            
            // Tree foliage
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
        
        console.log('✅ Trees moved to GFL building row');
    }
    
    // 1. City buildings behind GFL building (ultra-comprehensive coverage)
    createBackgroundCityBuildings() {
        console.log('🏙️ Creating ultra-comprehensive background city buildings...');
        
        const backgroundBuildings = [
            // First row - ultra wall-to-wall coverage
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
            { x: 24, z: -22, width: 4, height: 7, depth: 4, material: 'building2' },
            
            // Second row - extended coverage
            { x: -20, z: -28, width: 5, height: 13, depth: 5, material: 'building1' },
            { x: -15, z: -28, width: 5, height: 15, depth: 5, material: 'building3' },
            { x: -10, z: -28, width: 5, height: 18, depth: 5, material: 'building2' },
            { x: -5, z: -28, width: 5, height: 20, depth: 5, material: 'building1' },
            { x: 0, z: -28, width: 5, height: 22, depth: 5, material: 'building3' },
            { x: 5, z: -28, width: 5, height: 19, depth: 5, material: 'building2' },
            { x: 10, z: -28, width: 5, height: 17, depth: 5, material: 'building1' },
            { x: 15, z: -28, width: 5, height: 14, depth: 5, material: 'building3' },
            { x: 20, z: -28, width: 5, height: 12, depth: 5, material: 'building2' },
            
            // Third row for complete city depth
            { x: -18, z: -35, width: 6, height: 21, depth: 6, material: 'building3' },
            { x: -12, z: -35, width: 6, height: 23, depth: 6, material: 'building2' },
            { x: -6, z: -35, width: 6, height: 26, depth: 6, material: 'building1' },
            { x: 0, z: -35, width: 6, height: 28, depth: 6, material: 'building3' },
            { x: 6, z: -35, width: 6, height: 25, depth: 6, material: 'building2' },
            { x: 12, z: -35, width: 6, height: 21, depth: 6, material: 'building1' },
            { x: 18, z: -35, width: 6, height: 19, depth: 6, material: 'building3' },
            
            // Fourth row - far background for complete coverage
            { x: -15, z: -42, width: 8, height: 30, depth: 8, material: 'building1' },
            { x: -5, z: -42, width: 8, height: 32, depth: 8, material: 'building2' },
            { x: 5, z: -42, width: 8, height: 31, depth: 8, material: 'building3' },
            { x: 15, z: -42, width: 8, height: 29, depth: 8, material: 'building1' }
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
        
        console.log('✅ Ultra-comprehensive background city buildings created - complete coverage');
    }
    
    // 2. Trees on bottom grass section sides
    async createBottomGrassTrees() {
        console.log('🌳 Creating trees on bottom grass section...');
        
        const bottomGrassTreePositions = [
            // Left side trees
            { x: -25, z: 16 },
            { x: -22, z: 14 },
            { x: -28, z: 18 },
            
            // Right side trees
            { x: 25, z: 16 },
            { x: 22, z: 14 },
            { x: 28, z: 18 }
        ];
        
        bottomGrassTreePositions.forEach((pos, index) => {
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.25, 0.35, 2.5, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 1.25, pos.z);
            trunk.castShadow = true;
            
            // Tree foliage - vary sizes
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
        
        console.log('✅ Bottom grass trees created');
    }
    
    // Forward-facing, shadow-free frog decorations
    async createEnhancedFroggerDecorations() {
        console.log('🐸 Creating forward-facing, shadow-free frogger decorations...');
        
        try {
            const froggerTexture = await this.loadTexture('/frogger.png');
            
            const froggerMaterial = new THREE.MeshLambertMaterial({
                map: froggerTexture,
                transparent: true,
                alphaTest: 0.1,
                // Enhanced lighting to eliminate shadows
                emissive: 0x004400,
                emissiveIntensity: 0.3
            });
            
            // Even larger geometry for better visibility
            const froggerGeometry = new THREE.PlaneGeometry(4, 4);
            
            // Both frogs facing forward (no rotation)
            const leftFrogger = new THREE.Mesh(froggerGeometry, froggerMaterial.clone());
            leftFrogger.position.set(-8, 1, -16);
            // No rotation - facing forward
            
            const rightFrogger = new THREE.Mesh(froggerGeometry, froggerMaterial.clone());
            rightFrogger.position.set(8, 1, -16);
            // No rotation - facing forward
            
            // Disable shadow casting/receiving to eliminate shadows
            leftFrogger.castShadow = false;
            leftFrogger.receiveShadow = false;
            rightFrogger.castShadow = false;
            rightFrogger.receiveShadow = false;
            
            this.decorations.push(leftFrogger);
            this.decorations.push(rightFrogger);
            this.scene.add(leftFrogger);
            this.scene.add(rightFrogger);
            
            console.log('✅ Forward-facing, shadow-free frogger decorations created');
            
        } catch (error) {
            console.warn('⚠️ Could not load frogger.png texture:', error);
            this.createPlaceholderFroggers();
        }
    }
    
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
    
    createPlaceholderFroggers() {
        console.log('🔄 Creating forward-facing placeholder frogger decorations...');
        
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
        
        console.log('✅ Forward-facing placeholder frogger decorations created');
    }
    
    createRoadVehicles() {
        console.log('🚗 Creating road vehicles...');
        
        const lanePositions = [9, 7, 5, 3, 1];
        const laneDirections = [1, -1, 1, -1, 1];
        // 2. Make last two rows (closest to river) move faster
        const laneSpeeds = [1.5, 2.0, 3.5, 4.0, 1.8]; // Increased speeds for lanes at z=5 and z=3
        
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
        
        console.log(`✅ ${this.obstacles.length} vehicles created with faster speeds near river`);
    }
    
    createStableRiverLogs() {
        console.log('🪵 Creating stable river logs...');
        
        const riverLanes = [-12, -10, -8, -6, -4];
        const laneDirections = [-1, 1, -1, 1, -1];
        // 1. Make first two rows (closest to GFL building) move faster
        const laneSpeeds = [2.5, 2.2, 1.2, 0.9, 1.1]; // Increased speeds for z=-12 and z=-10
        
        riverLanes.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            const numLogs = 3;
            
            for (let i = 0; i < numLogs; i++) {
                const log = new Log(this.scene);
                log.create();
                
                const spacing = 14;
                const extendedBounds = this.screenWidth/2 + 10;
                const startX = direction > 0 ? 
                    -extendedBounds + (i * spacing) : 
                    extendedBounds - (i * spacing);
                
                log.setPosition(startX, 0.1, z);
                log.setVelocity(direction * speed, 0, 0);
                log.isStableLog = true;
                
                this.obstacles.push(log);
            }
        });
        
        console.log('✅ Stable logs created with faster speeds near GFL building');
    }
    
    // 5. Enhanced corner buildings to fill blue gaps
    createCornerBuildings() {
        console.log('🏢 Creating enhanced corner buildings to fill gaps...');
        
        const cornerBuildings = [
            // Back corners - larger to fill blue gaps
            { x: -35, z: -30, width: 12, height: 25, depth: 12, material: 'building1' },
            { x: 35, z: -30, width: 12, height: 22, depth: 12, material: 'building3' },
            { x: -35, z: 30, width: 14, height: 28, depth: 12, material: 'building2' },
            { x: 35, z: 30, width: 14, height: 24, depth: 12, material: 'building3' },
            
            // Additional buildings to completely fill corner gaps
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
        
        console.log('✅ Enhanced corner buildings created - gaps filled');
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
    
    createLetterH(building, x, y, z, size, material) {
        // H - Left vertical bar
        const hLeft = new THREE.BoxGeometry(0.25, size * 1.2, 0.2);
        const hLeftMesh = new THREE.Mesh(hLeft, material);
        hLeftMesh.position.set(x - size/3, y, z);
        building.add(hLeftMesh);
        
        // H - Right vertical bar
        const hRight = new THREE.BoxGeometry(0.25, size * 1.2, 0.2);
        const hRightMesh = new THREE.Mesh(hRight, material);
        hRightMesh.position.set(x + size/3, y, z);
        building.add(hRightMesh);
        
        // H - Middle horizontal bar
        const hMiddle = new THREE.BoxGeometry(size * 0.8, 0.25, 0.2);
        const hMiddleMesh = new THREE.Mesh(hMiddle, material);
        hMiddleMesh.position.set(x, y, z);
        building.add(hMiddleMesh);
    }
    
    createLetterQ(building, x, y, z, size, material) {
        // Q - Outer circle with thicker segments for better visibility
        const segments = 20; // More segments for smoother circle
        const thickness = 0.25; // Thicker segments
        
        for (let i = 0; i < segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const nextAngle = ((i + 1) / segments) * Math.PI * 2;
            
            const radius = size * 0.45; // Slightly larger radius
            const x1 = Math.cos(angle) * radius;
            const y1 = Math.sin(angle) * radius;
            const x2 = Math.cos(nextAngle) * radius;
            const y2 = Math.sin(nextAngle) * radius;
            
            const segmentLength = Math.sqrt((x2-x1)**2 + (y2-y1)**2);
            const segmentAngle = Math.atan2(y2-y1, x2-x1);
            
            const segment = new THREE.BoxGeometry(segmentLength, thickness, 0.2);
            const segmentMesh = new THREE.Mesh(segment, material);
            segmentMesh.position.set(x + (x1+x2)/2, y + (y1+y2)/2, z);
            segmentMesh.rotation.z = segmentAngle;
            building.add(segmentMesh);
        }
        
        // Q - Tail (larger diagonal line)
        const qTail = new THREE.BoxGeometry(size * 0.4, thickness, 0.2); // Longer tail
        const qTailMesh = new THREE.Mesh(qTail, material);
        qTailMesh.position.set(x + size * 0.25, y - size * 0.25, z);
        qTailMesh.rotation.z = -Math.PI / 4; // 45 degree angle
        building.add(qTailMesh);
    }
    
    update(deltaTime) {
        // Update obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.update(deltaTime);
            
            // 3. FIXED: More robust reset logic to prevent disappearing obstacles
            const resetDistance = this.screenWidth/2 + 15;
            const spawnDistance = this.screenWidth/2 + 20; // Spawn further out
            
            if (obstacle.velocity.x > 0 && obstacle.position.x > resetDistance) {
                // Moving right, reset to left spawn point
                obstacle.setPosition(-spawnDistance, obstacle.position.y, obstacle.position.z);
            } else if (obstacle.velocity.x < 0 && obstacle.position.x < -resetDistance) {
                // Moving left, reset to right spawn point  
                obstacle.setPosition(spawnDistance, obstacle.position.y, obstacle.position.z);
            }
            
            // 3. ADDITIONAL: Force respawn if obstacle gets too far off screen (failsafe)
            const maxAllowedDistance = this.screenWidth/2 + 30;
            if (Math.abs(obstacle.position.x) > maxAllowedDistance) {
                const direction = obstacle.velocity.x > 0 ? -1 : 1;
                obstacle.setPosition(direction * spawnDistance, obstacle.position.y, obstacle.position.z);
                console.log(`🔄 Respawned ${obstacle.type} that went too far off screen`);
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
        
        // Animate frogger decorations with subtle bobbing
        this.decorations.forEach(decoration => {
            if (decoration.material && decoration.material.map && 
                decoration.material.map.image && 
                decoration.material.map.image.src && 
                decoration.material.map.image.src.includes('frogger.png')) {
                
                const bobAmount = 0.1;
                const bobSpeed = 2;
                const originalY = decoration.userData.originalY || decoration.position.y;
                
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