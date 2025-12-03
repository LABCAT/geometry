import p5 from "p5";
import "p5/lib/addons/p5.sound";
import { Midi } from '@tonejs/midi';
import '@/lib/p5.polar.js';
import '@/lib/p5.sacredGeometry.js';

import AnimatedCell from './classes/geometry-1/AnimatedCell.js';
import Act1Scene from './classes/geometry-1/Act1Scene.js';
import Act2Scene from './classes/geometry-1/Act2Scene.js';
import Act3Scene from './classes/geometry-1/Act3Scene.js';

const base = import.meta.env.BASE_URL || './';
const audio = `${base}audio/GeometryNo1.ogg`;
const midi = `${base}audio/GeometryNo1.mid`;

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
     * Available blend modes for the sketch
     * @type {string[]}
     */
    p.blendModes = [
        p.BLEND,
        p.EXCLUSION,
        p.SCREEN,
        p.DIFFERENCE,
        p.HARD_LIGHT
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
    p.actSequence = [1, 2, 3]; // Cycle through acts in this order
    p.currentActIndex = 0; // Index in actSequence
    p.currentAct = 1; // Current act number
    p.currentSceneIndex = 0;
    p.animationStartTime = 0;
    p.animationDuration = 1000;
    p.animationProgress = 0;
    p.animatedCell = null;
    p.act1Scene = null;
    p.act2Scene = null;
    p.act3Scene = null;

    /**
     * MIDI loading and processing
     * Handles synchronization between audio and visuals
     */
    p.loadMidi = () => {
        Midi.fromUrl(midi).then((result) => {
            console.log('MIDI loaded:', result);
            const track1 = result.tracks[15].notes; // touch orchestra
            p.scheduleCueSet(track1, 'executeTrack1');
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
     * Preload function - Loading audio and setting up MIDI
     * This runs first, before setup()
     */
    p.preload = () => {
        /**
         * Log when preload starts
         */
        p.song = p.loadSound(audio, p.loadMidi);
        console.log(p.song);

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
        const fxHash = p.generateFxHash();
        console.log(fxHash);

        // p.randomSeed(fxHash);

        // Initialize AnimatedCell instance
        p.animatedCell = new AnimatedCell(p);

        // Initialize Act scene renderers
        p.act1Scene = new Act1Scene(p, p.animatedCell);
        p.act2Scene = new Act2Scene(p, p.animatedCell);
        p.act3Scene = new Act3Scene(p, p.animatedCell);

        // Initialize random color values
        p.initializeRandomValues();
    };

    /**
     * Draw Act 1 Scene - Contains the main drawing logic for Act 1
     */
    p.drawAct1Scene = () => {
        const scene = p.acts.act1[p.currentSceneIndex];
        p.act1Scene.draw(scene);
    };

    /**
     * Draw Act 2 Scene - Contains the main drawing logic for Act 2
     */
    p.drawAct2Scene = () => {

        const scene = p.acts.act2[p.currentSceneIndex];
        p.act2Scene.draw(scene);
    };

    /**
     * Draw Act 3 Scene - Contains the main drawing logic for Act 3
     */
    p.drawAct3Scene = () => {
        const scene = p.acts.act3[p.currentSceneIndex];
        p.act3Scene.draw(scene);
    };

    /**
     * Main draw loop - This is where your animations happen
     * This runs continuously after setup
     */
    p.draw = () => {
        p.clear();

        if (p.showingStatic) {
            p.background(0, 0, 0);

        } else if(p.audioLoaded && p.song.isPlaying() || p.songHasFinished){
            // Update animation progress
            const elapsed = (p.song.currentTime() * 1000) - p.animationStartTime;
            p.animationProgress = p.min(elapsed / p.animationDuration, 1);

            // Draw current act
            if (p.currentAct === 1) {
                p.drawAct1Scene();
            } else if (p.currentAct === 2) {
                p.drawAct2Scene();
            } else if (p.currentAct === 3) {
                p.drawAct3Scene();
            }
        }
    };

    /**
     * Example track execution functions
     * Add your animation triggers here
     */
    p.executeTrack1 = (note) => {
        const { currentCue, durationTicks } = note;
        const duration = (durationTicks / p.PPQ) * (60 / p.bpm);
        p.animationDuration = duration * 1000;

        if(currentCue !== 1) {
            p.currentSceneIndex++;
        }

        const currentActScenes = p.acts[`act${p.currentAct}`];

        // Check if next scene would exceed current act's length
        if (p.currentSceneIndex >= currentActScenes.length) {
            p.currentActIndex = (p.currentActIndex + 1) % p.actSequence.length;
            p.currentAct = p.actSequence[p.currentActIndex];
            p.currentSceneIndex = 0;
            console.log(`Switching to Act ${p.currentAct}`);
        }

        p.animationStartTime = p.song.currentTime() * 1000;
        p.animationProgress = 0;

        p.blendMode(p.random(p.blendModes));
    }

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
     * Generate fxhash-style hash string for random seeding
     * Uses the same logic as fxhash library's internal hash generation
     * @returns {String} A 51-character hash string starting with "oo"
     */
    p.generateFxHash = () => {
        const chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
        return `oo${Array.from({length: 49}, () => chars[Math.random() * chars.length | 0]).join("")}`;
    };

    /**
     * Sets the global stroke weight based on the smaller dimension of the canvas
     */
    p.setStrokeWeight = () => {
        const weight = p.min(p.width, p.height) * 0.01;
        p.strokeWeight(weight);
    };

    p.initializeRandomValues = () => {
        p.baseHue = p.random(360);
        p.complementaryHue = (p.baseHue + 180) % 360;
        p.baseSplitComp1 = (p.baseHue + 150) % 360;
        p.baseSplitComp2 = (p.baseHue + 210) % 360;
        p.compSplitComp1 = (p.complementaryHue + 150) % 360;
        p.compSplitComp2 = (p.complementaryHue + 210) % 360;

        p.colourSet = [p.baseHue, p.baseSplitComp1, p.baseSplitComp2, p.complementaryHue, p.compSplitComp1, p.compSplitComp2];

        // Generate Act 1 scenes
        for(let i = 0; i < 16; i++){
            const selectedBaseHue = p.random(p.colourSet);
            p.acts.act1.push(
                {
                    baseHue: selectedBaseHue,
                    complementaryHue: (selectedBaseHue + 180) % 360,
                    pattern1: {
                        pattern: p.random(p.patternFunctions),
                        shape: p.random(p.shapeTypes),
                    },
                    pattern2: {
                        pattern: p.random(p.patternFunctions),
                        shape: p.random(p.shapeTypes),
                        bgColour: p.random([p.color(0, 0, 0), p.color(0, 0, 100)]),
                    },
                }
            )
        }

        p.acts.act1 = p.shuffle(p.acts.act1);

        // Generate Act 2 scenes
        for(let i = 0; i < 16; i++){
            // Alternate between baseHue and complementaryHue
            const useBaseHue = i % 2 === 0;
            const colorTriad = useBaseHue
                ? [p.baseHue, p.baseSplitComp1, p.baseSplitComp2]
                : [p.complementaryHue, p.compSplitComp1, p.compSplitComp2];

            // Create 6 cells with different bg/fg combinations
            const cells = [];
            const combinations = [
                [0, 1], // primaryHue bg, splitComp1 fg
                [1, 0], // splitComp1 bg, primaryHue fg
                [2, 1], // splitComp2 bg, splitComp1 fg
                [1, 2], // splitComp1 bg, splitComp2 fg
                [2, 0], // splitComp2 bg, primaryHue fg
                [0, 2], // primaryHue bg, splitComp2 fg
            ];

            for(let j = 0; j < 6; j++){
                const [bgIdx, fgIdx] = combinations[j];
                cells.push({
                    bgHue: colorTriad[bgIdx],
                    fgHue: colorTriad[fgIdx],
                    pattern: p.random(p.patternFunctions),
                    shape: p.random(p.shapeTypes)
                });
            }

            p.acts.act2.push({ cells });
        }

        // Generate Act 3 scenes
        for(let i = 0; i < 16; i++){
            const selectedBaseHue = p.random(p.colourSet);
            const complementaryHue = (selectedBaseHue + 180) % 360;

            // Generate unique pattern and shape sets for this scene
            const shuffledPatterns = [...p.patternFunctions].sort(() => Math.random() - 0.5);
            const shuffledShapes = [...p.shapeTypes].sort(() => Math.random() - 0.5);

            p.acts.act3.push({
                baseHue: selectedBaseHue,
                complementaryHue: complementaryHue,
                patterns: shuffledPatterns.slice(0, 4),
                shapes: shuffledShapes.slice(0, 4)
            });
        }

        p.acts.act3 = p.shuffle(p.acts.act3);

        console.log('Act 1:', p.acts.act1);
        console.log('Act 2:', p.acts.act2);
        console.log('Act 3:', p.acts.act3);
    };
};

new p5(GeometryNo1);
