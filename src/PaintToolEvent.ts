import {DocNode} from "./Documents/DocNodes/DocNode";
import {IUndoRedo} from "./Interface/IUndoRedo";

export interface PaintToolEvent<NodeType extends DocNode = DocNode, ExtraType = any> {
    pos: Vec2;
    button: number;
    type: "down" | "up" | "move";
    pressure: number;
    node: NodeType;

    history: IUndoRedo[];
    extra?: ExtraType;
}
