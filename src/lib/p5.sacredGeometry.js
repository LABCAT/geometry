//       ____                           _  ____                                  _              
//  _ __| ___|  ___  __ _  ___ _ __ ___  __| |/ ___| ___  ___  _ __ ___   ___| |_ _ __ _   _ 
// | '_ \___ \ / __|/ _` |/ __| '__/ _ \/ _` | |  _ / _ \/ _ \| '_ ` _ \ / _ \ __| '__| | | |
// | |_) |__) |\__ \ (_| | (__| | |  __/ (_| | |_| |  __/ (_) | | | | | |  __/ |_| |  | |_| |
// | .__/____(_)___/\__,_|\___|_|  \___|\__,_|\____|\___|\___/|_| |_| |_|\___|\__|_|   \__, |
// |_|                                                                                |___/ 
//
// Sacred Geometry extension for p5.js
// Extends p5.polar.js functionality
// REQUIRES: p5.polar.js to be loaded first

/**
 * Draws a single cell with background color and sacred geometry pattern
 * @param {p5.Color} bgColor - Background color object
 * @param {number} strokeHue - Stroke hue value
 * @param {number} x - X position of the cell
 * @param {number} y - Y position of the cell
 * @param {number} w - Width of the cell
 * @param {number} h - Height of the cell
 * @param {boolean} isTintedBG - Whether background is tinted (true) or shaded (false)
 * @param {number} patternIndex - Index of pattern from currentPatternSet
 */
p5.prototype.drawCell = function(bgColor, strokeHue, x, y, w, h, isTintedBG, patternIndex) {
  const maxSize = this.min(w, h) * 0.35;
  const size = maxSize * (this.animationProgress || 1);
  
  this.push();
  this.translate(x, y);
  
  this.fill(bgColor);
  this.noStroke();
  this.rect(0, 0, w, h);
  
  this.setCenter(w / 2, h / 2);
  this.stroke(strokeHue, 100, 100);
  this.fill(strokeHue, 100, 50);
  
  this.polarEllipse(0, size, size);
  
  this.pop();
};