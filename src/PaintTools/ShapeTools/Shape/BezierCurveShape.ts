import {Shape} from "./Shape";

export class BezierCurveShape extends Shape {
    points: [Vec2, Vec2, Vec2, Vec2];

    radius: number = 10;

    constructor(p0: Vec2, c0: Vec2, c1: Vec2, p1: Vec2) {
        super();
        this.points = [p0, c0, c1, p1];
    }

    inDotRange(p0: Vec2, p1: Vec2): boolean {
        let distance = Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2));
        return distance <= this.radius;
    }

    inRange(pos: Vec2): boolean {
        for (const point of this.points) {
            if (this.inDotRange(point, pos)) {
                return true;
            }
        }
        return false;
    }

    renderTo(e: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D): void {
        let tmpCanvas = new OffscreenCanvas(e.canvas.width, e.canvas.height);
        let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        tmpCtx.beginPath();
        tmpCtx.moveTo(this.points[0][0], this.points[0][1]);
        tmpCtx.bezierCurveTo(this.points[1][0], this.points[1][1], this.points[2][0], this.points[2][1], this.points[3][0], this.points[3][1]);
        tmpCtx.stroke();

        e.drawImage(tmpCanvas, 0, 0);
    }

    drawDot(e: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D, pos: Vec2): void {
        e.strokeStyle = "#000000";
        e.fillStyle = "#ffffff";
        e.beginPath();
        e.arc(pos[0], pos[1], this.radius, 0, Math.PI * 2);
        e.fill();
        e.stroke();
    }

    getPointIndex(pos: Vec2): number {
        for (let i = 0; i < this.points.length; i++) {
            if (this.inDotRange(this.points[i], pos)) {
                return i;
            }
        }
        return -1;
    }

    movePoint(pos: Vec2, index: number): void {
        this.points[index] = pos;
    }

    renderUI(e: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D): void {
        e.clearRect(0, 0, e.canvas.width, e.canvas.height)
        e.strokeStyle = "black";
        // this.renderTo(e);

        e.moveTo(this.points[0][0], this.points[0][1]);
        e.lineTo(this.points[1][0], this.points[1][1]);
        e.stroke();
        e.moveTo(this.points[3][0], this.points[3][1]);
        e.lineTo(this.points[2][0], this.points[2][1]);
        e.stroke();
        for (const point of this.points) {
            this.drawDot(e, point);
        }
    }
}
