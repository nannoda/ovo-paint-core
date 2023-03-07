

export abstract class Shape {
    abstract renderTo(e: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D): void;

    // abstract fromJSON(json: any): void;
    // abstract toJSON(): string;
}
