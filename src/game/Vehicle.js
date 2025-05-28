import * as THREE from 'three';

// ===== EASY CONFIGURATION SECTION =====
// Adjust these values to fix issues quickly
const CONFIG = {
    // HEIGHT SETTINGS
    roadVehicleHeight: 5.0,        // How high above ground (0-10 range)
    
    // VEHICLE DIMENSIONS (width x height in world units)
    vehicleSizes: {
        cybertruck: { width: 4.0, height: 2.0 },   // Good reference size
        taxi: { width: 4.0, height: 2.0 },         // FIXED: was squished, now same as cybertruck
        sportscar: { width: 4.0, height: 2.0 },   // FIXED: was squished, now same as cybertruck
    },
    
    // ROTATION FIXES
    rotation: {
        baseX: -Math.PI / 2,           
        baseY: 0,                      
        baseZ: Math.PI,                      
        
        facingRightZ: -Math.PI,      // Keep this - flips right-moving cars  
        facingLeftZ: -Math.PI,             // CHANGE THIS - no flip for left-moving cars
    },
    
    // MOVEMENT DIRECTION FIX
    movement: {
        invertDirection: false,         // FLIP THIS if cars move opposite to facing direction
    },
    
    // LANE POSITIONING (to avoid sidewalks)
    lanes: {
        roadStartZ: -15,               // Where road starts (negative Z)
        roadEndZ: 15,                  // Where road ends (positive Z)  
        laneWidth: 3,                  // Width of each lane
        numLanes: 5,                   // Total number of lanes
    }
};


// ===== RECOMMENDED VALUES TO TRY =====
/*
If cars are UPSIDE DOWN, try:
CONFIG.rotation.baseX = Math.PI / 2;  (instead of -Math.PI / 2)

If cars move WRONG DIRECTION, try:
CONFIG.movement.invertDirection = false;  (instead of true)

If cars are SQUISHED, adjust:
CONFIG.vehicleSizes.taxi.width = 5.0;     (make wider)
CONFIG.vehicleSizes.sportscar.width = 5.0;

If cars are on SIDEWALK, adjust:
CONFIG.lanes.roadStartZ = -12;            (narrow the road)
CONFIG.lanes.roadEndZ = 12;
*/

// Base class for all moving obstacles
export class Vehicle {
    constructor(scene, type = 'car') {
        this.scene = scene;
        this.type = type;
        this.mesh = null;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();
        this.speed = 1;
        this.isRideable = false;
        this.movingRight = true;
        
        console.log(`🚗 Creating ${type} vehicle`);
    }
    
    // Get proper geometry sizes for each vehicle type
    static getVehicleSize(vehicleType) {
        // Use CONFIG sizes for road vehicles
        if (CONFIG.vehicleSizes[vehicleType]) {
            return CONFIG.vehicleSizes[vehicleType];
        }
        
        // Default sizes for water objects
        const defaultSizes = {
            log: { radius: 0.6, length: 6.0 },
            lilypad: { radius: 2.5 },
            turtle: { width: 2.0, height: 1.5 },
            crocodile: { width: 4.0, height: 1.0 }
        };
        
        return defaultSizes[vehicleType] || { width: 3.0, height: 2.0 };
    }
    
    // Load textures properly
    static getTexture(vehicleType) {
        const textureLoader = new THREE.TextureLoader();
        const filename = `${vehicleType}.png`;
        
        console.log(`🖼️ Loading texture for ${vehicleType}`);
        
        const texture = textureLoader.load(
            filename,
            (loadedTexture) => {
                console.log(`✅ ${vehicleType} texture loaded successfully`);
                loadedTexture.wrapS = THREE.ClampToEdgeWrapping;
                loadedTexture.wrapT = THREE.ClampToEdgeWrapping;
                loadedTexture.minFilter = THREE.LinearFilter;
                loadedTexture.magFilter = THREE.LinearFilter;
                loadedTexture.flipY = false;
            },
            undefined,
            (error) => {
                console.error(`❌ Failed to load ${vehicleType} texture:`, error);
            }
        );
        
        return texture;
    }
    
