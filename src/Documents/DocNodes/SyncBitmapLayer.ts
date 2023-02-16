import {AbstractDocNode} from "./AbstractDocNode";

export class SyncBitmapLayer extends AbstractDocNode {
    protected _actionCanvas: OffscreenCanvas;
    protected _actionCtx: OffscreenCanvasRenderingContext2D;
    protected _actionStarted: boolean = false;
    protected _lastRenderedImage: ImageBitmap;

    constructor(width: number, height: number, name: string) {
        super(width, height, name);
        this._actionCanvas = new OffscreenCanvas(width, height);
        this._actionCtx = this._actionCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        this._lastRenderedImage = this.renderCanvas.transferToImageBitmap();
    }

    get actionCanvas(): OffscreenCanvas {
        if (this._actionStarted)
            return this._renderCanvas;
        throw new Error("Action not started");
    }

    get actionCtx(): OffscreenCanvasRenderingContext2D {
        if (this._actionStarted)
            return this._renderCtx;
        throw new Error("Action not started");
    }

    startAction(): void {
        this._actionStarted = true;
    }

    flushAction(): void {
        this._lastRenderedImage = this.renderCanvas.transferToImageBitmap();
    }

    endAction(): void {
        this._actionStarted = false;
        this.flushAction();
        this.forceRender();
    }

    forceRender(): void {
        const ctx = this._renderCtx;
        ctx.clearRect(0, 0, this.width, this.height);
        ctx.drawImage(this._lastRenderedImage, 0, 0);
        if (this._actionStarted) {
            ctx.drawImage(this._actionCanvas, 0, 0);
        }
    }
}
