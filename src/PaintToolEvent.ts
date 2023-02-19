import {DocNode} from "./Documents/DocNodes/DocNode";

export interface PaintToolEvent<NodeType extends DocNode = DocNode, ExtraType = any> {
    pos: Vec2;
    button: number;
    type: "down" | "up" | "move";
    pressure: number;
    node: NodeType;
    extra?: ExtraType;
}
