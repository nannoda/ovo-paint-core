import {PaintTool} from "./PaintTool";
import {PaintToolEvent} from "../PaintToolEvent";

export class DotPen implements PaintTool{
    onMove(e: PaintToolEvent) {
        const ctx = e.ctx;
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(e.pos[0], e.pos[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    }
    onDown(e: PaintToolEvent): void {
    }

    onUp(e: PaintToolEvent): void {
    }
}
