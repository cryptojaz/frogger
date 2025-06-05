// BaseLevel.js - Base class for all levels using configuration-driven approach

import * as THREE from 'three';
import { LevelConfigManager } from './LevelConfig.js';
import { Vehicle } from './Vehicle.js';

export class BaseLevel {
    constructor(scene, levelNumber, worldWidth, worldDepth) {
        this.scene = scene;
        this.levelNumber = levelNumber;
        this.worldWidth = worldWidth;
        this.worldDepth = worldDepth;
        
        // Get configuration for this level
        this.config = LevelConfigManager.getConfig(levelNumber);
        if (!this.config) {
            throw new Error(`No configuration found for level ${levelNumber}`);
        }
        
        // Screen dimensions
        this.screenWidth = 80;
        this.playableWidth = worldWidth;
        
        // Level objects
        this.terrain = [];
        this.obstacles = [];
        this.goals = [];
        this.decorations = [];
        
        // Shared materials cache
        this.sharedMaterials = BaseLevel.getSharedMaterials();
        
        // Texture loader
        this.textureLoader = new THREE.TextureLoader();
        
        console.log(`🏗️ Level ${levelNumber} (${this.config.name}) created`);
    }
    
    static getSharedMaterials() {
        if (!BaseLevel._cachedMaterials) {
            console.log('🎨 Creating shared materials cache...');
            
            BaseLevel._cachedMaterials = {
                // City materials
                grass: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                road: new THREE.MeshLambertMaterial({ color: 0x2a2a2a }),
                water: new THREE.MeshLambertMaterial({ color: 0x1a5490, transparent: true, opacity: 0.8 }),
                sidewalk: new THREE.MeshLambertMaterial({ color: 0xcccccc }),
                cityGround: new THREE.MeshLambertMaterial({ color: 0x444444 }),
                
                // Jungle materials
                jungleGrass: new THREE.MeshLambertMaterial({ color: 0x1a4a1a }),
                jungleRoad: new THREE.MeshLambertMaterial({ color: 0x4a3728 }),
                swampWater: new THREE.MeshLambertMaterial({ color: 0x3d4a1a, transparent: true, opacity: 0.9 }),
                junglePath: new THREE.MeshLambertMaterial({ color: 0x5a4a3a }),
                jungleGround: new THREE.MeshLambertMaterial({ color: 0x2a3a1a }),
                
                // Mars materials
    // Mars materials
marsGround: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
marsRock: new THREE.MeshLambertMaterial({ color: 0xA0522D }),
marsSand: new THREE.MeshLambertMaterial({ color: 0xDEB887 }),
marsTransportLane: new THREE.MeshLambertMaterial({ 
    color: 0x666666, // ✅ GREY color for Mars transport lanes
    transparent: true, 
    opacity: 0.8,
    emissive: 0x222222
}),
                
                // D.C. materials
                dcGrass: new THREE.MeshLambertMaterial({ color: 0x2F4F2F }),
                dcRoad: new THREE.MeshLambertMaterial({ color: 0x2a2a2a }),
                potomacRiver: new THREE.MeshLambertMaterial({ color: 0x1e3a5f, transparent: true, opacity: 0.8 }),
                whitehouse: new THREE.MeshLambertMaterial({ color: 0xf5f5f5 }),
                marble: new THREE.MeshLambertMaterial({ color: 0xe6e6e6 }),
                
                // Digital/AGI materials
                digitalGround: new THREE.MeshLambertMaterial({ 
                    color: 0x000011, 
                    emissive: 0x001122, 
                    emissiveIntensity: 0.2 
                }),
                dataStream: new THREE.MeshLambertMaterial({ 
                    color: 0x00ff00, 
                    transparent: true, 
                    opacity: 0.6,
                    emissive: 0x004400
                }),
                quantumGrid: new THREE.MeshLambertMaterial({ 
                    color: 0x0066ff, 
                    transparent: true, 
                    opacity: 0.4,
                    emissive: 0x002244
                }),
                neonBlue: new THREE.MeshLambertMaterial({ 
                    color: 0x00ffff, 
                    emissive: 0x006666,
                    emissiveIntensity: 0.5
                }),
                neonGreen: new THREE.MeshLambertMaterial({ 
                    color: 0x00ff00, 
                    emissive: 0x004400,
                    emissiveIntensity: 0.5
                }),
                
                // Building materials
                goalBuilding: new THREE.MeshLambertMaterial({ color: 0x4a90e2 }),
                building1: new THREE.MeshLambertMaterial({ color: 0x555555 }),
                building2: new THREE.MeshLambertMaterial({ color: 0x666666 }),
                building3: new THREE.MeshLambertMaterial({ color: 0x777777 }),
                
                // Temple materials
                templeStone: new THREE.MeshLambertMaterial({ color: 0x6a5a4a }),
                templeMoss: new THREE.MeshLambertMaterial({ color: 0x2a4a1a }),
                
                // Mars structure materials
                spaceDome: new THREE.MeshLambertMaterial({ 
                    color: 0xcccccc, 
                    transparent: true, 
                    opacity: 0.7 
                }),
                metallic: new THREE.MeshLambertMaterial({ color: 0x708090 }),
                
                // Shared materials
                trunk: new THREE.MeshLambertMaterial({ color: 0x8B4513 }),
                foliage: new THREE.MeshLambertMaterial({ color: 0x228B22 }),
                jungleFoliage: new THREE.MeshLambertMaterial({ color: 0x1a4a1a }),
                yellowLine: new THREE.MeshLambertMaterial({ color: 0xFFFF00, emissive: 0x222200 }),
                whiteLine: new THREE.MeshLambertMaterial({ color: 0xFFFFFF, emissive: 0x111111 }),
                boundaryMarker: new THREE.MeshLambertMaterial({ color: 0x999999, transparent: true, opacity: 0.3 })
            };
        }
        
        return BaseLevel._cachedMaterials;
    }
    
