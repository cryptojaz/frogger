import * as THREE from 'three';

// OLD IMPORT (causing the error):
// import { Car, Log, Turtle, Crocodile, Vine, Hovercar, Laser, Iceberg, Penguin, Cloud, Bird, Cybertruck } from './Vehicle.js';

// NEW IMPORT (fixed):
import { Car, Log, Turtle, Crocodile, Cybertruck, Taxi, Bus } from './Vehicle.js';


// The rest of your Level.js file stays exactly the same!
// Just replace that first import line with the new one above.
export class Level {
    constructor(scene, levelNumber, worldWidth, worldDepth) {
        this.scene = scene;
        this.levelNumber = levelNumber;
        this.worldWidth = worldWidth;
        this.worldDepth = worldDepth;
        
        // Level objects
        this.terrain = [];
        this.obstacles = [];
        this.goals = [];
        this.decorations = [];
        this.particles = [];
        this.clouds = [];
        
        // Shared materials for memory efficiency
        this.sharedMaterials = Level.getSharedMaterials();
        
        console.log(`🏗️ Level ${levelNumber} manager created`);
    }
    
    // Static method for shared materials (memory efficient)
    static getSharedMaterials() {
        if (!Level._sharedMaterials) {
            Level._sharedMaterials = {
                // Level 1: Classic Frogger
                grass: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                road: new THREE.MeshLambertMaterial({ color: 0x2a2a2a }),
                water: new THREE.MeshLambertMaterial({ color: 0x1a5490, transparent: true, opacity: 0.8 }),
                sidewalk: new THREE.MeshLambertMaterial({ color: 0xcccccc }),
                lilyPad: new THREE.MeshLambertMaterial({ color: 0x32CD32 }),
                
                // Level 2: Jungle Swamp
                mud: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
                swampWater: new THREE.MeshLambertMaterial({ color: 0x556B2F, transparent: true, opacity: 0.9 }),
                
                // Level 3: Futuristic City
                metal: new THREE.MeshLambertMaterial({ color: 0x666666 }),
                neon: new THREE.MeshLambertMaterial({ color: 0x00ffff, emissive: 0x003333 }),
                
                // Level 4: Arctic Tundra
                snow: new THREE.MeshLambertMaterial({ color: 0xFFFAFA }),
                ice: new THREE.MeshLambertMaterial({ color: 0xE0FFFF, transparent: true, opacity: 0.7 }),
                
                // Level 5: Sky Ruins
                stone: new THREE.MeshLambertMaterial({ color: 0x708090 }),
                sky: new THREE.MeshLambertMaterial({ color: 0x87CEEB, transparent: true, opacity: 0.6 })
            };
        }
        return Level._sharedMaterials;
    }
    
    async create() {
        console.log(`🏗️ Creating Level ${this.levelNumber}...`);
        
        switch (this.levelNumber) {
            case 1:
                await this.createLevel1_ClassicFrogger();
                break;
            case 2:
                await this.createLevel2_JungleSwamp();
                break;
            case 3:
                await this.createLevel3_FuturisticCity();
                break;
            case 4:
                await this.createLevel4_ArcticTundra();
                break;
            case 5:
                await this.createLevel5_SkyRuins();
                break;
            default:
                await this.createLevel1_ClassicFrogger(); // Fallback
        }
        
        console.log(`✅ Level ${this.levelNumber} created successfully`);
    }
    
    // COMPLETE CITY Level 1: Homage to Original 1981 Frogger with FULL URBAN ENVIRONMENT
    async createLevel1_ClassicFrogger() {
        console.log('🐸 Creating COMPLETE CITY Level 1: Classic Frogger with Full Urban Environment');
        
        // Setup dramatic lighting first
        this.setupDramaticLighting();
        
        // Create basic terrain
        this.createStartingArea();
        this.createRoadSection();
        this.createMedianStrip();
        this.createRiverSection();
        this.createGoalArea();
        
        // Create obstacles
        this.createRoadVehicles();
        this.createRiverObjects();
        
        // CREATE COMPLETE URBAN ENVIRONMENT
        this.createCompleteUrbanEnvironment();
        
        // Add atmospheric effects
        this.addAtmosphericEffects();
        
        console.log('🌆 COMPLETE urban Frogger level with full cityscape created!');
    }
    
    setupDramaticLighting() {
        // Ambient light for overall illumination
        const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
        this.scene.add(ambientLight);
        
        // Main directional light (sun)
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(15, 25, 10);
        directionalLight.target.position.set(0, 0, 0);
        directionalLight.castShadow = true;
        
        // Optimize shadow map for better quality
        directionalLight.shadow.mapSize.width = 2048;
        directionalLight.shadow.mapSize.height = 2048;
        directionalLight.shadow.camera.near = 0.5;
        directionalLight.shadow.camera.far = 60;
        directionalLight.shadow.camera.left = -20;
        directionalLight.shadow.camera.right = 20;
        directionalLight.shadow.camera.top = 20;
        directionalLight.shadow.camera.bottom = -20;
        
        this.scene.add(directionalLight);
        this.scene.add(directionalLight.target);
        
        // Add city ambient glow
        const cityGlow = new THREE.AmbientLight(0xffa500, 0.15);
        this.scene.add(cityGlow);
        
        console.log('💡 Dramatic lighting setup complete');
    }
    
    createStartingArea() {
        // Starting grass strip
        const grassGeometry = new THREE.PlaneGeometry(this.worldWidth, 4);
        const grassMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        
        const startGrass = new THREE.Mesh(grassGeometry, grassMaterial);
        startGrass.rotation.x = -Math.PI / 2;
        startGrass.position.set(0, 0, 14);
        startGrass.receiveShadow = true;
        this.terrain.push(startGrass);
        this.scene.add(startGrass);
        
        // Add grass details
        this.addGrassDetails(14);
        
        // Sidewalk
        const sidewalkGeometry = new THREE.PlaneGeometry(this.worldWidth, 1);
        const sidewalkMaterial = new THREE.MeshLambertMaterial({ color: 0xcccccc });
        
        const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalk.rotation.x = -Math.PI / 2;
        sidewalk.position.set(0, 0.01, 11);
        sidewalk.receiveShadow = true;
        this.terrain.push(sidewalk);
        this.scene.add(sidewalk);
    }
    
