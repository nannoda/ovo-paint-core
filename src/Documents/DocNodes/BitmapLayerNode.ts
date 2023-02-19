import {DocNode, DocNodeRenderEvent} from "./DocNode";
import {IUndoRedo} from "../../Interface/IUndoRedo";
import {clearCanvas} from "../../submodules/common-ts-utils/Canvas/PaintCanvas";

export class BitmapLayerNode extends DocNode implements IUndoRedo {
    // protected _cachedImage: CanvasImageSource;

    activeCtx: OffscreenCanvasRenderingContext2D;
    activeCanvas: OffscreenCanvas;

    private readonly _actionBaseCanvas: OffscreenCanvas;
    private readonly _actionBaseCtx: OffscreenCanvasRenderingContext2D;

    private readonly _undoQueue: CanvasImageSource[] = [];
    private readonly _redoStack: CanvasImageSource[] = [];
    private _baseCanvas: OffscreenCanvas;
    private _baseCtx: OffscreenCanvasRenderingContext2D;

    constructor(width: number, height: number, name: string = "New Pixel Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
        this.activeCanvas = new OffscreenCanvas(width, height);
        this.activeCtx = this.activeCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!this.activeCtx) {
            throw new Error("Failed to create OffscreenCanvasRenderingContext2D");
        }
        // // this.workerCanvas = new WorkerCanvas2D(width, height);
        // let tmpCanvas = new OffscreenCanvas(width, height);
        // let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        // tmpCtx.fillStyle = "transparent";
        // tmpCtx.fillRect(0, 0, width, height);
        // // this.cachedLastImage = tmpCanvas.transferToImageBitmap();
        // this._undoQueue.push(tmpCanvas.transferToImageBitmap());

        this._actionBaseCanvas = new OffscreenCanvas(width, height);
        this._actionBaseCtx = this._actionBaseCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        // this._baseImage = tmpCanvas.transferToImageBitmap();
        this._baseCanvas = new OffscreenCanvas(width, height);
        this._baseCtx = this._baseCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    }

    get width(): number {
        return this.activeCanvas.width;
    }

    get height(): number {
        return this.activeCanvas.height;
    }

    get lastUndoImage(): CanvasImageSource | null {
        if (this._undoQueue.length === 0) {
            return null;
        }
        return this._undoQueue[this._undoQueue.length - 1];
    }

    rawRender(e: DocNodeRenderEvent): void {
        e.ctx.globalCompositeOperation = this.blendMode;
        if (e.renderMode === "export") {
            this.currentTransparency = this.transparency.onExport;
        } else {
            e.ctx.globalAlpha = this.currentTransparency;
        }
        let tmpCanvas = new OffscreenCanvas(this.width, this.height);
        let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        tmpCtx.drawImage(this._actionBaseCanvas, 0, 0);
        tmpCtx.drawImage(this.activeCanvas, this.offset[0], this.offset[1]);

        e.ctx.drawImage(tmpCanvas, 0, 0);
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

    createSnapshot(): void {
        let activeImage = this.activeCanvas.transferToImageBitmap();
        this._undoQueue.push(activeImage);

        this._actionBaseCtx.drawImage(activeImage, 0, 0);

        // this._undoQueue.push(this.activeCanvas.transferToImageBitmap());
        // clearCanvas(this.activeCanvas);
    }

    redo(): void {
        console.log("redo", this._redoStack.length)
        if (this._redoStack.length === 0) {
            console.log("Nothing to redo");
            return;
        }
        let redoImage = this._redoStack.pop() as CanvasImageSource;
        this.activeCtx.drawImage(redoImage, 0, 0);
        this.createSnapshot();
    }

    shiftSnapshot(): void {
        if (this._undoQueue.length === 0) {
            console.log("Nothing to undo");
            return;
        }
        let newBaseAction =  this._undoQueue.shift() as CanvasImageSource;
        this._baseCtx.drawImage(newBaseAction, 0, 0);
    }

    undo(): void {
        if (this._undoQueue.length === 0) {
            console.log("Nothing to undo");
            return;
        }
        let undoImage = this._undoQueue.pop() as CanvasImageSource;
        this._redoStack.push(undoImage);
        clearCanvas(this._actionBaseCanvas);
        this._actionBaseCtx.drawImage(this._baseCanvas, 0, 0);
        for (let i = 0; i < this._undoQueue.length; i++) {
            this._actionBaseCtx.drawImage(this._undoQueue[i], 0, 0);
        }
    }
}
