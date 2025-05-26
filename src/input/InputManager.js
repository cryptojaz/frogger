export class InputManager {
    constructor(game) {
        this.game = game;
        this.eventListeners = {};
        
        // Input state tracking
        this.keys = {};
        this.mouse = { x: 0, y: 0, isDown: false };
        this.touch = { startX: 0, startY: 0, isActive: false };
        this.gamepad = { connected: false, index: -1 };
        
        // Control settings
        this.settings = {
            swipeThreshold: 50,        // Minimum swipe distance
            tapThreshold: 10,          // Maximum movement for tap
            doubleClickTime: 300,      // Double-click/tap timing
            gamepadDeadzone: 0.3       // Analog stick deadzone
        };
        
        // Movement state
        this.lastMoveTime = 0;
        this.moveInputCooldown = 150;  // Prevent rapid movement
        this.lastTouchTime = 0;
        
        this.init();
    }
    
    init() {
        this.setupKeyboardControls();
        this.setupMouseControls();
        this.setupTouchControls();
        this.setupGamepadControls();
        this.detectInputMethod();
        
        console.log('🎮 Multi-platform input manager initialized');
    }
    
    // KEYBOARD CONTROLS (Desktop)
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.game.isPlaying) return;
            
            this.keys[event.code] = true;
            const now = Date.now();
            
            // Prevent rapid movement
            if (now - this.lastMoveTime < this.moveInputCooldown) return;
            
            let moved = false;
            
            // Arrow Keys or WASD
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.emit('move', { direction: 'up', method: 'keyboard' });
                    moved = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.emit('move', { direction: 'down', method: 'keyboard' });
                    moved = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.emit('move', { direction: 'left', method: 'keyboard' });
                    moved = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.emit('move', { direction: 'right', method: 'keyboard' });
                    moved = true;
                    break;
                    
                // Spacebar: Dash forward (two spaces)
                case 'Space':
                    this.emit('dash', { direction: 'up', method: 'keyboard' });
                    moved = true;
                    event.preventDefault();
                    break;
                    
                // Special abilities
                case 'KeyE':
                    this.emit('tongueAttack', { method: 'keyboard' });
                    break;
                case 'KeyR':
                    this.emit('croak', { method: 'keyboard' });
                    break;
            }
            
            if (moved) {
                this.lastMoveTime = now;
            }
        });
        
        document.addEventListener('keyup', (event) => {
            this.keys[event.code] = false;
        });
    }
    
    // MOUSE CONTROLS (Desktop - Point and Click)
    setupMouseControls() {
        let clickStartTime = 0;
        let lastClickTime = 0;
        
        document.addEventListener('mousedown', (event) => {
            if (!this.game.isPlaying) return;
            
            this.mouse.isDown = true;
            clickStartTime = Date.now();
            this.updateMousePosition(event);
        });
        
        document.addEventListener('mouseup', (event) => {
            if (!this.game.isPlaying || !this.mouse.isDown) return;
            
            const clickDuration = Date.now() - clickStartTime;
            const now = Date.now();
            
            this.mouse.isDown = false;
            this.updateMousePosition(event);
            
            // Check for double-click dash
            const isDoubleClick = (now - lastClickTime) < this.settings.doubleClickTime;
            lastClickTime = now;
            
            if (event.button === 0) { // Left click
                if (event.shiftKey) {
                    // Shift + Click: Tongue Attack
                    this.emit('tongueAttack', { method: 'mouse', position: this.mouse });
                } else if (event.ctrlKey) {
                    // Ctrl + Click: Croak
                    this.emit('croak', { method: 'mouse' });
                } else {
                    // Regular click: Move to adjacent grid square
                    const direction = this.getClickDirection(event);
                    if (direction) {
                        if (isDoubleClick) {
                            this.emit('dash', { direction, method: 'mouse' });
                        } else {
                            this.emit('move', { direction, method: 'mouse' });
                        }
                    }
                }
            } else if (event.button === 2) { // Right click
                // Right-click: Dash
                const direction = this.getClickDirection(event);
                if (direction) {
                    this.emit('dash', { direction, method: 'mouse' });
                }
                event.preventDefault();
            }
        });
        
        // Disable context menu for right-click dash
        document.addEventListener('contextmenu', (event) => {
            if (this.game.isPlaying) {
                event.preventDefault();
            }
        });
    }
    
    // TOUCH CONTROLS (Mobile/Tablet)
    setupTouchControls() {
        let touchStartTime = 0;
        let lastTouchTime = 0;
        
        document.addEventListener('touchstart', (event) => {
            if (!this.game.isPlaying) return;
            
            const touch = event.touches[0];
            this.touch.startX = touch.clientX;
            this.touch.startY = touch.clientY;
            this.touch.isActive = true;
            touchStartTime = Date.now();
            
            event.preventDefault();
        }, { passive: false });
        
        document.addEventListener('touchend', (event) => {
            if (!this.game.isPlaying || !this.touch.isActive) return;
            
            const touch = event.changedTouches[0];
            const endX = touch.clientX;
            const endY = touch.clientY;
            const touchDuration = Date.now() - touchStartTime;
            const now = Date.now();
            
            // Calculate movement
            const deltaX = endX - this.touch.startX;
            const deltaY = endY - this.touch.startY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            
            this.touch.isActive = false;
            
            // Check for double-tap
            const isDoubleTap = (now - lastTouchTime) < this.settings.doubleClickTime;
            lastTouchTime = now;
            
            if (distance < this.settings.tapThreshold) {
                // Tap gestures
                if (event.touches.length === 2) {
                    // Two-finger tap: Croak
                    this.emit('croak', { method: 'touch' });
                } else if (isDoubleTap) {
                    // Double-tap: Dash forward
                    this.emit('dash', { direction: 'up', method: 'touch' });
                } else {
                    // Single tap: Tongue attack
                    this.emit('tongueAttack', { method: 'touch', position: { x: endX, y: endY } });
                }
            } else if (distance > this.settings.swipeThreshold) {
                // Swipe gestures
                const direction = this.getSwipeDirection(deltaX, deltaY);
                
                if (isDoubleTap || touchDuration < 100) {
                    // Fast swipe or double-tap swipe: Dash
                    this.emit('dash', { direction, method: 'touch' });
                } else {
                    // Regular swipe: Move
                    this.emit('move', { direction, method: 'touch' });
                }
            }
            
            event.preventDefault();
        }, { passive: false });
        
        // Handle pinch gesture for croak
        document.addEventListener('touchstart', (event) => {
            if (event.touches.length === 2) {
                // Pinch gesture detected
                setTimeout(() => {
                    if (event.touches.length === 2) {
                        this.emit('croak', { method: 'touch-pinch' });
                    }
                }, 100);
            }
        });
    }
    
    // GAMEPAD CONTROLS (Console-style)
    setupGamepadControls() {
        window.addEventListener('gamepadconnected', (event) => {
            this.gamepad.connected = true;
            this.gamepad.index = event.gamepad.index;
            console.log('🎮 Gamepad connected:', event.gamepad.id);
            this.startGamepadLoop();
        });
        
        window.addEventListener('gamepaddisconnected', (event) => {
            this.gamepad.connected = false;
            this.gamepad.index = -1;
            console.log('🎮 Gamepad disconnected');
        });
        
        // Check for already connected gamepads
        const gamepads = navigator.getGamepads();
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i]) {
                this.gamepad.connected = true;
                this.gamepad.index = i;
                this.startGamepadLoop();
                break;
            }
        }
    }
    
    startGamepadLoop() {
        if (!this.gamepad.connected) return;
        
        const checkGamepad = () => {
            if (!this.gamepad.connected || !this.game.isPlaying) return;
            
            const gamepad = navigator.getGamepads()[this.gamepad.index];
            if (!gamepad) return;
            
            const now = Date.now();
            
            // D-pad or Left Analog Stick
            const leftStickX = gamepad.axes[0];
            const leftStickY = gamepad.axes[1];
            
            // Check for movement (with deadzone)
            if (now - this.lastMoveTime > this.moveInputCooldown) {
                let direction = null;
                
                // D-pad buttons (digital)
                if (gamepad.buttons[12]?.pressed) direction = 'up';    // D-pad up
                else if (gamepad.buttons[13]?.pressed) direction = 'down';  // D-pad down
                else if (gamepad.buttons[14]?.pressed) direction = 'left';  // D-pad left
                else if (gamepad.buttons[15]?.pressed) direction = 'right'; // D-pad right
                
                // Analog stick (if no d-pad input)
                else if (Math.abs(leftStickX) > this.settings.gamepadDeadzone || 
                         Math.abs(leftStickY) > this.settings.gamepadDeadzone) {
                    
                    if (Math.abs(leftStickX) > Math.abs(leftStickY)) {
                        direction = leftStickX > 0 ? 'right' : 'left';
                    } else {
                        direction = leftStickY > 0 ? 'down' : 'up';
                    }
                }
                
                if (direction) {
                    this.emit('move', { direction, method: 'gamepad' });
                    this.lastMoveTime = now;
                }
            }
            
            // Action buttons
            if (gamepad.buttons[0]?.pressed) { // A/X: Dash
                if (now - this.lastMoveTime > this.moveInputCooldown) {
                    this.emit('dash', { direction: 'up', method: 'gamepad' });
                    this.lastMoveTime = now;
                }
            }
            
            if (gamepad.buttons[1]?.pressed) { // B/Square: Tongue Attack
                this.emit('tongueAttack', { method: 'gamepad' });
            }
            
            if (gamepad.buttons[3]?.pressed) { // Y/Triangle: Croak
                this.emit('croak', { method: 'gamepad' });
            }
            
            requestAnimationFrame(checkGamepad);
        };
        
        checkGamepad();
    }
    
    // HELPER METHODS
    updateMousePosition(event) {
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
    }
    
    getClickDirection(event) {
        // Convert mouse position to game world direction
        const canvas = this.game.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = x - centerX;
        const deltaY = y - centerY;
        
        // Determine closest cardinal direction
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY > 0 ? 'down' : 'up';
        }
    }
    
    getSwipeDirection(deltaX, deltaY) {
        // Determine swipe direction based on largest component
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            return deltaX > 0 ? 'right' : 'left';
        } else {
            return deltaY < 0 ? 'up' : 'down'; // Inverted Y for natural touch
        }
    }
    
    detectInputMethod() {
        // Auto-detect primary input method for UI adaptation
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
        }
        
        if (navigator.getGamepads().some(gp => gp)) {
            document.body.classList.add('gamepad-connected');
        }
    }
    
    // EVENT SYSTEM
    on(event, callback) {
        if (!this.eventListeners[event]) {
            this.eventListeners[event] = [];
        }
        this.eventListeners[event].push(callback);
    }
    
    emit(event, data) {
        if (this.eventListeners[event]) {
            this.eventListeners[event].forEach(callback => callback(data));
        }
    }
    
    // CLEANUP
    destroy() {
        // Remove all event listeners
        document.removeEventListener('keydown', this.keyDownHandler);
        document.removeEventListener('keyup', this.keyUpHandler);
        // ... other cleanup
        
        this.gamepad.connected = false;
        console.log('🎮 Input manager destroyed');
    }
}