/**
 * OpenFormUI - Interactive UI component for simulating fxhash open-form evolution
 * Creates 4 buttons representing a lineage chain: Root -> Child -> Grandchild -> Great-grandchild
 */
export default class OpenFormUI {
  constructor() {
    this.lineage = [];
    this.buttons = [];
    this.container = null;
    this.onLineageChange = null; // Callback for when lineage updates
    
    this.init();
  }

  /**
   * Initialize the UI container and buttons
   */
  init() {
    // Create main container
    this.container = document.createElement('div');
    this.container.style.position = 'fixed';
    this.container.style.top = '20px';
    this.container.style.left = '20px';
    this.container.style.zIndex = '1000';
    this.container.style.display = 'flex';
    this.container.style.flexDirection = 'column';
    this.container.style.gap = '10px';
    
    // Create buttons for each generation
    const buttonLabels = ['1st Gen', '2nd Gen', '3rd Gen', '4th Gen'];
    
    buttonLabels.forEach((label, index) => {
      const button = this.createButton(label, index);
      this.buttons.push(button);
      this.container.appendChild(button);
    });
    
    // Add to DOM
    document.body.appendChild(this.container);
    
    // Check if there are existing hashes in URL, otherwise generate root
    this.initializeFromURL();
  }

  /**
   * Create a styled button with the project aesthetic
   */
  createButton(label, index) {
    const button = document.createElement('button');
    button.textContent = label;
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 20px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.style.borderRadius = '5px';
    button.style.fontFamily = 'monospace';
    button.style.minWidth = '160px';
    button.style.textAlign = 'left';
    
    // All buttons start visible but disabled (except root will be enabled later)
    
    // Add click handler
    button.addEventListener('click', () => this.handleButtonClick(index));
    
    return button;
  }

  /**
   * Handle button click - generate hash and reset subsequent buttons
   */
  handleButtonClick(index) {
    // Generate new hash for this level
    this.generateHash(index);
    
    // Reset all subsequent levels
    for (let i = index + 1; i < this.buttons.length; i++) {
      this.resetButton(i);
    }
    
    // Update button states
    this.updateButtonStates();
    
    // Trigger callback if set
    if (this.onLineageChange) {
      this.onLineageChange(this.lineage, index);
    }
  }

  /**
   * Generate new token at specified level
   * Simulates platform generating new hash for each evolution
   */
  generateHash(level) {
    console.log('Generating hash for level:', level);
    
    if (level === 0) {
      // ROOT: Reset everything, generate completely new lineage
      console.log('Resetting to new root');
      this.lineage = [];
      
      // Navigate to new URL with new fxhash (let library generate)
      this.navigateToNewToken([]);
    } else {
      // CHILD/GRANDCHILD/etc: Add new generation to existing lineage
      console.log('Adding generation to existing lineage');
      // Button clicks should evolve from current lineage
      // All buttons except 1 should add to the existing lineage
      const parentLineage = [...this.lineage];
      console.log(`Button ${level + 1} clicked, evolving from current lineage:`, parentLineage);
      
      // Navigate to new URL representing evolved token
      this.navigateToNewToken(parentLineage);
    }
  }

  /**
   * Navigate to new URL to simulate platform generating new token
   * Let fxhash library handle hash generation by removing fxhash param
   */
  navigateToNewToken(parentLineage) {
    // Generate new hash using fxhash library's internal function
    const newHash = this.generateFxHash();
    
    if (parentLineage.length === 0) {
      // Root - lineage contains just the new hash
      this.lineage = [newHash];
    } else {
      // Evolution - lineage contains parents + new hash
      this.lineage = [...parentLineage, newHash];
    }
    
    // Update URL: fxhash = current generation, lineage = parent generations
    const url = new URL(window.location);
    url.searchParams.set('fxhash', newHash); // Current generation
    
    // For URL: lineage parameter contains parent generations only
    if (this.lineage.length > 1) {
      const parents = this.lineage.slice(0, -1); // All except current
      url.hash = `lineage=${parents.join(',')}`;
    } else {
      url.hash = '';
    }
    
    window.history.pushState({}, '', url);
    
    // Manually update $fx state since pushState doesn't trigger reinit
    this.updateFxHashState();
    
    // Update button display with new hash
    this.updateButtonDisplay(this.lineage.length - 1, newHash);
    
    // Log updated $fx state
    console.log('After manual update, $fx state:', {
      hash: window.$fx.hash,
      lineage: window.$fx.lineage,
      depth: window.$fx.depth
    });
    
    console.log('Generated new hash:', newHash, 'Updated lineage:', this.lineage);
  }

  /**
   * Initialize UI from existing URL parameters or generate new lineage
   */
  initializeFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const hashFragment = window.location.hash;
    
    // Check if fxhash already exists
    const existingHash = urlParams.get('fxhash');
    
