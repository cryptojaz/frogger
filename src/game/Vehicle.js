import * as THREE from 'three';

// Base class for all moving obstacles
export class Vehicle {
    constructor(scene, type = 'car') {
        this.scene = scene;
        this.type = type;
        this.mesh = null;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.speed = 1;
        this.isRideable = false; // Key property for logs/turtles vs cars/crocodiles
        
        console.log(`🚗 Creating ${type} vehicle`);
    }
    
    // CORRECT ASPECT RATIOS based on your actual PNG dimensions
    static getGeometryForType(vehicleType) {
        // Calculate correct aspect ratios from your PNG dimensions
        const dimensions = {
            cybertruck: { width: 1259, height: 568 },  // Wide rectangle
            taxi: { width: 1024, height: 1536 },       // Tall rectangle  
            sportscar: { width: 1024, height: 1536 }   // Sports car instead of bus
        };
        
        const dim = dimensions[vehicleType];
        if (!dim) return new THREE.PlaneGeometry(3.0, 2.0); // Fallback
        
        // Calculate aspect ratio
        const aspectRatio = dim.width / dim.height;
        
        // Set base size and maintain aspect ratio
        let width, height;
        
        if (aspectRatio > 1) {
            // Wide image (like cybertruck)
            width = 4.0;  // Make it big enough to see
            height = width / aspectRatio;
        } else {
            // Tall image (like taxi/sportscar)
            height = 4.0;  // Make it big enough to see
            width = height * aspectRatio;
        }
        
        console.log(`📐 ${vehicleType}: ${dim.width}x${dim.height} → ${width.toFixed(1)}x${height.toFixed(1)} (aspect: ${aspectRatio.toFixed(2)})`);
        
        return new THREE.PlaneGeometry(width, height);
    }
    
    // Load textures
    static getTexture(vehicleType) {
        if (!Vehicle._textures) Vehicle._textures = {};
        
        if (!Vehicle._textures[vehicleType]) {
            const textureLoader = new THREE.TextureLoader();
            const filename = `${vehicleType}.png`;
            
            console.log(`🖼️ Loading ${vehicleType} from ${filename}`);
            
            Vehicle._textures[vehicleType] = textureLoader.load(
                filename,
                (texture) => {
                    console.log(`✅ ${vehicleType} texture loaded successfully`);
                    console.log(`   Image size: ${texture.image.width} x ${texture.image.height}`);
                    texture.wrapS = THREE.ClampToEdgeWrapping;
                    texture.wrapT = THREE.ClampToEdgeWrapping;
                    texture.flipY = false;
                },
                undefined,
                (error) => {
                    console.error(`❌ Failed to load ${vehicleType}:`, error);
                    Vehicle._textures[vehicleType] = null;
                }
            );
        }
        return Vehicle._textures[vehicleType];
    }
    
    create() {
        if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
            this.createCorrectAspectPNG();
        } else {
            // River objects - logs, turtles, crocodiles
            this.createRiverObject();
        }
        
