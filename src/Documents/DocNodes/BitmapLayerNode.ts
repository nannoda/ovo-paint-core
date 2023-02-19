import {DocNode, DocNodeRenderEvent} from "./DocNode";
import {clearCanvas} from "../../submodules/common-ts-utils/Canvas/PaintCanvas";
import {WorkerCanvas2D} from "../../submodules/common-ts-utils/WebWorker/WorkerCanvas2D";

export class BitmapLayerNode extends DocNode {
    protected _cachedImage: CanvasImageSource;

    activeCtx: OffscreenCanvasRenderingContext2D;
    activeCanvas: OffscreenCanvas;

    // workerCanvas: WorkerCanvas2D;


    constructor(width: number, height: number, name: string = "New Pixel Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
        this.activeCanvas = new OffscreenCanvas(width, height);
        this.activeCtx = this.activeCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!this.activeCtx) {
            throw new Error("Failed to create OffscreenCanvasRenderingContext2D");
        }

        // this.workerCanvas = new WorkerCanvas2D(width, height);


        let tmpCanvas = new OffscreenCanvas(width, height);
        let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        tmpCtx.fillStyle = "transparent";
        tmpCtx.fillRect(0, 0, width, height);
        this._cachedImage = tmpCanvas.transferToImageBitmap();
    }

    get width(): number {
        // return this.workerCanvas.width;
        return this.activeCanvas.width;
    }

    get height(): number {
        // return this.workerCanvas.height;
        return this.activeCanvas.height;
    }


    flushActionCache(): void {
        let tmpCanvas = new OffscreenCanvas(this.width, this.height);
        let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        tmpCtx.drawImage(this._cachedImage, 0, 0);
        tmpCtx.drawImage(this.activeCanvas, 0, 0);
        // tmpCtx.drawImage(this.workerCanvas.content, 0, 0);

        clearCanvas(this.activeCanvas);
        // this.workerCanvas = new WorkerCanvas2D(this.width, this.height);
        this._cachedImage = tmpCanvas.transferToImageBitmap();
    }

    rawRender(e: DocNodeRenderEvent): void {
        e.ctx.globalCompositeOperation = this.blendMode;
        if (e.renderMode === "export") {
            this.currentTransparency = this.transparency.onExport;
        } else {
            e.ctx.globalAlpha = this.currentTransparency;
        }
        e.ctx.drawImage(this._cachedImage, this.offset[0], this.offset[1]);
        e.ctx.drawImage(this.activeCanvas, this.offset[0], this.offset[1]);
        // e.ctx.drawImage(this.workerCanvas.content, this.offset[0], this.offset[1]);
        // console.log("Rendering PixelLayerNode" + this.name);
    }

    render(e: DocNodeRenderEvent): void {
        switch (e.renderMode) {
            case "background":
                if (e.reachActiveLayer) {
                    return;
                }
                this.rawRender(e);
                break;
            case "foreground":
                if (!e.reachActiveLayer) {
                    return;
                }
                this.rawRender(e);
                break;
            case "activeNode":
                if (!e.reachActiveLayer) {
                    return;
                }
                this.rawRender(e);
                break;
            case "export":
                this.rawRender(e);
                break;
        }
    }
}
