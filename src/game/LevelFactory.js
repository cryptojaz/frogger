// LevelFactory.js - Creates levels using configuration-driven approach

import * as THREE from 'three';
import { BaseLevel } from './BaseLevel.js';
import { LevelConfigManager } from './LevelConfig.js';
import { Vehicle } from './Vehicle.js';

// Import existing vehicle classes
import { Cybertruck, Taxi, Bus } from './Vehicle.js';

export class LevelFactory {
    static createLevel(scene, levelNumber, worldWidth, worldDepth) {
        // Validate level exists
        LevelConfigManager.validateLevel(levelNumber);
        
        // Create enhanced level with vehicle factories
        return new ConfigurableLevel(scene, levelNumber, worldWidth, worldDepth);
    }
}

// Enhanced BaseLevel with proper vehicle creation
class ConfigurableLevel extends BaseLevel {
    constructor(scene, levelNumber, worldWidth, worldDepth) {
        super(scene, levelNumber, worldWidth, worldDepth);
        
        // Create vehicle factories for this level
        this.vehicleFactory = new VehicleFactory(scene, levelNumber);
        this.obstacleFactory = new ObstacleFactory(scene, levelNumber);
    }
    
    createVehicleByType(type) {
        return this.vehicleFactory.createVehicle(type);
    }
    
    createObstacleByType(type) {
        return this.obstacleFactory.createObstacle(type);
    }
    
    // Override environment decorations for level-specific features
    createCityBuildings() {
        if (this.levelNumber !== 1) return;
        
        console.log('🏢 Creating city buildings...');
        
        const cornerBuildings = [
            { x: -35, z: -30, width: 12, height: 25, depth: 12 },
            { x: 35, z: -30, width: 12, height: 22, depth: 12 },
            { x: -35, z: 30, width: 14, height: 28, depth: 12 },
            { x: 35, z: 30, width: 14, height: 24, depth: 12 }
        ];
        
        cornerBuildings.forEach(building => {
            const buildingGeometry = new THREE.BoxGeometry(building.width, building.height, building.depth);
            const buildingMesh = new THREE.Mesh(buildingGeometry, this.sharedMaterials.building1);
            buildingMesh.position.set(building.x, building.height/2, building.z);
            buildingMesh.castShadow = true;
            buildingMesh.receiveShadow = true;
            
            this.decorations.push(buildingMesh);
            this.scene.add(buildingMesh);
        });
        
        console.log('✅ City buildings created');
    }
    
    createJungleTrees() {
        if (this.levelNumber !== 2) return;
        
        console.log('🌳 Creating jungle trees...');
        
        const jungleTreePositions = [
            { x: -25, z: 16 }, { x: -22, z: 14 }, { x: -28, z: 18 },
            { x: 25, z: 16 }, { x: 22, z: 14 }, { x: 28, z: 18 },
            { x: -35, z: -25 }, { x: 35, z: -25 }, { x: -40, z: 0 }, { x: 40, z: 0 }
        ];
        
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
        
        console.log('✅ Jungle trees created');
    }
    
    createCornerBushes() {
        if (this.levelNumber !== 2) return;
        
        console.log('🌿 Creating corner bushes...');
        
        const bushPositions = [
            // Top corners coverage
            { x: 35, z: 25 }, { x: 40, z: 25 }, { x: 45, z: 25 }, { x: 50, z: 25 },
            { x: 35, z: 30 }, { x: 40, z: 30 }, { x: 45, z: 30 }, { x: 50, z: 30 },
            { x: -35, z: 25 }, { x: -40, z: 25 }, { x: -45, z: 25 }, { x: -50, z: 25 },
            { x: -35, z: 30 }, { x: -40, z: 30 }, { x: -45, z: 30 }, { x: -50, z: 30 }
        ];
        
        bushPositions.forEach((pos) => {
            const bushGeometry = new THREE.SphereGeometry(4, 8, 6);
            const bush = new THREE.Mesh(bushGeometry, this.sharedMaterials.jungleFoliage);
            bush.position.set(pos.x, 2.5, pos.z);
            bush.scale.set(1.8, 0.8, 1.8);
            bush.castShadow = true;
            
            this.decorations.push(bush);
            this.scene.add(bush);
        });
        
        console.log('✅ Corner bushes created');
    }
}

