export type RenderMode = "export" | "background" | "foreground";

export interface RenderEvent {
    activeLayer: DocNode;
    reachActiveLayer: boolean;
    renderMode: RenderMode;
    canvas: HTMLCanvasElement | OffscreenCanvas;
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
}

export abstract class DocNode {

    public name: string;

    public offset: Vec2;

    protected constructor(name: string, offset: Vec2 = [0, 0]) {
        this.name = name;
        this.offset = offset;
    }

    abstract render(e: RenderEvent): void;
}