import {PaintToolEvent} from "../PaintToolEvent";

export interface PaintTool {
    onDown(e: PaintToolEvent): void;
    onMove(e: PaintToolEvent): void;
    onUp(e: PaintToolEvent): void;
}