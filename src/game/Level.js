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
                // In your existing Level.js, add this case to the create() method:
case 3:
    await this.createLevel3_MarsColony();
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
        
        // ✅ ADD: InfoWarsPepe decorations for Level 2
        await this.createInfoWarsPepeDecorations();
        
           // ✅ NEW: Add AlexJones decorations
    await this.createAlexJonesDecorations();

    await this.createAlexJones2Decorations();
        console.log('✅ Jungle Swamp created with faster gameplay');
    }


    // ✅ UPDATED: Try different approaches for dogesolider.png
    async createInfoWarsPepeDecorations() {
        // Try multiple possible filenames
        const possibleFilenames = ['/dogesolider.png', '/dogesoldier.png', '/DogeSoldier.png', '/dogesolider.jpg'];
        
        for (const filename of possibleFilenames) {
            try {
                console.log(`🐕 Attempting to load ${filename}...`);
                const dogeTexture = await this.loadTexture(filename);
                
                // ✅ VIBRANT IMAGE SETTINGS: Same as other images
                dogeTexture.colorSpace = THREE.SRGBColorSpace;
                dogeTexture.generateMipmaps = false;
                dogeTexture.minFilter = THREE.LinearFilter;
                dogeTexture.magFilter = THREE.LinearFilter;
                
                const dogeMaterial = new THREE.MeshBasicMaterial({
                    map: dogeTexture,
                    transparent: true,
                    alphaTest: 0.1,
                    side: THREE.DoubleSide,
                    toneMapped: false,
                    opacity: 1.0
                });
                
                const dogeGeometry = new THREE.PlaneGeometry(4, 4);
                // Left DogeSoldier (by jungle temple)
                const leftDoge = new THREE.Mesh(dogeGeometry, dogeMaterial.clone());
                leftDoge.position.set(-8, 2, -14);
                leftDoge.castShadow = false;
                leftDoge.receiveShadow = false;
                // Right DogeSoldier (by jungle temple)
                const rightDoge = new THREE.Mesh(dogeGeometry, dogeMaterial.clone());
                rightDoge.position.set(8, 2, -14);
                rightDoge.castShadow = false;
                rightDoge.receiveShadow = false;
                this.decorations.push(leftDoge);
                this.decorations.push(rightDoge);
                this.scene.add(leftDoge);
                this.scene.add(rightDoge);
                
                console.log(`✅ Successfully loaded and added DogeSoldier decorations using ${filename}`);
                return; // Success! Exit the function
                
            } catch (error) {
                console.warn(`❌ Failed to load ${filename}:`, error.message);
                continue; // Try next filename
            }
        }
        
        // If all filenames failed, use placeholder
        console.error('❌ All DogeSoldier image attempts failed, using placeholder');
        this.createPlaceholderInfoWarsPepes();
    }

    // ✅ FIXED: Placeholder if dogesolider.png fails to load
    createPlaceholderInfoWarsPepes() {
        const placeholderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffd700, // ✅ CHANGED: Gold color for Doge theme
            emissive: 0x444400,
            emissiveIntensity: 0.3
        });
        
        const placeholderGeometry = new THREE.BoxGeometry(3, 3, 3);
        
        const leftPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        leftPlaceholder.position.set(-8, 1.5, -14);
        leftPlaceholder.castShadow = false;
        leftPlaceholder.receiveShadow = false;
        
        const rightPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial.clone());
        rightPlaceholder.position.set(8, 1.5, -14);
        rightPlaceholder.castShadow = false;
        rightPlaceholder.receiveShadow = false;
        
        this.decorations.push(leftPlaceholder);
        this.decorations.push(rightPlaceholder);
        this.scene.add(leftPlaceholder);
        this.scene.add(rightPlaceholder);
        
        console.log('✅ Added placeholder DogeSoldier decorations (gold cubes)');
    }
        // In Level.js - Replace the createAlexJonesDecorations() method:

async createAlexJonesDecorations() {
    // Try multiple possible filenames for alexjones.png
    const possibleFilenames = ['/alexjones.png', '/AlexJones.png', '/alex-jones.png', '/alex_jones.png'];
    
    for (const filename of possibleFilenames) {
        try {
            console.log(`📢 Attempting to load ${filename}...`);
            const alexTexture = await this.loadTexture(filename);
            
            // ✅ VIBRANT IMAGE SETTINGS: Same as other images
            alexTexture.colorSpace = THREE.SRGBColorSpace;
            alexTexture.generateMipmaps = false;
            alexTexture.minFilter = THREE.LinearFilter;
            alexTexture.magFilter = THREE.LinearFilter;
            
            const alexMaterial = new THREE.MeshBasicMaterial({
                map: alexTexture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,
                opacity: 1.0
            });
            
            // ✅ BIGGER SIZE: 80% bigger than original 4x4
            const alexSize = 4 * 1.8; // 4 * 1.8 = 7.2 (80% bigger)
            const alexGeometry = new THREE.PlaneGeometry(alexSize, alexSize);
            
            // ✅ SINGLE SIDE: Only right side of temple
            const rightAlex = new THREE.Mesh(alexGeometry, alexMaterial);
            rightAlex.position.set(-25, 4, -14); // Right side only
            rightAlex.castShadow = false;
            rightAlex.receiveShadow = false;
            
            this.decorations.push(rightAlex);
            this.scene.add(rightAlex);
            
            console.log(`✅ Successfully added single AlexJones decoration (80% bigger) using ${filename}`);
            return; // Success! Exit the function
            
        } catch (error) {
            console.warn(`❌ Failed to load ${filename}:`, error.message);
            continue; // Try next filename
        }
    }
    
    // If all filenames failed, use placeholder
    console.error('❌ All AlexJones image attempts failed, using placeholder');
    this.createPlaceholderAlexJones();
}

