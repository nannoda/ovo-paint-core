export interface PaintToolEvent<T = any> {
    pos: Vec2;
    button: number;
    type: "down" | "up" | "move";
    pressure: number;
    canvas: OffscreenCanvas;
    ctx: OffscreenCanvasRenderingContext2D;
    extra: T;
}