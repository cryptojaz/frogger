import * as THREE from 'three';

export class Player {
    constructor(scene, audioManager = null) {
        this.scene = scene;
        this.audioManager = audioManager;
        this.mesh = null;
        this.position = new THREE.Vector3();
        
        // ✅ NEW: Ground circle for depth perception
        this.groundCircle = null;
        
        // Current direction for sprite
        this.currentDirection = 'up';
        this.textures = {};
        
        // Animation properties
        this.isHopping = false;
        this.hopStartY = 0;
        this.hopHeight = 0.5;
        this.hopDuration = 0.3;
        this.hopTimer = 0;
        
        // ✅ NEW: Riding state for logs/gators
        this.ridingLog = null;
        this.logOffset = 0;
        
        console.log('🐸 Player instance created');
    }
    
    async create() {
        await this.loadTextures();
        this.createSprite();
        this.createGroundIndicator(); // ✅ NEW: Add ground circle
        this.scene.add(this.mesh);
        console.log('🐸 Directional sprite frog created with ground indicator');
    }
    
    // ✅ ORIGINAL: Keep your exact texture loading but add ONE line
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
                // ✅ ONLY ADD: This one line for background removal
                this.textures[direction].premultiplyAlpha = false;
            } catch (error) {
                console.warn(`Failed to load ${filename}:`, error);
            }
        }
    }
    
    // ✅ ORIGINAL: Keep your exact sprite creation but add ONE line
    createSprite() {
        const material = new THREE.SpriteMaterial({
            map: this.textures[this.currentDirection],
            transparent: true,
            alphaTest: 0.1  // ✅ ONLY ADD: This one line for background removal
        });
        
        this.mesh = new THREE.Sprite(material);
        this.mesh.scale.set(2, 2, 1);
        this.mesh.position.copy(this.position);
        this.mesh.castShadow = true;
    }
    
    // ✅ NEW: Create ground circle for depth perception
    createGroundIndicator() {
        console.log('🎯 Creating ground indicator circle...');
        
        // Create a subtle ground circle/shadow under the frog
        const circleGeometry = new THREE.RingGeometry(0.3, 0.5, 16);
        const circleMaterial = new THREE.MeshBasicMaterial({
            color: 0x00ff88,        // Green color
            transparent: true,
            opacity: 0.6,
            side: THREE.DoubleSide,
            depthWrite: false       // Prevents z-fighting with ground
        });
        
        this.groundCircle = new THREE.Mesh(circleGeometry, circleMaterial);
        this.groundCircle.rotation.x = -Math.PI / 2; // Lay flat on ground
        this.groundCircle.position.y = 0.01; // Just above ground
        this.groundCircle.renderOrder = 1; // Render after ground
        
        this.scene.add(this.groundCircle);
        console.log('✅ Ground indicator created - green circle under frog');
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        if (this.mesh) {
            // Add small Y offset so frog sits on ground instead of in it
            this.mesh.position.set(x, y + 1, z);
        }
        
        // ✅ NEW: Update ground circle position
        if (this.groundCircle) {
            this.groundCircle.position.x = x;
            this.groundCircle.position.z = z;
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
        
        // ✅ NEW: Update ground circle position immediately
        if (this.groundCircle) {
            this.groundCircle.position.x = this.position.x;
            this.groundCircle.position.z = this.position.z;
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
        
        // ✅ NEW: Update ground circle position to follow frog
        if (this.groundCircle) {
            this.groundCircle.position.x = this.position.x;
            this.groundCircle.position.z = this.position.z;
            
            // Subtle pulsing animation
            const time = Date.now() * 0.003;
            const pulse = 1 + Math.sin(time) * 0.1;
            this.groundCircle.scale.set(pulse, pulse, pulse);
        }
        
        // Hop animation
        if (this.isHopping) {
            this.hopTimer += deltaTime;
            const hopProgress = this.hopTimer / this.hopDuration;
            
            if (hopProgress <= 1.0) {
                const hopY = this.hopStartY + (4 * this.hopHeight * hopProgress * (1 - hopProgress));
                this.mesh.position.y = hopY + 1;
                
                // ✅ NEW: Make ground circle brighter and larger during hop
                if (this.groundCircle) {
                    this.groundCircle.material.opacity = 0.8 + (hopProgress * 0.2);
                    const hopScale = 1 + (hopProgress * 0.3);
                    this.groundCircle.scale.set(hopScale, hopScale, hopScale);
                }
                
                const squashFactor = 1 - 0.2 * Math.sin(hopProgress * Math.PI);
                this.mesh.scale.set(squashFactor * 2, (1 / squashFactor) * 2, 1);
            } else {
                this.isHopping = false;
                this.mesh.position.y = this.hopStartY + 1;
                this.mesh.scale.set(2, 2, 1);
                
                // ✅ NEW: Reset ground circle opacity and scale
                if (this.groundCircle) {
                    this.groundCircle.material.opacity = 0.6;
                    this.groundCircle.scale.set(1, 1, 1);
                }
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
    
    // ✅ NEW: Update ground circle color based on danger level
    updateGroundCircleColor(dangerLevel) {
        if (!this.groundCircle) return;
        
        const material = this.groundCircle.material;
        switch(dangerLevel) {
            case 0: // Safe - green
                material.color.setHex(0x00ff88);
                break;
            case 1: // Caution - yellow
                material.color.setHex(0xffff00);
                break;
            case 2: // Danger - red
                material.color.setHex(0xff0000);
                break;
            default:
                material.color.setHex(0x00ff88); // Default green
        }
    }
    
    // ✅ NEW: Set ground circle visibility
    setGroundCircleVisible(visible) {
        if (this.groundCircle) {
            this.groundCircle.visible = visible;
        }
    }
    
    // ✅ NEW: Get ground circle visibility state
    isGroundCircleVisible() {
        return this.groundCircle ? this.groundCircle.visible : false;
    }
    
    tongueAttack() {
        console.log('👅 Frog extends tongue!');
        if (this.mesh) {
            this.mesh.scale.setScalar(2.4);
            setTimeout(() => {
                if (this.mesh) this.mesh.scale.set(2, 2, 1);
            }, 200);
        }
        
        // ✅ NEW: Flash ground circle during tongue attack
        if (this.groundCircle) {
            const originalColor = this.groundCircle.material.color.getHex();
            this.groundCircle.material.color.setHex(0xffffff); // Flash white
            setTimeout(() => {
                if (this.groundCircle) {
                    this.groundCircle.material.color.setHex(originalColor);
                }
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
        
        // ✅ NEW: Ripple effect on ground circle during croak
        if (this.groundCircle) {
            const originalScale = this.groundCircle.scale.x;
            this.groundCircle.scale.set(originalScale * 1.5, originalScale * 1.5, originalScale * 1.5);
            setTimeout(() => {
                if (this.groundCircle) {
                    this.groundCircle.scale.set(originalScale, originalScale, originalScale);
                }
            }, 300);
        }
    }
    
    dispose() {
        console.log('🧹 Disposing player resources...');
        
        // Dispose textures
        Object.values(this.textures).forEach(texture => {
            if (texture) texture.dispose();
        });
        
        // ✅ NEW: Dispose ground circle
        if (this.groundCircle) {
            this.scene.remove(this.groundCircle);
            if (this.groundCircle.geometry) this.groundCircle.geometry.dispose();
            if (this.groundCircle.material) this.groundCircle.material.dispose();
            this.groundCircle = null;
            console.log('✅ Ground circle disposed');
        }
        
        // Dispose frog sprite
        if (this.mesh) {
            if (this.mesh.material) this.mesh.material.dispose();
            this.scene.remove(this.mesh);
            this.mesh = null;
        }
        
        console.log('🐸 Player resources cleaned up');
    }
}