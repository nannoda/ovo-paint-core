import {ShapePaintTool} from "./ShapePaintTool";
import {PaintToolEvent} from "../../PaintToolEvent";
import {ShapeLayerNode} from "../../Documents/DocNodes/Layers/ShapeLayerNode";
import {BezierCurveShape} from "./Shape/BezierCurveShape";

export class BezierCurveTool extends ShapePaintTool {
    selectedShape: BezierCurveShape | null = null;
    // downPos: Vec2 | null = null;
    // downRelaPos: Vec2 | null = null;
    selectedPointIndex: number | null = null;

    pointBuffer: Vec2[] = [];

    drawThisUI(e: PaintToolEvent<ShapeLayerNode>) {
        const ctx = e.ui.ctx;
        // ctx.clearRect(0, 0, e.ui.canvas.width, e.ui.canvas.height);
        for (const point of this.pointBuffer) {
            this.drawPoint(ctx, point);
        }
    }

    onDown(e: PaintToolEvent<ShapeLayerNode>) {
        super.onDown(e);
        let shape = e.node.getInRangeShapes(e.pos);
        if (shape !== null) {
            if (!(shape instanceof BezierCurveShape)) return;
            this.selectedShape = shape;
            this.selectedPointIndex = shape.getPointIndex(e.pos);
            shape.renderUI(e.ui.ctx)
        } else {
            if (e.button === 2) {
                console.log("right click")
                this.pointBuffer = [];
                e.ui.ctx.clearRect(0, 0, e.ui.canvas.width, e.ui.canvas.height);
                return;
            }
            if (this.pointBuffer.length < 3) {
                this.pointBuffer.push(e.pos);
                this.drawPoint(e.ui.ctx, e.pos);
            } else {
                this.pointBuffer.push(e.pos);
                // this.drawPoint(e.ui.ctx, e.pos);
                const p0 = this.pointBuffer[0];
                const p1 = this.pointBuffer[1];
                const p2 = this.pointBuffer[2];
                const p3 = this.pointBuffer[3];
                const shape = new BezierCurveShape(p0, p1, p2, p3);
                e.node.addShape(shape);
                shape.renderUI(e.ui.ctx)
                this.pointBuffer = [];
            }
        }
    }

    drawPoint(ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D, pos: Vec2) {
        ctx.strokeStyle = "red";
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, Math.PI * 2);
        ctx.stroke();
    }

    onMove(e: PaintToolEvent<ShapeLayerNode>) {
        super.onMove(e);

        this.drawThisUI(e)

        if (this.selectedShape === null) {
            let currentShape = e.node.getInRangeShapes(e.pos);
            if (currentShape !== null) {
                if (!(currentShape instanceof BezierCurveShape)) return;
                currentShape.renderUI(e.ui.ctx);
            }
            return;
        }
        if (this.selectedPointIndex === null) return;

        this.selectedShape.movePoint(e.pos, this.selectedPointIndex);
        this.selectedShape.renderUI(e.ui.ctx);
    }

    onUp(e: PaintToolEvent<ShapeLayerNode>) {
        super.onUp(e);
        this.selectedShape = null;
        this.selectedPointIndex = null;
    }
}
