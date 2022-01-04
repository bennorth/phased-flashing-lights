const LED_Side_Proportion = 0.9;
const Matrix_Border_Proportion = 1.0 - LED_Side_Proportion;
const Frames_Per_Second = 60;

// Thanks, https://stackoverflow.com/questions/2450954
const shuffleArray = (xs) => {
    for (let i = xs.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [xs[i], xs[j]] = [xs[j], xs[i]];
    }
};

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

    refresh(img) {
        this.context.clearRect(0, 0, this.width, this.height);
        let r = 0, c = 0;
        img.forEach((pixel) => {
            if (pixel) this.lightOn(r, c);
            c += 1;
            if (c === this.nCols) { c = 0; r += 1; }
        });
    }

    lightOn(r, c) {
        const ctxt = this.context;

        ctxt.save();
        ctxt.translate(c * this.cellSize, r * this.cellSize);
        ctxt.beginPath();
        ctxt.fillStyle = "#f82";
        ctxt.moveTo(0, 0);
        ctxt.lineTo(0, this.ledSide);
        ctxt.lineTo(this.ledSide, this.ledSide);
        ctxt.lineTo(this.ledSide, 0);
        ctxt.closePath();
        ctxt.fill();
        ctxt.restore();
    }
}

// Assumes that freq0 is even.
const phiIncrChoices = (freq0, n) => {
    let evenChoices = [freq0];
    for (let i = 1; i < (n + 1) / 2; ++i) {
        evenChoices.push(freq0 + 2 * i);
        evenChoices.push(freq0 - 2 * i);
    }

    let oddChoices = [];
    for (let i = 0; i < n / 2; ++i) {
        oddChoices.push(freq0 + 2 * i + 1);
        oddChoices.push(freq0 - 2 * i - 1);
    }

    return { even: evenChoices, odd: oddChoices };
};

class PhasingDemo {
    constructor(slug, images, nRows, nCols, fullCellSize, freq0) {
        this.slug = slug;
        this.images = images;
        this.nRows = nRows;
        this.nCols = nCols;
        this.fullCellSize = fullCellSize;
        this.freq0 = freq0;

        this.durationFrames = this.freq0 * Frames_Per_Second;

        this.initPhiAndPhiIncr();
    }

    initPhiAndPhiIncr() {
        const nPixels = this.nRows * this.nCols;

        let allIdxs = [...Array(nPixels).keys()];
        shuffleArray(allIdxs);

        // Start with arbitrary values; will be overwritten.
        this.phis = this.images[0].map(_ => 0);
        this.phiIncrs = this.images[0].map(_ => 0);

        let choices = phiIncrChoices(this.freq0, nPixels);

        for (let i of allIdxs) {
            const match = (this.images[0][i] === this.images[1][i]);
            this.phiIncrs[i] = (match ? choices.even : choices.odd).shift();

            const lit0 = (this.images[0][i] === 1);
            this.phis[i] = ((lit0 ? 1 : 3) * this.durationFrames / 4) | 0;
        }
    }
}