    async create() {
        console.log(`🏗️ Creating level ${this.levelNumber} using configuration...`);
        
        // Create environment based on type
        await this.createEnvironment();
        
        // Create game layout
        await this.createGameLayout();
        
        // Create obstacles
        await this.createObstacles();
        
        // Create decorations
        await this.createDecorations();
        
        console.log(`✅ Level ${this.levelNumber} (${this.config.name}) created successfully`);
    }
    
    async createEnvironment() {
        const envType = this.config.environment.type;
        const groundColor = this.config.environment.groundColor;
        
        // Create foundation
        const groundSize = 140;
        const groundGeometry = new THREE.PlaneGeometry(groundSize, groundSize);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: groundColor });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, -0.1, 0);
        ground.receiveShadow = true;
        this.decorations.push(ground);
        this.scene.add(ground);
        
        console.log(`🌍 Created ${envType} environment with ground color ${groundColor.toString(16)}`);
    }
    
    async createGameLayout() {
        const zones = this.config.zones;
        
        // Create starting area
        await this.createStartingArea(zones.start);
        
        // Create road section
        await this.createRoadSection(zones.roadStart, zones.roadEnd);
        
        // Create median/safe area
        await this.createSafeArea(zones.medianStart, zones.medianEnd);
        
        // Create water/transport section
        await this.createWaterSection(zones.waterStart, zones.waterEnd);
        
        // Create goal area
        await this.createGoalArea(zones.goalArea);
    }
    
    async createStartingArea(zPosition) {
        let materialKey;
        switch (this.config.environment.type) {
            case 'jungle':
                materialKey = 'jungleGrass';
                break;
            case 'mars':
                materialKey = 'marsSand';
                break;
            case 'dc':
                materialKey = 'dcGrass';
                break;
            case 'digital':
                materialKey = 'digitalGround';
                break;
            default:
                materialKey = 'grass';
        }
        
        const grassGeometry = new THREE.PlaneGeometry(this.screenWidth, 4);
        const startGrass = new THREE.Mesh(grassGeometry, this.sharedMaterials[materialKey]);
        startGrass.rotation.x = -Math.PI / 2;
        startGrass.position.set(0, 0, zPosition);
        startGrass.receiveShadow = true;
        this.terrain.push(startGrass);
        this.scene.add(startGrass);
    }
    
    async createRoadSection(startZ, endZ) {
        const height = endZ - startZ;
        const centerZ = (startZ + endZ) / 2;
        
        let materialKey;
        switch (this.config.environment.type) {
            case 'jungle':
                materialKey = 'jungleRoad';
                break;
            case 'mars':
                materialKey = 'marsRock';
                break;
            case 'dc':
                materialKey = 'dcRoad';
                break;
            case 'digital':
                materialKey = 'digitalGround';
                break;
            default:
                materialKey = 'road';
        }
        
        const roadGeometry = new THREE.PlaneGeometry(this.screenWidth + 40, height);
        const road = new THREE.Mesh(roadGeometry, this.sharedMaterials[materialKey]);
        road.rotation.x = -Math.PI / 2;
        road.position.set(0, 0, centerZ);
        road.receiveShadow = true;
        this.terrain.push(road);
        this.scene.add(road);
        
        // Add lane markings if configured
        if (this.config.features.laneMarkings) {
            this.createLaneMarkings(centerZ);
        }
    }
    
    
    // ADD this createSafeArea method right after createRoadSection (around line 220)