// ✅ UPDATED PLACEHOLDER: Single side and bigger
createPlaceholderAlexJones() {
    const placeholderMaterial = new THREE.MeshLambertMaterial({ 
        color: 0xff6600, // Orange color for Alex Jones theme
        emissive: 0x442200,
        emissiveIntensity: 0.3
    });
    
    // ✅ BIGGER PLACEHOLDER: 80% bigger
    const placeholderSize = 3 * 1.8; // 3 * 1.8 = 5.4 (80% bigger)
    const placeholderGeometry = new THREE.BoxGeometry(placeholderSize, placeholderSize, placeholderSize);
    
    // ✅ SINGLE SIDE: Only right side
    const rightPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    rightPlaceholder.position.set(12, 1.5, -14); // Right side only
    rightPlaceholder.castShadow = false;
    rightPlaceholder.receiveShadow = false;
    
    this.decorations.push(rightPlaceholder);
    this.scene.add(rightPlaceholder);
    
    console.log('✅ Added single placeholder AlexJones decoration (80% bigger, orange cube)');
}

// In Level.js - Add this NEW method after createAlexJonesDecorations():

async createAlexJones2Decorations() {
    // Try multiple possible filenames for alexjones2.png
    const possibleFilenames = ['/alexjones2.png', '/AlexJones2.png', '/alex-jones2.png', '/alex_jones2.png'];
    
    for (const filename of possibleFilenames) {
        try {
            console.log(`📢 Attempting to load second AlexJones: ${filename}...`);
            const alex2Texture = await this.loadTexture(filename);
            
            // ✅ VIBRANT IMAGE SETTINGS: Same as other images
            alex2Texture.colorSpace = THREE.SRGBColorSpace;
            alex2Texture.generateMipmaps = false;
            alex2Texture.minFilter = THREE.LinearFilter;
            alex2Texture.magFilter = THREE.LinearFilter;
            
            const alex2Material = new THREE.MeshBasicMaterial({
                map: alex2Texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide,
                toneMapped: false,
                opacity: 1.0
            });
            
            // ✅ SAME SIZE: 80% bigger than original 4x4 (to match the first one)
            const alex2Size = 4 * 1.8; // 4 * 1.8 = 7.2 (80% bigger)
            const alex2Geometry = new THREE.PlaneGeometry(alex2Size, alex2Size);
            
            // ✅ RIGHT SIDE: Mirror position of the moved alexjones.png
            const rightAlex2 = new THREE.Mesh(alex2Geometry, alex2Material);
            rightAlex2.position.set(25, 4, -14); // Right side - mirror of left side (-25)
            rightAlex2.castShadow = false;
            rightAlex2.receiveShadow = false;
            
            this.decorations.push(rightAlex2);
            this.scene.add(rightAlex2);
            
            console.log(`✅ Successfully added AlexJones2 decoration (right side, 80% bigger) using ${filename}`);
            return; // Success! Exit the function
            
        } catch (error) {
            console.warn(`❌ Failed to load ${filename}:`, error.message);
            continue; // Try next filename
        }
    }
    
    // If all filenames failed, use placeholder
    console.error('❌ All AlexJones2 image attempts failed, using placeholder');
    this.createPlaceholderAlexJones2();
}

// ✅ PLACEHOLDER for AlexJones2 if image fails
createPlaceholderAlexJones2() {
    const placeholderMaterial = new THREE.MeshLambertMaterial({ 
        color: 0x0066ff, // ✅ BLUE color to distinguish from first AlexJones (orange)
        emissive: 0x002244,
        emissiveIntensity: 0.3
    });
    
    // ✅ SAME SIZE: 80% bigger
    const placeholderSize = 3 * 1.8; // 3 * 1.8 = 5.4 (80% bigger)
    const placeholderGeometry = new THREE.BoxGeometry(placeholderSize, placeholderSize, placeholderSize);
    
    // ✅ RIGHT SIDE: Mirror position
    const rightPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    rightPlaceholder.position.set(25, 2, -14); // Right side position
    rightPlaceholder.castShadow = false;
    rightPlaceholder.receiveShadow = false;
    
    this.decorations.push(rightPlaceholder);
    this.scene.add(rightPlaceholder);
    
    console.log('✅ Added placeholder AlexJones2 decoration (right side, 80% bigger, blue cube)');
}