    addGrassDetails(zPosition) {
        // Add small grass clumps for detail
        const clumpGeometry = new THREE.ConeGeometry(0.1, 0.2, 4);
        const clumpMaterial = new THREE.MeshLambertMaterial({ color: 0x1a7a1a });
        
        for (let i = 0; i < 15; i++) {
            const clump = new THREE.Mesh(clumpGeometry, clumpMaterial);
            clump.position.set(
                (Math.random() - 0.5) * this.worldWidth * 0.8,
                0.1,
                zPosition + (Math.random() - 0.5) * 3
            );
            clump.rotation.y = Math.random() * Math.PI * 2;
            clump.scale.setScalar(0.5 + Math.random() * 0.5);
            clump.castShadow = true;
            this.decorations.push(clump);
            this.scene.add(clump);
        }
    }
    
    createRoadSection() {
        // 5-lane road
        const roadGeometry = new THREE.PlaneGeometry(this.worldWidth, 10);
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
        
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, 5);
        road.receiveShadow = true;
        this.terrain.push(road);
        this.scene.add(road);
        
        // Lane markings
        this.createLaneMarkings(5, 10);
    }
    
    createLaneMarkings(roadZ, roadWidth) {
        // Center line
        const centerLineGeometry = new THREE.PlaneGeometry(this.worldWidth, 0.15);
        const centerLineMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFF00,
            emissive: 0x222200
        });
        const centerLine = new THREE.Mesh(centerLineGeometry, centerLineMaterial);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.set(0, 0.02, roadZ);
        this.decorations.push(centerLine);
        this.scene.add(centerLine);
        
        // Dashed lines for lanes
        this.createDashedLines(roadZ, roadWidth);
    }
    
    createDashedLines(roadZ, roadWidth) {
        const dashGeometry = new THREE.PlaneGeometry(1.2, 0.12);
        const dashMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFFFF,
            emissive: 0x111111
        });
        
        // Create dashed lines for 4 lanes
        for (let lane = -1.5; lane <= 1.5; lane += 1) {
            if (lane === 0) continue; // Skip center
            
            for (let i = -this.worldWidth/2; i < this.worldWidth/2; i += 3) {
                const dash = new THREE.Mesh(dashGeometry, dashMaterial);
                dash.rotation.x = -Math.PI / 2;
                dash.position.set(i, 0.02, roadZ + lane * 2);
                this.decorations.push(dash);
                this.scene.add(dash);
            }
        }
    }
    
    createMedianStrip() {
        // Safe median strip
        const medianGeometry = new THREE.PlaneGeometry(this.worldWidth, 2);
        const medianMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        
        const median = new THREE.Mesh(medianGeometry, medianMaterial);
        median.rotation.x = -Math.PI / 2;
        median.position.set(0, 0.05, 0);
        median.receiveShadow = true;
        this.terrain.push(median);
        this.scene.add(median);
    }
    
    createRiverSection() {
        // 5-lane river
        const riverGeometry = new THREE.PlaneGeometry(this.worldWidth, 10);
        const riverMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x1a5490,
            transparent: true,
            opacity: 0.8
        });
        
        const river = new THREE.Mesh(riverGeometry, riverMaterial);
        river.rotation.x = -Math.PI / 2;
        river.position.set(0, -0.05, -5);
        this.terrain.push(river);
        this.scene.add(river);
        
        // Add simple water animation
        this.animateWater(river);
    }
    
    animateWater(waterMesh) {
        // REMOVE FLICKERING - make water static and beautiful
        // No more animated opacity or position changes
        
        // Optional: Add subtle, non-flickering water effect
        const animate = () => {
            if (waterMesh.material) {
                const time = Date.now() * 0.001;
                // Very subtle color shift instead of opacity flicker
                const blueShift = 0.1 + Math.sin(time * 0.1) * 0.05;
                waterMesh.material.color.setHSL(0.6, 0.8, blueShift);
                // Keep position stable - no more bobbing
                waterMesh.position.y = -0.05; // Fixed position
            }
            requestAnimationFrame(animate);
        };
        animate();
        
        console.log('🌊 Water animation fixed - no more flickering');
    }
    
    createGoalArea() {
        // Goal grass area
        const goalGeometry = new THREE.PlaneGeometry(this.worldWidth, 4);
        const goalMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
        
        const goalGrass = new THREE.Mesh(goalGeometry, goalMaterial);
        goalGrass.rotation.x = -Math.PI / 2;
        goalGrass.position.set(0, 0, -14);
        goalGrass.receiveShadow = true;
        this.terrain.push(goalGrass);
        this.scene.add(goalGrass);
        
        // Create 5 lily pad goals
        this.createLilyPads();
    }
    
    createLilyPads() {
        const lilyPadPositions = [-6, -3, 0, 3, 6];
        
        lilyPadPositions.forEach(x => {
            // Create lily pad shape using a circle
            const lilyPadGeometry = new THREE.CircleGeometry(0.8, 12);
            const lilyPadMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 });
            const lilyPad = new THREE.Mesh(lilyPadGeometry, lilyPadMaterial);
            lilyPad.rotation.x = -Math.PI / 2;
            lilyPad.position.set(x, 0.02, -12);
            lilyPad.castShadow = true;
            
            this.goals.push(lilyPad);
            this.scene.add(lilyPad);
        });
        
        console.log('🪷 5 lily pad goals created');
    }
    

// Replace your createRoadVehicles method with this for TRUE FROGGER CONTINUOUS STREAMS:

createRoadVehicles() {
    console.log('🚗 Creating CONTINUOUS traffic streams like classic Frogger...');
    
    const lanePositions = [9, 7, 5, 3, 1]; // Road Z positions
    const laneDirections = [1, -1, 1, -1, 1]; // Alternating directions
    const laneSpeeds = [1.5, 2.0, 1.2, 2.5, 1.8]; // Different speeds per lane
    
    lanePositions.forEach((z, laneIndex) => {
        const direction = laneDirections[laneIndex];
        const speed = laneSpeeds[laneIndex];
        
        // CONTINUOUS STREAM CALCULATION
        const vehicleLength = 4; // Approximate vehicle length
        const gapSize = 8; // Gap between vehicles (player needs to fit through)
        const vehicleSpacing = vehicleLength + gapSize; // Total space per vehicle
        
        // Calculate total stream distance (much larger than screen)
        const screenBuffer = 15; // Extra distance off-screen on each side
        const totalStreamDistance = (this.worldWidth + 2 * screenBuffer);
        const numVehicles = Math.ceil(totalStreamDistance / vehicleSpacing);
        
        console.log(`Lane ${laneIndex + 1}: Creating ${numVehicles} vehicles for continuous stream`);
        
        // Create vehicles across the ENTIRE stream (including off-screen)
        for (let i = 0; i < numVehicles; i++) {
            // Create different vehicle types
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
            
            // POSITION VEHICLES ACROSS ENTIRE STREAM
            let startX;
            if (direction > 0) {
                // Moving right: start from far left (including off-screen)
                startX = -this.worldWidth/2 - screenBuffer + (i * vehicleSpacing);
            } else {
                // Moving left: start from far right (including off-screen)  
                startX = this.worldWidth/2 + screenBuffer - (i * vehicleSpacing);
            }
            
            vehicle.setPosition(startX, 0.3, z);
            vehicle.setVelocity(direction * speed, 0, 0);
            
            this.obstacles.push(vehicle);
            
            console.log(`  Vehicle ${i + 1} at X: ${startX.toFixed(1)}`);
        }
    });
    
    console.log(`✅ Continuous traffic streams created: ${this.obstacles.length} total vehicles`);
}

// ALTERNATIVE VERSION: If you want even MORE challenge, use this instead:

createRoadVehiclesIntenseChallenge() {
    const lanePositions = [9, 7, 5, 3, 1];
    const laneDirections = [1, -1, 1, -1, 1];
    const laneSpeeds = [1.8, 2.2, 1.5, 2.8, 2.0]; // Slightly faster
    
    lanePositions.forEach((z, laneIndex) => {
        const direction = laneDirections[laneIndex];
        const speed = laneSpeeds[laneIndex];
        const vehiclesPerLane = 4; // Even more vehicles
        
        for (let i = 0; i < vehiclesPerLane; i++) {
            let vehicle;
            const random = Math.random();
            if (random < 0.4) {
                vehicle = new Cybertruck(this.scene);
            } else if (random < 0.75) {
                vehicle = new Taxi(this.scene);
            } else {
                vehicle = new Bus(this.scene);
            }
            
            vehicle.create();
            
            // INTENSE: Fill the entire road with strategic gaps
            const gapSize = 6; // Minimum gap for player to squeeze through
            const vehicleLength = 3;
            const totalUnit = gapSize + vehicleLength;
            
            // Position vehicles to create challenging but fair gaps
            const startX = direction > 0 ? 
                -this.worldWidth/2 + (i * totalUnit) + Math.random() * 2 : 
                this.worldWidth/2 - (i * totalUnit) - Math.random() * 2;
            
            vehicle.setPosition(startX, 0.3, z);
            vehicle.setVelocity(direction * speed, 0, 0);
            
            this.obstacles.push(vehicle);
        }
    });
    
    console.log(`🚗 INTENSE traffic pattern created - immediate challenge!`);
}

// Replace your createRiverObjects method with this (logs already in water):

createRiverObjects() {
    console.log('🌊 Creating CONTINUOUS STREAMS of rideable logs and obstacles...');
    
    const riverLanes = [-9, -7, -5, -3, -1]; // River Z positions
    const laneDirections = [-1, 1, -1, 1, -1]; // Alternating directions
    const laneSpeeds = [1.2, 1.0, 1.5, 0.8, 1.3]; // Varied speeds
    
    riverLanes.forEach((z, laneIndex) => {
        const direction = laneDirections[laneIndex];
        const speed = laneSpeeds[laneIndex];
        
        // CONTINUOUS STREAM CALCULATION (same logic as roads)
        const objectLength = 4; // Log/turtle length
        const gapSize = 7; // Gap between objects (frog needs to fit)
        const objectSpacing = objectLength + gapSize;
        
        // Calculate stream distance
        const screenBuffer = 15;
        const totalStreamDistance = (this.worldWidth + 2 * screenBuffer);
        const numObjects = Math.ceil(totalStreamDistance / objectSpacing);
        
        console.log(`🌊 River lane ${laneIndex + 1}: Creating ${numObjects} objects for continuous stream`);
        
        // Create objects across the ENTIRE stream
        for (let i = 0; i < numObjects; i++) {
            // Create different river objects
            let riverObject;
            const random = Math.random();
            if (random < 0.65) {
                riverObject = new Log(this.scene); // 65% logs (rideable)
            } else if (random < 0.9) {
                riverObject = new Turtle(this.scene); // 25% turtles (rideable)
            } else {
                riverObject = new Crocodile(this.scene); // 10% crocodiles (dangerous)
            }
            
            riverObject.create();
            
            // POSITION OBJECTS ACROSS ENTIRE STREAM
            let startX;
            if (direction > 0) {
                // Moving right: start from far left
                startX = -this.worldWidth/2 - screenBuffer + (i * objectSpacing);
            } else {
                // Moving left: start from far right
                startX = this.worldWidth/2 + screenBuffer - (i * objectSpacing);
            }
            
            // Position on water surface
            riverObject.setPosition(startX, 0.1, z); // Slightly above water
            riverObject.setVelocity(direction * speed, 0, 0);
            
            this.obstacles.push(riverObject);
            
            const rideable = riverObject.isRideable ? "RIDEABLE" : "DANGEROUS";
            console.log(`  ${riverObject.type} (${rideable}) at X: ${startX.toFixed(1)}`);
        }
    });
    
    console.log(`🌊 River continuous streams: ${this.obstacles.filter(o => ['log', 'turtle', 'crocodile'].includes(o.type)).length} objects created`);
}

// Replace your createImmersiveCityscape method to push buildings further from road:

createImmersiveCityscape() {
    // Create prominent buildings MUCH FURTHER from road for better visibility
    const prominentBuildings = [
        // Behind goal area - pushed much further back
        { x: 0, z: -35, width: 8, height: 25, depth: 6 },
        { x: -20, z: -40, width: 6, height: 20, depth: 8 },
        { x: 20, z: -40, width: 6, height: 18, depth: 8 },
        
        // Behind starting area - pushed much further back
        { x: 0, z: 35, width: 10, height: 22, depth: 6 },
        { x: -22, z: 40, width: 8, height: 24, depth: 6 },
        { x: 22, z: 40, width: 8, height: 19, depth: 6 },
        
        // On the sides - MUCH FURTHER from road (was -22/22, now -40/40)
        { x: -40, z: 0, width: 6, height: 28, depth: 8 },
        { x: 40, z: 0, width: 6, height: 26, depth: 8 },
        { x: -35, z: 10, width: 5, height: 15, depth: 6 },
        { x: 35, z: 10, width: 5, height: 18, depth: 6 },
        { x: -35, z: -10, width: 5, height: 20, depth: 6 },
        { x: 35, z: -10, width: 5, height: 16, depth: 6 },
    ];
    
    prominentBuildings.forEach(building => {
        const buildingGeometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.6, 0.1, 0.3 + Math.random() * 0.4)
        });
        
        const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
        buildingMesh.position.set(building.x, building.height/2, building.z);
        buildingMesh.castShadow = true;
        buildingMesh.receiveShadow = true;
        
        // Add windows to ALL sides
        this.addWindowsToAllSides(buildingMesh, building.width, building.height, building.depth);
        this.addRooftopDetails(buildingMesh, building.width, building.height, building.depth);
        
        // ADD INWARD-FACING LIGHTS for buildings on the sides
        if (Math.abs(building.x) > 30) { // Side buildings
            this.addInwardFacingLights(buildingMesh, building);
        }
        
        this.decorations.push(buildingMesh);
        this.scene.add(buildingMesh);
    });
    
    console.log('🏢 Buildings repositioned for better road visibility with inward lights');
}

// NEW METHOD: Add windows to all sides of buildings

addWindowsToAllSides(building, width, height, depth) {
    const windowRows = Math.floor(height / 1.5);
    const windowCols = Math.floor(Math.max(width, depth) / 0.8);
    
    // Front side (positive Z)
    this.addWindowsToSide(building, width, height, windowRows, windowCols, 
        { x: 0, y: 0, z: depth/2 + 0.01 }, { x: 1, y: 1, z: 0 });
    
    // Back side (negative Z)
    this.addWindowsToSide(building, width, height, windowRows, windowCols, 
        { x: 0, y: 0, z: -depth/2 - 0.01 }, { x: -1, y: 1, z: 0 });
    
    // Left side (negative X)
    this.addWindowsToSide(building, depth, height, windowRows, Math.floor(depth / 0.8), 
        { x: -width/2 - 0.01, y: 0, z: 0 }, { x: 0, y: 1, z: 1 });
    
    // Right side (positive X)
    this.addWindowsToSide(building, depth, height, windowRows, Math.floor(depth / 0.8), 
        { x: width/2 + 0.01, y: 0, z: 0 }, { x: 0, y: 1, z: -1 });
}

addWindowsToSide(building, sideWidth, sideHeight, windowRows, windowCols, basePosition, normal) {
    for (let row = 1; row < windowRows - 1; row++) {
        for (let col = 0; col < windowCols; col++) {
            if (Math.random() > 0.3) { // More windows
                const isLit = Math.random() > 0.4;
                const windowGeometry = new THREE.PlaneGeometry(0.4, 0.6);
                const windowMaterial = new THREE.MeshLambertMaterial({ 
                    color: isLit ? 0xffffaa : 0x222244,
                    emissive: isLit ? 0x444422 : 0x000000,
                    emissiveIntensity: isLit ? 0.4 : 0
                });
                
                const window = new THREE.Mesh(windowGeometry, windowMaterial);
                
                // Position window on the correct side
                if (normal.z !== 0) {
                    // Front or back side
                    window.position.set(
                        basePosition.x + (col - windowCols/2 + 0.5) * 0.8,
                        basePosition.y + (row - windowRows/2) * 1.5,
                        basePosition.z
                    );
                } else {
                    // Left or right side
                    window.position.set(
                        basePosition.x,
                        basePosition.y + (row - windowRows/2) * 1.5,
                        basePosition.z + (col - windowCols/2 + 0.5) * 0.8
                    );
                    window.rotation.y = Math.PI / 2; // Rotate for side walls
                }
                
                building.add(window);
            }
        }
    }
}
    // ==================== COMPLETE URBAN ENVIRONMENT ====================
    
    createCompleteUrbanEnvironment() {
        console.log('🌆 Creating COMPLETE urban environment...');
        
        // Create full city foundation - no more floating island!
        this.createCityFoundation();
        this.createUrbanStreetGrid();
        this.createImmersiveCityscape();
        this.createDynamicSky();
        this.addEnvironmentalLighting();
        this.createStreetDetails();
    }
    
    createCityFoundation() {
        // Create large ground plane that covers the entire visible area
        const groundSize = 120; // Much larger than before
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 }); // Asphalt gray
        
        const cityGround = new THREE.Mesh(groundGeometry, groundMaterial);
        cityGround.rotation.x = -Math.PI / 2;
        cityGround.position.set(0, -0.1, 0);
        cityGround.receiveShadow = true;
        this.decorations.push(cityGround);
        this.scene.add(cityGround);
        
        // Add sidewalk areas around the play area
        this.createSidewalkAreas();
        
        console.log('🏗️ City foundation laid');
    }
    
    createSidewalkAreas() {
        // Sidewalks on all sides of the play area
        const sidewalkWidth = 3;
        const playAreaWidth = this.worldWidth + 4; // A bit wider than play area
        const playAreaDepth = 32; // Covers from start to goal
        
        // North sidewalk (behind goal area)
        const northSidewalk = new THREE.PlaneGeometry(playAreaWidth, sidewalkWidth);
        const northSidewalkMesh = new THREE.Mesh(northSidewalk, this.sharedMaterials.sidewalk);
        northSidewalkMesh.rotation.x = -Math.PI / 2;
        northSidewalkMesh.position.set(0, 0, -18);
        northSidewalkMesh.receiveShadow = true;
        this.terrain.push(northSidewalkMesh);
        this.scene.add(northSidewalkMesh);
        
        // South sidewalk (behind starting area)
        const southSidewalk = new THREE.PlaneGeometry(playAreaWidth, sidewalkWidth);
        const southSidewalkMesh = new THREE.Mesh(southSidewalk, this.sharedMaterials.sidewalk);
        southSidewalkMesh.rotation.x = -Math.PI / 2;
        southSidewalkMesh.position.set(0, 0, 18);
        southSidewalkMesh.receiveShadow = true;
        this.terrain.push(southSidewalkMesh);
        this.scene.add(southSidewalkMesh);
        
        // East sidewalk
        const eastSidewalk = new THREE.PlaneGeometry(sidewalkWidth, playAreaDepth + 6);
        const eastSidewalkMesh = new THREE.Mesh(eastSidewalk, this.sharedMaterials.sidewalk);
        eastSidewalkMesh.rotation.x = -Math.PI / 2;
        eastSidewalkMesh.position.set(playAreaWidth/2 + 1, 0, 0);
        eastSidewalkMesh.receiveShadow = true;
        this.terrain.push(eastSidewalkMesh);
        this.scene.add(eastSidewalkMesh);
        
        // West sidewalk
        const westSidewalk = new THREE.PlaneGeometry(sidewalkWidth, playAreaDepth + 6);
        const westSidewalkMesh = new THREE.Mesh(westSidewalk, this.sharedMaterials.sidewalk);
        westSidewalkMesh.rotation.x = -Math.PI / 2;
        westSidewalkMesh.position.set(-playAreaWidth/2 - 1, 0, 0);
        westSidewalkMesh.receiveShadow = true;
        this.terrain.push(westSidewalkMesh);
        this.scene.add(westSidewalkMesh);
    }
    
    createUrbanStreetGrid() {
        // Create streets extending in all directions from the main play area
        this.createPerpendicularStreets();
        this.createDistantCityBlocks();
    }
    // SIMPLE FIX: Just replace your existing createPerpendicularStreets method in Level.js:

