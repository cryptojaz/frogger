import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

export class PlayerGLB {
    constructor(scene) {
        this.scene = scene;
        this.mesh = null;
        this.mixer = null;
        this.animations = {};
        this.currentAnimation = null;
        this.position = new THREE.Vector3();
        
        // Animation properties
        this.targetPosition = new THREE.Vector3();
        this.isMoving = false;
        this.moveSpeed = 8;
        this.isLoaded = false;
        this.isGLBModel = false; // Track if we're using GLB or primitives
        
        // GLB file paths - using original 5MB files
        this.animationFiles = {
            idle: './player/idling.glb',
            jump: './player/jumping.glb',
            run: './player/running.glb',
            victory: './player/victory.glb',
            death: './player/dying.glb'
        };
        
        this.setupLoader();
    }
    
    setupLoader() {
        // Setup GLTF loader with Draco compression support
        this.loader = new GLTFLoader();
        
        // Setup Draco decoder for compressed models
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/');
        this.loader.setDRACOLoader(dracoLoader);
    }
    
    async create() {
        try {
            console.log('🐸 Loading GLB player character...');
            
            // Load the main model (idle animation)
            await this.loadMainModel();
            
            // Load additional animations
            await this.loadAnimations();
            
            // Set initial state - IMPORTANT: Do this before showing mesh
            this.playAnimation('idle');
            this.targetPosition.copy(this.position);
            
            // Small delay to ensure animation starts, then show the mesh
            setTimeout(() => {
                if (this.mesh) {
                    this.mesh.visible = true;
                    console.log('🐸 Player character visible and ready!');
                }
            }, 100);
            
            this.isLoaded = true;
            console.log('🐸 GLB player character loaded successfully!');
            
        } catch (error) {
            console.error('Failed to load GLB player:', error);
            this.createFallbackPlayer();
        }
    }
    