// Vehicle Factory for different levels
class VehicleFactory {
    constructor(scene, levelNumber) {
        this.scene = scene;
        this.levelNumber = levelNumber;
    }
    
    createVehicle(type) {
        switch (this.levelNumber) {
            case 1:
                return this.createLevel1Vehicle(type);
            case 2:
                return this.createLevel2Vehicle(type);
            case 3:
                return this.createLevel3Vehicle(type);
            case 4:
                return this.createLevel4Vehicle(type);
            case 5:
                return this.createLevel5Vehicle(type);
            default:
                return this.createLevel1Vehicle(type); // Fallback
        }
    }
    
    createLevel1Vehicle(type) {
        switch (type) {
            case 'cybertruck':
                return new Cybertruck(this.scene);
            case 'taxi':
                return new Taxi(this.scene);
            case 'sportscar':
                return new Bus(this.scene); // Using Bus class for sportscar
            default:
                return new Cybertruck(this.scene);
        }
    }
    
    createLevel2Vehicle(type) {
        switch (type) {
            case 'angryfrog':
                return new Level2Vehicle(this.scene, 'angryfrog');
            case 'protestor':
                return new Level2Vehicle(this.scene, 'protestor');
            case 'leftyvan':
                return new Level2Vehicle(this.scene, 'leftyvan');
            default:
                return new Level2Vehicle(this.scene, 'angryfrog');
        }
    }
    
    createLevel3Vehicle(type) {
        switch (type) {
            case 'alieninufo':
                return new AlienUFOVehicle(this.scene);
            case 'tardigrade':
                return new TardigradeVehicle(this.scene);
            case 'marsprotestor':
                return new MarsProtestorVehicle(this.scene);
            default:
                return new AlienUFOVehicle(this.scene);
        }
    }
    
    createLevel4Vehicle(type) {
        switch (type) {
            case 'donkey':
                return new DonkeyVehicle(this.scene);
            case 'leftist':
                return new LeftistVehicle(this.scene);
            case 'limo':
                return new LimoVehicle(this.scene);
            default:
                return new DonkeyVehicle(this.scene);
        }
    }
    
    createLevel5Vehicle(type) {
        switch (type) {
            case 'virus_program':
                return new Level5Vehicle(this.scene, 'virus_program');
            case 'firewall_agent':
                return new Level5Vehicle(this.scene, 'firewall_agent');
            case 'data_packet':
                return new Level5Vehicle(this.scene, 'data_packet');
            case 'ai_drone':
                return new Level5Vehicle(this.scene, 'ai_drone');
            case 'quantum_bit':
                return new Level5Vehicle(this.scene, 'quantum_bit');
            default:
                return new Level5Vehicle(this.scene, 'virus_program');
        }
    }
}

// Obstacle Factory for water/transport sections
class ObstacleFactory {
    constructor(scene, levelNumber) {
        this.scene = scene;
        this.levelNumber = levelNumber;
    }
    
    createObstacle(type) {
        switch (this.levelNumber) {
            case 1:
                return this.createLevel1Obstacle(type);
            case 2:
                return this.createLevel2Obstacle(type);
            case 3:
                return this.createLevel3Obstacle(type);
            case 4:
                return this.createLevel4Obstacle(type);
            case 5:
                return this.createLevel5Obstacle(type);
            default:
                return this.createLevel1Obstacle(type);
        }
    }
    
    createLevel1Obstacle(type) {
        return new Vehicle(this.scene, 'log'); // Standard logs
    }
    
    createLevel2Obstacle(type) {
        if (type === 'gator') {
            return new Level2Gator(this.scene);
        }
        return new Vehicle(this.scene, 'log');
    }
    
    createLevel3Obstacle(type) {
        if (type === 'robovan') {
            return new RoboVan(this.scene);
        }
        return new Vehicle(this.scene, 'log');
    }
    
