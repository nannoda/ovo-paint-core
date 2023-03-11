export interface ShapeState {

}
export type CanvasCtx = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export abstract class Shape<T extends ShapeState = ShapeState> {
    abstract renderTo(e: CanvasCtx): void;

    abstract getState(): T;
    abstract applyState(state: T): void;

    // abstract fromJSON(json: any): void;
    // abstract toJSON(): string;
}