// This is the MISSING method that creates the top pathway where the robots stand

async createSafeArea(startZ, endZ) {
    const height = endZ - startZ;
    const centerZ = (startZ + endZ) / 2;
    
    let materialKey;
    switch (this.config.environment.type) {
        case 'jungle':
            materialKey = 'junglePath';
            break;
        case 'mars':
            materialKey = 'metallic';
            break;
        case 'dc':
            materialKey = 'marble';
            break;
        case 'digital':
            materialKey = 'quantumGrid';
            break;
        default:
            materialKey = 'sidewalk';
    }
    
    // ✅ EXTENDED: Full width to match other sections
    const safeGeometry = new THREE.PlaneGeometry(this.screenWidth + 40, height);
    const safeArea = new THREE.Mesh(safeGeometry, this.sharedMaterials[materialKey]);
    safeArea.rotation.x = -Math.PI / 2;
    safeArea.position.set(0, 0.05, centerZ);
    safeArea.receiveShadow = true;
    this.terrain.push(safeArea);
    this.scene.add(safeArea);
}

    async createGoalArea(zPosition) {
        // Create goal platform
        let materialKey;
        switch (this.config.environment.type) {
            case 'jungle':
                materialKey = 'junglePath';
                break;
            case 'mars':
                materialKey = 'metallic';
                break;
            case 'dc':
                materialKey = 'marble';
                break;
            case 'digital':
                materialKey = 'quantumGrid';
                break;
            default:
                materialKey = 'sidewalk';
        }
        
        const goalGeometry = new THREE.PlaneGeometry(this.screenWidth + 40, 4);
        const goalPlatform = new THREE.Mesh(goalGeometry, this.sharedMaterials[materialKey]);
        goalPlatform.rotation.x = -Math.PI / 2;
        goalPlatform.position.set(0, 0, zPosition + 2);
        goalPlatform.receiveShadow = true;
        this.terrain.push(goalPlatform);
        this.scene.add(goalPlatform);
        
        // Create headquarters building
        await this.createHeadquarters(zPosition);
    }
    
    async createHeadquarters(zPosition) {
        // Create building
        const buildingGeometry = new THREE.BoxGeometry(12, 8, 4);
        const building = new THREE.Mesh(buildingGeometry, this.sharedMaterials.goalBuilding);
        building.position.set(0, 4, zPosition);
        building.castShadow = true;
        building.receiveShadow = true;
        
        // Add headquarters image
        await this.addHeadquartersImage(building);
        
        this.goals.push(building);
        this.decorations.push(building);
        this.scene.add(building);
    }
    
    async createObstacles() {
        // Create road vehicles
        await this.createRoadVehicles();
        
        // Create water/transport obstacles
        await this.createWaterObstacles();
    }
    
    async createRoadVehicles() {
        const roadConfig = this.config.roadVehicles;
        
        roadConfig.lanes.forEach((z, laneIndex) => {
            const direction = roadConfig.directions[laneIndex];
            const speed = roadConfig.speeds[laneIndex];
            const vehicleCount = roadConfig.vehiclesPerLane;
            const spacing = roadConfig.spacing;
            
            for (let i = 0; i < vehicleCount; i++) {
                // Select vehicle type based on level
                const vehicleType = roadConfig.types[Math.floor(Math.random() * roadConfig.types.length)];
                const vehicle = this.createVehicleByType(vehicleType);
                
                if (vehicle) {
                    vehicle.create();
                    
                    const bounds = this.screenWidth / 2 + 10;
                    const startX = direction > 0 ? 
                        -bounds + (i * spacing) : 
                        bounds - (i * spacing);
                    
                    vehicle.setPosition(startX, 0.3, z);
                    vehicle.setVelocity(direction * speed, 0, 0);
                    this.obstacles.push(vehicle);
                }
            }
        });
        
        console.log(`✅ Created ${this.obstacles.length} road vehicles`);
    }
    
    async createWaterObstacles() {
        const waterConfig = this.config.waterObstacles;
        
        waterConfig.lanes.forEach((z, laneIndex) => {
            const direction = waterConfig.directions[laneIndex];
            const speed = waterConfig.speeds[laneIndex];
            const obstacleCount = waterConfig.obstaclesPerLane;
            const spacing = waterConfig.spacing;
            
            for (let i = 0; i < obstacleCount; i++) {
                // Select obstacle type based on level
                const obstacleType = waterConfig.types[Math.floor(Math.random() * waterConfig.types.length)];
                const obstacle = this.createObstacleByType(obstacleType);
                
                if (obstacle) {
                    obstacle.create();
                    
                    const bounds = this.screenWidth / 2 + 10;
                    const startX = direction > 0 ? 
                        -bounds + (i * spacing) : 
                        bounds - (i * spacing);
                    
                    obstacle.setPosition(startX, 0.1, z);
                    obstacle.setVelocity(direction * speed, 0, 0);
                    obstacle.isRideable = waterConfig.allRideable;
                    obstacle.type = obstacleType;
                    this.obstacles.push(obstacle);
                }
            }
        });
        
        console.log(`✅ Created water/transport obstacles`);
    }
    
    createVehicleByType(type) {
        // This will be implemented by specific level classes or use a factory
        console.warn(`Vehicle type ${type} not implemented yet - using placeholder`);
        return new Vehicle(this.scene, 'cybertruck'); // Fallback
    }
    
    createObstacleByType(type) {
        // This will be implemented by specific level classes or use a factory
        console.warn(`Obstacle type ${type} not implemented yet - using placeholder`);
        return new Vehicle(this.scene, 'log'); // Fallback
    }
    
    async createDecorations() {
        // Create soldiers/decorations
        await this.createSoldierDecorations();
        
        // Create environment-specific decorations
        await this.createEnvironmentDecorations();
    }
    
    async createSoldierDecorations() {
        const assets = this.config.assets;
        
        // Left soldier
        await this.createSoldierImage(assets.leftSoldier, -9, 2, this.config.zones.goalArea + 2);
        
        // Right soldier  
        await this.createSoldierImage(assets.rightSoldier, 8, 2, this.config.zones.goalArea + 2);
        
        // Additional soldiers if configured
        if (assets.additionalSoldiers) {
            for (let i = 0; i < assets.additionalSoldiers.length; i++) {
                const xPos = (i % 2 === 0) ? -25 : 25; // Alternate sides
                await this.createSoldierImage(assets.additionalSoldiers[i], xPos, 4, this.config.zones.goalArea + 2);
            }
        }
    }
    
    async createEnvironmentDecorations() {
        const features = this.config.features;
        
        if (features.cityBuildings) {
            this.createCityBuildings();
        }
        
        if (features.jungleTrees) {
            this.createJungleTrees();
        }
        
        if (features.cornerBushes) {
            this.createCornerBushes();
        }
        
        if (features.marsRocks) {
            this.createMarsRocks();
        }
        
        if (features.spaceDomes) {
            this.createSpaceDomes();
        }
        
        if (features.dcMonuments) {
            this.createDCMonuments();
        }
        
        if (features.americanFlags) {
            this.createAmericanFlags();
        }
        
        if (features.governmentBuildings) {
            this.createGovernmentBuildings();
        }
        
        if (features.matrixRain) {
            this.createMatrixRain();
        }
        
        if (features.hologramGrids) {
            this.createHologramGrids();
        }
        
        if (features.quantumParticles) {
            this.createQuantumParticles();
        }
        
        if (features.neonGlow) {
            this.createNeonGlow();
        }
    }
    
    // Utility methods
    createLaneMarkings(centerZ) {
        // Create center line
        const centerLineGeometry = new THREE.PlaneGeometry(this.screenWidth, 0.15);
        const centerLine = new THREE.Mesh(centerLineGeometry, this.sharedMaterials.yellowLine);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.set(0, 0.02, centerZ);
        this.decorations.push(centerLine);
        this.scene.add(centerLine);
        
        // Create lane dashes
        const dashGeometry = new THREE.PlaneGeometry(1.2, 0.12);
        for (let lane = -2.5; lane <= 2.5; lane += 1) {
            if (lane === 0) continue;
            for (let i = -this.screenWidth/2; i < this.screenWidth/2; i += 3) {
                const laneZ = centerZ + lane * 2;
                const dash = new THREE.Mesh(dashGeometry, this.sharedMaterials.whiteLine);
                dash.rotation.x = -Math.PI / 2;
                dash.position.set(i, 0.02, laneZ);
                this.decorations.push(dash);
                this.scene.add(dash);
            }
        }
    }
    
    async createSoldierImage(filename, x, y, z) {
        try {
            const texture = await this.loadTexture(filename);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,
                opacity: 1.0
            });
            
            const geometry = new THREE.PlaneGeometry(4, 4);
            const image = new THREE.Mesh(geometry, material);
            image.position.set(x, y, z);
            image.castShadow = false;
            image.receiveShadow = false;
            
            this.decorations.push(image);
            this.scene.add(image);
            
            console.log(`✅ Added soldier decoration: ${filename}`);
        } catch (error) {
            console.warn(`⚠️ Could not load ${filename}, using placeholder`);
            this.createPlaceholderCube(x, y, z, 0xff6600);
        }
    }
    
    async addHeadquartersImage(building) {
        try {
            const texture = await this.loadTexture(this.config.assets.headquarters);
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.generateMipmaps = false;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,
                opacity: 1.0
            });
            
            const geometry = new THREE.PlaneGeometry(12, 6);
            const image = new THREE.Mesh(geometry, material);
            image.position.set(0, 0, 2.01);
            image.castShadow = false;
            image.receiveShadow = false;
            
            building.add(image);
            console.log(`✅ Added headquarters image: ${this.config.assets.headquarters}`);
        } catch (error) {
            console.warn(`⚠️ Could not load headquarters image, using placeholder`);
        }
    }
    
    loadTexture(url) {
        return new Promise((resolve, reject) => {
            this.textureLoader.load(
                url,
                (texture) => resolve(texture),
                (progress) => console.log('📥 Loading texture...'),
                (error) => reject(error)
            );
        });
    }
    
    createPlaceholderCube(x, y, z, color) {
        const geometry = new THREE.BoxGeometry(3, 3, 3);
        const material = new THREE.MeshLambertMaterial({ 
            color: color,
            emissive: color * 0.1,
            emissiveIntensity: 0.3
        });
        
        const cube = new THREE.Mesh(geometry, material);
        cube.position.set(x, y, z);
        cube.castShadow = false;
        cube.receiveShadow = false;
        
        this.decorations.push(cube);
        this.scene.add(cube);
    }
    
    // Environment-specific decoration methods (to be overridden by subclasses)
    createCityBuildings() {
        console.log('🏢 Creating city buildings...');
        // Implementation would go here
    }
    
    createJungleTrees() {
        console.log('🌳 Creating jungle trees...');
        // Implementation would go here  
    }
    
    createCornerBushes() {
        console.log('🌿 Creating corner bushes...');
        // Implementation would go here
    }