    createLevel4Obstacle(type) {
        if (type === 'patriotbus') {
            return new PatriotBus(this.scene);
        }
        return new Vehicle(this.scene, 'log');
    }
    
    
    createLevel5Obstacle(type) {
        if (type === 'quantum_platform') {
            return new Level5QuantumPlatform(this.scene);
        }
        if (type === 'data_stream') {
            return new Level5DataStream(this.scene);
        }
        if (type === 'neural_link') {
            return new Level5NeuralLink(this.scene);
        }
        return new Vehicle(this.scene, 'log');
    }
}

// Level 2 Vehicle Class
class Level2Vehicle extends Vehicle {
    constructor(scene, vehicleType) {
        super(scene, vehicleType);
    }
    
    create() {
        console.log(`🛣️ Creating Level 2 ${this.type} vehicle`);
        
        const size = { width: 4.0, height: 2.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadLevel2Texture(`${this.type}.png`);
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 5.0;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 2 ${this.type} vehicle created`);
    }
    
    loadLevel2Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename);
    }
}

// Level 2 Gator Class
class Level2Gator extends Vehicle {
    constructor(scene) {
        super(scene, 'gator');
        this.isRideable = true;
    }
    
    create() {
        console.log(`🐊 Creating Level 2 Gator`);
        
        const size = { width: 8.0, height: 3.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadGatorTexture('gator.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 2 gator created`);
    }
    
    loadGatorTexture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename);
    }
}

// In LevelFactory.js - Replace ALL Level 3 vehicle classes with these fixed versions
// The key is copying the EXACT rotation logic from Vehicle.js CONFIG settings

// REAL FIX: Complete Level 3 vehicle classes with EXACT Vehicle.js rotation values
// Replace ALL Level 3 classes in LevelFactory.js with these:

// 1. AlienUFOVehicle - Complete implementation
class AlienUFOVehicle extends Vehicle {
    constructor(scene) {
        super(scene, 'alieninufo');
        this.isRideable = false;
    }
    
    create() {
        console.log(`🛸 Creating Level 3 AlienUFO vehicle`);
        
        const size = { width: 4.5, height: 2.5 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Try to load texture
        const texture = this.loadLevel3Texture('alieninufo.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            color: 0xffffff  // Don't tint the texture
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ EXACT VALUES from Vehicle.js CONFIG
        this.mesh.rotation.x = -Math.PI / 2;  // CONFIG.rotation.baseX
        this.mesh.rotation.y = 0;             // CONFIG.rotation.baseY  
        this.mesh.rotation.z = Math.PI;       // CONFIG.rotation.baseZ (NOT -Math.PI!)
        this.mesh.position.y = 5.0;          // CONFIG.roadVehicleHeight
        
        this.scene.add(this.mesh);
        console.log(`✅ AlienUFO created with correct rotation`);
    }
    
    loadLevel3Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(
            filename,
            (texture) => {
                console.log(`✅ ${filename} loaded`);
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename}`);
            }
        );
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
        
        // ✅ EXACT VALUES from Vehicle.js updateRotationBasedOnMovement
        this.mesh.rotation.x = -Math.PI / 2;  // CONFIG.rotation.baseX
        this.mesh.rotation.y = 0;             // CONFIG.rotation.baseY
        
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;  // CONFIG.rotation.facingRightZ
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
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

// Replace TardigradeVehicle with this EXACT copy of working AlienUFOVehicle

class TardigradeVehicle extends Vehicle {
    constructor(scene) {
        super(scene, 'tardigrade');  // ONLY change the type name
        this.isRideable = false;
    }
    
    create() {
        console.log(`🐻 Creating Level 3 Tardigrade vehicle`);
        
        const size = { width: 4.0, height: 2.3 };  // EXACT same size as AlienUFO
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Try to load texture
        const texture = this.loadLevel3Texture('tardigrade.png');  // ONLY change filename
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            color: 0xffffff  // Don't tint the texture
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ EXACT VALUES from working AlienUFO
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        this.mesh.rotation.z = Math.PI;       
        this.mesh.position.y = 5.0;          
        
        this.scene.add(this.mesh);
        console.log(`✅ Tardigrade created with EXACT AlienUFO rotation`);
    }
    
    // EXACT copy of AlienUFO methods
    loadLevel3Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(
            filename,
            (texture) => {
                console.log(`✅ ${filename} loaded`);
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename}`);
            }
        );
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
        
