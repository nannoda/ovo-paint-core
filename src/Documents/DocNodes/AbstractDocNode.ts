export abstract class AbstractDocNode {
    private _name: string;
    protected abstract _content: CanvasImageSource;

    isDirty: boolean = true;

    offset: Vec2;

    protected constructor(size: Vec2, name: string = "Untitled", offset: Vec2 = [0, 0]) {
        this._name = name;
        this.offset = offset;
    }

    get name(): string {
        return this._name;
    }

    set name(name: string) {
        this._name = name;
    }

    /**
     * Get the image source that represents the rendered content of this node.
     */
    get content(): CanvasImageSource {
        return this._content;
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

    abstract get width(): number ;

    abstract get height(): number ;
}
