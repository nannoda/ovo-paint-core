import {DocNode} from "./Documents/DocNodes/DocNode";
import {IUndoRedo} from "./Interface/IUndoRedo";
import {OVODocument} from "./Documents/OVODocument";
import {Vec2} from "./submodules/common-ts-utils/Math/Vector";

export interface PaintToolEvent<NodeType extends DocNode> {
    pos: Vec2;
    // button: number;
    // type: "down" | "up" | "move";
    pressure: number;
    // doc: OVODocument;
    // ui: {
    //     canvas: HTMLCanvasElement | OffscreenCanvas;
    //     ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
    //     scale: number;
    // },
    key: {
        shift: boolean;
        ctrl: boolean;
        alt: boolean;
    }
    history: IUndoRedo[];

    node: NodeType;
}
