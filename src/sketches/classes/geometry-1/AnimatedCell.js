/**
 * AnimatedCell - Class for drawing animated cells with sacred geometry patterns
 * Handles rendering of individual cells with background colors and pattern overlays
 */
export default class AnimatedCell {
  /**
   * Create an AnimatedCell
   * @param {p5} p - The p5 instance
   */
  constructor(p) {
    this.p = p;
  }

  /**
   * Draw a single cell with background color and sacred geometry pattern
   * @param {p5.Color} bgColor - Background color object
   * @param {p5.Color} patternColour - Pattern color object
   * @param {number} x - X position of the cell
   * @param {number} y - Y position of the cell
   * @param {number} w - Width of the cell
   * @param {number} h - Height of the cell
   * @param {string} pattern - Pattern function name
   * @param {string} shape - Shape type
   * @param {boolean} easeIn - Slow ease-in (pattern2); default is ease-out
   */
  draw(bgColor, patternColour, x, y, w, h, pattern, shape, easeIn = false) {
    const maxSize = this.p.min(w, h) * 0.35;
    const t = this.p.min(1, (this.p.animationProgress ?? 1) / 0.8);
    const progress = easeIn ? t * t : 1 - Math.pow(1 - t, 3);
    const size = maxSize * progress;
    
    this.p.push();
    this.p.translate(x, y);
    
    this.p.fill(bgColor);
    this.p.noStroke();
    this.p.rect(0, 0, w, h);
    
    this.p.setCenter(w / 2, h / 2);
    this.p.stroke(patternColour);
    this.p.noFill();
    
    this.p[pattern](shape, size);
    
    this.p.pop();
  }
}