    if (existingHash && window.$fx) {
      // The lineage array contains ALL generations INCLUDING current
      // lineage[0] = 1st gen, lineage[1] = 2nd gen, etc.
      this.lineage = [...window.$fx.lineage];
      console.log('Initialized from existing lineage:', this.lineage);
      console.log('Current hash:', window.$fx.hash);
      console.log('Depth:', window.$fx.depth);
      
      // Display each generation on its corresponding button
      // Reverse the lineage array to match button order
      const reversedLineage = [...this.lineage].reverse();
      for (let i = 0; i < reversedLineage.length; i++) {
        this.updateButtonDisplay(i, reversedLineage[i]);
        console.log(`Button ${i + 1} (generation ${i + 1}): ${reversedLineage[i]}`);
      }
      
    } else {
      // No existing hash, generate new root
      this.generateHash(0);
    }
    
    // Update button states
    this.updateButtonStates();
  }

  /**
   * Generate new hash using fxhash library's internal logic
   * Extracted from the minified fxhash library v() function
   */
  generateFxHash() {
    // This is the exact same logic as the v() function in fxhash.min.js:
    // function v(){return`oo${Array.from({length:49},()=>p[Math.random()*p.length|0]).join("")}`}
    const p = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    return `oo${Array.from({length:49}, () => p[Math.random() * p.length | 0]).join("")}`;
  }

  /**
   * Update URL parameters to match fxhash format
   * @param {string} mainHash - The current token's hash
   * @param {array} lineage - Array of parent hashes
   */
  updateURLParams(mainHash, lineage) {
    const url = new URL(window.location);
    
    // Set main hash parameter
    url.searchParams.set('fxhash', mainHash);
    
    // Set lineage in hash fragment if there are parents
    if (lineage.length > 0) {
      url.hash = `lineage=${lineage.join(',')}`;
    } else {
      url.hash = '';
    }
    
    // Update URL without page refresh
    window.history.pushState({}, '', url);
    
    console.log('Updated URL:', url.toString());
  }

  /**
   * Update the fxhash library's internal state
   */
  updateFxHashState() {
    if (window.$fx) {
      window.$fx.lineage = [...this.lineage];
      window.$fx.depth = this.lineage.length - 1;
      window.$fx.hash = this.lineage[this.lineage.length - 1]; // Current generation (last in lineage)
      
      // Recreate PRNGs for each depth
      window.$fx._fxRandByDepth = this.lineage.map(hash => window.$fx.createFxRandom(hash));
      window.$fx.rand = window.$fx._fxRandByDepth[window.$fx.depth]; // Use current generation PRNG
      
      // Update randAt function
      window.$fx.randAt = (depth) => {
        if (depth < 0 || depth >= window.$fx.lineage.length) {
          throw new Error("Invalid depth");
        }
        return window.$fx._fxRandByDepth[depth]();
      };
    }
  }

  /**
   * Update button display with hash (truncated for display)
   */
  updateButtonDisplay(level, hash) {
    const labels = ['1st Gen', '2nd Gen', '3rd Gen', '4th Gen'];
    // Show generation label with short hash
    const shortHash = hash.substring(0, 8) + '...';
    this.buttons[level].textContent = `${labels[level]} ${shortHash}`;
    // Set full hash as title for hover tooltip
    this.buttons[level].title = hash;
  }

  /**
   * Reset a button to its initial state
   */
  resetButton(level) {
    const labels = ['1st Gen', '2nd Gen', '3rd Gen', '4th Gen'];
    this.buttons[level].textContent = labels[level];
    this.buttons[level].title = ''; // Clear tooltip
    this.disableButton(this.buttons[level]);
  }

  /**
   * Update button enabled/disabled states based on lineage
   */
  updateButtonStates() {
    for (let i = 0; i < this.buttons.length; i++) {
      if (i === 0) {
        // Root is always enabled
        this.enableButton(this.buttons[i]);
      } else if (i <= this.lineage.length) {
        // Enable if we can add to this level (parent exists)
        // If lineage has 1 item (root), then child (index 1) should be enabled
        this.enableButton(this.buttons[i]);
      } else {
        // Disable if parent doesn't exist
        this.disableButton(this.buttons[i]);
      }
    }
  }

  /**
   * Enable a button
   */
  enableButton(button) {
    button.disabled = false;
    button.style.backgroundColor = 'black';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.style.opacity = '1';
  }

  /**
   * Disable a button - make it clearly disabled but still visible
   */
  disableButton(button) {
    button.disabled = true;
    button.style.backgroundColor = '#1a1a1a';
    button.style.color = '#555';
    button.style.cursor = 'not-allowed';
    button.style.opacity = '0.6';
    button.style.border = '1px solid #333';
  }

  /**
   * Get current lineage
   */
  getLineage() {
    return [...this.lineage];
  }

  /**
   * Get current depth (number of parents)
   */
  getDepth() {
    return Math.max(0, this.lineage.length - 1);
  }

  /**
   * Set callback for lineage changes
   */
  setOnLineageChange(callback) {
    this.onLineageChange = callback;
  }

  /**
   * Cleanup - remove from DOM
   */
  destroy() {
    if (this.container && this.container.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}
