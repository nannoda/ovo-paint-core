import {DocNode, DocNodeRenderEvent} from "../DocNode";
import {Shape} from "../../../PaintTools/ShapeTools/Shape/Shape";

export class ShapeLayerNode extends DocNode{

    constructor(name: string = "New Shape Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
    }
    private shapes: Shape[] = [];
    addShape(shape: Shape): void {
        this.shapes.push(shape);
    }

    removeShape(shape: Shape): void {
        const index = this.shapes.indexOf(shape);
        if (index !== -1) {
            this.shapes.splice(index, 1);
        }
    }
    render(e: DocNodeRenderEvent): void {
        // let bitmaps:CanvasImageSource = []
        for (const shape of this.shapes) {
            shape.renderTo(e.ctx);
        }
        // e.ctx.drawImage(tmpCanvas, this.offset[0], this.offset[1]);
    }

    getInRangeShapes(pos: Vec2): Shape | null {
        for (const shape of this.shapes) {
            if (shape.inRange(pos)) {
                return shape;
            }
        }
        return null;
    }
}