// ✅ THEN ADD THIS CALL in createLevel2_JungleSwamp() method:
// Find this section and add the new line:




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
        
        // ✅ REMOVED: Temple decorations (moss, pillars)
        // this.addTempleDecorations(temple);
        
        // ✅ NEW: Add InfoWarsSign instead of temple glow
        this.addInfoWarsSign(temple);
        
        this.goals.push(temple);
        this.decorations.push(temple);
        this.scene.add(temple);
        
        console.log('✅ Clean jungle temple area created with InfoWarsSign');
    }
    
    // ✅ ENHANCED: Try multiple approaches for infowarssign.png
    async addInfoWarsSign(building) {
        // Try multiple possible filenames and extensions
        const possibleFilenames = [
            '/infowarssign.png', '/InfoWarsSign.png', '/infowars-sign.png', 
            '/infowars_sign.png', '/infowarssign.jpg', '/InfoWarsSign.jpg'
        ];
        
        for (const filename of possibleFilenames) {
            try {
                console.log(`📋 Attempting to load InfoWars sign: ${filename}...`);
                const infowarsSignTexture = await this.loadTexture(filename);
                
                // ✅ VIBRANT IMAGE SETTINGS: Same as other images
                infowarsSignTexture.colorSpace = THREE.SRGBColorSpace;
                infowarsSignTexture.generateMipmaps = false;
                infowarsSignTexture.minFilter = THREE.LinearFilter;
                infowarsSignTexture.magFilter = THREE.LinearFilter;
                
                const infowarsSignMaterial = new THREE.MeshBasicMaterial({
                    map: infowarsSignTexture,
                    transparent: true,
                    alphaTest: 0.1,
                    side: THREE.DoubleSide,
                    toneMapped: false,
                    opacity: 1.0
                });
                
                // Size the image appropriately for the building front
                const imageWidth = 12;   // Fits nicely on 12-unit wide building
                const imageHeight = 6;  // Good proportions
                const infowarsSignGeometry = new THREE.PlaneGeometry(imageWidth, imageHeight);
                const infowarsSignImage = new THREE.Mesh(infowarsSignGeometry, infowarsSignMaterial);
                
                // Position on the front face of the building
                infowarsSignImage.position.set(0, 0, 2.01); // Slightly in front of building face
                infowarsSignImage.castShadow = false;
                infowarsSignImage.receiveShadow = false;
                
                building.add(infowarsSignImage);
                console.log(`✅ Successfully loaded InfoWarsSign using ${filename}`);
                return; // Success! Exit the function
                
            } catch (error) {
                console.warn(`❌ Failed to load ${filename}:`, error.message);
                continue; // Try next filename
            }
        }
        
        // If all attempts failed, create text placeholder
        console.error('❌ All InfoWarsSign image attempts failed, creating text placeholder');
        this.createInfoWarsTextPlaceholder(building);
    }
    
    // ✅ NEW: Text placeholder if image fails
    createInfoWarsTextPlaceholder(building) {
        // Create simple text geometry as fallback
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 256;
        
        // Fill with orange background
        context.fillStyle = '#ff6600';
        context.fillRect(0, 0, 512, 256);
        
        // Add white text
        context.fillStyle = '#ffffff';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.fillText('INFO WARS', 256, 128);
        context.fillText('SIGN', 256, 180);
        
        // Create material from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: false
        });
        
        const geometry = new THREE.PlaneGeometry(12, 6);
        const placeholder = new THREE.Mesh(geometry, material);
        placeholder.position.set(0, 0, 2.01);
        placeholder.castShadow = false;
        placeholder.receiveShadow = false;
        
        building.add(placeholder);
        console.log('✅ Created InfoWars text placeholder');
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
    
    // Enhanced vehicles with 1.5x speed multiplier - FIXED LANE POSITIONS
    createJungleVehicles() {
        console.log('🚗 Creating faster jungle vehicles with custom textures...');
        

        const lanePositions = [13, 11, 9, 7, 5];
        const laneDirections = [1, -1, 1, -1, 1];
        const laneSpeeds = [9.5, 4.0, 3.5, 5.0, 7.8];


        lanePositions.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            const numVehicles = 7; // Back to normal
       
            
            for (let i = 0; i < numVehicles; i++) {
                let vehicle;
                const random = Math.random();
                if (random < 0.35) {
                    // ✅ Use AngryFrog instead of Cybertruck
                    vehicle = new AngryFrogVehicle(this.scene);
                } else if (random < 0.7) {
                    // ✅ Use Protestor instead of Taxi
                    vehicle = new ProtestorVehicle(this.scene);
                } else {
                    // ✅ Use LeftyVan instead of Bus/Sportscar
                    vehicle = new LeftyVanVehicle(this.scene);
                }
                
                vehicle.create();
                
                const extendedSpacing = 17;
                const extendedBounds = this.screenWidth/2 + 10;
                const startX = direction > 0 ? 
                    -extendedBounds + (i * extendedSpacing) : 
                    extendedBounds - (i * extendedSpacing);
                
                vehicle.setPosition(startX, 0.3, z);
                vehicle.setVelocity(direction * speed, 0, 0);
                this.obstacles.push(vehicle);
            }
        });
        
        console.log(`✅ ${this.obstacles.length} faster jungle vehicles created with custom textures`);
    }
    

    // Add this temporary method to Level.js in the Level class
