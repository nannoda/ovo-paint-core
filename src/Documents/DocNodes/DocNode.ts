import {Vec2} from "../../submodules/common-ts-utils/Math/Vector";

export type RenderMode = "export" | "edit"| "background" | "foreground" | "activeNode";

export interface DocNodeRenderEvent {
    activeNode: DocNode;
    reachActiveLayer: boolean;
    renderMode: RenderMode;
    canvas: HTMLCanvasElement | OffscreenCanvas;
    ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
}

export interface TransparencyOptions {
    onExport: number;
    onSelect: number;
    onUnselect: number;
}

export abstract class DocNode {
    public name: string;
    public offset: Vec2;
    public blendMode: GlobalCompositeOperation = "source-over";
    public transparency: TransparencyOptions = {
        onExport: 1,
        onSelect: 1,
        onUnselect: 1
    }
    public currentTransparency: number = 1;

    protected constructor(name: string, offset: Vec2 = [0, 0]) {
        this.name = name;
        this.offset = offset;
    }

    abstract render(e: DocNodeRenderEvent): void;

    onSelect(): void {
        this.currentTransparency = this.transparency.onSelect;
    }

    onUnselect(): void {
        this.currentTransparency = this.transparency.onUnselect;
    }
}
