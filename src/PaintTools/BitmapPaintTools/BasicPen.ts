import {BitmapPaintTool} from "./BitmapPaintTool";
import {PaintToolEvent} from "../../PaintToolEvent";
import {BitmapLayerNode} from "../../Documents/DocNodes/BitmapLayerNode";
import {drawHermitCurve} from "../../submodules/common-ts-utils/Canvas/PaintCanvas";

export class BasicPen extends BitmapPaintTool {
    isDrawing: boolean = false;

    lastPoints: Vec2[] = [];

    onDown(e: PaintToolEvent<BitmapLayerNode>) {
        super.onDown(e);
        e.node.activeCtx.lineCap = "round";
        this.isDrawing = true;
    }

    onMove(e: PaintToolEvent<BitmapLayerNode>) {
        super.onMove(e);

        if (!this.isDrawing) return;

        const ctx = e.node.activeCtx;
        let len = this.lastPoints.length;
        if (this.lastPoints.length >= 4) {
            // let p1 = this.lastPoints[len - 4];
            // let p2 = this.lastPoints[len - 3];
            // let p3 = this.lastPoints[len - 2];
            // let p4 = this.lastPoints[len - 1];
            let p1 = this.lastPoints[0];
            let p2 = this.lastPoints[1];
            let p3 = this.lastPoints[2];
            let p4 = this.lastPoints[3];
            ctx.lineWidth = 20 * e.pressure;

            drawHermitCurve(ctx, p1, p2, p3, p4)
            this.lastPoints.shift();
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