// This creates red debug cubes to help you see exactly where the blue is visible

createDebugBlueDetectors() {
    console.log('🔍 Creating debug cubes to find blue sky areas...');
    
    // Create red debug cubes in the areas where blue might be visible
    const debugPositions = [
        // Top corners at various heights and distances
        { x: 30, y: 5, z: 20 }, { x: 35, y: 5, z: 25 }, { x: 40, y: 5, z: 30 },
        { x: 30, y: 8, z: 20 }, { x: 35, y: 8, z: 25 }, { x: 40, y: 8, z: 30 },
        { x: 30, y: 12, z: 20 }, { x: 35, y: 12, z: 25 }, { x: 40, y: 12, z: 30 },
        
        { x: -30, y: 5, z: 20 }, { x: -35, y: 5, z: 25 }, { x: -40, y: 5, z: 30 },
        { x: -30, y: 8, z: 20 }, { x: -35, y: 8, z: 25 }, { x: -40, y: 8, z: 30 },
        { x: -30, y: 12, z: 20 }, { x: -35, y: 12, z: 25 }, { x: -40, y: 12, z: 30 },
        
        // Far corners
        { x: 50, y: 5, z: 35 }, { x: 55, y: 8, z: 40 }, { x: 60, y: 12, z: 45 },
        { x: -50, y: 5, z: 35 }, { x: -55, y: 8, z: 40 }, { x: -60, y: 12, z: 45 }
    ];
    
    const debugMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Bright red
    const debugGeometry = new THREE.BoxGeometry(2, 2, 2);
    
    debugPositions.forEach((pos, index) => {
        const debugCube = new THREE.Mesh(debugGeometry, debugMaterial);
        debugCube.position.set(pos.x, pos.y, pos.z);
        debugCube.name = `debug_cube_${index}`;
        
        this.decorations.push(debugCube);
        this.scene.add(debugCube);
    });
    
    console.log('🔍 Added red debug cubes - wherever you see red, put bushes there!');
    console.log('📋 Call level.removeDebugCubes() when done');
}

// Helper to remove debug cubes
removeDebugCubes() {
    this.decorations = this.decorations.filter(obj => {
        if (obj.name && obj.name.startsWith('debug_cube_')) {
            this.scene.remove(obj);
            return false;
        }
        return true;
    });
    console.log('🧹 Debug cubes removed');
}
    // Swamp obstacles: ALL GATORS (rideable) - REVERSE ALL DIRECTIONS
    createSwampObstacles() {
        console.log('🐊 Creating swamp obstacles - ALL GATORS with ALL DIRECTIONS REVERSED...');
        
        const swampLanes = [-12, -10, -8, -6, -4];
        const laneDirections = [1, -1, 1, -1, 1]; // ✅ REVERSED AGAIN: All gators go opposite way
        // 1.5x speed for swamp obstacles

        const laneSpeeds = [4.5, 2.2, 5.2, 2.9, 4.1];

        swampLanes.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            
            // ✅ ALL lanes get gators now (rideable)
            this.createGatorLane(z, direction, speed);
        });
        
        console.log('✅ Swamp obstacles created - ALL GATORS with ALL DIRECTIONS REVERSED (rideable)');
    }
    
    // ✅ RENAMED and UPDATED: All lanes use gators now
    createGatorLane(z, direction, speed) {
        const numGators = 5; // Same as lily pads
        
        for (let i = 0; i < numGators; i++) {
            // ✅ ALL gators now (rideable like logs)
            const gator = new GatorLog(this.scene);
            gator.create();
            
            const spacing = 14;
            const extendedBounds = this.screenWidth/2 + 10;
            const startX = direction > 0 ? 
                -extendedBounds + (i * spacing) : 
                extendedBounds - (i * spacing);
            
            gator.setPosition(startX, 0.1, z);
            gator.setVelocity(direction * speed, 0, 0);
            gator.isRideable = true; // All gators are rideable
            gator.type = 'gator';
            
            this.obstacles.push(gator);
        }
    }
    
    createJungleTrees() {
        console.log('🌳 Creating jungle trees and corner bushes...');
        
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
        
        // Create trees
        jungleTreePositions.forEach((pos, index) => {
            const trunkGeometry = new THREE.CylinderGeometry(0.4, 0.5, 4, 8);
            const trunk = new THREE.Mesh(trunkGeometry, this.sharedMaterials.trunk);
            trunk.position.set(pos.x, 2, pos.z);
            trunk.castShadow = true;
            
            const foliageSize = 2.5 + (index % 4) * 0.3;
            const foliageGeometry = new THREE.SphereGeometry(foliageSize, 8, 6);
            const foliage = new THREE.Mesh(foliageGeometry, this.sharedMaterials.jungleFoliage);
            foliage.position.set(pos.x, 5.5, pos.z);
            foliage.scale.set(1.2, 0.8, 1.2);
            foliage.castShadow = true;
            
            this.decorations.push(trunk);
            this.decorations.push(foliage);
            this.scene.add(trunk);
            this.scene.add(foliage);
        });
        
        // ✅ NEW: Create corner bushes to cover blue sky
        this.createCornerBushes();
        
        console.log('✅ Jungle trees and corner bushes created');
    }
    
    // In Level.js - Replace the createCornerBushes() method