        if (this.mesh) {
            this.scene.add(this.mesh);
        }
    }
    
    createCorrectAspectPNG() {
        console.log(`🎨 Creating PNG vehicle with correct aspect ratio: ${this.type}`);
        
        const texture = Vehicle.getTexture(this.type);
        
        if (texture) {
            // PERFECT MATERIAL - No distortion
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                alphaTest: 0.1,
                side: THREE.DoubleSide
            });
            
            // CORRECT GEOMETRY - Matches PNG aspect ratio
            const geometry = Vehicle.getGeometryForType(this.type);
            this.mesh = new THREE.Mesh(geometry, material);
            
            // SIMPLE ROTATION - lay flat
            this.mesh.rotation.x = -Math.PI / 2;
            
            // ALL VEHICLES AT SAME HEIGHT - No vertical separation needed
            this.mesh.position.y = 0.25;
            
            // Special rotation for cybertruck only
            if (this.type === 'cybertruck') {
                this.mesh.rotation.z = Math.PI / 2;
            }
            
            // NO SHADOWS - Keep PNG clean
            this.mesh.castShadow = false;
            this.mesh.receiveShadow = false;
            
            console.log(`✅ ${this.type} created with correct aspect ratio at height ${this.mesh.position.y}`);
        } else {
            console.log(`🔧 Creating colored fallback for ${this.type}`);
            this.createColoredFallback();
        }
    }
    
    createColoredFallback() {
        const colors = {
            cybertruck: 0x888888,
            taxi: 0xFFD700,
            sportscar: 0xff0000  // Red sports car
        };
        
        const material = new THREE.MeshBasicMaterial({
            color: colors[this.type] || 0x666666
        });
        
        const geometry = Vehicle.getGeometryForType(this.type);
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.rotation.x = -Math.PI / 2;
        this.mesh.position.y = 0.25;
        
        if (this.type === 'cybertruck') {
            this.mesh.rotation.z = Math.PI / 2;
        }
    }
    
    createRiverObject() {
        let geometry, material;
        
        switch (this.type) {

            case 'log':
                // Make logs even more rideable
                geometry = new THREE.CylinderGeometry(0.6, 0.6, 7, 12); // Even wider and longer
                material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                this.mesh = new THREE.Mesh(geometry, material);
                
                this.mesh.rotation.z = Math.PI / 2;
                this.mesh.rotation.x = 0;
                this.mesh.rotation.y = 0;
                
                this.isRideable = true;
                
                // Add invisible collision box for easier riding
                const collisionGeometry = new THREE.BoxGeometry(8, 1, 1.5); // Larger collision area
                const collisionMaterial = new THREE.MeshBasicMaterial({ 
                    transparent: true, 
                    opacity: 0,
                    visible: false // Invisible helper
                });
                const collisionBox = new THREE.Mesh(collisionGeometry, collisionMaterial);
                this.mesh.add(collisionBox);
                
                console.log(`🪵 Enhanced log with larger collision area created`);
                break;
                
            case 'turtle':
                // Turtles are RIDEABLE platforms
                geometry = new THREE.SphereGeometry(0.6, 12, 8);
                material = new THREE.MeshLambertMaterial({ color: 0x228B22 });
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.scale.set(1.2, 0.4, 1.5); // Flatter and wider
                this.isRideable = true; // FROG CAN RIDE TURTLES!
                
                // Add shell pattern
                const shellGeometry = new THREE.SphereGeometry(0.5, 12, 8);
                const shellMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
                const shell = new THREE.Mesh(shellGeometry, shellMaterial);
                shell.position.y = 0.1;
                shell.scale.set(1.1, 0.3, 1.3);
                this.mesh.add(shell);
                break;
                
            case 'crocodile':
                // Crocodiles are DANGEROUS - frog should avoid!
                geometry = new THREE.BoxGeometry(2.5, 0.4, 0.8);
                material = new THREE.MeshLambertMaterial({ color: 0x556B2F });
                this.mesh = new THREE.Mesh(geometry, material);
                this.isRideable = false; // DANGEROUS! FROG SHOULD AVOID!
                
                // Add glowing red eyes to show danger
                const eyeGeometry = new THREE.SphereGeometry(0.08, 6, 4);
                const eyeMaterial = new THREE.MeshLambertMaterial({ 
                    color: 0xff0000,
                    emissive: 0x220000 
                });
                
                const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
                leftEye.position.set(-0.2, 0.25, 1.0);
                this.mesh.add(leftEye);
                
                const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
                rightEye.position.set(0.2, 0.25, 1.0);
                this.mesh.add(rightEye);
                break;
        }
        
        if (this.mesh) {
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
            
            if (this.isRideable) {
                console.log(`🪵 Created RIDEABLE ${this.type} - frog can hop on this!`);
            } else {
                console.log(`🐊 Created DANGEROUS ${this.type} - frog should avoid this!`);
            }
        }
    }
    
    // Check if player can ride this object
    canPlayerRide() {
        return this.isRideable || false;
    }
    
    // Get the height the player should be at when riding
    getRideHeight() {
        if (!this.isRideable) return null;
        
        switch (this.type) {
            case 'log':
                return this.position.y + 0.6; // Top of log
            case 'turtle':
                return this.position.y + 0.4; // Top of turtle shell
            default:
                return this.position.y + 0.3;
        }
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }
    
    setVelocity(vx, vy, vz) {
        this.velocity.set(vx, vy, vz);
        this.speed = this.velocity.length();
        
        // Rotate vehicles to face movement direction
        if (this.mesh && this.velocity.length() > 0) {
            const direction = this.velocity.clone().normalize();
            
            if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
                const angle = Math.atan2(direction.x, direction.z);
                
                if (this.type === 'cybertruck') {
                    this.mesh.rotation.z = Math.PI / 2 + angle;
                } else {
                    // Add 180 degrees (Math.PI) to flip taxi and sportscar around
                    this.mesh.rotation.z = angle + Math.PI;
                }
            } else {
                // River objects - handle each type differently
                if (this.type === 'log') {
                    // LOGS STAY PARALLEL TO ROAD - never rotate based on movement
                    this.mesh.rotation.z = Math.PI / 2; // Always horizontal
                    this.mesh.rotation.x = 0;
                    this.mesh.rotation.y = 0;
                    console.log(`🪵 Log stays parallel to road regardless of movement direction`);
                } else {
                    // Turtles and crocodiles face their movement direction
                    const angle = Math.atan2(direction.z, direction.x);
                    this.mesh.rotation.y = -angle + Math.PI / 2;
                }
            }
        }
    }
    
    update(deltaTime) {
        // Update position
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        if (this.mesh) {
            this.mesh.position.copy(this.position);
            
            // Add gentle bobbing for river objects
            if (['log', 'turtle', 'crocodile'].includes(this.type)) {
                const time = Date.now() * 0.001;
                const offset = this.position.x * 0.1;
                this.mesh.position.y = this.position.y + Math.sin(time * 2 + offset) * 0.02;
            }
        }
    }
    
    isVisible(worldWidth) {
        return Math.abs(this.position.x) < worldWidth + 10;
    }
    
    reset(x, y, z, vx, vy, vz) {
        this.setPosition(x, y, z);
        this.setVelocity(vx, vy, vz);
    }
    
    dispose() {
        if (this.mesh) {
            this.scene.remove(this.mesh);
            if (this.mesh.material) this.mesh.material.dispose();
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }
    
    static disposeAll() {
        if (Vehicle._textures) {
            Object.values(Vehicle._textures).forEach(texture => {
                if (texture) texture.dispose();
            });
            Vehicle._textures = null;
        }
        console.log('🧹 All vehicle resources cleaned up');
    }
}

// FIXED: No more overlapping vehicles - each creates specific type
export class Car extends Vehicle {
    constructor(scene) {
        // Random selection to prevent patterns - now uses sportscar instead of bus
        const types = ['cybertruck', 'taxi', 'sportscar'];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        
        super(scene, selectedType);
        console.log(`🎲 Random vehicle: ${selectedType}`);
    }
}

export class Cybertruck extends Vehicle {
    constructor(scene) {
        super(scene, 'cybertruck');
    }
}

export class Taxi extends Vehicle {
    constructor(scene) {
        super(scene, 'taxi');
    }
}

export class Sportscar extends Vehicle {
    constructor(scene) {
        super(scene, 'sportscar');
    }
}

export class Bus extends Vehicle {
    constructor(scene) {
        super(scene, 'sportscar'); // Use sportscar instead of bus
    }
}

export class Log extends Vehicle {
    constructor(scene) {
        super(scene, 'log');
    }
}

export class Turtle extends Vehicle {
    constructor(scene) {
        super(scene, 'turtle');
    }
}

export class Crocodile extends Vehicle {
    constructor(scene) {
        super(scene, 'crocodile');
    }
}