        // ✅ EXACT copy from working AlienUFO
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;  
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
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

// Do the EXACT same for MarsProtestorVehicle - just change 'tardigrade' to 'marsprotestor'

// Replace MarsProtestorVehicle with this EXACT copy of working AlienUFOVehicle

class MarsProtestorVehicle extends Vehicle {
    constructor(scene) {
        super(scene, 'marsprotestor');  // ONLY change the type name
        this.isRideable = false;
    }
    
    create() {
        console.log(`🚩 Creating Level 3 MarsProtestor vehicle`);
        
        const size = { width: 4.5, height: 2.5 };  // EXACT same size as AlienUFO
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Try to load texture
        const texture = this.loadLevel3Texture('marsprotestor2.png');  // ONLY change filename
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            color: 0xffffff  // Don't tint the texture
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // ✅ EXACT VALUES from working AlienUFO
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        this.mesh.rotation.z = Math.PI;       
        this.mesh.position.y = 5.0;          
        
        this.scene.add(this.mesh);
        console.log(`✅ MarsProtestor created with EXACT AlienUFO rotation`);
    }
    
    // EXACT copy of AlienUFO methods
    loadLevel3Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(
            filename,
            (texture) => {
                console.log(`✅ ${filename} loaded`);
                texture.wrapS = THREE.ClampToEdgeWrapping;
                texture.wrapT = THREE.ClampToEdgeWrapping;
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                texture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${filename}`);
            }
        );
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
        
        // ✅ EXACT copy from working AlienUFO
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;  
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
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
// Replace RoboVan with this EXACT copy of working Level2Gator

class RoboVan extends Vehicle {
    constructor(scene) {
        super(scene, 'robovan');  // ONLY change the type name
        this.isRideable = true;   // Keep rideable like gator
    }
    
    create() {
        console.log(`🤖 Creating Level 3 RoboVan`);
        
        const size = { width: 8.0, height: 5.0 };  // EXACT same size as Gator
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadRoboVanTexture('robovan.png');  // ONLY change filename
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        

        
        this.scene.add(this.mesh);
        console.log(`✅ RoboVan created with EXACT Gator rotation`);
    }
    
    // EXACT copy of Gator texture loading method
    loadRoboVanTexture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename);
    }
    
    // EXACT copy of Gator methods
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.set(x, 2.1, z);  // Same Y position as gator
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
        
        // ✅ EXACT copy from working Level2Gator
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.rotation.y = 0;
        
        if (this.movingRight) {
            this.mesh.rotation.z = Math.PI;
            this.mesh.rotation.y = Math.PI;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
            this.mesh.rotation.z = -Math.PI;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        }
    }
    
    update(deltaTime) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        if (this.mesh) {
            this.mesh.position.x = this.position.x;
            this.mesh.position.y = 0.1;  // Same Y position as gator
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

class DonkeyVehicle extends Vehicle {
    constructor(scene) {
        super(scene, 'donkey');
        this.isRideable = false;
    }
    
    create() {
        console.log(`🫏 Creating Level 4 Donkey vehicle`);
        
        const size = { width: 4.5, height: 2.5 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadLevel4Texture('donkey.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            color: 0xffffff
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        this.mesh.rotation.z = Math.PI;       
        this.mesh.position.y = 5.0;          
        
        this.scene.add(this.mesh);
        console.log(`✅ Donkey vehicle created`);
    }
    
    loadLevel4Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename, (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.flipY = false;
        });
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
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;  
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
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

class LeftistVehicle extends Vehicle {
    constructor(scene) {
        super(scene, 'leftist');
        this.isRideable = false;
    }
    
    create() {
        console.log(`🚗 Creating Level 4 Leftist vehicle`);
        
        const size = { width: 4.0, height: 2.3 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadLevel4Texture('leftist.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            color: 0xffffff
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        this.mesh.rotation.z = Math.PI;       
        this.mesh.position.y = 5.0;          
        
        this.scene.add(this.mesh);
        console.log(`✅ Leftist vehicle created`);
    }
    
    loadLevel4Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename, (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.flipY = false;
        });
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
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;  
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
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

class LimoVehicle extends Vehicle {
    constructor(scene) {
        super(scene, 'limo');
        this.isRideable = false;
    }
    
    create() {
        console.log(`🚙 Creating Level 4 Limo vehicle`);
        
        const size = { width: 6.0, height: 2.5 }; // Longer for limo
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadLevel4Texture('limo.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide,
            color: 0xffffff
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        this.mesh.rotation.z = Math.PI;       
        this.mesh.position.y = 5.0;          
        
        this.scene.add(this.mesh);
        console.log(`✅ Limo vehicle created`);
    }
    
    loadLevel4Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename, (texture) => {
            texture.wrapS = THREE.ClampToEdgeWrapping;
            texture.wrapT = THREE.ClampToEdgeWrapping;
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.LinearFilter;
            texture.flipY = false;
        });
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
        this.mesh.rotation.x = -Math.PI / 2;  
        this.mesh.rotation.y = 0;             
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;  
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
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

class PatriotBus extends Vehicle {
    constructor(scene) {
        super(scene, 'patriotbus');
        this.isRideable = true; // Rideable transport
    }
    
    create() {
        console.log(`🚌 Creating Level 4 Patriot Bus`);
        
        const size = { width: 8.0, height: 4.0 }; // Large bus
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const texture = this.loadPatriotBusTexture('patriotbus.png');
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1; // Water level
        
        this.scene.add(this.mesh);
        console.log(`✅ Patriot Bus created`);
    }
    
    loadPatriotBusTexture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename);
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
    
    updateRotationBasedOnMovement() {
        if (!this.mesh || this.velocity.length() === 0) return;
        
        this.mesh.rotation.x = Math.PI / 2;
        this.mesh.rotation.y = Math.PI;
        
        if (this.movingRight) {
            this.mesh.rotation.z = -Math.PI;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x);
        } else {
            this.mesh.rotation.z = -Math.PI;
            this.mesh.scale.x = -Math.abs(this.mesh.scale.x);
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


// Level 4 Vehicle Class (Washington D.C.)
class Level4Vehicle extends Vehicle {
    constructor(scene, vehicleType) {
        super(scene, vehicleType);
    }
    
    create() {
        console.log(`🏛️ Creating Level 4 ${this.type} vehicle`);
        
        const size = { width: 5.0, height: 2.5 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Try to load texture, fallback to colored geometry
        let material;
        try {
            const texture = this.loadLevel4Texture(`${this.type}.png`);
            material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide
            });
        } catch (error) {
            // Fallback to colored geometry
            material = new THREE.MeshLambertMaterial({ 
                color: this.getLevel4VehicleColor()
            });
            console.warn(`Using placeholder for ${this.type}`);
        }
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 5.0;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 4 ${this.type} vehicle created`);
    }
    