    async loadMainModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                this.animationFiles.idle,
                (gltf) => {
                    // Get the main mesh
                    this.mesh = gltf.scene;
                    
                    // Scale and position the model
                    this.mesh.scale.setScalar(1.0);
                    this.mesh.position.copy(this.position);
                    
                    // Fix starting rotation - face forward (up direction in game)
                    this.mesh.rotation.y = Math.PI; // 180 degrees to face forward
                    this.isGLBModel = true; // Mark as GLB model
                    
                    // Hide mesh initially to prevent T-pose visibility
                    this.mesh.visible = false;
                    
                    // Enable shadows
                    this.mesh.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            
                            // Optimize materials for performance
                            if (child.material) {
                                child.material.precision = 'mediump';
                            }
                        }
                    });
                    
                    // Setup animation mixer
                    this.mixer = new THREE.AnimationMixer(this.mesh);
                    
                    // Store idle animation
                    if (gltf.animations && gltf.animations.length > 0) {
                        this.animations.idle = this.mixer.clipAction(gltf.animations[0]);
                        this.animations.idle.setLoop(THREE.LoopRepeat);
                    }
                    
                    // Add to scene
                    this.scene.add(this.mesh);
                    
                    resolve(gltf);
                },
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(1);
                    console.log(`Loading player model: ${percent}%`);
                    
                    if (progress.total > 2000000) { // 2MB warning
                        console.log(`📦 Large model: ${(progress.total / 1000000).toFixed(1)}MB`);
                    }
                },
                (error) => {
                    console.error('Error loading main player model:', error);
                    reject(error);
                }
            );
        });
    }
    
    async loadAnimations() {
        const loadPromises = Object.entries(this.animationFiles)
            .filter(([name]) => name !== 'idle') // Skip idle (already loaded)
            .map(([name, path]) => this.loadSingleAnimation(name, path));
        
        try {
            await Promise.all(loadPromises);
            console.log('🎬 All player animations loaded');
        } catch (error) {
            console.warn('Some animations failed to load, using fallbacks:', error);
        }
    }
    
    async loadSingleAnimation(name, path) {
        return new Promise((resolve, reject) => {
            this.loader.load(
                path,
                (gltf) => {
                    if (gltf.animations && gltf.animations.length > 0 && this.mixer) {
                        const action = this.mixer.clipAction(gltf.animations[0]);
                        
                        // Configure animation based on type
                        switch (name) {
                            case 'jump':
                                action.setLoop(THREE.LoopOnce);
                                action.clampWhenFinished = true;
                                break;
                            case 'victory':
                            case 'death':
                                action.setLoop(THREE.LoopOnce);
                                action.clampWhenFinished = true;
                                break;
                            case 'run':
                                action.setLoop(THREE.LoopRepeat);
                                break;
                            default:
                                action.setLoop(THREE.LoopRepeat);
                        }
                        
                        this.animations[name] = action;
                        console.log(`✅ Loaded animation: ${name}`);
                    }
                    resolve(gltf);
                },
                undefined,
                (error) => {
                    console.warn(`Failed to load animation ${name}:`, error);
                    resolve(); // Don't reject, just continue without this animation
                }
            );
        });
    }
    
    createFallbackPlayer() {
        console.log('🐸 Creating fallback primitive player...');
        
        // Create simple frog from primitives as fallback
        const bodyGeometry = new THREE.BoxGeometry(1.2, 0.8, 1.5);
        const bodyMaterial = new THREE.MeshLambertMaterial({ color: 0x00aa00 });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        
        this.mesh = new THREE.Group();
        this.mesh.add(body);
        
        // Add simple eyes
        const eyeGeometry = new THREE.SphereGeometry(0.15, 8, 8);
        const eyeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        
        const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        leftEye.position.set(-0.3, 0.5, -0.4);
        this.mesh.add(leftEye);
        
        const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
        rightEye.position.set(0.3, 0.5, -0.4);
        this.mesh.add(rightEye);
        
        // IMPORTANT: Face forward direction (up in game world)
        this.mesh.rotation.y = 0; // Don't rotate - eyes are already at front (-0.4 z)
        
        this.scene.add(this.mesh);
        this.isLoaded = true;
        this.isGLBModel = false; // Mark as primitive model
        
        console.log('🐸 Fallback player created and facing forward');
    }
    
    playAnimation(animationName, fadeTime = 0.2) {
        if (!this.mixer || !this.animations[animationName]) {
            console.warn(`Animation '${animationName}' not available, using fallback`);
            return;
        }
        
        const newAction = this.animations[animationName];
        
        // Fade from current animation
        if (this.currentAnimation && this.currentAnimation !== newAction) {
            this.currentAnimation.fadeOut(fadeTime);
        }
        
        // Fade in new animation
        newAction.reset();
        newAction.fadeIn(fadeTime);
        newAction.play();
        
        this.currentAnimation = newAction;
        
        // Handle one-time animations
        if (animationName === 'jump') {
            // Reset to idle after jump completes
            setTimeout(() => {
                if (!this.isMoving) {
                    this.playAnimation('idle');
                }
            }, 800);
        }
    }
    
    setPosition(x, y, z) {
        this.position.set(x, y, z);
        this.targetPosition.copy(this.position);
        if (this.mesh) {
            this.mesh.position.copy(this.position);
        }
    }
    
    move(dx, dy, dz) {
        this.targetPosition.add(new THREE.Vector3(dx, dy, dz));
        this.isMoving = true;
        
        // Play jump animation if available
        this.playAnimation('jump');
        
        // Face movement direction
        if (dx !== 0 || dz !== 0) {
            if (this.isGLBModel) {
                // GLB model needs 180° offset
                const angle = Math.atan2(dx, dz) + Math.PI;
                if (this.mesh) {
                    this.mesh.rotation.y = angle;
                }
            } else {
                // Primitive model faces correct direction by default
                const angle = Math.atan2(dx, dz);
                if (this.mesh) {
                    this.mesh.rotation.y = angle;
                }
            }
        }
    }
    
    dash(dx, dy, dz) {
        // Dash is like move but faster and longer distance
        this.targetPosition.add(new THREE.Vector3(dx * 2, dy, dz * 2));
        this.isMoving = true;
        this.moveSpeed = 12; // Faster dash speed
        
        this.playAnimation('run');
        
        // Face movement direction
        if (dx !== 0 || dz !== 0) {
            if (this.isGLBModel) {
                // GLB model needs 180° offset
                const angle = Math.atan2(dx, dz) + Math.PI;
                if (this.mesh) {
                    this.mesh.rotation.y = angle;
                }
            } else {
                // Primitive model faces correct direction by default
                const angle = Math.atan2(dx, dz);
                if (this.mesh) {
                    this.mesh.rotation.y = angle;
                }
            }
        }
    }
    
    playDeathAnimation() {
        this.playAnimation('death');
    }
    
    playVictoryAnimation() {
        this.playAnimation('victory');
    }
    
    tongueAttack() {
        console.log('🐸 Tongue attack!');
        if (this.mesh) {
            const originalScale = this.mesh.scale.clone();
            this.mesh.scale.multiplyScalar(1.1);
            setTimeout(() => {
                if (this.mesh) {
                    this.mesh.scale.copy(originalScale);
                }
            }, 200);
        }
    }
    
    croak() {
        console.log('🐸 Croak!');
        if (this.mesh) {
            const originalY = this.mesh.position.y;
            this.mesh.position.y += 0.2;
            setTimeout(() => {
                if (this.mesh) {
                    this.mesh.position.y = originalY;
                }
            }, 300);
        }
    }
    
    update(deltaTime) {
        // Update animation mixer
        if (this.mixer) {
            this.mixer.update(deltaTime);
        }
        
        // Handle movement animation
        if (this.isMoving && this.mesh) {
            const distance = this.position.distanceTo(this.targetPosition);
            
            if (distance > 0.1) {
                // Move towards target
                const direction = new THREE.Vector3()
                    .subVectors(this.targetPosition, this.position)
                    .normalize();
                
                const moveDistance = this.moveSpeed * deltaTime;
                this.position.add(direction.multiplyScalar(moveDistance));
                
                this.mesh.position.copy(this.position);
            } else {
                // Snap to target and stop moving
                this.position.copy(this.targetPosition);
                this.mesh.position.copy(this.position);
                this.isMoving = false;
                this.moveSpeed = 8; // Reset to normal speed
                
                // Return to idle animation if not already playing a special one
                if (this.currentAnimation === this.animations.run) {
                    this.playAnimation('idle');
                }
            }
        }
    }
    
    // Cleanup
    dispose() {
        if (this.mixer) {
            this.mixer.stopAllAction();
        }
        
        if (this.mesh) {
            this.scene.remove(this.mesh);
            
            // Dispose of geometries and materials
            this.mesh.traverse((child) => {
                if (child.geometry) child.geometry.dispose();
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(material => material.dispose());
                    } else {
                        child.material.dispose();
                    }
                }
            });
        }
        
        console.log('🐸 Player GLB disposed');
    }
}