// FIXES FOR BaseLevel.js

// 1. REPLACE the createWaterSection method to extend water full width:
async createWaterSection(startZ, endZ) {
    const height = endZ - startZ;
    const centerZ = (startZ + endZ) / 2;
    
    let materialKey;
    switch (this.config.environment.type) {
        case 'jungle':
            materialKey = 'swampWater';
            break;
        case 'mars':
            materialKey = 'marsTransportLane'; // ✅ NEW: Use grey Mars transport lanes
            break;
        case 'dc':
            materialKey = 'potomacRiver';
            break;
        case 'digital':
            materialKey = 'dataStream';
            break;
        default:
            materialKey = 'water';
    }
    
    // ✅ FIXED: Increased width from screenWidth + 20 to full extension
    const waterGeometry = new THREE.PlaneGeometry(this.screenWidth + 40, height); // Was +20, now +40
    const water = new THREE.Mesh(waterGeometry, this.sharedMaterials[materialKey]);
    water.rotation.x = -Math.PI / 2;
    water.position.set(0, -0.05, centerZ);
    this.terrain.push(water);
    this.scene.add(water);
}
// REPLACE the createMarsRocks method in BaseLevel.js with this version
// This targets the actual visible screen areas you're pointing to

// REPLACE these two methods in BaseLevel.js


