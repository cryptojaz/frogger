// LevelConfig.js - Centralized configuration for all levels
// This makes adding new levels as simple as adding a new configuration object

export const LEVEL_CONFIGS = {
    1: {
        // Basic Info
        name: "City Streets",
        frogsNeeded: 4,
        
        // Environment
        environment: {
            type: "city",
            groundColor: 0x444444,
            fogColor: 0x87CEEB,
            backgroundColor: 0x87CEEB
        },
        
        // Assets
        assets: {
            headquarters: "gflhq.png",
            leftSoldier: "pepesoldier.png", 
            rightSoldier: "pepesoldier.png",
            frogImages: "gflmemer.png",
            goalSign: null // Level 1 uses gflhq.png on building
        },
        
        // Layout zones (Z positions)
        zones: {
            start: 16,
            roadStart: 1,
            roadEnd: 15,
            medianStart: -2,
            medianEnd: 1,
            waterStart: -14,
            waterEnd: -2,
            goalArea: -16
        },
        
        // Road vehicles configuration
        roadVehicles: {
            lanes: [13, 11, 9, 7, 5],
            directions: [1, -1, 1, -1, 1],
            speeds: [9.1, 3.5, 3.3, 5.0, 7.5],
            types: ["cybertruck", "taxi", "sportscar"],
            vehiclesPerLane: 7,
            spacing: 17
        },
        
        // Water obstacles configuration
        waterObstacles: {
            lanes: [-12, -10, -8, -6, -4],
            directions: [-1, 1, -1, 1, -1],
            speeds: [4.0, 2.1, 5.0, 2.9, 4.0],
            types: ["log"], // All logs for Level 1
            obstaclesPerLane: 6,
            spacing: 14,
            allRideable: true
        },
        
        // Audio
        music: "FeelingFroggish.mp3",
        
        // Special features
        features: {
            laneMarkings: true,
            cityBuildings: true,
            sidewalkTrees: true,
            bottomGrassTrees: true
        }
    },
    
    2: {
        // Basic Info
        name: "Jungle Swamp",
        frogsNeeded: 5,
        
        // Environment
        environment: {
            type: "jungle",
            groundColor: 0x2a3a1a,
            fogColor: 0x87CEEB,
            backgroundColor: 0x87CEEB
        },
        
        // Assets
        assets: {
            headquarters: "infowarssign.png",
            leftSoldier: "dogesoldier.png",
            rightSoldier: "alexjones.png", 
            additionalSoldiers: ["alexjones2.png"], // Extra decorations
            frogImages: "infowarspepe.png",
            goalSign: "infowarssign.png"
        },
        
        // Layout zones
        zones: {
            start: 16,
            roadStart: 4,
            roadEnd: 14,
            medianStart: -2,
            medianEnd: 4,
            waterStart: -14,
            waterEnd: -2,
            goalArea: -16
        },
        
        // Road vehicles (1.5x speed, different types)
        roadVehicles: {
            lanes: [13, 11, 9, 7, 5],
            directions: [1, -1, 1, -1, 1],
            speeds: [9.5, 4.0, 3.5, 5.0, 7.8], // 1.5x faster
            types: ["angryfrog", "protestor", "leftyvan"],
            vehiclesPerLane: 7,
            spacing: 17
        },
        
        // Water obstacles (all gators)
        waterObstacles: {
            lanes: [-12, -10, -8, -6, -4],
            directions: [1, -1, 1, -1, 1], // Reversed from Level 1
            speeds: [4.5, 2.2, 5.2, 2.9, 4.1], // 1.5x faster
            types: ["gator"], // All gators for Level 2
            obstaclesPerLane: 5,
            spacing: 14,
            allRideable: true
        },
        
        // Audio
        music: "Level2song.mp3",
        
        // Special features
        features: {
            laneMarkings: false, // Muddy tracks instead
            jungleTrees: true,
            cornerBushes: true,
            infowarsDecorations: true
        }
    },
    
// Updated Level 3 configuration for LevelConfig.js
// Replace the existing Level 3 config with this:
// FIXED Level 3 Configuration - Replace the Level 3 config in LevelConfig.js

3: {
    // Basic Info
    name: "Mars Colony",
    frogsNeeded: 6,
    
    // Environment
    environment: {
        type: "mars",
        groundColor: 0x8B4513, // Mars red-brown
        fogColor: 0xFFB6C1,   // Pinkish Mars atmosphere
        backgroundColor: 0x2F1B14 // Dark reddish-brown Mars sky
    },
    
    // Assets
    assets: {
        headquarters: "spacex_hq.png",
        leftSoldier: "optimus_robot.png",     
        rightSoldier: "optimus_robot.png",    
        frogImages: "astronautpepe.png", // Using same frog image as Level 1 for now
        goalSign: "spacex_hq.png"
    },
    
    // Layout zones
    zones: {
        start: 16,
        roadStart: 1,
        roadEnd: 15,
        medianStart: -2,
        medianEnd: 1,
        waterStart: -14,
        waterEnd: -2,
        goalArea: -16
    },
    
    // Road vehicles (2x speed, Mars themes)
    roadVehicles: {
        lanes: [13, 11, 9, 7, 5],
        directions: [1, -1, 1, -1, 1],
        speeds: [12.0, 7.0, 6.6, 10.0, 15.0], // 2x faster than Level 1
        types: ["alieninufo", "tardigrade", "marsprotestor"], // ✅ FIXED: Exact type names
        vehiclesPerLane: 6, // Fewer but faster
        spacing: 20 // More spacing due to speed
    },
    
    // "Water" obstacles (robovans as transport)
    waterObstacles: {
        lanes: [-12, -10, -8, -6, -4],
        directions: [-1, 1, -1, 1, -1],
        speeds: [6.0, 3.2, 7.5, 4.4, 6.0], // 2x faster than Level 1
        types: ["robovan"], // ✅ FIXED: Use robovan as rideable transport
        obstaclesPerLane: 4, // Fewer but faster
        spacing: 18,
        allRideable: true
    },
    
    // Audio
    music: "PatriotFrog.mp3", // Reuse existing, or add mars_theme.mp3 later
    
    // Special features
    features: {
        laneMarkings: true,
        marsRocks: true,
        spaceDomes: true,
        redPlanetSurface: true,
        marsAtmosphere: true
    }
},
// Updated LevelConfig.js with Level 4: Washington D.C.
// Add this Level 4 configuration to your existing LEVEL_CONFIGS object

// LEVEL 4 CONFIGURATION UPDATES for LevelConfig.js
// Replace the existing Level 4 config with this updated version

// REPLACE your Level 4 config in LevelConfig.js with this corrected version:

4: {
    // Basic Info
    name: "Washington D.C.",
    frogsNeeded: 7,
    
    // Environment
    environment: {
        type: "dc",
        groundColor: 0x2F4F2F, // Dark green for D.C. grass
        fogColor: 0x87CEEB,   // Sky blue
        backgroundColor: 0x4169E1 // Royal blue D.C. sky
    },
    
    // Assets
    assets: {
        headquarters: "whitehouse.png",        
        leftSoldier: "magasoldier.png",        
        rightSoldier: "magasoldier.png",       
        frogImages: "patrioticfrog.png",       
        goalSign: "whitehouse.png"             
    },
    
    // Layout zones
    zones: {
        start: 16,
        roadStart: 1,
        roadEnd: 15,
        medianStart: -2,
        medianEnd: 1,
        waterStart: -14,
        waterEnd: -2,
        goalArea: -16
    },
    
    // Road vehicles - NOW CORRECT
    roadVehicles: {
        lanes: [13, 11, 9, 7, 5],
        directions: [1, -1, 1, -1, 1],
        speeds: [15.0, 8.8, 8.3, 12.5, 18.8], 
        types: ["donkey", "leftist", "limo"], // ✅ CORRECT: These classes now exist
        vehiclesPerLane: 5, 
        spacing: 25 
    },
    
    // Water obstacles - NOW CORRECT
    waterObstacles: {
        lanes: [-12, -10, -8, -6, -4],
        directions: [-1, 1, -1, 1, -1],
        speeds: [7.5, 4.0, 9.4, 5.5, 7.5], 
        types: ["patriotbus"], // ✅ CORRECT: This class now exists
        obstaclesPerLane: 3, 
        spacing: 22,
        allRideable: true
    },
    
    // Audio
    music: "PatrioticFroggy.mp3", 
    
    // Special features
    features: {
        laneMarkings: true,
        dcBushes: true,           
        americanFlags: true,      
        dcMonuments: true,        
        potomacRiver: true,       
        governmentBuildings: true 
    }
},

5: {
    // Basic Info  
    name: "AGI Simulation",
    frogsNeeded: 8,
    
    // Environment
    environment: {
        type: "digital",
        groundColor: 0x000011,
        fogColor: 0x001122,
        backgroundColor: 0x000033
    },
    
    // Assets
    assets: {
        headquarters: "agi_core.png",
        leftSoldier: "ai_sentinel.png",
        rightSoldier: "neural_guardian.png",
        frogImages: "cyberfrog.png",
        goalSign: "agi_core.png"
    },
    
    // Layout zones
    zones: {
        start: 16,
        roadStart: 1,
        roadEnd: 15,
        medianStart: -2,
        medianEnd: 1,
        waterStart: -14,
        waterEnd: -2,
        goalArea: -16
    },
    
    // Road vehicles (3x speed - ultimate challenge!)
    roadVehicles: {
        lanes: [13, 11, 9, 7, 5],
        directions: [1, -1, 1, -1, 1],
        speeds: [18.0, 10.5, 9.9, 15.0, 22.5], // 3x faster than Level 1
        types: ["virus_program", "firewall_agent", "ai_drone"],
        vehiclesPerLane: 4,
        spacing: 30
    },
    
    // "Water" obstacles (data streams)
    waterObstacles: {
        lanes: [-12, -10, -8, -6, -4],
        directions: [-1, 1, -1, 1, -1],
        speeds: [9.0, 4.8, 11.3, 6.6, 9.0], // 3x faster than Level 1
        types: ["quantum_platform", "data_stream", "neural_link"],
        obstaclesPerLane: 3,
        spacing: 25,
        allRideable: true
    },
    
    // Audio
    music: "DigitalRealm.mp3",
    
    // Special features
    features: {
        laneMarkings: true,
        matrixRain: true,
        hologramGrids: true,
        quantumParticles: true,
        neonGlow: true,
        digitalStructures: true
    }
}
};



