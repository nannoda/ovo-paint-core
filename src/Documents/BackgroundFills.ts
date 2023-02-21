export function getCheckBoard(
    fill1: string = "#ececec",
    fill2: string = "#ffffff",
    width = 20, height = 20, squareSize = 10) {
    let canvas = new OffscreenCanvas(width, height);
    let ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    if (!ctx) {
        throw new Error("Failed to create canvas context");
    }
    ctx.fillStyle = fill1;
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = fill2;
    for (let i = 0; i < width; i += squareSize) {
        for (let j = 0; j < height; j += squareSize) {
            console.log(i, j)
            if ((i / squareSize) % 2 == (j / squareSize) % 2) {
                ctx.fillRect(i, j, squareSize, squareSize);
            }
        }
    }
    return canvas.transferToImageBitmap();
}