import {ShapePaintTool} from "./ShapePaintTool";
import {PaintToolEvent} from "../../PaintToolEvent";
import {ShapeLayerNode} from "../../Documents/DocNodes/Layers/ShapeLayerNode";
import {TextShape} from "./Shape/TextShape";

export class TextTool extends ShapePaintTool {
    private downRelaPos: Vec2 | null = null;
    private selectedShape: TextShape | null = null;

    onDown(e: PaintToolEvent<ShapeLayerNode>) {
        super.onDown(e);
        const pos = e.pos;
        let shape = e.node.getInRangeShapes(pos);
        if (shape !== null) {
            if (!(shape instanceof TextShape)) return;
            if (e.button === 1) {
                e.node.removeShape(shape);
                return;
            }
            if (e.button === 0) {
                shape.renderUI(e.ui.ctx);
                this.selectedShape = shape;
                this.downRelaPos = [pos[0] - shape.position[0], pos[1] - shape.position[1]];
            }
            if (e.button === 2) {
                const text = prompt("Text", shape.content);
                if (text === null) return;
                const font = prompt("Font", shape.font);
                if (font === null) return;
                const size = prompt("Size", shape.fontSize.toString());
                if (size === null) return;
                shape.font = font;
                shape.fontSize = parseInt(size);

                shape.content = text;
            }
        } else {
            const text = prompt("Text", "Your Text Here");
            if (text === null) return;
            const font = prompt("Font", "Arial");
            if (font === null) return;
            const size = prompt("Size", "20");
            if (size === null) return;
            const textNode = new TextShape(text, pos, font, parseInt(size));
            e.node.addShape(textNode);
        }
    }


    onMove(e: PaintToolEvent<ShapeLayerNode>) {
        super.onMove(e);

        if (this.selectedShape !== null) {
            this.selectedShape.renderUI(e.ui.ctx);
            const pos = e.pos;
            this.selectedShape.position = [pos[0] - this.downRelaPos![0], pos[1] - this.downRelaPos![1]];
        }else{
            e.ui.ctx.clearRect(0, 0, e.ui.canvas.width, e.ui.canvas.height);
            const currShape = e.node.getInRangeShapes(e.pos);
            if (currShape !== null) {
                if (!(currShape instanceof TextShape)) return;
                currShape.renderUI(e.ui.ctx);
            }
        }
    }

    onUp(e: PaintToolEvent<ShapeLayerNode>) {
        super.onUp(e);
        e.ui.ctx.clearRect(0, 0, e.ui.canvas.width, e.ui.canvas.height);
        // this.downPos = null;
        this.selectedShape = null;
    }
}
