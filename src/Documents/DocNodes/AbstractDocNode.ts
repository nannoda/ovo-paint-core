export abstract class AbstractDocNode {
    private _name: string;
    protected readonly _renderCanvas: OffscreenCanvas;

    protected _renderCtx: OffscreenCanvasRenderingContext2D;

    isDirty: boolean = true;

    offset: Vec2;

    protected constructor(width: number, height: number, name: string) {
        this._name = name;
        this._renderCanvas = new OffscreenCanvas(width, height);
        this._renderCtx = this._renderCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        this.offset = [0, 0];
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    /**
     * Get the canvas that represents the rendered content of this node.
     * Usually this canvas shouldn't be modified directly.
     */
    get renderCanvas(): OffscreenCanvas {
        return this._renderCanvas;
    }

    /**
     * Render the content of this node to the render canvas.
     */
    render(): void {
        if (!this.isDirty) {
            return;
        }
        this.forceRender();
    }

    /**
     * Force the node to render its content to the render canvas.
     * Doesn't check if the node is dirty.
     */
    forceRender(): void {

    }

    get width(): number {
        return this._renderCanvas.width;
    }

    get height(): number {
        return this._renderCanvas.height;
    }
}
