import * as THREE from 'three';

export class EnhancedLevel {
    constructor(scene, worldWidth, worldDepth) {
        this.scene = scene;
        this.worldWidth = worldWidth;
        this.worldDepth = worldDepth;
        this.mesh = null;
        
        // Much larger world to completely fill camera view
        this.EXTENDED_WIDTH = worldWidth * 6; // Even wider coverage
        this.EXTENDED_DEPTH = worldDepth * 4; // Much deeper coverage
        
        // NYC-style grid system
        this.STREET_SPACING = 8; // Distance between parallel streets
        this.BLOCK_SIZE = 6; // Size of city blocks
    }
    
    create() {
        // Create level group
        this.mesh = new THREE.Group();
        
        // Create complete NYC-style city grid
        this.createGroundPlane();
        this.createCentralPark();
        this.createHorizontalRoads();
        this.createNYCStreetGrid();
        this.createCityBlocks();
        this.createDetailedStartZone();
        this.createRichEndZone();
        
        this.scene.add(this.mesh);
        
        console.log('🏙️ Enhanced level created with central park and horizontal roads');
    }
    
    createGroundPlane() {
        // Massive base plane to cover ALL visible area - BRIGHTER
        const groundGeometry = new THREE.PlaneGeometry(this.EXTENDED_WIDTH, this.EXTENDED_DEPTH);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4d7c26 // Brighter grass color
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.set(0, -0.1, 0);
        ground.receiveShadow = true;
        this.mesh.add(ground);
    }
    
