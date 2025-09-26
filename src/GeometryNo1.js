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
     * Animation and color properties
     */
    p.animationStartTime = 0;
    p.animationDuration = 2000; // 2 seconds
    p.animationProgress = 0;
    p.lastRegenTime = 0;
    p.autoRegenInterval = 5000; // 5 seconds
    p.baseHue = 0;
    p.complementaryHue = 0;


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
        const seed = p.hashToSeed(hl.tx.hash + hl.tx.tokenId);
        // console.log(`Hash: ${hl.tx.hash}, TokenID: ${hl.tx.tokenId}, Seed: ${seed}`);
        p.randomSeed(seed);
        p.createCanvas(p.windowWidth, p.windowHeight);
        p.canvas.classList.add('p5Canvas--cursor-play');
        p.background(0, 0, 0);
        p.colorMode(p.HSB);
        
        // Initialize random color values
        p.initializeRandomValues();
        
        // Initialize open-form UI
        p.openFormUI = new OpenFormUI();
        
        document.getElementById("loader").classList.add("loading--complete");
        document.getElementById('play-icon').classList.add('fade-in');
    };

    /** 
     * Main draw loop - This is where your animations happen
     * This runs continuously after setup
     */
    p.draw = () => {
        p.clear();
        
        // Update animation progress
        const elapsed = p.millis() - p.animationStartTime;
        p.animationProgress = p.constrain(elapsed / p.animationDuration, 0, 1);
        
        // Auto-regenerate every 5 seconds
        if (p.millis() - p.lastRegenTime > p.autoRegenInterval) {
            p.initializeRandomValues();
        }
        
        const cellWidth = p.width / 2;
        const cellHeight = p.height / 2;
        const cellAspectRatio = cellWidth / cellHeight;
        
        if (cellAspectRatio > 1.5 && window.innerHeight < 500) {
            // Single row layout when aspect ratio > 3:2
            const singleCellWidth = p.width / 4;
            const singleCellHeight = p.height;
            p.drawCell(p.color(p.complementaryHue, 20, 100), p.complementaryHue, 0, 0, singleCellWidth, singleCellHeight, true, 0);
            p.drawCell(p.color(p.complementaryHue, 100, 20), p.complementaryHue, singleCellWidth, 0, singleCellWidth, singleCellHeight, false, 1);
            p.drawCell(p.color(p.baseHue, 20, 100), p.baseHue, singleCellWidth * 2, 0, singleCellWidth, singleCellHeight, true, 2);
            p.drawCell(p.color(p.baseHue, 100, 20), p.baseHue, singleCellWidth * 3, 0, singleCellWidth, singleCellHeight, false, 3);
        } else {
            // 2x2 grid layout
            p.drawCell(p.color(p.complementaryHue, 100, 20), p.complementaryHue, 0, 0, cellWidth, cellHeight, true, 0);
            p.drawCell(p.color(p.baseHue, 20, 100), p.baseHue, cellWidth, 0, cellWidth, cellHeight, false, 1);
            p.drawCell(p.color(p.complementaryHue, 20, 100), p.complementaryHue, 0, cellHeight, cellWidth, cellHeight, false, 2);
            p.drawCell(p.color(p.baseHue, 100, 20), p.baseHue, cellWidth, cellHeight, cellWidth, cellHeight, true, 3);
        }
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

    }

    p.executeTrack2 = (note) => {
        const { currentCue, durationTicks } = note;
        const duration = (durationTicks / p.PPQ) * (60 / p.bpm);
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
     * Convert a string to a deterministic seed for p5.js random functions
     * Used with highlight.xyz for consistent generative art
     * @param {String} str - The string to convert to a seed
     * @returns {Number} - A deterministic seed value
     */
    p.hashToSeed = (str) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = Math.imul(31, hash) + str.charCodeAt(i) | 0;
        }
        return Math.abs(hash);
    };
    
    /**
     * Utility: Check if the canvas is in portrait orientation
     * @returns {Boolean} true if portrait, false otherwise
     */
    p.isPortraitCanvas = () => {
        return p.height > p.width;
    };

    /**
     * Initialize random values for colors and animation
     */
    p.initializeRandomValues = () => {
        p.baseHue = p.random(360);
        p.complementaryHue = (p.baseHue + 180) % 360;
        p.animationStartTime = p.millis();
        p.lastRegenTime = p.millis();
        p.animationProgress = 0;
    };
};

export default GeometryNo1