// 2. IMPROVED Mars rocks - more rocks, no cubes, better variety:
createMarsRocks() {
    console.log('🪨 Creating improved Mars rocks with natural shapes...');
    
    // ✅ BETTER: 4 rock sizes for good variety
    const rockSizes = [
        { radius: 1.5, height: 1.2 },   // Small rocks
        { radius: 2.8, height: 2.0 },   // Medium rocks  
        { radius: 4.2, height: 3.0 },   // Large rocks
        { radius: 5.5, height: 4.0 }    // Extra large rocks
    ];
    
    // ✅ MORE ROCKS in visible but safe areas
    const rockPositions = [
        // ✅ BACKGROUND AREA (behind SpaceX HQ)
        { x: -30, z: -35, sizeIndex: 2 },   // Large rock top left back
        { x: -15, z: -38, sizeIndex: 1 },   // Medium rock left back
        { x: 0, z: -40, sizeIndex: 3 },     // Extra large center back
        { x: 15, z: -38, sizeIndex: 1 },    // Medium rock right back
        { x: 30, z: -35, sizeIndex: 2 },    // Large rock top right back
        { x: -22, z: -45, sizeIndex: 0 },   // Small rock far left back
        { x: 22, z: -45, sizeIndex: 0 },    // Small rock far right back
        
        // ✅ CORNER DECORATIONS (safe from gameplay)
        { x: -40, z: 30, sizeIndex: 1 },    // Medium rock bottom left corner
        { x: 40, z: 30, sizeIndex: 1 },     // Medium rock bottom right corner
        { x: -45, z: 0, sizeIndex: 0 },     // Small rock left side
        { x: 45, z: 0, sizeIndex: 0 },      // Small rock right side
        { x: -50, z: -20, sizeIndex: 2 },   // Large rock far left
        { x: 50, z: -20, sizeIndex: 2 },    // Large rock far right
        
        // ✅ STARTING AREA DECORATION (visible enhancement)
        { x: -25, z: 35, sizeIndex: 1 },    // Medium rock bottom left
        { x: 25, z: 35, sizeIndex: 1 },     // Medium rock bottom right
        { x: 0, z: 38, sizeIndex: 0 },      // Small rock center bottom
        { x: -12, z: 32, sizeIndex: 0 },    // Small rock left
        { x: 12, z: 32, sizeIndex: 0 }      // Small rock right
    ];
    
    // ✅ NATURAL Mars rock material
    const marsRockMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x8B4513,        // Mars reddish-brown
        emissive: 0x331a0d,     // Subtle warm glow
        emissiveIntensity: 0.08
    });
    
    // Create rocks with natural variation
    rockPositions.forEach((pos, index) => {
        const size = rockSizes[pos.sizeIndex];
        
        // ✅ NO CUBES: Only spheres and natural irregular shapes
        let rockGeometry;
        if (index % 4 === 0) {
            // Sphere rocks (most natural)
            rockGeometry = new THREE.SphereGeometry(size.radius, 10, 8);
        } else if (index % 4 === 1) {
            // Flattened spheres (boulder-like)
            rockGeometry = new THREE.SphereGeometry(size.radius, 10, 8);
            // Flatten on Y axis for boulder look
            const vertices = rockGeometry.attributes.position.array;
            for (let i = 1; i < vertices.length; i += 3) { // Y coordinates
                vertices[i] *= 0.7; // Flatten to 70% height
            }
            rockGeometry.attributes.position.needsUpdate = true;
        } else if (index % 4 === 2) {
            // Dodecahedron (natural crystal-like)
            rockGeometry = new THREE.DodecahedronGeometry(size.radius * 0.8);
        } else {
            // Icosahedron (another natural crystal shape)
            rockGeometry = new THREE.IcosahedronGeometry(size.radius * 0.9, 1);
        }
        
        // ✅ NATURAL deformation for organic look
        const vertices = rockGeometry.attributes.position.array;
        for (let i = 0; i < vertices.length; i += 3) {
            const deformation = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
            vertices[i] *= deformation;     // X
            vertices[i + 1] *= deformation; // Y  
            vertices[i + 2] *= deformation; // Z
        }
        rockGeometry.attributes.position.needsUpdate = true;
        rockGeometry.computeVertexNormals();
        
        const rock = new THREE.Mesh(rockGeometry, marsRockMaterial);
        
        // Position naturally on ground
        rock.position.set(pos.x, size.height / 2, pos.z);
        
        // ✅ NATURAL rotation - looks like rocks settled naturally
        rock.rotation.x = (Math.random() - 0.5) * 0.4; // Small tilt
        rock.rotation.y = Math.random() * Math.PI * 2;  // Any direction
        rock.rotation.z = (Math.random() - 0.5) * 0.4; // Small tilt
        
        // ✅ SUBTLE size variation for natural diversity
        const scaleVariation = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
        rock.scale.setScalar(scaleVariation);
        
        rock.castShadow = true;
        rock.receiveShadow = true;
        
        this.decorations.push(rock);
        this.scene.add(rock);
    });
    
    console.log(`✅ Created ${rockPositions.length} natural Mars rocks with organic shapes`);
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
    createDCMonuments() {
        console.log('🏛️ Creating D.C. monuments...');
        
        // Washington Monument (tall obelisk)
        const monumentGeometry = new THREE.CylinderGeometry(1, 1.5, 20, 8);
        const monument = new THREE.Mesh(monumentGeometry, this.sharedMaterials.marble);
        monument.position.set(-45, 10, 5);
        monument.castShadow = true;
        monument.receiveShadow = true;
        
        // Lincoln Memorial (wide building)
        const lincolnGeometry = new THREE.BoxGeometry(15, 8, 10);
        const lincoln = new THREE.Mesh(lincolnGeometry, this.sharedMaterials.marble);
        lincoln.position.set(45, 4, 0);
        lincoln.castShadow = true;
        lincoln.receiveShadow = true;
        
        // Capitol Building (dome structure)
        const domeGeometry = new THREE.SphereGeometry(5, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
        const capitolDome = new THREE.Mesh(domeGeometry, this.sharedMaterials.whitehouse);
        capitolDome.position.set(0, 8, -25);
        
        const capitolBaseGeometry = new THREE.BoxGeometry(20, 6, 15);
        const capitolBase = new THREE.Mesh(capitolBaseGeometry, this.sharedMaterials.marble);
        capitolBase.position.set(0, 3, -25);
        capitolBase.castShadow = true;
        
        this.decorations.push(monument, lincoln, capitolDome, capitolBase);
        this.scene.add(monument);
        this.scene.add(lincoln);
        this.scene.add(capitolDome);
        this.scene.add(capitolBase);
        
        console.log('✅ D.C. monuments created');
    }
    
    createAmericanFlags() {
        console.log('🇺🇸 Creating American flags...');
        
        const flagPositions = [
            { x: -20, z: 10 }, { x: 20, z: 10 },
            { x: -30, z: -5 }, { x: 30, z: -5 },
            { x: 0, z: 20 }, { x: 0, z: -30 }
        ];
        
        flagPositions.forEach((pos) => {
            // Flag pole
            const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 12, 8);
            const pole = new THREE.Mesh(poleGeometry, this.sharedMaterials.metallic);
            pole.position.set(pos.x, 6, pos.z);
            pole.castShadow = true;
            
            // Flag (red, white, blue pattern)
            const flagGeometry = new THREE.PlaneGeometry(4, 2.5);
            const flagMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xff0000,  // Red for now, could be texture later
                side: THREE.DoubleSide
            });
            const flag = new THREE.Mesh(flagGeometry, flagMaterial);
            flag.position.set(pos.x + 2, 10, pos.z);
            
            this.decorations.push(pole, flag);
            this.scene.add(pole);
            this.scene.add(flag);
        });
        
        console.log('✅ American flags created');
    }
    
    createGovernmentBuildings() {
        console.log('🏢 Creating government buildings...');
        
        // Pentagon-style building
        const pentagonGeometry = new THREE.CylinderGeometry(8, 10, 6, 5);
        const pentagon = new THREE.Mesh(pentagonGeometry, this.sharedMaterials.building1);
        pentagon.position.set(-50, 3, -15);
        pentagon.castShadow = true;
        
        // FBI Building
        const fbiGeometry = new THREE.BoxGeometry(12, 15, 8);
        const fbi = new THREE.Mesh(fbiGeometry, this.sharedMaterials.building2);
        fbi.position.set(50, 7.5, -10);
        fbi.castShadow = true;
        
        // Supreme Court
        const courtGeometry = new THREE.BoxGeometry(18, 10, 12);
        const court = new THREE.Mesh(courtGeometry, this.sharedMaterials.marble);
        court.position.set(-35, 5, 25);
        court.castShadow = true;
        
        this.decorations.push(pentagon, fbi, court);
        this.scene.add(pentagon);
        this.scene.add(fbi);
        this.scene.add(court);
        
        console.log('✅ Government buildings created');
    }
    
    createMatrixRain() {
        console.log('💚 Creating matrix rain effect...');
        
        // Create digital "rain" falling from the sky
        for (let i = 0; i < 50; i++) {
            const rainGeometry = new THREE.BoxGeometry(0.1, 2, 0.1);
            const rainMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x00ff00,
                emissive: 0x004400,
                emissiveIntensity: 0.6,
                transparent: true,
                opacity: 0.7
            });
            
            const rainDrop = new THREE.Mesh(rainGeometry, rainMaterial);
            rainDrop.position.set(
                (Math.random() - 0.5) * 100,
                Math.random() * 30 + 10,
                (Math.random() - 0.5) * 60
            );
            
            this.decorations.push(rainDrop);
            this.scene.add(rainDrop);
        }
        
        console.log('✅ Matrix rain created');
    }
    
    createHologramGrids() {
        console.log('🔷 Creating hologram grids...');
        
        // Create floating holographic grid planes
        const gridPositions = [
            { x: -25, y: 8, z: 10 }, { x: 25, y: 12, z: 5 },
            { x: 0, y: 15, z: -20 }, { x: -40, y: 6, z: -5 }
        ];
        
        gridPositions.forEach((pos) => {
            const gridGeometry = new THREE.PlaneGeometry(8, 8, 8, 8);
            const gridMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x0066ff,
                wireframe: true,
                transparent: true,
                opacity: 0.4,
                emissive: 0x002244,
                emissiveIntensity: 0.3
            });
            
            const grid = new THREE.Mesh(gridGeometry, gridMaterial);
            grid.position.set(pos.x, pos.y, pos.z);
            grid.rotation.x = Math.random() * Math.PI;
            grid.rotation.y = Math.random() * Math.PI;
            
            this.decorations.push(grid);
            this.scene.add(grid);
        });
        
        console.log('✅ Hologram grids created');
    }
    
    createQuantumParticles() {
        console.log('⚛️ Creating quantum particles...');
        
        // Create floating glowing particles
        for (let i = 0; i < 30; i++) {
            const particleGeometry = new THREE.SphereGeometry(0.3, 8, 6);
            const particleMaterial = new THREE.MeshLambertMaterial({ 
                color: Math.random() > 0.5 ? 0x00ffff : 0xff00ff,
                emissive: Math.random() > 0.5 ? 0x006666 : 0x660066,
                emissiveIntensity: 0.8,
                transparent: true,
                opacity: 0.8
            });
            
            const particle = new THREE.Mesh(particleGeometry, particleMaterial);
            particle.position.set(
                (Math.random() - 0.5) * 80,
                Math.random() * 20 + 5,
                (Math.random() - 0.5) * 50
            );
            
            this.decorations.push(particle);
            this.scene.add(particle);
        }
        
        console.log('✅ Quantum particles created');
    }
    
    createNeonGlow() {
        console.log('💡 Creating neon glow effects...');
        
        // Create neon light strips along the boundaries
        const neonPositions = [
            { x: -40, z: 0, width: 2, height: 50 },
            { x: 40, z: 0, width: 2, height: 50 },
            { x: 0, z: 25, width: 80, height: 2 },
            { x: 0, z: -25, width: 80, height: 2 }
        ];
        
        neonPositions.forEach((pos) => {
            const neonGeometry = new THREE.PlaneGeometry(pos.width, pos.height);
            const neonMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x00ffff,
                emissive: 0x006666,
                emissiveIntensity: 1.0,
                transparent: true,
                opacity: 0.6,
                side: THREE.DoubleSide
            });
            
            const neon = new THREE.Mesh(neonGeometry, neonMaterial);
            neon.position.set(pos.x, 5, pos.z);
            neon.rotation.x = -Math.PI / 2;
            
            this.decorations.push(neon);
            this.scene.add(neon);
        });
        
        console.log('✅ Neon glow effects created');
    }
    
    // Standard level methods
    update(deltaTime) {
        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.update(deltaTime);
            
            // Handle boundary wrapping
            const screenBound = this.screenWidth / 2 + 15;
            
            if (obstacle.velocity.x > 0 && obstacle.position.x > screenBound) {
                const newX = this.calculateRespawnPosition(obstacle, 'right');
                obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
            } else if (obstacle.velocity.x < 0 && obstacle.position.x < -screenBound) {
                const newX = this.calculateRespawnPosition(obstacle, 'left');
                obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
            }
        });
        
        // Animate goal building (subtle glow effect)
        const time = Date.now() * 0.001;
        this.goals.forEach(goal => {
            if (goal.children && goal.children[0]) {
                const image = goal.children[0];
                if (image.material && image.material.opacity !== undefined) {
                    image.material.opacity = 0.9 + Math.sin(time * 2) * 0.1;
                }
            }
        });
    }
    
    calculateRespawnPosition(obstacle, direction) {
        const laneObstacles = this.obstacles.filter(o => 
            o !== obstacle && 
            Math.abs(o.position.z - obstacle.position.z) < 1
        );
        
        if (laneObstacles.length === 0) {
            const screenBound = this.screenWidth / 2 + 15;
            return direction === 'right' ? -screenBound - 5 : screenBound + 5;
        }
        
        let furthestObstacle;
        if (direction === 'right') {
            furthestObstacle = laneObstacles.reduce((leftmost, current) => 
                current.position.x < leftmost.position.x ? current : leftmost
            );
            return furthestObstacle.position.x - 17;
        } else {
            furthestObstacle = laneObstacles.reduce((rightmost, current) => 
                current.position.x > rightmost.position.x ? current : rightmost
            );
            return furthestObstacle.position.x + 17;
        }
    }
    
    getObstacles() {
        return this.obstacles;
    }
    
    getGoals() {
        return this.goals;
    }
    
    dispose() {
        console.log(`🧹 Disposing Level ${this.levelNumber}...`);
        
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
        
        console.log(`✅ Level disposed`);
    }
}