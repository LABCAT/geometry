/**
 * Act3Scene - Handles rendering for Act 3 scenes
 * Draws 2x2 or 1x4 grid of cells with layered sacred geometry patterns
 */
export default class Act3Scene {
  /**
   * Create an Act3Scene renderer
   * @param {p5} p - The p5 instance
   * @param {AnimatedCell} animatedCell - The AnimatedCell instance for drawing
   */
  constructor(p, animatedCell) {
    this.p = p;
    this.animatedCell = animatedCell;
  }

  /**
   * Draw the current Act 3 scene
   * @param {Object} scene - The scene data containing hues and patterns
   */
  draw(scene) {
    const cellWidth = this.p.width / 2;
    const cellHeight = this.p.height / 2;
    const cellAspectRatio = cellWidth / cellHeight;

    if (cellAspectRatio > 1.5 && window.innerHeight < 500) {
      this.drawSingleRowLayout(scene);
    } else {
      this.drawGridLayout(scene);
    }
  }

  /**
   * Draw single row layout (1x4 grid) for wide aspect ratios
   * @param {Object} scene - The scene data
   */
  drawSingleRowLayout(scene) {
    const singleCellWidth = this.p.width / 4;
    const singleCellHeight = this.p.height;

    this.drawCell(
      this.p.color(scene.complementaryHue, 20, 100),
      scene.complementaryHue,
      0,
      0,
      singleCellWidth,
      singleCellHeight,
      true,
      0,
      scene
    );

    this.drawCell(
      this.p.color(scene.complementaryHue, 100, 20),
      scene.complementaryHue,
      singleCellWidth,
      0,
      singleCellWidth,
      singleCellHeight,
      false,
      1,
      scene
    );

    this.drawCell(
      this.p.color(scene.baseHue, 20, 100),
      scene.baseHue,
      singleCellWidth * 2,
      0,
      singleCellWidth,
      singleCellHeight,
      true,
      2,
      scene
    );

    this.drawCell(
      this.p.color(scene.baseHue, 100, 20),
      scene.baseHue,
      singleCellWidth * 3,
      0,
      singleCellWidth,
      singleCellHeight,
      false,
      3,
      scene
    );
  }

  /**
   * Draw 2x2 grid layout
   * @param {Object} scene - The scene data
   */
  drawGridLayout(scene) {
    const cellWidth = this.p.width / 2;
    const cellHeight = this.p.height / 2;

    this.drawCell(
      this.p.color(scene.complementaryHue, 100, 20),
      scene.complementaryHue,
      0,
      0,
      cellWidth,
      cellHeight,
      true,
      0,
      scene
    );

    this.drawCell(
      this.p.color(scene.baseHue, 20, 100),
      scene.baseHue,
      cellWidth,
      0,
      cellWidth,
      cellHeight,
      false,
      1,
      scene
    );

    this.drawCell(
      this.p.color(scene.complementaryHue, 20, 100),
      scene.complementaryHue,
      0,
      cellHeight,
      cellWidth,
      cellHeight,
      false,
      2,
      scene
    );

    this.drawCell(
      this.p.color(scene.baseHue, 100, 20),
      scene.baseHue,
      cellWidth,
      cellHeight,
      cellWidth,
      cellHeight,
      true,
      3,
      scene
    );
  }

  /**
   * Draws a single cell with background color and layered sacred geometry pattern
   * @param {p5.Color} bgColor - Background color object
   * @param {number} strokeHue - Stroke hue value
   * @param {number} x - X position of the cell
   * @param {number} y - Y position of the cell
   * @param {number} w - Width of the cell
   * @param {number} h - Height of the cell
   * @param {boolean} isTintedBG - Whether background is tinted (true) or shaded (false)
   * @param {number} patternIndex - Index of pattern from scene.patterns
   * @param {Object} scene - The scene data containing patterns and shapes
   */
  drawCell(bgColor, strokeHue, x, y, w, h, isTintedBG, patternIndex, scene) {
    const maxSize = this.p.min(w, h) * 0.35;
    const size = maxSize * this.p.animationProgress;

    this.p.push();
    this.p.translate(x, y);

    this.p.fill(bgColor);
    this.p.noStroke();
    this.p.rect(0, 0, w, h);

    this.p.noFill();
    this.p.setCenter(w / 2, h / 2);

    const pattern = scene.patterns[patternIndex];
    const shape = scene.shapes[patternIndex];

    if (isTintedBG) {
      this.p.stroke(strokeHue, 100, 100);
      this.p.fill(strokeHue, 40, 100);
      this.p[pattern](shape, size);

      this.p.stroke(strokeHue, 80, 100);
      this.p.fill(strokeHue, 100, 40);
      this.p[pattern](shape, size / 2);
    } else {
      this.p.stroke(strokeHue, 100, 100);
      this.p.fill(strokeHue, 100, 40);
      this.p[pattern](shape, size);

      this.p.stroke(strokeHue, 100, 80);
      this.p.fill(strokeHue, 40, 100);
      this.p[pattern](shape, size / 2);
    }

    this.p.pop();
  }
}

