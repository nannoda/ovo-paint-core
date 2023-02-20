import {DocNode, DocNodeRenderEvent} from "../DocNode";
import {IUndoRedo} from "../../../Interface/IUndoRedo";
import {clearCanvas} from "../../../submodules/common-ts-utils/Canvas/PaintCanvas";

export class BitmapLayerNode extends DocNode implements IUndoRedo {
    activeCtx: OffscreenCanvasRenderingContext2D;
    activeCanvas: OffscreenCanvas;
    private readonly _undoQueue: CanvasImageSource[] = [];
    private readonly _redoStack: CanvasImageSource[] = [];

    constructor(width: number, height: number, name: string = "New Pixel Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
        this.activeCanvas = new OffscreenCanvas(width, height);
        this.activeCtx = this.activeCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!this.activeCtx) {
            throw new Error("Failed to create OffscreenCanvasRenderingContext2D");
        }
    }

    get width(): number {
        return this.activeCanvas.width;
    }

    get height(): number {
        return this.activeCanvas.height;
    }

    get lastImage(): CanvasImageSource | null {
        if (this._undoQueue.length === 0) {
            return null;
        }
        return this._undoQueue[this._undoQueue.length - 1];
    }

    rawRender(e: DocNodeRenderEvent): void {
        let ctx = e.ctx;
        ctx.globalCompositeOperation = this.blendMode;
        if (e.renderMode === "export") {
            this.currentTransparency = this.transparency.onExport;
        } else {
            ctx.globalAlpha = this.currentTransparency;
        }
        if (this.lastImage){
            ctx.drawImage(this.lastImage, 0, 0);
        }
        ctx.drawImage(this.activeCanvas, this.offset[0], this.offset[1]);
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
        let tmpCanvas = new OffscreenCanvas(this.width, this.height);
        let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (this.lastImage){
            tmpCtx.drawImage(this.lastImage, 0, 0);
        }
        tmpCtx.drawImage(this.activeCanvas, 0, 0);
        this._undoQueue.push(tmpCanvas.transferToImageBitmap());
        clearCanvas(this.activeCanvas);
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
        this._undoQueue.shift();
    }

    undo(): void {
        if (this._undoQueue.length === 0) {
            console.log("Nothing to undo");
            return;
        }
        let undoImage = this._undoQueue.pop() as CanvasImageSource;
        this._redoStack.push(undoImage);
        clearCanvas(this.activeCanvas);
    }
}
