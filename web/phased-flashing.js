const LED_Side_Proportion = 0.9;
const Matrix_Border_Proportion = 1.0 - LED_Side_Proportion;

class LEDMatrix {
    constructor(canvas, cellSize, nRows, nCols) {
        this.canvas = canvas;
        this.cellSize = cellSize;
        this.nCols = nCols;
        this.ledSide = LED_Side_Proportion * cellSize;

        const border = Matrix_Border_Proportion * cellSize;

        this.width = canvas.width = cellSize * nCols + border;
        this.height = canvas.height = cellSize * nRows + border;

        $(canvas).css({
            width: canvas.width,
            height: canvas.height,
            backgroundColor: "black",
        });

        this.context = canvas.getContext("2d");
        this.context.translate(border, border);
    }
}
