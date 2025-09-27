import { Midi } from '@tonejs/midi';
import ColorGenerator from './lib/p5.colorGenerator.js';
import './lib/p5.polar.js';
import './lib/p5.sacredGeometry.js';
import OpenFormUI from './classes/OpenFormUI.js';

const audio = './audio/geometry-no-1.ogg';
const midi = './audio/geometry-no-1.mid';

const GeometryNo1 = (p) => {
    /** 
     * Core audio properties
     */
    p.song = null;
    p.PPQ = 3840 * 4;
    p.bpm = 200;
    p.audioLoaded = false;
    p.songHasFinished = false;
    p.showingStatic = true;

    /**
     * Array of available polar shape types
     * @type {string[]}
     */
    p.shapeTypes = [
        'polarEllipse',
        'polarTriangle',
        'polarSquare',
        'polarPentagon',
        'polarHexagon',
        'polarHeptagon',
        'polarOctagon'
    ];

    /**
     * Array of available pattern drawing functions
     * @type {string[]}
     */
    p.patternFunctions = [
        'drawVesicaPiscis',
        'drawSeedOfLife',
        'drawEggOfLife',
        'drawFlowerOfLife',
        'drawFruitOfLife',
        'drawMetatronsCube',
        'drawTreeOfLife'
    ];

    /** 
     * Animation and color properties
     */
    p.acts = {
        act1: [],
        act2: [],
        act3: [],
        act4: [],
    }
    p.currentSceneIndex = 0;
    p.sceneChangeInterval = null;
    p.animationStartTime = 0;
    p.animationDuration = 1000;
    p.animationProgress = 0; 

    /** 
     * Preload function - Loading audio and setting up MIDI
     * This runs first, before setup()
     */
    p.preload = () => {
        /** 
         * Log when preload starts
         */
        p.song = p.loadSound(audio, p.loadMidi);
        p.song.onended(() => {
            p.songHasFinished = true;
            if (p.canvas) {
                p.canvas.classList.add('p5Canvas--cursor-play');
                p.canvas.classList.remove('p5Canvas--cursor-pause');
            }
        });
    };

    /** 
     * Setup function - Initialize your canvas and any starting properties
     * This runs once after preload
     */
    p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.canvas.classList.add('p5Canvas--cursor-play');
        p.setStrokeWeight();
        p.background(0, 0, 0);
        p.colorMode(p.HSB);
        // Initialize open-form UI
        p.openFormUI = new OpenFormUI();
        // Initialize random color values
        p.initializeRandomValues();

        console.log(p.acts.act1[0]);
        
        document.getElementById("loader").classList.add("loading--complete");
        document.getElementById('play-icon').classList.add('fade-in');
        p.startSceneChanging();
    };

    /** 
     * Draw Act 1 Scene - Contains the main drawing logic for Act 1
     */
    p.drawAct1Scene = () => {
        const scene = p.acts.act1[p.currentSceneIndex];
        const cellWidth = p.width / 2;
        const cellHeight = p.height / 2;
        const cellAspectRatio = cellWidth / cellHeight;
        
        if (cellAspectRatio > 1.5 && window.innerHeight < 500) {
            // Single row layout when aspect ratio > 3:2
            const singleCellWidth = p.width / 4;
            const singleCellHeight = p.height;
            p.drawCell(
                p.color(scene.complementaryHue, 20, 100),
                p.color(scene.baseHue, 100, 100),
                0,
                0,
                singleCellWidth,
                singleCellHeight,
                scene.pattern1.pattern,
                scene.pattern1.shape
            );
            p.drawCell(
                p.color(scene.complementaryHue, 100, 20),
                p.color(scene.baseHue, 100, 100),
                singleCellWidth,
                0,
                singleCellWidth,
                singleCellHeight,
                scene.pattern2.pattern,
                scene.pattern2.shape
            );
            p.drawCell(
                p.color(scene.baseHue, 20, 100),
                p.color(scene.complementaryHue, 100, 100),
                singleCellWidth * 2,
                0,
                singleCellWidth,
                singleCellHeight,
                scene.pattern1.pattern,
                scene.pattern1.shape
            );
            p.drawCell(
                p.color(scene.baseHue, 100, 20),
                p.color(scene.complementaryHue, 100, 100),
                singleCellWidth * 3,
                0,
                singleCellWidth,
                singleCellHeight,
                scene.pattern2.pattern,
                scene.pattern2.shape
            );
        } else {
            // 2x2 grid layout
            p.drawCell(
                p.color(scene.complementaryHue, 100, 100),
                p.color(scene.baseHue, 100, 100),
                0,
                0,
                cellWidth,
                cellHeight,
                scene.pattern1.pattern,
                scene.pattern1.shape
            );
            p.drawCell(
                scene.pattern2.bgColour,
                p.color(scene.complementaryHue, 100, 100),
                cellWidth,
                0,
                cellWidth,
                cellHeight,
                scene.pattern2.pattern,
                scene.pattern2.shape
            );
            p.drawCell(
                scene.pattern2.bgColour,
                p.color(scene.baseHue, 100, 100),
                0,
                cellHeight,
                cellWidth,
                cellHeight,
                scene.pattern2.pattern,
                scene.pattern2.shape
            );
            p.drawCell(
                p.color(scene.baseHue, 100, 100),
                p.color(scene.complementaryHue, 100, 100),
                cellWidth,
                cellHeight,
                cellWidth,
                cellHeight,
                scene.pattern1.pattern,
                scene.pattern1.shape
            );          
        }
    };

    /** 
     * Main draw loop - This is where your animations happen
     * This runs continuously after setup
     */
    p.draw = () => {
        p.clear();
        
        // Update animation progress
        const elapsed = p.millis() - p.animationStartTime;
        p.animationProgress = p.min(elapsed / p.animationDuration, 1);
        
        p.drawAct1Scene();
    };

    /** 
     * MIDI loading and processing
     * Handles synchronization between audio and visuals
     */
    p.loadMidi = () => {
        Midi.fromUrl(midi).then((result) => {
            /** 
             * Log when MIDI is loaded
             */
            // console.log('MIDI loaded:', result);
            /** 
             * Example: Schedule different tracks for different visual elements
             */
            const track1 = result.tracks[16].notes; 
            const track2 = result.tracks[10].notes; 
            // p.scheduleCueSet(track1, 'executeTrack1');
            // p.scheduleCueSet(track2, 'executeTrack2');
            /** 
             * Update UI elements when loaded
             */
            document.getElementById("loader").classList.add("loading--complete");
            document.getElementById('play-icon').classList.add('fade-in');
            p.audioLoaded = true;
        });
    };

    /** 
     * Schedule MIDI cues to trigger animations
     * @param {Array} noteSet - Array of MIDI notes
     * @param {String} callbackName - Name of the callback function to execute
     * @param {Boolean} polyMode - Allow multiple notes at same time if true
     */
    p.scheduleCueSet = (noteSet, callbackName, polyMode = false) => {
        let lastTicks = -1,
            currentCue = 1;
        for (let i = 0; i < noteSet.length; i++) {
            const note = noteSet[i],
                { ticks, time } = note;
            if(ticks !== lastTicks || polyMode){
                note.currentCue = currentCue;
                p.song.addCue(time, p[callbackName], note);
                lastTicks = ticks;
                currentCue++;
            }
        }
    }

    /** 
     * Example track execution functions
     * Add your animation triggers here
     */
    p.executeTrack1 = (note) => {
        const { currentCue, durationTicks } = note;
        const duration = (durationTicks / p.PPQ) * (60 / p.bpm);
        
        // Cycle to next scene
        p.currentSceneIndex = (p.currentSceneIndex + 1) % p.acts.act1.length;
        
        // Reset animation for new scene
        p.animationStartTime = p.millis();
        p.animationProgress = 0;
    }

    p.executeTrack2 = (note) => {
        const { currentCue, durationTicks } = note;
        const duration = (durationTicks / p.PPQ) * (60 / p.bpm);
    }

    /**
     * Start the scene changing interval
     */
    p.startSceneChanging = () => {
        p.stopSceneChanging(); // Clear any existing interval
        p.sceneChangeInterval = setInterval(() => {
            p.executeTrack1({});
        }, 1500);
    };

    /**
     * Stop the scene changing interval
     */
    p.stopSceneChanging = () => {
        if (p.sceneChangeInterval) {
            clearInterval(p.sceneChangeInterval);
            p.sceneChangeInterval = null;
        }
    };

    /** 
     * Handle mouse/touch interaction
     * Controls play/pause and reset functionality
     */
    p.mousePressed = () => {
        if(p.audioLoaded){
            if (p.song.isPlaying()) {
                p.song.pause();
                if (p.canvas) {
                    p.canvas.classList.add('p5Canvas--cursor-play');
                    p.canvas.classList.remove('p5Canvas--cursor-pause');
                }
            } else {
                if (parseInt(p.song.currentTime()) >= parseInt(p.song.buffer.duration)) {
                    /** 
                     * Reset animation properties here
                     */
                }
                document.getElementById("play-icon").classList.remove("fade-in");
                p.song.play();
                p.showingStatic = false;
                p.loop(); // Restart the draw loop
                if (p.canvas) {
                    p.canvas.classList.add('p5Canvas--cursor-pause');
                    p.canvas.classList.remove('p5Canvas--cursor-play');
                }
            }
        }
    }

    /**
     * Resizes the canvas when the window is resized and redraws
     */
    p.windowResized = () => {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        p.setStrokeWeight();
        p.redraw();
    };

    /**
     * Utility: Check if the canvas is in portrait orientation
     * @returns {Boolean} true if portrait, false otherwise
     */
    p.isPortraitCanvas = () => {
        return p.height > p.width;
    };

    /**
     * Sets the global stroke weight based on the smaller dimension of the canvas
     */
    p.setStrokeWeight = () => {
        const weight = p.min(p.width, p.height) * 0.01;
        p.strokeWeight(weight);
    };

    p.initializeRandomValues = () => {
        p.randomSeed(window.$fx.lineage[0]);
        
        p.baseHue = p.random(360);
        p.complementaryHue = (p.baseHue + 180) % 360;
        p.baseSplitComp1 = (p.baseHue + 150) % 360;
        p.baseSplitComp2 = (p.baseHue + 210) % 360;
        p.compSplitComp1 = (p.complementaryHue + 150) % 360;
        p.compSplitComp2 = (p.complementaryHue + 210) % 360;
        
        p.colourSet = [p.baseHue, p.baseSplitComp1, p.baseSplitComp2, p.complementaryHue, p.compSplitComp1, p.compSplitComp2];
        
        const availableShapes = [...p.shapeTypes];
        p.selectedShapes = ['polarEllipse'];
        availableShapes.splice(availableShapes.indexOf('polarEllipse'), 1);
        p.selectedShapes.push(p.random(availableShapes));
        
        const availablePatterns = p.patternFunctions.filter(pattern => 
            pattern !== 'drawMetatronsCube' && pattern !== 'drawTreeOfLife'
        );
        p.selectedPatterns = ['drawVesicaPiscis'];
        availablePatterns.splice(availablePatterns.indexOf('drawVesicaPiscis'), 1);
        p.selectedPatterns.push(p.random(availablePatterns));

        for(let i = 0; i < 6; i++){
            p.acts.act1.push(
                {
                    baseHue: p.colourSet[i],
                    complementaryHue: (p.colourSet[i] + 180) % 360,
                    pattern1: {
                        pattern: p.random(p.selectedPatterns),
                        shape: p.random(p.selectedShapes),
                    },
                    pattern2: {
                        pattern: p.random(p.selectedPatterns),
                        shape: p.random(p.selectedShapes),
                        bgColour: p.random([p.color(0, 0, 0), p.color(0, 0, 100)]),
                    },
                }
            ) 
        }

        for(let i = 0; i < 6; i++){
            const selectedBaseHue = p.random(p.colourSet);
            p.acts.act1.push(
                {
                    baseHue: selectedBaseHue,
                    complementaryHue: (selectedBaseHue + 180) % 360,
                    pattern1: {
                        pattern: p.random(p.selectedPatterns),
                        shape: p.random(p.selectedShapes),
                    },
                    pattern2: {
                        pattern: p.random(p.selectedPatterns),
                        shape: p.random(p.selectedShapes),
                        bgColour: p.random([p.color(0, 0, 0), p.color(0, 0, 100)]),
                    },
                }
            ) 
        }

        p.acts.act1 = p.shuffle(p.acts.act1);
        console.log(p.acts.act1);
    };
};

export default GeometryNo1