// Utility functions for level management
export class LevelConfigManager {
    static getConfig(levelNumber) {
        return LEVEL_CONFIGS[levelNumber] || null;
    }
    
    static getMaxLevel() {
        return Math.max(...Object.keys(LEVEL_CONFIGS).map(Number));
    }
    
    static getAllLevels() {
        return Object.keys(LEVEL_CONFIGS).map(Number).sort((a, b) => a - b);
    }
    
    static validateLevel(levelNumber) {
        const config = this.getConfig(levelNumber);
        if (!config) {
            throw new Error(`Level ${levelNumber} configuration not found`);
        }
        
        // Validate required fields
        const required = ['name', 'frogsNeeded', 'environment', 'assets', 'zones'];
        for (const field of required) {
            if (!config[field]) {
                throw new Error(`Level ${levelNumber} missing required field: ${field}`);
            }
        }
        
        return true;
    }
    
    static createPlaceholderAssets(levelNumber) {
        const config = this.getConfig(levelNumber);
        if (!config) return {};
        
        // Return asset mapping with fallbacks
        return {
            headquarters: config.assets.headquarters || 'placeholder_hq.png',
            leftSoldier: config.assets.leftSoldier || 'placeholder_soldier.png',
            rightSoldier: config.assets.rightSoldier || 'placeholder_soldier.png',
            frogImages: config.assets.frogImages || 'placeholder_frog.png'
        };
    }
}

// Export individual configs for easy access
export const LEVEL_1_CONFIG = LEVEL_CONFIGS[1];
export const LEVEL_2_CONFIG = LEVEL_CONFIGS[2]; 
export const LEVEL_3_CONFIG = LEVEL_CONFIGS[3];