    createCentralPark() {
        // Create a beautiful central park area - BRIGHTER
        const parkWidth = this.worldWidth;
        const parkDepth = 8; // Height of central park area
        
        // Main park grass
        const parkGeometry = new THREE.PlaneGeometry(parkWidth, parkDepth);
        const parkMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x32CD32 // Much brighter green for park
        });
        const park = new THREE.Mesh(parkGeometry, parkMaterial);
        park.rotation.x = -Math.PI / 2;
        park.position.set(0, 0.02, 0); // Slightly elevated
        park.receiveShadow = true;
        this.mesh.add(park);
        
        // Add park features
        this.createParkTrees();
        this.createParkPaths();
        this.createParkBenches();
        this.createParkFountain();
        
        console.log('🌳 Central park created');
    }
    
    createParkTrees() {
        // Create trees throughout the park
        const treePositions = [
            { x: -6, z: 2 }, { x: -3, z: 3 }, { x: 3, z: 2 }, { x: 6, z: 3 },
            { x: -5, z: -1 }, { x: 0, z: -3 }, { x: 5, z: -2 },
            { x: -8, z: 0 }, { x: 8, z: 1 }
        ];
        
        treePositions.forEach(pos => {
            this.createTree(pos.x, pos.z);
        });
    }
    
    createTree(x, z) {
        // Tree trunk - brighter
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0xA0522D }); // Brighter brown
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.set(x, 1, z);
        trunk.castShadow = true;
        this.mesh.add(trunk);
        
        // Tree foliage - brighter
        const foliageGeometry = new THREE.SphereGeometry(1.5, 8, 8);
        const foliageMaterial = new THREE.MeshLambertMaterial({ color: 0x32CD32 }); // Brighter green
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.set(x, 2.8, z);
        foliage.castShadow = true;
        this.mesh.add(foliage);
    }
    
    createParkPaths() {
        // Create winding paths through the park
        const pathWidth = 0.8;
        
        // Main path across the park
        const mainPathGeometry = new THREE.PlaneGeometry(this.worldWidth * 0.8, pathWidth);
        const pathMaterial = new THREE.MeshLambertMaterial({ color: 0xF5DEB3 }); // Brighter path color
        const mainPath = new THREE.Mesh(mainPathGeometry, pathMaterial);
        mainPath.rotation.x = -Math.PI / 2;
        mainPath.position.set(0, 0.03, 0);
        this.mesh.add(mainPath);
        
        // Cross path
        const crossPathGeometry = new THREE.PlaneGeometry(pathWidth, 6);
        const crossPath = new THREE.Mesh(crossPathGeometry, pathMaterial);
        crossPath.rotation.x = -Math.PI / 2;
        crossPath.position.set(0, 0.03, 0);
        this.mesh.add(crossPath);
    }
    
    createParkBenches() {
        // Add benches along paths
        const benchPositions = [
            { x: -4, z: 1 }, { x: 4, z: -1 }, { x: -2, z: -2 }, { x: 2, z: 2 }
        ];
        
        benchPositions.forEach(pos => {
            this.createBench(pos.x, pos.z);
        });
    }
    
    createParkFountain() {
        // Central fountain
        const fountainBase = new THREE.CylinderGeometry(1.2, 1.5, 0.3, 16);
        const fountainMaterial = new THREE.MeshLambertMaterial({ color: 0xEEEEEE }); // Brighter fountain
        const base = new THREE.Mesh(fountainBase, fountainMaterial);
        base.position.set(0, 0.15, 0);
        this.mesh.add(base);
        
        // Water
        const waterGeometry = new THREE.CylinderGeometry(1, 1, 0.1, 16);
        const waterMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x4169E1,
            transparent: true,
            opacity: 0.8
        });
        const water = new THREE.Mesh(waterGeometry, waterMaterial);
        water.position.set(0, 0.35, 0);
        this.mesh.add(water);
        
        // Fountain spire
        const spireGeometry = new THREE.CylinderGeometry(0.1, 0.2, 1, 8);
        const spire = new THREE.Mesh(spireGeometry, fountainMaterial);
        spire.position.set(0, 0.8, 0);
        this.mesh.add(spire);
    }
    
    createHorizontalRoads() {
        // Create the main horizontal roads where cars will drive
        const roadWidth = 3;
        const roadPositions = [
            { z: 10, name: 'Road 1' },
            { z: 6, name: 'Road 2' },
            { z: 2, name: 'Road 3' },
            { z: -2, name: 'Road 4' },
            { z: -6, name: 'Road 5' },
            { z: -10, name: 'Road 6' }
        ];
        
        roadPositions.forEach((road, index) => {
            // Main road surface - FULL WIDTH ROADS
            const roadGeometry = new THREE.PlaneGeometry(this.EXTENDED_WIDTH, roadWidth); 
            const roadMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x444444 // Slightly brighter road color
            });
            const roadMesh = new THREE.Mesh(roadGeometry, roadMaterial);
            roadMesh.rotation.x = -Math.PI / 2;
            roadMesh.position.set(0, 0.01, road.z);
            roadMesh.receiveShadow = true;
            this.mesh.add(roadMesh);
            
            // Lane markings across FULL WIDTH
            this.createRoadMarkings(road.z, roadWidth);
            
            // Road shoulders across FULL WIDTH
            this.createRoadShoulders(road.z, roadWidth);
            
            console.log(`🛣️ Created ${road.name} at z=${road.z}`);
        });
    }
    
    createRoadMarkings(roadZ, roadWidth) {
        // Center line across FULL WIDTH
        const centerLineGeometry = new THREE.PlaneGeometry(this.EXTENDED_WIDTH, 0.1);
        const lineMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xFFFF00
        });
        const centerLine = new THREE.Mesh(centerLineGeometry, lineMaterial);
        centerLine.rotation.x = -Math.PI / 2;
        centerLine.position.set(0, 0.02, roadZ);
        this.mesh.add(centerLine);
        
        // Dashed lane dividers across FULL WIDTH
        this.createDashedLine(0, 0.02, roadZ, this.EXTENDED_WIDTH, 0xFFFFFF, true);
    }
    
    createRoadShoulders(roadZ, roadWidth) {
        // Top shoulder across FULL WIDTH
        const shoulderGeometry = new THREE.PlaneGeometry(this.EXTENDED_WIDTH, 0.5);
        const shoulderMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x666666 // Brighter shoulder color
        });
        
        const topShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        topShoulder.rotation.x = -Math.PI / 2;
        topShoulder.position.set(0, 0.005, roadZ + roadWidth/2 + 0.25);
        this.mesh.add(topShoulder);
        
        const bottomShoulder = new THREE.Mesh(shoulderGeometry, shoulderMaterial);
        bottomShoulder.rotation.x = -Math.PI / 2;
        bottomShoulder.position.set(0, 0.005, roadZ - roadWidth/2 - 0.25);
        this.mesh.add(bottomShoulder);
    }
    
    createNYCStreetGrid() {
        // Create a proper street grid like NYC (for background)
        const streetWidth = 2;
        
        // Horizontal streets (running east-west) - background only
        const numHorizontalStreets = Math.ceil(this.EXTENDED_DEPTH / this.STREET_SPACING);
        for (let i = 0; i < numHorizontalStreets; i++) {
            const streetZ = (i - numHorizontalStreets/2) * this.STREET_SPACING;
            
            // Skip the main game road area and central park
            if (Math.abs(streetZ) < 18) continue;
            
            const streetGeometry = new THREE.PlaneGeometry(this.EXTENDED_WIDTH, streetWidth);
            const streetMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x444444 // Brighter background streets
            });
            const street = new THREE.Mesh(streetGeometry, streetMaterial);
            street.rotation.x = -Math.PI / 2;
            street.position.set(0, 0.01, streetZ);
            this.mesh.add(street);
            
            // Add lane markings
            this.createDashedLine(0, 0.02, streetZ, this.EXTENDED_WIDTH, 0xffffff);
        }
        
        // Vertical streets (running north-south)
        const numVerticalStreets = Math.ceil(this.EXTENDED_WIDTH / this.STREET_SPACING);
        for (let i = 0; i < numVerticalStreets; i++) {
            const streetX = (i - numVerticalStreets/2) * this.STREET_SPACING;
            
            const streetGeometry = new THREE.PlaneGeometry(streetWidth, this.EXTENDED_DEPTH);
            const streetMaterial = new THREE.MeshLambertMaterial({ 
                color: 0x444444 // Brighter background streets
            });
            const street = new THREE.Mesh(streetGeometry, streetMaterial);
            street.rotation.x = -Math.PI / 2;
            street.position.set(streetX, 0.01, 0);
            this.mesh.add(street);
            
            // Add lane markings
            this.createDashedLine(streetX, 0.02, 0, this.EXTENDED_DEPTH, 0xffffff);
        }
    }
    
    createCityBlocks() {
        // Create city blocks in the grid
        const numBlocksX = Math.ceil(this.EXTENDED_WIDTH / this.STREET_SPACING);
        const numBlocksZ = Math.ceil(this.EXTENDED_DEPTH / this.STREET_SPACING);
        
        for (let x = 0; x < numBlocksX; x++) {
            for (let z = 0; z < numBlocksZ; z++) {
                const blockX = (x - numBlocksX/2) * this.STREET_SPACING;
                const blockZ = (z - numBlocksZ/2) * this.STREET_SPACING;
                
                // Skip the main game area
                if (Math.abs(blockZ) < 20 && Math.abs(blockX) < 15) continue;
                
                this.createCityBlock(blockX, blockZ, this.BLOCK_SIZE);
            }
        }
    }
    
    createCityBlock(x, z, size) {
        // Create a city block with buildings and streets
        const blockGeometry = new THREE.PlaneGeometry(size * 0.9, size * 0.9);
        const blockMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xdddddd // Brighter urban areas
        });
        const block = new THREE.Mesh(blockGeometry, blockMaterial);
        block.rotation.x = -Math.PI / 2;
        block.position.set(x, 0, z);
        this.mesh.add(block);
        
        // Add random buildings in this block
        const numBuildings = 2 + Math.floor(Math.random() * 3);
        for (let i = 0; i < numBuildings; i++) {
            const buildingX = x + (Math.random() - 0.5) * size * 0.6;
            const buildingZ = z + (Math.random() - 0.5) * size * 0.6;
            const buildingWidth = 1 + Math.random() * 2;
            const buildingDepth = 1 + Math.random() * 2;
            const buildingHeight = 3 + Math.random() * 8;
            
            this.createRandomBuilding(buildingX, buildingZ, buildingWidth, buildingDepth, buildingHeight);
        }
    }
    
    createRandomBuilding(x, z, width, depth, height) {
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        const buildingMaterial = new THREE.MeshLambertMaterial({ 
            color: new THREE.Color().setHSL(0.1, 0.2, 0.4 + Math.random() * 0.3) // Brighter buildings
        });
        const building = new THREE.Mesh(buildingGeometry, buildingMaterial);
        building.position.set(x, height / 2, z);
        building.castShadow = true;
        this.mesh.add(building);
        
        // Add windows
        this.addRandomWindows(building, { x, z, width, depth, height });
    }
    
    addRandomWindows(building, config) {
        const windowsPerSide = Math.max(1, Math.floor(config.width));
        const floors = Math.max(1, Math.floor(config.height / 2));
        
        // Front face windows
        for (let floor = 0; floor < floors; floor++) {
            for (let window = 0; window < windowsPerSide; window++) {
                const windowGeometry = new THREE.PlaneGeometry(0.3, 0.5);
                const isLit = Math.random() > 0.4;
                const windowMaterial = new THREE.MeshLambertMaterial({ 
                    color: isLit ? 0xffffaa : 0x444444, // Brighter windows
                    emissive: isLit ? 0x332200 : 0x000000,
                    emissiveIntensity: 0.3
                });
                const windowMesh = new THREE.Mesh(windowGeometry, windowMaterial);
                windowMesh.position.set(
                    building.position.x - config.width/2 + (window + 0.5) * (config.width / windowsPerSide),
                    building.position.y - config.height/2 + (floor + 0.5) * (config.height / floors),
                    building.position.z + config.depth/2 + 0.01
                );
                this.mesh.add(windowMesh);
            }
        }
    }
    
    createDetailedStartZone() {
        // Base grass area - BRIGHTER and positioned at bottom
        const startGeometry = new THREE.PlaneGeometry(this.worldWidth, 6);
        const startMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x32CD32 // Brighter start zone green
        });
        const startZone = new THREE.Mesh(startGeometry, startMaterial);
        startZone.rotation.x = -Math.PI / 2;
        startZone.position.set(0, 0, 15); // Position at bottom of screen
        startZone.receiveShadow = true;
        this.mesh.add(startZone);
        
        // Add sidewalk
        this.createSidewalk(0, 12);
        
        // Add street furniture
        this.addStreetFurniture();
        
        // Add grass details
        this.addDetailedGrass(0, 15);
    }
    
    createSidewalk(x, z) {
        const sidewalkGeometry = new THREE.PlaneGeometry(this.worldWidth, 1);
        const sidewalkMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xdddddd // Brighter sidewalk
        });
        const sidewalk = new THREE.Mesh(sidewalkGeometry, sidewalkMaterial);
        sidewalk.rotation.x = -Math.PI / 2;
        sidewalk.position.set(x, 0.01, z);
        sidewalk.receiveShadow = true;
        
        // Add sidewalk texture pattern
        this.addSidewalkPattern(sidewalk);
        
        this.mesh.add(sidewalk);
    }
    
    addSidewalkPattern(sidewalk) {
        // Create simple pattern with lines
        for (let i = -this.worldWidth/2; i < this.worldWidth/2; i += 2) {
            const lineGeometry = new THREE.PlaneGeometry(0.1, 1);
            const lineMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xbbbbbb // Brighter lines
            });
            const line = new THREE.Mesh(lineGeometry, lineMaterial);
            line.rotation.x = -Math.PI / 2;
            line.position.set(i, 0.02, sidewalk.position.z);
            this.mesh.add(line);
        }
    }
    
    addStreetFurniture() {
        // Street lamps
        this.createStreetLamp(-8, 12);
        this.createStreetLamp(8, 12);
        
        // Fire hydrant
        this.createFireHydrant(-6, 13);
        
        // Trash can
        this.createTrashCan(5, 13);
        
        // Bench
        this.createBench(0, 13);
    }
    
    createStreetLamp(x, z) {
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 }); // Brighter pole
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.set(x, 2, z);
        pole.castShadow = true;
        this.mesh.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const lightMaterial = new THREE.MeshLambertMaterial({ 
            color: 0xffff88,
            emissive: 0xffff44,
            emissiveIntensity: 0.3
        });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.set(x, 4, z);
        this.mesh.add(light);
        
        // Add actual light source
        const streetLight = new THREE.PointLight(0xffff88, 0.5, 10);
        streetLight.position.set(x, 4, z);
        streetLight.castShadow = true;
        this.scene.add(streetLight);
    }
    
    createFireHydrant(x, z) {
        const hydrantGeometry = new THREE.CylinderGeometry(0.3, 0.3, 1, 8);
        const hydrantMaterial = new THREE.MeshLambertMaterial({ color: 0xff2222 }); // Brighter red
        const hydrant = new THREE.Mesh(hydrantGeometry, hydrantMaterial);
        hydrant.position.set(x, 0.5, z);
        hydrant.castShadow = true;
        this.mesh.add(hydrant);
        
        // Add valve on top
        const valveGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.8);
        const valveMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
        const valve = new THREE.Mesh(valveGeometry, valveMaterial);
        valve.position.set(x, 1.1, z);
        this.mesh.add(valve);
    }
    
    createTrashCan(x, z) {
        const canGeometry = new THREE.CylinderGeometry(0.4, 0.3, 1.2, 8);
        const canMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 }); // Brighter can
        const can = new THREE.Mesh(canGeometry, canMaterial);
        can.position.set(x, 0.6, z);
        can.castShadow = true;
        this.mesh.add(can);
        
        // Lid
        const lidGeometry = new THREE.CylinderGeometry(0.45, 0.45, 0.1, 8);
        const lidMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const lid = new THREE.Mesh(lidGeometry, lidMaterial);
        lid.position.set(x, 1.25, z);
        this.mesh.add(lid);
    }
    
    createBench(x, z) {
        // Bench seat
        const seatGeometry = new THREE.BoxGeometry(2, 0.1, 0.5);
        const benchMaterial = new THREE.MeshLambertMaterial({ color: 0xA0522D }); // Brighter brown
        const seat = new THREE.Mesh(seatGeometry, benchMaterial);
        seat.position.set(x, 0.5, z);
        seat.castShadow = true;
        this.mesh.add(seat);
        
        // Bench back
        const backGeometry = new THREE.BoxGeometry(2, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, benchMaterial);
        back.position.set(x, 0.9, z - 0.2);
        this.mesh.add(back);
        
        // Legs
        for (let i = 0; i < 2; i++) {
            const legGeometry = new THREE.BoxGeometry(0.1, 0.5, 0.1);
            const legMaterial = new THREE.MeshLambertMaterial({ color: 0x444444 });
            const leg = new THREE.Mesh(legGeometry, legMaterial);
            leg.position.set(x + (i * 1.8 - 0.9), 0.25, z);
            this.mesh.add(leg);
        }
    }
    
    createRichEndZone() {
        // Goal area with more detail - BRIGHTER and positioned at top
        const endGeometry = new THREE.PlaneGeometry(this.worldWidth, 6);
        const endMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x40E040 // Even brighter goal zone
        });
        const endZone = new THREE.Mesh(endGeometry, endMaterial);
        endZone.rotation.x = -Math.PI / 2;
        endZone.position.set(0, 0, -15); // Position at top of screen
        endZone.receiveShadow = true;
        this.mesh.add(endZone);
        
        // Enhanced goal markers
        this.createEnhancedGoalMarkers();
        
        // Add celebratory elements
        this.addCelebratoryElements();
        
        // Sidewalk at end
        this.createSidewalk(0, -12);
    }
    
    createEnhancedGoalMarkers() {
        const positions = [-6, -2, 2, 6];
        
        positions.forEach(x => {
            // Goal post
            const postGeometry = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
            const postMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xff6600
            });
            const post = new THREE.Mesh(postGeometry, postMaterial);
            post.position.set(x, 1.5, -14); // Fixed position for top of screen
            post.castShadow = true;
            this.mesh.add(post);
            
            // Flag
            const flagGeometry = new THREE.PlaneGeometry(1.2, 0.8);
            const flagMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xff0000,
                side: THREE.DoubleSide
            });
            const flag = new THREE.Mesh(flagGeometry, flagMaterial);
            flag.position.set(x + 0.6, 2.8, -14);
            
            // Animate flag
            flag.userData = { 
                originalPosition: flag.position.clone(),
                time: Math.random() * Math.PI * 2
            };
            
            this.mesh.add(flag);
            
            // Goal area marking
            const goalAreaGeometry = new THREE.RingGeometry(1, 1.5, 8);
            const goalAreaMaterial = new THREE.MeshLambertMaterial({ 
                color: 0xffff00,
                transparent: true,
                opacity: 0.6
            });
            const goalArea = new THREE.Mesh(goalAreaGeometry, goalAreaMaterial);
            goalArea.rotation.x = -Math.PI / 2;
            goalArea.position.set(x, 0.01, -14);
            this.mesh.add(goalArea);
        });
    }
    
    addCelebratoryElements() {
        // Add some decorative elements around goal area
        for (let i = 0; i < 6; i++) {
            const confettiGeometry = new THREE.SphereGeometry(0.1, 4, 4);
            const confettiMaterial = new THREE.MeshLambertMaterial({ 
                color: new THREE.Color().setHSL(Math.random(), 0.8, 0.6)
            });
            const confetti = new THREE.Mesh(confettiGeometry, confettiMaterial);
            confetti.position.set(
                (Math.random() - 0.5) * this.worldWidth * 0.8,
                Math.random() * 2 + 0.5,
                -15 + Math.random() * 4 + 1 // Fixed position for top area
            );
            this.mesh.add(confetti);
        }
    }
    
    addDetailedGrass(centerX, centerZ) {
        // Enhanced grass with more variety
        for (let i = 0; i < 30; i++) {
            const grassType = Math.floor(Math.random() * 3);
            let grassGeometry, grassMaterial;
            
            switch (grassType) {
                case 0: // Grass tuft
                    grassGeometry = new THREE.ConeGeometry(0.1, 0.3, 4);
                    grassMaterial = new THREE.MeshLambertMaterial({ 
                        color: 0x228B22 // Brighter grass
                    });
                    break;
                case 1: // Flower
                    grassGeometry = new THREE.SphereGeometry(0.05, 6, 6);
                    grassMaterial = new THREE.MeshLambertMaterial({ 
                        color: new THREE.Color().setHSL(Math.random(), 0.8, 0.7)
                    });
                    break;
                case 2: // Small bush
                    grassGeometry = new THREE.SphereGeometry(0.2, 8, 8);
                    grassMaterial = new THREE.MeshLambertMaterial({ 
                        color: 0x32CD32 // Brighter bush
                    });
                    break;
            }
            
            const grass = new THREE.Mesh(grassGeometry, grassMaterial);
            grass.position.set(
                centerX + (Math.random() - 0.5) * this.worldWidth * 0.8,
                grassType === 1 ? 0.3 : 0.15,
                centerZ + (Math.random() - 0.5) * 4
            );
            grass.rotation.y = Math.random() * Math.PI * 2;
            grass.scale.setScalar(0.5 + Math.random() * 0.5);
            this.mesh.add(grass);
        }
    }
    
    createDashedLine(x, y, z, length, color = 0xffffff, isHorizontal = false) {
        const dashLength = 1;
        const gapLength = 0.5;
        const totalSegment = dashLength + gapLength;
        const numDashes = Math.floor(length / totalSegment);
        
        const dashGeometry = isHorizontal ? 
            new THREE.PlaneGeometry(dashLength, 0.08) :
            new THREE.PlaneGeometry(0.08, dashLength);
        const dashMaterial = new THREE.MeshLambertMaterial({ color });
        
        for (let i = 0; i < numDashes; i++) {
            const dash = new THREE.Mesh(dashGeometry, dashMaterial);
            dash.rotation.x = -Math.PI / 2;
            
            if (isHorizontal) {
                dash.position.set(
                    x - length/2 + (i * totalSegment) + dashLength/2,
                    y,
                    z
                );
            } else {
                dash.position.set(
                    x, 
                    y, 
                    z - length/2 + (i * totalSegment) + dashLength/2
                );
            }
            this.mesh.add(dash);
        }
    }
}