    create() {
        if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
            this.createRoadVehicle();
        } else {
            this.createWaterObject();
        }
        
        if (this.mesh) {
            this.scene.add(this.mesh);
        }
    }
    
    createRoadVehicle() {
        console.log(`🛣️ Creating road vehicle: ${this.type}`);
        
        const size = Vehicle.getVehicleSize(this.type);
        const geometry = new THREE.PlaneGeometry(size.width, size.height);
        
        // Try to load PNG texture
        const texture = Vehicle.getTexture(this.type);
        
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            alphaTest: 0.1,
            side: THREE.DoubleSide
        });
        
        // Fallback colors if texture fails
        material.color = new THREE.Color(this.getVehicleColor());
        
        this.mesh = new THREE.Mesh(geometry, material);
        
        // APPLY CONFIGURABLE ROTATION
        this.mesh.rotation.x = CONFIG.rotation.baseX;
        this.mesh.rotation.y = CONFIG.rotation.baseY;
        this.mesh.rotation.z = CONFIG.rotation.baseZ;
        
        // SET CONFIGURABLE HEIGHT
        this.mesh.position.y = CONFIG.roadVehicleHeight;
        
        console.log(`✅ Road vehicle ${this.type} created with size ${size.width}x${size.height} at height ${CONFIG.roadVehicleHeight}`);
    }
    
    createWaterObject() {
        console.log(`🌊 Creating water object: ${this.type}`);
        
        let geometry, material;
        const size = Vehicle.getVehicleSize(this.type);
        
        switch (this.type) {
            case 'log':
                geometry = new THREE.CylinderGeometry(size.radius, size.radius, size.length, 12);
                material = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.rotation.z = Math.PI / 2;
                this.isRideable = true;
                break;
                
            case 'lilypad':
                geometry = new THREE.CylinderGeometry(size.radius, size.radius, 0.3, 16);
                material = new THREE.MeshBasicMaterial({ 
                    color: 0x00FF00,
                    transparent: false
                });
                this.mesh = new THREE.Mesh(geometry, material);
                this.mesh.position.y = 0.2;
                this.isRideable = true;
                
                const centerGeometry = new THREE.CylinderGeometry(0.8, 0.8, 0.4, 8);
                const centerMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFF00 });
                const center = new THREE.Mesh(centerGeometry, centerMaterial);
                center.position.y = 0.2;
                this.mesh.add(center);
                break;
                
            case 'turtle':
                geometry = new THREE.BoxGeometry(size.width, 0.8, size.height);
                material = new THREE.MeshLambertMaterial({ color: 0x006400 });
                this.mesh = new THREE.Mesh(geometry, material);
                this.isRideable = true;
                break;
                
            case 'crocodile':
                geometry = new THREE.BoxGeometry(size.width, 0.6, size.height);
                material = new THREE.MeshLambertMaterial({ color: 0x556B2F });
                this.mesh = new THREE.Mesh(geometry, material);
                this.isRideable = false;
                break;
        }
        
        if (this.mesh) {
            this.mesh.position.y = 0.0;
            this.mesh.castShadow = true;
            this.mesh.receiveShadow = true;
        }
    }
    
    getVehicleColor() {
        const colors = {
            cybertruck: 0xC0C0C0,
            taxi: 0xFFD700,
            sportscar: 0xFF4500
        };
        return colors[this.type] || 0x666666;
    }
    
    // Set position with lane constraints
    setPosition(x, y, z) {
        // CONSTRAIN TO ROAD LANES (avoid sidewalks)
        if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
            // Clamp Z position to stay on road
            z = Math.max(CONFIG.lanes.roadStartZ, Math.min(CONFIG.lanes.roadEndZ, z));
        }
        
        this.position.set(x, y, z);
        if (this.mesh) {
            if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
                this.mesh.position.set(x, CONFIG.roadVehicleHeight, z);
            } else {
                this.mesh.position.copy(this.position);
            }
        }
    }
    
    setVelocity(vx, vy, vz) {
        // APPLY MOVEMENT DIRECTION FIX
        if (CONFIG.movement.invertDirection && ['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
            vx = -vx; // Invert X velocity if needed
        }
        
        this.velocity.set(vx, vy, vz);
        this.speed = this.velocity.length();
        this.movingRight = vx > 0;
        
        console.log(`🎯 ${this.type} velocity: (${vx}, ${vy}, ${vz}) - Moving right: ${this.movingRight}`);
        
        this.updateRotationBasedOnMovement();
    }
    
// In Vehicle.js, replace the updateRotationBasedOnMovement() method with this:

updateRotationBasedOnMovement() {
    if (!this.mesh || this.velocity.length() === 0) return;
    
    if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
        // APPLY CONFIGURABLE ROTATION
        this.mesh.rotation.x = CONFIG.rotation.baseX;
        this.mesh.rotation.y = CONFIG.rotation.baseY;
        
        if (this.movingRight) {
            // Cars moving right: normal orientation
            this.mesh.rotation.z = CONFIG.rotation.facingRightZ;
            this.mesh.scale.x = Math.abs(this.mesh.scale.x); // Ensure positive scale
        } else {
            // Cars moving left: flip horizontally so they face left
            this.mesh.rotation.z = CONFIG.rotation.facingLeftZ;
            this.mesh.scale.x = -Math.abs(this.mesh.scale.x); // Make scale negative to flip
        }
        
        console.log(`🚗 ${this.type} facing ${this.movingRight ? 'RIGHT →' : 'LEFT ←'} (scale.x: ${this.mesh.scale.x})`);
        
    } else if (['log', 'lilypad'].includes(this.type)) {
        if (this.type === 'log') {
            this.mesh.rotation.x = 0;
            this.mesh.rotation.y = 0; 
            this.mesh.rotation.z = Math.PI / 2;
        }
    } else {
        const angle = Math.atan2(this.velocity.z, this.velocity.x);
        this.mesh.rotation.y = -angle;
    }
}
    
    canPlayerRide() {
        return this.isRideable === true;
    }
    
    getRideHeight() {
        if (!this.isRideable) return null;
        
        switch (this.type) {
            case 'log':
                return this.position.y + 0.8;
            case 'lilypad':
                return this.position.y + 0.2;
            case 'turtle':
                return this.position.y + 0.5;
            default:
                return this.position.y + 0.3;
        }
    }
    
    update(deltaTime) {
        this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
        
        if (this.mesh) {
            if (['cybertruck', 'taxi', 'sportscar'].includes(this.type)) {
                // MAINTAIN ROAD CONSTRAINTS AND HEIGHT
                let constrainedZ = Math.max(CONFIG.lanes.roadStartZ, Math.min(CONFIG.lanes.roadEndZ, this.position.z));
                this.mesh.position.x = this.position.x;
                this.mesh.position.y = CONFIG.roadVehicleHeight;
                this.mesh.position.z = constrainedZ;
            } else {
                this.mesh.position.copy(this.position);
                
                // Water bobbing
                const time = Date.now() * 0.001;
                const offset = this.position.x * 0.1;
                const bobAmount = this.type === 'lilypad' ? 0.01 : 0.02;
                this.mesh.position.y = this.position.y + Math.sin(time * 2 + offset) * bobAmount;
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
            if (this.mesh.material) {
                if (this.mesh.material.map) this.mesh.material.map.dispose();
                this.mesh.material.dispose();
            }
            if (this.mesh.geometry) this.mesh.geometry.dispose();
            this.mesh = null;
        }
    }
}

// VEHICLE CLASSES
export class Car extends Vehicle {
    constructor(scene) {
        const types = ['cybertruck', 'taxi', 'sportscar'];
        const selectedType = types[Math.floor(Math.random() * types.length)];
        super(scene, selectedType);
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
        super(scene, 'sportscar');
    }
}

// WATER OBJECTS
export class Log extends Vehicle {
    constructor(scene) {
        super(scene, 'log');
    }
}

export class LilyPad extends Vehicle {
    constructor(scene) {
        super(scene, 'lilypad');
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