import {BitmapPaintTool} from "./BitmapPaintTool";
import {PaintToolEvent} from "../../PaintToolEvent";
import {BitmapLayerNode} from "../../Documents/DocNodes/Layers/BitmapLayerNode";
import {drawHermitCurve} from "../../submodules/common-ts-utils/Canvas/PaintCanvas";

export class BasicPen extends BitmapPaintTool {
    isDrawing: boolean = false;

    lastPoints: Vec2[] = [];

    maxSize: number = 20;
    minSize: number = 5;

    drawUI(e: PaintToolEvent<BitmapLayerNode>, size: number) {

        e.ui.ctx.clearRect(0, 0, e.ui.canvas.width, e.ui.canvas.height);
        e.ui.ctx.strokeStyle = "#969696";
        e.ui.ctx.lineWidth = 1;
        e.ui.ctx.beginPath();
        // Draw a circle at the current mouse position
        e.ui.ctx.arc(e.pos[0], e.pos[1], size, 0, 2 * Math.PI);
        e.ui.ctx.stroke();
    }

    onDown(e: PaintToolEvent<BitmapLayerNode>) {
        super.onDown(e);
        e.node.activeCtx.lineCap = "round";
        this.isDrawing = true;
    }

    onMove(e: PaintToolEvent<BitmapLayerNode>) {
        super.onMove(e);
        if (!this.isDrawing) {
            this.drawUI(e, this.maxSize / 2);
            return;
        }
        const ctx = e.node.activeCtx;
        if (this.lastPoints.length >= 4) {
            let p1 = this.lastPoints[0];
            let p2 = this.lastPoints[1];
            let p3 = this.lastPoints[2];
            let p4 = this.lastPoints[3];
            let size = (this.maxSize - this.minSize) * e.pressure + this.minSize;
            ctx.lineWidth = size;
            drawHermitCurve(ctx, p1, p2, p3, p4)
            this.lastPoints.shift();
            this.drawUI(e, size / 2)
        }

        this.lastPoints.push(e.pos);
    }

    onUp(e: PaintToolEvent<BitmapLayerNode>) {
        super.onUp(e);
        this.isDrawing = false;
        e.node.createSnapshot();
        this.lastPoints = [];
    }
}
