const Two_Pi = 2.0 * Math.PI;
const LED_Side_Proportion = 0.9;
const Matrix_Border_Proportion = 1.0 - LED_Side_Proportion;
const Fixed_Display_Scale = 0.3;
const Phasor_Indicator_Radius_Proportion = 0.025;
const Phasor_Display_Scale = 0.3;
const Frames_Per_Second = 60;
const Leap_Lead_In_Seconds = 4.0;

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
    // TODO: "freq0" is a bad name. It's actually the number of seconds
    // the whole cycle takes, setting the centre frequency to 1Hz.
    constructor(slug, images, nRows, nCols, fullCellSize, freq0) {
        this.slug = slug;
        this.images = images;
        this.nRows = nRows;
        this.nCols = nCols;
        this.fullCellSize = fullCellSize;
        this.freq0 = freq0;

        this.durationFrames = this.freq0 * Frames_Per_Second;

        this.initPhiAndPhiIncr();

        this.initFixedDisplays();
        this.initPhasor();

        const canvas = $(`.${slug}.lights`)[0];
        this.matrix = new LEDMatrix(canvas, fullCellSize, nRows, nCols);

        this.initLeapOnClick();

        this.frameIdx = 0;
        this.tick = this.tick.bind(this);
        window.requestAnimationFrame(this.tick);
    }

    initFixedDisplays() {
        const cellSize = Fixed_Display_Scale * this.fullCellSize;

        this.images.forEach((image, i) => {
            const canvas = $(`.${this.slug}.lights-${i}`)[0];
            const matrix = new LEDMatrix(
                canvas,
                cellSize,
                this.nRows,
                this.nCols
            );
            matrix.refresh(image);
        });
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

        // Copy for leaping directly to particular frame.
        this.phis_0 = this.phis.slice();
    }

    leapToFrameFun(idx) {
        return () => {
            this.frameIdx = idx;
            this.phis = this.phis_0.map(
                (ph, i) => (ph + idx * this.phiIncrs[i]) % this.durationFrames
            );
        };
    }

    initLeapOnClick() {
        const leadInFrames = Leap_Lead_In_Seconds * Frames_Per_Second;

        const leapFrame0 = this.durationFrames - leadInFrames;
        $(`.${this.slug}.lights-0`).click(this.leapToFrameFun(leapFrame0));

        const leapFrame1 = (this.durationFrames / 2 - leadInFrames) | 0;
        $(`.${this.slug}.lights-1`).click(this.leapToFrameFun(leapFrame1));
    }

    initPhasor() {
        const canvas = $(`.${this.slug}.phasor`)[0];

        const cellSize = this.fullCellSize * Phasor_Display_Scale;
        const wd = cellSize * this.nCols;
        const ht = cellSize * this.nRows;

        canvas.width = wd;
        canvas.height = ht;

        $(canvas).css({ width: wd, height: ht, backgroundColor: "black" });

        const context = canvas.getContext("2d");
        context.translate(wd / 2, ht / 2);
        context.scale(1.0, -1.0);
        context.strokeStyle = "#fff";
        context.lineWidth = 2.0;

        const height = this.fullCellSize * this.nRows;
        const indicatorRadius = height * Phasor_Indicator_Radius_Proportion;

        this.phasorInfo = { canvas, context, indicatorRadius };
    }

    refreshPhasor() {
        const info = this.phasorInfo;
        let ctxt = info.context;
        const wd = info.canvas.width;
        const ht = info.canvas.height;
        const r = wd * 0.4;

        ctxt.fillStyle = "#aaa";
        ctxt.fillRect(-wd / 2, -ht / 2, wd, ht);

        ctxt.beginPath();
        ctxt.arc(0, 0, r, 0, Two_Pi);
        ctxt.stroke();

        const th = Two_Pi * this.frameIdx / this.durationFrames;
        const [dotX, dotY] = [r * Math.cos(th), r * Math.sin(th)];

        ctxt.fillStyle = "#fff";
        ctxt.beginPath();
        ctxt.arc(dotX, dotY, info.indicatorRadius, 0, Two_Pi);
        ctxt.fill();
    }

    tick() {
        this.frameIdx += 1;

        this.phiIncrs.forEach((dPhi, i) => {
            this.phis[i] += dPhi
            if (this.phis[i] >= this.durationFrames)
                this.phis[i] -= this.durationFrames;
        });

        const lit = this.phis.map(phi => (phi < this.durationFrames / 2));
        this.matrix.refresh(lit);

        this.refreshPhasor();

        window.requestAnimationFrame(this.tick);
    }
}

const drawCircularGraph = (div) => {
    const SZ = 240;
    const jCanvas = $("<canvas></canvas>");
    const canvas = jCanvas[0];
    canvas.width = canvas.height = SZ;
    jCanvas.css({ width: SZ, height: SZ, backgroundColor: "#b8b8b8" });
    $(div).append(jCanvas);

    const lightFreq = JSON.parse(div.dataset.freq);
    const lightPhase = JSON.parse(div.dataset.phase);

    const ctxt = canvas.getContext("2d");
    ctxt.translate(SZ / 2, SZ / 2);

    // Put up with left-handed coord system; we only label ½ so it doesn't
    // matter which way round we go.

    const rTrack = SZ * 0.425;

    // Radial indicator lines for t=0 and t=½:
    ctxt.lineWidth = 2.0;
    ctxt.strokeStyle = "white";
    ctxt.beginPath();
    ctxt.moveTo(-rTrack, 0);
    ctxt.lineTo(-(rTrack * 0.8), 0);
    ctxt.stroke();
    ctxt.beginPath();
    ctxt.moveTo(rTrack, 0);
    ctxt.lineTo(rTrack * 0.8, 0);
    ctxt.stroke();

    // Labels for indicator lines:
    const rText = 0.325 * SZ;
    ctxt.font = "20px sans-serif";
    ctxt.textBaseline = "middle";
    ctxt.fillStyle = "black";
    ctxt.textAlign = "right";
    ctxt.fillText("t = 0", rText, 0);
    ctxt.textAlign = "left";
    ctxt.fillText("t = ½", -rText, 0);

    // Black background circle for 'light off':
    ctxt.lineWidth = 6.0;
    ctxt.strokeStyle = "black";
    ctxt.beginPath();
    ctxt.arc(0, 0, rTrack, 0, Two_Pi);
    ctxt.stroke();

    // Orange segments where light is on:
    ctxt.strokeStyle = "#f82";
    for (let i = 0; i < lightFreq; ++i) {
        ctxt.beginPath();
        ctxt.arc(0, 0, rTrack,
                 (i + lightPhase - 0.25) * Two_Pi / lightFreq,
                 (i + lightPhase + 0.25) * Two_Pi / lightFreq);
        ctxt.stroke();
    }
};

let allDemos = [];
const launchDemo = (...args) => allDemos.push(new PhasingDemo(...args));

$(document).ready(() => {
});
