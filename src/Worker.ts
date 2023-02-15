export function workerFunction() {
    console.log("Worker.ts");

    self.onmessage = (event: MessageEvent) => {
        console.log("Worker.ts got message: ");
        console.log(event.data);
        let canvas = event.data.canvas as OffscreenCanvas;
        let ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);
    }

    console.log("Worker.ts done.");
}
