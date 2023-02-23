import {DocNode, DocNodeRenderEvent} from "../DocNode";
import {IUndoRedo} from "../../../Interface/IUndoRedo";
import {clearCanvas} from "../../../submodules/common-ts-utils/Canvas/PaintCanvas";

export class BitmapLayerNode extends DocNode implements IUndoRedo {
    ctx: OffscreenCanvasRenderingContext2D;
    canvas: OffscreenCanvas;
    private readonly _undoQueue: CanvasImageSource[] = [];
    private readonly _redoStack: CanvasImageSource[] = [];

    constructor(width: number, height: number, name: string = "New Bitmap Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
        this.canvas = new OffscreenCanvas(width, height);
        this.ctx = this.canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!this.ctx) {
            throw new Error("Failed to create OffscreenCanvasRenderingContext2D for BitmapLayerNode");
        }
    }

    get width(): number {
        return this.canvas.width;
    }

    get height(): number {
        return this.canvas.height;
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
        ctx.drawImage(this.canvas, this.offset[0], this.offset[1]);
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
            case "edit":
                this.rawRender(e);
        }
    }

    createSnapshot(): void {
        let image = this.canvas.transferToImageBitmap();
        this._undoQueue.push(image);
        this.ctx.drawImage(image, 0, 0);
    }

    redo(): void {
        console.log("redo", this._redoStack.length)
        if (this._redoStack.length === 0) {
            console.log("Nothing to redo");
            return;
        }
        clearCanvas(this.canvas);
        let redoImage = this._redoStack.pop() as CanvasImageSource;
        this.ctx.drawImage(redoImage, 0, 0);
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
        clearCanvas(this.canvas);
        this.ctx.drawImage(undoImage, 0, 0);
        this._redoStack.push(undoImage);
    }
}