createPerpendicularStreets() {
    const streetWidth = 8;
    const streetLength = 60;
    
    // Streets extending east and west from the main area
    const eastWestStreetGeometry = new THREE.PlaneGeometry(streetLength, streetWidth);
    const streetMaterial = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
    
    // Street extending east - MOVED AWAY FROM WATER
    const eastStreet = new THREE.Mesh(eastWestStreetGeometry, streetMaterial);
    eastStreet.rotation.x = -Math.PI / 2;
    eastStreet.position.set(35, -0.05, 15); // Moved from (25, -0.05, 5) to avoid water
    eastStreet.receiveShadow = true;
    this.decorations.push(eastStreet);
    this.scene.add(eastStreet);
    
    // Street extending west - MOVED AWAY FROM WATER  
    const westStreet = new THREE.Mesh(eastWestStreetGeometry.clone(), streetMaterial);
    westStreet.rotation.x = -Math.PI / 2;
    westStreet.position.set(-35, -0.05, 15); // Moved from (-25, -0.05, 5) to avoid water
    westStreet.receiveShadow = true;
    this.decorations.push(westStreet);
    this.scene.add(westStreet);
    
    // Perpendicular streets running north-south - MOVED AWAY FROM CENTER
    const northSouthStreetGeometry = new THREE.PlaneGeometry(streetWidth, streetLength);
    
    // Move these streets much further from the play area
    const streetPositions = [-30, 30]; // Only 2 streets, much further out
    streetPositions.forEach(x => {
        const street = new THREE.Mesh(northSouthStreetGeometry.clone(), streetMaterial);
        street.rotation.x = -Math.PI / 2;
        street.position.set(x, -0.05, 0); // Keep same Z but move X much further
        street.receiveShadow = true;
        this.decorations.push(street);
        this.scene.add(street);
    });
}
    addExtendedStreetMarkings() {
        // Add lane markings to extended streets
        const dashGeometry = new THREE.PlaneGeometry(0.8, 0.08);
        const dashMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFFFF,
            emissive: 0x111111
        });
        
        // East-west street markings
        [-25, 25].forEach(x => {
            for (let i = -25; i < 25; i += 3) {
                const dash = new THREE.Mesh(dashGeometry.clone(), dashMaterial);
                dash.rotation.x = -Math.PI / 2;
                dash.position.set(x + i, 0.01, 5);
                this.decorations.push(dash);
                this.scene.add(dash);
            }
        });
        
        // North-south street markings
        [-20, -10, 10, 20].forEach(x => {
            for (let i = -25; i < 25; i += 3) {
                const dash = new THREE.Mesh(dashGeometry.clone(), dashMaterial);
                dash.rotation.x = -Math.PI / 2;
                dash.rotation.z = Math.PI / 2;
                dash.position.set(x, 0.01, i);
                this.decorations.push(dash);
                this.scene.add(dash);
            }
        });
    }
    
    createDistantCityBlocks() {
        // Create city blocks filling the entire area
        const blockSize = 8;
        const blocksPerSide = 6;
        
        for (let x = -blocksPerSide; x <= blocksPerSide; x++) {
            for (let z = -blocksPerSide; z <= blocksPerSide; z++) {
                // Skip the area around the main play zone
                if (Math.abs(x) < 4 && Math.abs(z) < 6) continue;
                
                this.createCityBlock(x * blockSize, z * blockSize, blockSize);
            }
        }
    }
    
    createCityBlock(centerX, centerZ, blockSize) {
        // Create 2-4 buildings per block
        const buildingsPerBlock = 2 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < buildingsPerBlock; i++) {
            const offsetX = (Math.random() - 0.5) * blockSize * 0.6;
            const offsetZ = (Math.random() - 0.5) * blockSize * 0.6;
            
            const width = 2 + Math.random() * 3;
            const height = 6 + Math.random() * 15;
            const depth = 2 + Math.random() * 3;
            
            const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
            const buildingMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.6, 0.1, 0.25 + Math.random() * 0.3)
            });
            
            const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingMesh.position.set(centerX + offsetX, height/2, centerZ + offsetZ);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            
            // Add detailed windows to prominent buildings
            this.addDetailedWindows(buildingMesh, width, height, depth);
            this.addRooftopDetails(buildingMesh, width, height, depth);
            
            this.decorations.push(buildingMesh);
            this.scene.add(buildingMesh);
        }
        
        console.log('🏢 Complete cityscape with filled blocks created');
    }
    
    addDetailedWindows(building, width, height, depth) {
        const windowRows = Math.floor(height / 1.5);
        const windowCols = Math.floor(width / 0.8);
        
        for (let row = 1; row < windowRows - 1; row++) {
            for (let col = 0; col < windowCols; col++) {
                // Front windows
                if (Math.random() > 0.2) {
                    const isLit = Math.random() > 0.4;
                    const windowGeometry = new THREE.PlaneGeometry(0.4, 0.6);
                    const windowMaterial = new THREE.MeshLambertMaterial({ 
                        color: isLit ? 0xffffaa : 0x222244,
                        emissive: isLit ? 0x444422 : 0x000000,
                        emissiveIntensity: isLit ? 0.4 : 0
                    });
                    
                    const window = new THREE.Mesh(windowGeometry, windowMaterial);
                    window.position.set(
                        (col - windowCols/2 + 0.5) * 0.8,
                        (row - windowRows/2) * 1.5,
                        depth/2 + 0.01
                    );
                    building.add(window);
                }
            }
        }
    }
    
    addRooftopDetails(building, width, height, depth) {
        // Add antenna/satellite dishes
        if (Math.random() > 0.6) {
            const antennaGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 6);
            const antennaMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
            const antenna = new THREE.Mesh(antennaGeometry, antennaMaterial);
            antenna.position.set(
                (Math.random() - 0.5) * width * 0.6,
                height/2 + 1,
                (Math.random() - 0.5) * depth * 0.6
            );
            antenna.castShadow = true;
            building.add(antenna);
        }
    }
    
    createDynamicSky() {
        // Create gradient sky instead of flat blue
        const skyGeometry = new THREE.SphereGeometry(80, 32, 16);
        
        // Create vertex colors for gradient
        const colors = [];
        const vertices = skyGeometry.attributes.position.array;
        
        for (let i = 0; i < vertices.length; i += 3) {
            const y = vertices[i + 1];
            const normalizedY = (y + 80) / 160;
            
            // Sky blue to lighter blue gradient
            const r = 0.5 + normalizedY * 0.4;
            const g = 0.7 + normalizedY * 0.3;
            const b = 0.9 + normalizedY * 0.1;
            
            colors.push(r, g, b);
        }
        
        skyGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
        
        const skyMaterial = new THREE.MeshBasicMaterial({ 
            vertexColors: true,
            side: THREE.BackSide,
            fog: false
        });
        
        const sky = new THREE.Mesh(skyGeometry, skyMaterial);
        this.scene.add(sky);
        
        // Add moving clouds
        this.addMovingClouds();
        
        console.log('🌤️ Dynamic gradient sky with moving clouds created');
    }
    
    addMovingClouds() {
        const cloudCount = 6;
        this.clouds = [];
        
        for (let i = 0; i < cloudCount; i++) {
            const cloudGeometry = new THREE.SphereGeometry(2 + Math.random() * 1.5, 8, 6);
            const cloudMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xffffff,
                transparent: true,
                opacity: 0.7 + Math.random() * 0.3
            });
            
            const cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
            cloud.position.set(
                (Math.random() - 0.5) * 60,
                12 + Math.random() * 8,
                (Math.random() - 0.5) * 60
            );
            
            cloud.scale.set(1 + Math.random(), 0.5 + Math.random() * 0.3, 1 + Math.random());
            
            // Add movement data
            cloud.userData = {
                speed: 0.01 + Math.random() * 0.02,
                direction: Math.random() * Math.PI * 2
            };
            
            this.clouds.push(cloud);
            this.scene.add(cloud);
        }
    }
    
    createImmersiveCityscape() {
        // Create prominent buildings around the main play area
        const prominentBuildings = [
            // Behind goal area
            { x: 0, z: -25, width: 8, height: 25, depth: 6 },
            { x: -12, z: -28, width: 6, height: 20, depth: 8 },
            { x: 12, z: -28, width: 6, height: 18, depth: 8 },
            
            // Behind starting area  
            { x: 0, z: 25, width: 10, height: 22, depth: 6 },
            { x: -15, z: 28, width: 8, height: 24, depth: 6 },
            { x: 15, z: 28, width: 8, height: 19, depth: 6 },
            
            // On the sides
            { x: -22, z: 0, width: 6, height: 28, depth: 8 },
            { x: 22, z: 0, width: 6, height: 26, depth: 8 },
        ];
        
        prominentBuildings.forEach(building => {
            const buildingGeometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
            const buildingMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(0.6, 0.1, 0.3 + Math.random() * 0.4)
            });
            
            const buildingMesh = new THREE.Mesh(buildingGeometry, buildingMaterial);
            buildingMesh.position.set(building.x, building.height/2, building.z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            
            // Add detailed windows to prominent buildings
            this.addDetailedWindows(buildingMesh, building.width, building.height, building.depth);
            this.addRooftopDetails(buildingMesh, building.width, building.height, building.depth);
            
            this.decorations.push(buildingMesh);
            this.scene.add(buildingMesh);
        });
        
        console.log('🏢 Immersive cityscape created with detailed buildings');
    }
    
    addEnvironmentalLighting() {
        // Add street lamps around the area
        this.addStreetLamps();
        
        // Add distant city lights effect
        this.addCityLights();
    }
    
    addStreetLamps() {
        const lampPositions = [
            [-8, 0, 16], [8, 0, 16],   // Starting area
            [-8, 0, -16], [8, 0, -16], // Goal area
            [-10, 0, 0], [10, 0, 0]    // Median area
        ];
        
        lampPositions.forEach(pos => {
            // Lamp post
            const postGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
            const postMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set(pos[0], 2, pos[2]);
            post.castShadow = true;
            
            // Lamp head
            const lampGeometry = new THREE.SphereGeometry(0.3, 8, 6);
            const lampMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xffffaa,
                emissive: 0xffff88,
                emissiveIntensity: 0.5
            });
            const lamp = new THREE.Mesh(lampGeometry, lampMaterial);
            lamp.position.set(pos[0], 4, pos[2]);
            
            // Point light
            const light = new THREE.PointLight(0xffffaa, 0.6, 10);
            light.position.set(pos[0], 4, pos[2]);
            light.castShadow = true;
            light.shadow.mapSize.width = 512;
            light.shadow.mapSize.height = 512;
            
            this.decorations.push(post);
            this.decorations.push(lamp);
            this.scene.add(post);
            this.scene.add(lamp);
            this.scene.add(light);
        });
        
        console.log('💡 Street lamps with point lights added');
    }
    
    addCityLights() {
        // Add distant glowing lights for atmosphere
        for (let i = 0; i < 15; i++) {
            const lightGeometry = new THREE.SphereGeometry(0.1, 6, 4);
            const lightMaterial = new THREE.MeshBasicMaterial({ 
                color: Math.random() > 0.5 ? 0xff6600 : 0x6600ff,
                transparent: true,
                opacity: 0.8
            });
            
            const light = new THREE.Mesh(lightGeometry, lightMaterial);
            const angle = Math.random() * Math.PI * 2;
            const radius = 25 + Math.random() * 15;
            
            light.position.set(
                Math.cos(angle) * radius,
                2 + Math.random() * 12,
                Math.sin(angle) * radius
            );
            
            this.decorations.push(light);
            this.scene.add(light);
        }
    }
    
    createStreetDetails() {
        // Add street furniture and details throughout the expanded city
        this.addTrafficLights();
        this.addTrees();
        this.addStreetFurniture();
  
    }
    
    addTrafficLights() {
        const trafficLightPositions = [
            [6, 0, 12], [-6, 0, 12],   // Near starting area
            [6, 0, -2], [-6, 0, -2]    // Near median
        ];
        
        trafficLightPositions.forEach(pos => {
            // Traffic light pole
            const poleGeometry = new THREE.CylinderGeometry(0.08, 0.08, 3, 8);
            const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            const pole = new THREE.Mesh(poleGeometry, poleMaterial);
            pole.position.set(pos[0], 1.5, pos[2]);
            pole.castShadow = true;
            
            // Traffic light box
            const boxGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.2);
            const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x222222 });
            const box = new THREE.Mesh(boxGeometry, boxMaterial);
            box.position.set(pos[0], 3.2, pos[2]);
            box.castShadow = true;
            
            // Traffic light colors
            const colors = [0xff0000, 0xffff00, 0x00ff00]; // Red, Yellow, Green
            colors.forEach((color, index) => {
                const lightGeometry = new THREE.CircleGeometry(0.08, 8);
                const isActive = index === Math.floor(Math.random() * 3);
                const lightMaterial = new THREE.MeshLambertMaterial({ 
                    color: isActive ? color : 0x333333,
                    emissive: isActive ? color : 0x000000,
                    emissiveIntensity: isActive ? 0.3 : 0
                });
                const light = new THREE.Mesh(lightGeometry, lightMaterial);
                light.position.set(pos[0], 3.5 - index * 0.25, pos[2] + 0.11);
                this.decorations.push(light);
                this.scene.add(light);
            });
            
            this.decorations.push(pole);
            this.decorations.push(box);
            this.scene.add(pole);
            this.scene.add(box);
        });
    }
    
    addTrees() {
        const treePositions = [
            [-7, 0, 15], [7, 0, 15],   // Starting area
            [-7, 0, -17], [7, 0, -17], // Goal area
        ];
        
        treePositions.forEach(pos => {
            // Tree trunk
            const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
            const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
            const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
            trunk.position.set(pos[0], 1, pos[2]);
            trunk.castShadow = true;
            
            // Tree foliage
            const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 6);
            const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x228B22 });
            const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
            foliage.position.set(pos[0], 2.8, pos[2]);
            foliage.scale.set(1, 0.8, 1);
            foliage.castShadow = true;
            
            this.decorations.push(trunk);
            this.decorations.push(foliage);
            this.scene.add(trunk);
            this.scene.add(foliage);
        });
        
        console.log('🌳 Trees and street details added');
    }
    
    addStreetFurniture() {
        // Add benches, mailboxes, etc. around the sidewalks
        const furniturePositions = [
            { x: -8, z: 16, type: 'bench' },
            { x: 8, z: 16, type: 'mailbox' },
            { x: -8, z: -18, type: 'bench' },
            { x: 8, z: -18, type: 'mailbox' },
            { x: 12, z: 5, type: 'bench' },
            { x: -12, z: 5, type: 'mailbox' }
        ];
        
        furniturePositions.forEach(item => {
            if (item.type === 'bench') {
                this.createBench(item.x, item.z);
            } else if (item.type === 'mailbox') {
                this.createMailbox(item.x, item.z);
            }
        });
    }
    
    createBench(x, z) {
        // Bench seat
        const seatGeometry = new THREE.BoxGeometry(1.5, 0.1, 0.4);
        const benchMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
        const seat = new THREE.Mesh(seatGeometry, benchMaterial);
        seat.position.set(x, 0.4, z);
        seat.castShadow = true;
        
        // Bench back
        const backGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, benchMaterial);
        back.position.set(x, 0.7, z - 0.15);
        back.castShadow = true;
        
        this.decorations.push(seat);
        this.decorations.push(back);
        this.scene.add(seat);
        this.scene.add(back);
    }
    
    createMailbox(x, z) {
        // Mailbox post
        const postGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1, 8);
        const postMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        const post = new THREE.Mesh(postGeometry, postMaterial);
        post.position.set(x, 0.5, z);
        post.castShadow = true;
        
        // Mailbox
        const boxGeometry = new THREE.BoxGeometry(0.3, 0.2, 0.4);
        const boxMaterial = new THREE.MeshLambertMaterial({ color: 0x000080 });
        const mailbox = new THREE.Mesh(boxGeometry, boxMaterial);
        mailbox.position.set(x, 1.1, z);
        mailbox.castShadow = true;
        
        this.decorations.push(post);
        this.decorations.push(mailbox);
        this.scene.add(post);
        this.scene.add(mailbox);
    }
    

    
    createParkedCar(x, z) {
        // Simple parked car
        const carGeometry = new THREE.BoxGeometry(1.8, 0.6, 4);
        const carColors = [0x333333, 0x666666, 0xffffff, 0xff0000, 0x0000ff];
        const carMaterial = new THREE.MeshLambertMaterial({ 
            color: carColors[Math.floor(Math.random() * carColors.length)]
        });
        
        const car = new THREE.Mesh(carGeometry, carMaterial);
        car.position.set(x, 0.3, z);
        car.castShadow = true;
        car.receiveShadow = true;
        
        this.decorations.push(car);
        this.scene.add(car);
    }
    
    addAtmosphericEffects() {
        // Add subtle fog for depth
        this.scene.fog = new THREE.Fog(0x87CEEB, 40, 90);
        
        // Add floating particles (dust/pollen)
        this.addFloatingParticles();
        
        console.log('🌫️ Atmospheric effects added');
    }
    
    addFloatingParticles() {
        const particleCount = 30;
        const particleGeometry = new THREE.SphereGeometry(0.02, 4, 4);
        const particleMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.6
        });
        
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * this.worldWidth * 2,
                Math.random() * 15,
                (Math.random() - 0.5) * 40
            );
            
            // Add random drift velocity
            particle.userData = {
                velocity: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.02,
                    (Math.random() - 0.5) * 0.01,
                    (Math.random() - 0.5) * 0.02
                )
            };
            
            this.particles.push(particle);
            this.decorations.push(particle);
            this.scene.add(particle);
        }
    }
    
    // Level 2: Jungle Swamp (Placeholder)
    async createLevel2_JungleSwamp() {
        console.log('🌿 Creating Level 2: Jungle Swamp (PLACEHOLDER)');
        console.log('🚧 Level 2 placeholder created - TODO: Full implementation');
    }
    
    // Level 3: Futuristic City (Placeholder)
    async createLevel3_FuturisticCity() {
        console.log('🚁 Creating Level 3: Futuristic City (PLACEHOLDER)');
        console.log('🚧 Level 3 placeholder created - TODO: Full implementation');
    }
    
    // Level 4: Arctic Tundra (Placeholder)
    async createLevel4_ArcticTundra() {
        console.log('❄️ Creating Level 4: Arctic Tundra (PLACEHOLDER)');
        console.log('🚧 Level 4 placeholder created - TODO: Full implementation');
    }
    
    // Level 5: Sky Ruins (Placeholder)
    async createLevel5_SkyRuins() {
        console.log('🏛️ Creating Level 5: Sky Ruins (PLACEHOLDER)');
        console.log('🚧 Level 5 placeholder created - TODO: Full implementation');
    }
    