    loadLevel4Texture(filename) {
        const textureLoader = new THREE.TextureLoader();
        return textureLoader.load(filename);
    }
    
    getLevel4VehicleColor() {
        const colors = {
            secret_service_suv: 0x000000,    // Black SUV
            capitol_police: 0x000080,        // Navy blue
            political_limo: 0x2F2F2F,       // Dark gray
            protest_van: 0xFF4500,           // Orange red
            media_truck: 0xFFFFFF            // White
        };
        return colors[this.type] || 0x444444;
    }
}

// Level 5 Vehicle Class (Digital/AGI)
class Level5Vehicle extends Vehicle {
    constructor(scene, vehicleType) {
        super(scene, vehicleType);
    }
    
    create() {
        console.log(`🤖 Creating Level 5 ${this.type} vehicle`);
        
        const size = { width: 4.0, height: 2.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Always use glowing materials for digital world
        const material = new THREE.MeshLambertMaterial({ 
            color: this.getLevel5VehicleColor(),
            emissive: this.getLevel5VehicleEmissive(),
            emissiveIntensity: 0.6,
            transparent: true,
            opacity: 0.9
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 5.0;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 5 ${this.type} vehicle created`);
    }
    
    getLevel5VehicleColor() {
        const colors = {
            virus_program: 0xff0000,      // Red virus
            firewall_agent: 0x0000ff,    // Blue firewall
            data_packet: 0x00ff00,       // Green data
            ai_drone: 0xff00ff,          // Magenta AI
            quantum_bit: 0x00ffff        // Cyan quantum
        };
        return colors[this.type] || 0x888888;
    }
    
    getLevel5VehicleEmissive() {
        const emissive = {
            virus_program: 0x440000,
            firewall_agent: 0x000044,
            data_packet: 0x004400,
            ai_drone: 0x440044,
            quantum_bit: 0x004444
        };
        return emissive[this.type] || 0x222222;
    }
}

// Level 4 Water Obstacles (Government Boats)
class Level4GovernmentBoat extends Vehicle {
    constructor(scene) {
        super(scene, 'government_boat');
        this.isRideable = true;
    }
    
    create() {
        console.log(`🛥️ Creating Level 4 Government Boat`);
        
        const size = { width: 6.0, height: 2.5 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x333333,
            emissive: 0x111111,
            emissiveIntensity: 0.2
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 4 government boat created`);
    }
}

class Level4CoastGuard extends Vehicle {
    constructor(scene) {
        super(scene, 'coast_guard');
        this.isRideable = true;
    }
    
    create() {
        console.log(`🚢 Creating Level 4 Coast Guard vessel`);
        
        const size = { width: 7.0, height: 3.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const material = new THREE.MeshLambertMaterial({ 
            color: 0xffffff,
            emissive: 0x222222,
            emissiveIntensity: 0.1
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 4 coast guard created`);
    }
}

class Level4PresidentialYacht extends Vehicle {
    constructor(scene) {
        super(scene, 'presidential_yacht');
        this.isRideable = true;
    }
    
    create() {
        console.log(`🛳️ Creating Level 4 Presidential Yacht`);
        
        const size = { width: 10.0, height: 4.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x1e3a5f,
            emissive: 0x0a1a2f,
            emissiveIntensity: 0.3
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 4 presidential yacht created`);
    }
}

// Level 5 Water Obstacles (Digital Transport)
class Level5QuantumPlatform extends Vehicle {
    constructor(scene) {
        super(scene, 'quantum_platform');
        this.isRideable = true;
    }
    
    create() {
        console.log(`⚛️ Creating Level 5 Quantum Platform`);
        
        const size = { width: 8.0, height: 3.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x00ffff,
            emissive: 0x006666,
            emissiveIntensity: 0.8,
            transparent: true,
            opacity: 0.7
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 5 quantum platform created`);
    }
}

class Level5DataStream extends Vehicle {
    constructor(scene) {
        super(scene, 'data_stream');
        this.isRideable = true;
    }
    
    create() {
        console.log(`💾 Creating Level 5 Data Stream`);
        
        const size = { width: 6.0, height: 2.0 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const material = new THREE.MeshLambertMaterial({ 
            color: 0x00ff00,
            emissive: 0x004400,
            emissiveIntensity: 1.0,
            transparent: true,
            opacity: 0.6
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 5 data stream created`);
    }
}

class Level5NeuralLink extends Vehicle {
    constructor(scene) {
        super(scene, 'neural_link');
        this.isRideable = true;
    }
    
    create() {
        console.log(`🧠 Creating Level 5 Neural Link`);
        
        const size = { width: 7.0, height: 2.5 };
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        const material = new THREE.MeshLambertMaterial({ 
            color: 0xff00ff,
            emissive: 0x440044,
            emissiveIntensity: 0.9,
            transparent: true,
            opacity: 0.8
        });
        
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.rotation.y = 0;
        this.mesh.rotation.z = -Math.PI;
        this.mesh.position.y = 0.1;
        
        this.scene.add(this.mesh);
        console.log(`✅ Level 5 neural link created`);
    }
}

export { ConfigurableLevel, VehicleFactory, ObstacleFactory };