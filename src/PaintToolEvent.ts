import {DocNode} from "./Documents/DocNodes/DocNode";
import {IUndoRedo} from "./Interface/IUndoRedo";
import {Vec2} from "./submodules/common-ts-utils/Math/Vector";

export interface PaintToolEvent<NodeType extends DocNode = DocNode, ExtraType = any> {
    pos: Vec2;
    // button: number;
    type: "down" | "up" | "move";
    pressure: number;
    node: NodeType;
    ui:{
        canvas: HTMLCanvasElement | OffscreenCanvas;
        ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
        scale: number;
    }
    history: IUndoRedo[];
    extra?: ExtraType;
}
