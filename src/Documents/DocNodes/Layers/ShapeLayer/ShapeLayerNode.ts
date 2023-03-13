import {DocNode, DocNodeRenderEvent} from "../../DocNode";
import {Shape} from "./Shape";


export class ShapeLayerNode extends DocNode {
    constructor(name: string = "New Shape Layer", offset: Vec2 = [0, 0]) {
        super(name, offset);
    }

    private _shapes: Shape[] = [];

    get shapes(): Shape[] {
        return this._shapes;
    }

    addShape(shape: Shape): void {
        this._shapes.push(shape);
    }

    removeShape(shape: Shape): void {
        const index = this._shapes.indexOf(shape);
        if (index !== -1) {
            this._shapes.splice(index, 1);
        }
    }

    render(e: DocNodeRenderEvent): void {
        // let bitmaps:CanvasImageSource = []
        for (const shape of this._shapes) {
            shape.renderTo(e.ctx);
        }
        // e.ctx.drawImage(tmpCanvas, this.offset[0], this.offset[1]);
    }

    // set shapes(shapes: Shape[]) {
    //     this._shapes = shapes;
    // }

    // getInRangeShapes(pos: Vec2): Shape | null {
    //     for (const shape of this.shapes) {
    //         if (shape.inRange(pos)) {
    //             return shape;
    //         }
    //     }
    //     return null;
    // }

    // getShape(
    //     tool: IShapeTool
    // ): Shape | null {
    //     for (const shape of this.shapes) {
    //         if (tool.selectsShape(shape)) {
    //             return shape;
    //         }
    //     }
    //     return null;
    // }
}