// Replace your update method in Level.js with this to maintain constant vehicle flow:
update(deltaTime) {
    // Update all moving obstacles
    this.obstacles.forEach(obstacle => {
        obstacle.update(deltaTime);
        
        // CONTINUOUS STREAM: Reset position to maintain endless flow
        const resetDistance = this.worldWidth/2 + 20; // When to reset
        
        if (obstacle.velocity.x > 0 && obstacle.position.x > resetDistance) {
            // Moving right, reset to left side
            const newX = -resetDistance;
            obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
            console.log(`🔄 ${obstacle.type} continues stream from left`);
            
        } else if (obstacle.velocity.x < 0 && obstacle.position.x < -resetDistance) {
            // Moving left, reset to right side
            const newX = resetDistance;
            obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
            console.log(`🔄 ${obstacle.type} continues stream from right`);
        }
    });
    
    // Level-specific updates
    switch (this.levelNumber) {
        case 1:
            this.updateLevel1(deltaTime);
            break;
        case 2:
            this.updateLevel2(deltaTime);
            break;
        case 3:
            this.updateLevel3(deltaTime);
            break;
        case 4:
            this.updateLevel4(deltaTime);
            break;
        case 5:
            this.updateLevel5(deltaTime);
            break;
    }
}
    
    updateLevel1(deltaTime) {
        const time = Date.now() * 0.001;
        
        // Animate moving clouds
        if (this.clouds) {
            this.clouds.forEach(cloud => {
                cloud.position.x += Math.cos(cloud.userData.direction) * cloud.userData.speed;
                cloud.position.z += Math.sin(cloud.userData.direction) * cloud.userData.speed;
                
                // Reset clouds that go too far
                if (Math.abs(cloud.position.x) > 40 || Math.abs(cloud.position.z) > 40) {
                    cloud.position.x = (Math.random() - 0.5) * 60;
                    cloud.position.z = (Math.random() - 0.5) * 60;
                }
            });
        }
        
        // Enhanced lily pad animation
        this.goals.forEach((lilyPad, index) => {
            const offset = index * 0.5;
            lilyPad.position.y = 0.02 + Math.sin(time * 0.8 + offset) * 0.015;
            lilyPad.rotation.z = Math.sin(time * 0.6 + offset) * 0.05;
        });
        
        // Animate floating particles
        if (this.particles) {
            this.particles.forEach(particle => {
                particle.position.add(particle.userData.velocity);
                
                // Reset if out of bounds
                if (particle.position.y > 20) particle.position.y = -2;
                if (Math.abs(particle.position.x) > this.worldWidth) {
                    particle.position.x = (Math.random() - 0.5) * this.worldWidth * 2;
                }
                if (Math.abs(particle.position.z) > 30) {
                    particle.position.z = (Math.random() - 0.5) * 40;
                }
            });
        }
        
        // Traffic light cycling (occasionally change lights)
        if (Math.random() < 0.002) {
            this.decorations.forEach(decoration => {
                if (decoration.material && decoration.material.emissive && decoration.geometry.parameters.radius === 0.08) {
                    // This is a traffic light
                    const shouldBeOn = Math.random() > 0.7;
                    decoration.material.emissiveIntensity = shouldBeOn ? 0.3 : 0;
                }
            });
        }
    }
    
    updateLevel2(deltaTime) {
        // TODO: Jungle swamp specific updates
    }
    
    updateLevel3(deltaTime) {
        // TODO: Futuristic city specific updates
    }
    
    updateLevel4(deltaTime) {
        // TODO: Arctic tundra specific updates
    }
    
    updateLevel5(deltaTime) {
        // TODO: Sky ruins specific updates
    }
    
    // Get all obstacles for collision detection
    getObstacles() {
        return this.obstacles;
    }
    
    // Get goal positions for win condition checking
    getGoals() {
        return this.goals;
    }
    
    // Memory cleanup
    dispose() {
        // Remove all terrain
        this.terrain.forEach(terrain => {
            this.scene.remove(terrain);
            if (terrain.geometry) terrain.geometry.dispose();
            if (terrain.material) terrain.material.dispose();
        });
        
        // Remove all obstacles
        this.obstacles.forEach(obstacle => {
            obstacle.dispose();
        });
        
        // Remove all goals
        this.goals.forEach(goal => {
            this.scene.remove(goal);
            if (goal.geometry) goal.geometry.dispose();
            if (goal.material) goal.material.dispose();
        });
        
        // Remove all decorations
        this.decorations.forEach(decoration => {
            this.scene.remove(decoration);
            if (decoration.geometry) decoration.geometry.dispose();
            if (decoration.material) decoration.material.dispose();
        });
        
        // Clear arrays
        this.terrain = [];
        this.obstacles = [];
        this.goals = [];
        this.decorations = [];
        this.particles = [];
        this.clouds = [];
        
        console.log(`🧹 Level ${this.levelNumber} resources cleaned up`);
    }
    
    // Static cleanup for shared materials
    static disposeSharedMaterials() {
        if (Level._sharedMaterials) {
            Object.values(Level._sharedMaterials).forEach(material => {
                material.dispose();
            });
            Level._sharedMaterials = null;
        }
        console.log('🧹 Level shared materials cleaned up');
    }
}