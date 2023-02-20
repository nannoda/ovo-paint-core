import {DocNode, DocNodeRenderEvent} from "../DocNode";

export class ReferenceLayerNode extends DocNode{
    t:number = 1;
    contentCanvas:  OffscreenCanvas;
    contentCtx: OffscreenCanvasRenderingContext2D;

    constructor(size:Vec2, name: string = "New Reference Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
        this.contentCanvas = new OffscreenCanvas(size[0], size[1]);
        this.contentCtx = this.contentCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    }
    onSelect() {
        super.onSelect();
        this.t = 1;
    }
    onUnselect() {
        super.onUnselect();
        this.t = 0.5;
    }

    render(e: DocNodeRenderEvent): void {
        // Set transparency
        e.ctx.globalAlpha = this.t;
        // Render content
        e.ctx.drawImage(this.contentCanvas, 0, 0);
        // Reset transparency

    }

}