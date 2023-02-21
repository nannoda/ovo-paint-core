import {DocNode} from "./Documents/DocNodes/DocNode";
import {IUndoRedo} from "./Interface/IUndoRedo";

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
    },
    key: {
        shift: boolean;
        ctrl: boolean;
        alt: boolean;
    }
    history: IUndoRedo[];
    extra?: ExtraType;
}
