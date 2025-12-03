/**
 * Act2Scene - Handles rendering for Act 2 scenes
 * Draws 6 cells (3x2 landscape or 2x3 portrait) with split complementary colors
 */
export default class Act2Scene {
  /**
   * Create an Act2Scene renderer
   * @param {p5} p - The p5 instance
   * @param {AnimatedCell} animatedCell - The AnimatedCell instance for drawing
   */
  constructor(p, animatedCell) {
    this.p = p;
    this.animatedCell = animatedCell;
  }

  /**
   * Draw the current Act 2 scene with 6 cells
   * @param {Object} scene - The scene data containing split complementary colors
   */
  draw(scene) {
    if (this.p.isPortraitCanvas()) {
      this.drawPortraitLayout(scene);
    } else {
      this.drawLandscapeLayout(scene);
    }
  }

  /**
   * Draw landscape layout (3 columns x 2 rows)
   * @param {Object} scene - The scene data
   */
  drawLandscapeLayout(scene) {
    const cellWidth = this.p.width / 3;
    const cellHeight = this.p.height / 2;

    // Draw 6 cells in 3x2 grid
    for (let i = 0; i < 6; i++) {
      const col = i % 3;
      const row = Math.floor(i / 3);
      const cell = scene.cells[i];

      this.animatedCell.draw(
        this.p.color(cell.bgHue, 100, 100),
        this.p.color(cell.fgHue, 100, 100),
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
        cell.pattern,
        cell.shape
      );
    }
  }

  /**
   * Draw portrait layout (2 columns x 3 rows)
   * @param {Object} scene - The scene data
   */
  drawPortraitLayout(scene) {
    const cellWidth = this.p.width / 2;
    const cellHeight = this.p.height / 3;

    // Draw 6 cells in 2x3 grid
    // Remap indices so first column matches landscape's top row
    for (let i = 0; i < 6; i++) {
      const col = i % 2;
      const row = Math.floor(i / 2);
      // Map: col 0 gets cells 0,1,2 (landscape top row), col 1 gets cells 3,4,5 (landscape bottom row)
      const cellIndex = col * 3 + row;
      const cell = scene.cells[cellIndex];

      this.animatedCell.draw(
        this.p.color(cell.bgHue, 100, 100),
        this.p.color(cell.fgHue, 100, 100),
        col * cellWidth,
        row * cellHeight,
        cellWidth,
        cellHeight,
        cell.pattern,
        cell.shape
      );
    }
  }
}

