import {BitmapPaintTool} from "./BitmapPaintTool";
import {BitmapLayerNode} from "../../Documents/DocNodes/Layers/BitmapLayerNode";
import {PaintToolEvent} from "../../PaintToolEvent";

export class BitmapRectTool extends BitmapPaintTool{
    downPos: Vec2 | null = null;

    onDown(e: PaintToolEvent<BitmapLayerNode>) {
        super.onDown(e);
        this.downPos = e.pos;

    }
    drawRect(ctx: OffscreenCanvasRenderingContext2D, ePos: Vec2) {
        if (this.downPos === null) return;
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.strokeStyle = "#000000";
        ctx.strokeRect(this.downPos[0], this.downPos[1], ePos[0] - this.downPos[0], ePos[1] - this.downPos[1]);
    }
    onMove(e: PaintToolEvent<BitmapLayerNode>) {
        super.onMove(e);
        this.drawRect( e.node.activeCtx, e.pos);
    }

    onUp(e: PaintToolEvent<BitmapLayerNode>) {
        super.onUp(e);
        this.drawRect(e.node.activeCtx, e.pos)
        this.downPos = null;
        e.node.createSnapshot();
    }
}