createCornerBushes() {
    console.log('🌿 Creating comprehensive corner bushes to eliminate blue sky...');
    
    const bushPositions = [
        // ✅ MASSIVE TOP RIGHT CORNER COVERAGE
        { x: 35, z: 25 }, { x: 40, z: 25 }, { x: 45, z: 25 }, { x: 50, z: 25 }, { x: 55, z: 25 }, { x: 60, z: 25 },
        { x: 35, z: 30 }, { x: 40, z: 30 }, { x: 45, z: 30 }, { x: 50, z: 30 }, { x: 55, z: 30 }, { x: 60, z: 30 },
        { x: 35, z: 35 }, { x: 40, z: 35 }, { x: 45, z: 35 }, { x: 50, z: 35 }, { x: 55, z: 35 }, { x: 60, z: 35 },
        { x: 35, z: 40 }, { x: 40, z: 40 }, { x: 45, z: 40 }, { x: 50, z: 40 }, { x: 55, z: 40 }, { x: 60, z: 40 },
        { x: 35, z: 45 }, { x: 40, z: 45 }, { x: 45, z: 45 }, { x: 50, z: 45 }, { x: 55, z: 45 }, { x: 60, z: 45 },
        { x: 35, z: 50 }, { x: 40, z: 50 }, { x: 45, z: 50 }, { x: 50, z: 50 }, { x: 55, z: 50 }, { x: 60, z: 50 },
        
        // ✅ MASSIVE TOP LEFT CORNER COVERAGE  
        { x: -35, z: 25 }, { x: -40, z: 25 }, { x: -45, z: 25 }, { x: -50, z: 25 }, { x: -55, z: 25 }, { x: -60, z: 25 },
        { x: -35, z: 30 }, { x: -40, z: 30 }, { x: -45, z: 30 }, { x: -50, z: 30 }, { x: -55, z: 30 }, { x: -60, z: 30 },
        { x: -35, z: 35 }, { x: -40, z: 35 }, { x: -45, z: 35 }, { x: -50, z: 35 }, { x: -55, z: 35 }, { x: -60, z: 35 },
        { x: -35, z: 40 }, { x: -40, z: 40 }, { x: -45, z: 40 }, { x: -50, z: 40 }, { x: -55, z: 40 }, { x: -60, z: 40 },
        { x: -35, z: 45 }, { x: -40, z: 45 }, { x: -45, z: 45 }, { x: -50, z: 45 }, { x: -55, z: 45 }, { x: -60, z: 45 },
        { x: -35, z: 50 }, { x: -40, z: 50 }, { x: -45, z: 50 }, { x: -50, z: 50 }, { x: -55, z: 50 }, { x: -60, z: 50 },
        
        // ✅ RIGHT EDGE COVERAGE
        { x: 65, z: 10 }, { x: 65, z: 15 }, { x: 65, z: 20 }, { x: 65, z: 25 }, { x: 65, z: 30 }, { x: 65, z: 35 },
        { x: 70, z: 15 }, { x: 70, z: 20 }, { x: 70, z: 25 }, { x: 70, z: 30 }, { x: 70, z: 35 }, { x: 70, z: 40 },
        
        // ✅ LEFT EDGE COVERAGE
        { x: -65, z: 10 }, { x: -65, z: 15 }, { x: -65, z: 20 }, { x: -65, z: 25 }, { x: -65, z: 30 }, { x: -65, z: 35 },
        { x: -70, z: 15 }, { x: -70, z: 20 }, { x: -70, z: 25 }, { x: -70, z: 30 }, { x: -70, z: 35 }, { x: -70, z: 40 }
    ];
    
    bushPositions.forEach((pos) => {
        // Create larger, taller bushes
        const bushGeometry = new THREE.SphereGeometry(4, 8, 6);  // ✅ BIGGER: Increased from 3 to 4
        const bush = new THREE.Mesh(bushGeometry, this.sharedMaterials.jungleFoliage);
        bush.position.set(pos.x, 2.5, pos.z); // ✅ TALLER: Increased from 1.5 to 2.5
        bush.scale.set(1.8, 0.8, 1.8); // ✅ WIDER: Increased from 1.5 to 1.8
        bush.castShadow = true;
        
        this.decorations.push(bush);
        this.scene.add(bush);
    });
    
    console.log(`✅ Added ${bushPositions.length} bigger corner bushes to completely block blue sky`);
}
    
    createVineDecorations() {
        console.log('🌿 Skipping vine decorations to remove sticks...');
        // ✅ REMOVED: All vine creation code to eliminate the stick decorations
        console.log('✅ Vine decorations skipped - no more sticks');
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
    
    update(deltaTime) {
        // ✅ NEW: More robust obstacle position management
        this.obstacles.forEach((obstacle, index) => {
            obstacle.update(deltaTime);
            
            // ✅ IMPROVED: Better boundary detection and reset
            const screenBound = this.screenWidth / 2 + 15; // Larger buffer
            const resetBuffer = 5; // Additional buffer for reset position
            
            if (obstacle.velocity.x > 0) {
                // Moving right: check if completely off screen
                if (obstacle.position.x > screenBound) {
                    // Calculate where it should respawn based on its lane companions
                    const newX = this.calculateRespawnPosition(obstacle, 'right');
                    obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
                    console.log(`🔄 ${obstacle.type} respawned at ${newX} (moving right)`);
                }
            } else if (obstacle.velocity.x < 0) {
                // Moving left: check if completely off screen
                if (obstacle.position.x < -screenBound) {
                    // Calculate where it should respawn based on its lane companions
                    const newX = this.calculateRespawnPosition(obstacle, 'left');
                    obstacle.setPosition(newX, obstacle.position.y, obstacle.position.z);
                    console.log(`🔄 ${obstacle.type} respawned at ${newX} (moving left)`);
                }
            }
        });
        
        // Goal glow animation (keep existing code)
        const time = Date.now() * 0.001;
        this.goals.forEach(goal => {
            if (goal.children && goal.children[0]) {
                const glow = goal.children[0];
                if (glow.material && glow.material.emissiveIntensity !== undefined) {
                    glow.material.emissiveIntensity = 0.4 + Math.sin(time * 3) * 0.2;
                }
            }
        });
        
        // Vine swaying for Level 2 (keep existing code)
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
    
    // ✅ NEW: Add this method to Level.js
    calculateRespawnPosition(obstacle, direction) {
        // Find all obstacles in the same lane (same Z position)
        const laneObstacles = this.obstacles.filter(o => 
            o !== obstacle && 
            Math.abs(o.position.z - obstacle.position.z) < 1
        );
        
        if (laneObstacles.length === 0) {
            // No other obstacles in lane, use standard position
            const screenBound = this.screenWidth / 2 + 15;
            return direction === 'right' ? -screenBound - 5 : screenBound + 5;
        }
        
        // Find the furthest obstacle in the opposite direction
        let furthestObstacle;
        if (direction === 'right') {
            // Respawning on left, find leftmost obstacle
            furthestObstacle = laneObstacles.reduce((leftmost, current) => 
                current.position.x < leftmost.position.x ? current : leftmost
            );
            // Spawn behind the leftmost obstacle
            return furthestObstacle.position.x - 17; // Standard spacing
        } else {
            // Respawning on right, find rightmost obstacle  
            furthestObstacle = laneObstacles.reduce((rightmost, current) => 
                current.position.x > rightmost.position.x ? current : rightmost
            );
            // Spawn behind the rightmost obstacle
            return furthestObstacle.position.x + 17; // Standard spacing
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
        const laneSpeeds = [4.0, 2.1, 5.0, 2.9, 4.0];
        
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
        const laneSpeeds = [9.1, 3.5, 3.3, 5.0, 7.5];
        
        lanePositions.forEach((z, laneIndex) => {
            const direction = laneDirections[laneIndex];
            const speed = laneSpeeds[laneIndex];
            const numVehicles = 7; // Back to normal
            const spacing = 17;    // Back to normal
            
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
    
    createPlaceholderPepeSoldiers() {
        const placeholderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400,
            emissiveIntensity: 0.3
        });
        
        const placeholderGeometry = new THREE.BoxGeometry(3, 3, 3);
        
        const leftPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
        leftPlaceholder.position.set(-8, 1.5, -14);
        leftPlaceholder.castShadow = false;
        leftPlaceholder.receiveShadow = false;
        
        const rightPlaceholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial.clone());
        rightPlaceholder.position.set(8, 1.5, -14);
        rightPlaceholder.castShadow = false;
        rightPlaceholder.receiveShadow = false;
        
        this.decorations.push(leftPlaceholder);
        this.decorations.push(rightPlaceholder);
        this.scene.add(leftPlaceholder);
        this.scene.add(rightPlaceholder);
        
        console.log('✅ Added placeholder Pepe Soldier decorations');
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


    
// ✅ ADD these Level 2 vehicle classes at the END of Level.js (before the final closing brace):

} // ← This is the END of the Level class

// ===== LEVEL 2 VEHICLE CLASSES =====
// ✅ PUT THE NEW VEHICLE CLASSES HERE - after the Level class but before the final export

class AngryFrogVehicle {
    constructor(scene) {
        this.scene = scene;
        this.type = 'angryfrog';
        this.mesh = null;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.speed = 1;
        this.isRideable = false;
        this.movingRight = true;
    }
    
    create() {
        this.createRoadVehicle();
        if (this.mesh) {
            this.scene.add(this.mesh);
        }
    }
    
    createRoadVehicle() {
        console.log(`🛣️ Creating Level 2 AngryFrog vehicle`);
        
        const size = { width: 4.0, height: 2.0 }; // Same size as cybertruck
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Load angryfrog.png texture
        const texture = this.loadLevel2Texture('angryfrog.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        // ✅ REMOVED: Don't set fallback color - it tints the image!
        // Let the PNG show its original colors
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ MATCH LEVEL 1: Use exact same rotation as Vehicle.js
        this.mesh.rotation.x = -Math.PI;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = Math.PI; // Back to Level 1 rotation
        this.mesh.position.y = 5.0;
        
        console.log(`✅ AngryFrog vehicle created`);
    }
    
    loadLevel2Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        
        console.log(`🖼️ Loading Level 2 texture: ${filename}`);
        
        const texture = textureLoader.load(
            filename,
            (loadedTexture) => {
                console.log(`✅ ${filename} texture loaded successfully`);
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                loadedTexture.minFilter = THREE.LinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename} texture:`, error);
            }
        );
        
        return texture;
    }
    
    // Vehicle behavior methods (same as original Vehicle class)
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.set(x, 5.0, z);
        }
    }
    
    setVelocity(vx, vy, vz) {
        this.velocity.set(vx, vy, vz);
        this.speed = this.velocity.length();
        this.movingRight = vx > 0;
        this.updateRotationBasedOnMovement();
    }
    
    updateRotationBasedOnMovement() {
        if (!this.mesh || this.velocity.length() === 0) return;
        
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        
        if (this.movingRight) {
            // ✅ FIXED: Face right (forward direction)
            this.mesh.rotation.z = -Math.PI;
            this.mesh.rotation.y = -Math.PI;
            this.mesh.rotation.y = -Math.PI;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
            // ✅ FIXED: Face left (backward direction) 
            this.mesh.rotation.z = Math.PI;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        }
    }
    
    update(deltaTime) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        if (this.mesh) {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = 5.0;
            this.mesh.position.z = this.position.z;
        }
    }
    
    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.material) {
                if (this.mesh.material.map) this.mesh.material.map.dispose();
                this.mesh.material.dispose();
            }
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }
}

// ✅ ADD: GatorLog class for Level 2 (replaces lily pads)
class GatorLog {
    constructor(scene) {
        this.scene = scene;
        this.type = 'gator';
        this.mesh = null;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.speed = 1;
        this.isRideable = true; // Gators are rideable like logs
        this.movingRight = true;
    }
    
    create() {
        console.log(`🐊 Creating Level 2 Gator log`);
        
        const size = { width: 8.0, height: 3.0 }; // ✅ BIGGER: Increased from 6x2 to 8x3
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadGatorTexture('gator.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ GATOR INITIAL ROTATION: Match Level 1 vehicles
        this.mesh.rotation.x = -Math.PI / 2;  // Same as Vehicle.js CONFIG.rotation.baseX
        this.mesh.rotation.y = 0;             // Same as Vehicle.js CONFIG.rotation.baseY  
        this.mesh.rotation.z = -Math.PI;      // Same as Vehicle.js CONFIG.rotation.baseZ
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Bigger gator log created (8x3) with Level 1 rotation`);
    }
    
    loadGatorTexture(filename) {
        const textureLoader = new THREE.TextureLoader();
        
        console.log(`🐊 Loading gator texture: ${filename}`);
        
        const texture = textureLoader.load(
            filename,
            (loadedTexture) => {
                console.log(`✅ ${filename} texture loaded successfully`);
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                loadedTexture.minFilter = THREE.LinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename} texture:`, error);
            }
        );
        
        return texture;
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.set(x, 0.1, z);
        }
    }
    
    setVelocity(vx, vy, vz) {
        this.velocity.set(vx, vy, vz);
        this.speed = this.velocity.length();
        this.movingRight = vx > 0;
        this.updateRotationBasedOnMovement();
    }
    
// In Level.js - Find the GatorLog class and replace updateRotationBasedOnMovement() method:

updateRotationBasedOnMovement() {
    if (!this.mesh || this.velocity.length() === 0) return;
    
    // ✅ GATOR DIRECTION FIX: Use different rotation logic than vehicles
    this.mesh.rotation.x = -Math.PI / 2;
    this.mesh.rotation.y = 0;
    
    if (this.movingRight) {
        // Moving right: face right
        this.mesh.rotation.z = -Math.PI;  // ✅ CHANGED: Was -Math.PI
        this.mesh.rotation.y = -Math.PI;  // ✅ CHANGED: Was -Math.PI
        this.mesh.scale.x = Math.abs(this.mesh.scale.x);
    } else {
        // Moving left: face left
        this.mesh.rotation.z = Math.PI;  // ✅ CHANGED: Was -Math.PI
        this.mesh.scale.x = Math.abs(this.mesh.scale.x);  // ✅ CHANGED: Don't flip scale
    }
}
    
    update(deltaTime) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        if (this.mesh) {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = 0.1;
            this.mesh.position.z = this.position.z;
        }
    }
    
    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.material) {
                if (this.mesh.material.map) this.mesh.material.map.dispose();
                this.mesh.material.dispose();
            }
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }
}

class ProtestorVehicle {
    constructor(scene) {
        this.scene = scene;
        this.type = 'protestor';
        this.mesh = null;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.speed = 1;
        this.isRideable = false;
        this.movingRight = true;
    }
    
    create() {
        this.createRoadVehicle();
        if (this.mesh) {
            this.scene.add(this.mesh);
        }
    }
    
    createRoadVehicle() {
        console.log(`🛣️ Creating Level 2 Protestor vehicle`);
        
        const size = { width: 4.5, height: 3.0 }; // Same size as taxi
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadLevel2Texture('protestor.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        // ✅ REMOVED: Don't set fallback color - it tints the image!
        // Let the PNG show its original colors
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ MATCH LEVEL 1: Use exact same rotation as Vehicle.js
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = Math.PI; // Back to Level 1 rotation
        this.mesh.position.y = 5.0;
        
        console.log(`✅ Protestor vehicle created`);
    }
    
    loadLevel2Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        
        console.log(`🖼️ Loading Level 2 texture: ${filename}`);
        
        const texture = textureLoader.load(
            filename,
            (loadedTexture) => {
                console.log(`✅ ${filename} texture loaded successfully`);
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                loadedTexture.minFilter = THREE.LinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename} texture:`, error);
            }
        );
        
        return texture;
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.set(x, 5.0, z);
        }
    }
    
    setVelocity(vx, vy, vz) {
        this.velocity.set(vx, vy, vz);
        this.speed = this.velocity.length();
        this.movingRight = vx > 0;
        this.updateRotationBasedOnMovement();
    }
    
    updateRotationBasedOnMovement() {
        if (!this.mesh || this.velocity.length() === 0) return;
        
        // ✅ LEVEL 2 VEHICLE FIX: Use Vehicle.js CONFIG settings
        this.mesh.rotation.x = -Math.PI / 2;  // CONFIG.rotation.baseX
        this.mesh.rotation.y = 0;             // CONFIG.rotation.baseY
        
        if (this.movingRight) {
            // Cars moving right: use Vehicle.js facingRightZ
            this.mesh.rotation.z = -Math.PI;  // CONFIG.rotation.facingRightZ
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
            // Cars moving left: use Vehicle.js facingLeftZ  
            this.mesh.rotation.z = -Math.PI;  // CONFIG.rotation.facingLeftZ
            this.mesh.scale.x = -Math.abs(this.mesh.scale.x);
        }
    }
    
    update(deltaTime) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        if (this.mesh) {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = 5.0;
            this.mesh.position.z = this.position.z;
        }
    }
    
    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.material) {
                if (this.mesh.material.map) this.mesh.material.map.dispose();
                this.mesh.material.dispose();
            }
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }
}

