import * as THREE from 'three';

export class Player {
    constructor(scene, audioManager = null) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.mesh = null;
        this.position = new THREE.Vector3();
        
        // Current direction for sprite
        this.currentDirection = 'up';
        this.textures = {};
        
        // Animation properties
        this.isHopping = false;
        this.hopStartY = 0;
        this.hopHeight = 0.5;
        this.hopDuration = 0.3;
        this.hopTimer = 0;
        
        console.log('🐸 Player instance created');
    }
    
    async create() {
        await this.loadTextures();
        this.createSprite();
        this.scene.add(this.mesh);
        console.log('🐸 Directional sprite frog created');
    }
    
    async loadTextures() {
        const loader = new THREE.TextureLoader();
        
        // Your actual file names
        const files = {
            up: 'froggermain.png',    // Main/front facing
            down: 'frogger.png',      // Back facing  
            left: 'froggerleft.png',  // Left facing
            right: 'froggerright.png' // Right facing
        };
        
        for (const [direction, filename] of Object.entries(files)) {
            try {
                this.textures[direction] = await new Promise((resolve, reject) => {
                    loader.load(filename, resolve, undefined, reject);
                });
                this.textures[direction].magFilter = THREE.NearestFilter;
                this.textures[direction].minFilter = THREE.NearestFilter;
            } catch (error) {
                console.warn(`Failed to load ${filename}:`, error);
            }
        }
    }
    
    createSprite() {
        const material = new THREE.SpriteMaterial({
            map: this.textures[this.currentDirection],
            transparent: true
        });
        
        this.mesh = new THREE.Sprite(material);
        this.mesh.scale.set(2, 2, 1);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            // Add small Y offset so frog sits on ground instead of in it
            this.mesh.position.set(x, y + 1, z);
        }
    }
    
    move(dx, dy, dz) {
        this.position.add(new THREE.Vector3(dx, dy, dz));
        
        // Update direction based on movement
        if (Math.abs(dx) > Math.abs(dz)) {
            this.currentDirection = dx > 0 ? 'right' : 'left';
        } else if (dz !== 0) {
            this.currentDirection = dz > 0 ? 'down' : 'up';
        }
        
        // Update sprite texture
        if (this.mesh && this.textures[this.currentDirection]) {
            this.mesh.material.map = this.textures[this.currentDirection];
            this.mesh.material.needsUpdate = true;
        }
        
        this.startHop();
        
        // Play jump sound
        if (this.audioManager) {
            this.audioManager.playSFX('jump');
        }
        
        if (this.mesh) {
            this.mesh.position.set(this.position.x, this.position.y + 1, this.position.z);
        }
        
        console.log(`🐸 Frog hopped ${this.currentDirection}`);
    }
    
    startHop() {
        this.isHopping = true;
        this.hopTimer = 0;
        this.hopStartY = this.position.y;
    }
    
    update(deltaTime) {
        if (!this.mesh) return;
        
        if (this.isHopping) {
            this.hopTimer += deltaTime;
            const hopProgress = this.hopTimer / this.hopDuration;
            
            if (hopProgress <= 1.0) {
                const hopY = this.hopStartY + (4 * this.hopHeight * hopProgress * (1 - hopProgress));
                this.mesh.position.y = hopY + 1;
                
                const squashFactor = 1 - 0.2 * Math.sin(hopProgress * Math.PI);
                this.mesh.scale.set(squashFactor * 2, (1 / squashFactor) * 2, 1);
            } else {
                this.isHopping = false;
                this.mesh.position.y = this.hopStartY + 1;
                this.mesh.scale.set(2, 2, 1);
            }
        } else {
            // Idle bobbing
            const time = Date.now() * 0.002;
            this.mesh.position.y = this.position.y + 1 + Math.sin(time) * 0.03;
        }
        
        // Ensure frog stays above ground
        this.mesh.position.x = this.position.x;
        this.mesh.position.z = this.position.z;
    }
    
    tongueAttack() {
        console.log('👅 Frog extends tongue!');
        if (this.mesh) {
            this.mesh.scale.setScalar(2.4);
            setTimeout(() => {
                if (this.mesh) this.mesh.scale.set(2, 2, 1);
            }, 200);
        }
    }
    
    croak() {
        console.log('🐸 Ribbit!');
        if (this.mesh) {
            const originalRotation = this.mesh.rotation.z;
            this.mesh.rotation.z = originalRotation + (Math.random() - 0.5) * 0.1;
            setTimeout(() => {
                if (this.mesh) this.mesh.rotation.z = originalRotation;
            }, 100);
        }
    }
    
    dispose() {
        Object.values(this.textures).forEach(texture => {
            if (texture) texture.dispose();
        });
        
        if (this.mesh) {
            if (this.mesh.material) this.mesh.material.dispose();
            this.scene.remove(this.mesh);
            this.mesh = null;
        }
        
        console.log('🐸 Player resources cleaned up');
    }
}