import {BitmapPaintTool} from "./BitmapPaintTool";
import {PaintToolEvent} from "../../PaintToolEvent";
import {BitmapLayerNode} from "../../Documents/DocNodes/BitmapLayerNode";
import {drawPointDebug} from "../../submodules/common-ts-utils/Canvas/PaintCanvas";

export class DebugPen extends BitmapPaintTool {
    isDrawing: boolean = false;
    onDown(e: PaintToolEvent<BitmapLayerNode>) {
        this.isDrawing = true;
        super.onDown(e);
    }

    onMove(e: PaintToolEvent<BitmapLayerNode>) {
        super.onMove(e);
        if (!this.isDrawing) return;
        console.log(e)
        const ctx = e.node.activeCtx;
        drawPointDebug(ctx, e.pos);
    }

    onUp(e: PaintToolEvent<BitmapLayerNode>) {
        super.onUp(e);
        this.isDrawing = false;
        e.node.flushActionCache();
    }
}