class LeftyVanVehicle {
    constructor(scene) {
        this.scene = scene;
        this.type = 'leftyvan';
        this.mesh = null;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.speed = 1;
        this.isRideable = false;
        this.movingRight = true;
    }
    
    create() {
        this.createRoadVehicle();
        if (this.mesh) {
            this.scene.add(this.mesh);
        }
    }
    
    createRoadVehicle() {
        console.log(`🛣️ Creating Level 2 LeftyVan vehicle`);
        
        const size = { width: 4.0, height: 2.0 }; // Same size as sportscar
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadLevel2Texture('leftyvan.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        // ✅ REMOVED: Don't set fallback color - it tints the image!
        // Let the PNG show its original colors
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ MATCH LEVEL 1: Use exact same rotation as Vehicle.js
        this.mesh.rotation.x = Math.PI;
        this.mesh.rotation.y = Math.PI/2;
        this.mesh.rotation.z = Math.PI; // Back to Level 1 rotation
        this.mesh.position.y = 5.0;
        
        console.log(`✅ LeftyVan vehicle created`);
    }
    
    loadLevel2Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        
        console.log(`🖼️ Loading Level 2 texture: ${filename}`);
        
        const texture = textureLoader.load(
            filename,
            (loadedTexture) => {
                console.log(`✅ ${filename} texture loaded successfully`);
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                loadedTexture.minFilter = THREE.LinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename} texture:`, error);
            }
        );
        
        return texture;
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.set(x, 5.0, z);
        }
    }
    
    setVelocity(vx, vy, vz) {
        this.velocity.set(vx, vy, vz);
        this.speed = this.velocity.length();
        this.movingRight = vx > 0;
        this.updateRotationBasedOnMovement();
    }
    
    updateRotationBasedOnMovement() {
        if (!this.mesh || this.velocity.length() === 0) return;
        
        // ✅ MATCH LEVEL 1: Use exact same rotation logic as Vehicle.js
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = Math.PI;
        
        if (this.movingRight) {
            // Cars moving right: use Level 1 rotation
            this.mesh.rotation.z = -Math.PI;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
            // Cars moving left: flip horizontally like Level 1
            this.mesh.rotation.z = -Math.PI;
            this.mesh.scale.x = -Math.abs(this.mesh.scale.x);
        }
    }
    
    update(deltaTime) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        if (this.mesh) {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = 5.0;
            this.mesh.position.z = this.position.z;
        }
    }
    
    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.material) {
                if (this.mesh.material.map) this.mesh.material.map.dispose();
                this.mesh.material.dispose();
            }
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }
}