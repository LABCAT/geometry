/**
 * Act1Scene - Handles rendering for Act 1 scenes
 * Draws 2x2 or 1x4 grid of cells with pattern1 and pattern2
 */
export default class Act1Scene {
  /**
   * Create an Act1Scene renderer
   * @param {p5} p - The p5 instance
   * @param {AnimatedCell} animatedCell - The AnimatedCell instance for drawing
   */
  constructor(p, animatedCell) {
    this.p = p;
    this.animatedCell = animatedCell;
  }

  /**
   * Draw the current Act 1 scene
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

    // Cell 1: pattern1
    this.animatedCell.draw(
      this.p.color(scene.complementaryHue, 100, 100),
      this.p.color(scene.baseHue, 100, 100),
      0,
      0,
      singleCellWidth,
      singleCellHeight,
      scene.pattern1.pattern,
      scene.pattern1.shape
    );

    // Cell 2: pattern2 (delayed)
    this.animatedCell.draw(
      scene.pattern2.bgColour,
      this.p.color(scene.complementaryHue, 100, 100),
      singleCellWidth,
      0,
      singleCellWidth,
      singleCellHeight,
      scene.pattern2.pattern,
      scene.pattern2.shape,
      0.4
    );

    // Cell 3: pattern1
    this.animatedCell.draw(
      this.p.color(scene.baseHue, 100, 100),
      this.p.color(scene.complementaryHue, 100, 100),
      singleCellWidth * 2,
      0,
      singleCellWidth,
      singleCellHeight,
      scene.pattern1.pattern,
      scene.pattern1.shape
    );

    // Cell 4: pattern2 (delayed)
    this.animatedCell.draw(
      scene.pattern2.bgColour,
      this.p.color(scene.baseHue, 100, 100),
      singleCellWidth * 3,
      0,
      singleCellWidth,
      singleCellHeight,
      scene.pattern2.pattern,
      scene.pattern2.shape,
      0.4
    );
  }

  /**
   * Draw 2x2 grid layout
   * @param {Object} scene - The scene data
   */
  drawGridLayout(scene) {
    const cellWidth = this.p.width / 2;
    const cellHeight = this.p.height / 2;

    // Top-left: pattern1
    this.animatedCell.draw(
      this.p.color(scene.complementaryHue, 100, 100),
      this.p.color(scene.baseHue, 100, 100),
      0,
      0,
      cellWidth,
      cellHeight,
      scene.pattern1.pattern,
      scene.pattern1.shape
    );

    // Top-right: pattern2 (delayed)
    this.animatedCell.draw(
      scene.pattern2.bgColour,
      this.p.color(scene.complementaryHue, 100, 100),
      cellWidth,
      0,
      cellWidth,
      cellHeight,
      scene.pattern2.pattern,
      scene.pattern2.shape,
      0.4
    );

    // Bottom-left: pattern2 (delayed)
    this.animatedCell.draw(
      scene.pattern2.bgColour,
      this.p.color(scene.baseHue, 100, 100),
      0,
      cellHeight,
      cellWidth,
      cellHeight,
      scene.pattern2.pattern,
      scene.pattern2.shape,
      0.4
    );

    // Bottom-right: pattern1
    this.animatedCell.draw(
      this.p.color(scene.baseHue, 100, 100),
      this.p.color(scene.complementaryHue, 100, 100),
      cellWidth,
      cellHeight,
      cellWidth,
      cellHeight,
      scene.pattern1.pattern,
      scene.pattern1.shape
    );
  }
}

