import {ShapeState} from "../../DocNodes/Layers/ShapeLayer/Shape";


type NodeType = "bitmap" | "group" | "shape";

export interface IHeader {
    version: string;
    type: string;
}

export const Header: IHeader = {
    version: "1.0",
    type: "OVOJSON",
}

export interface NodeJson {
    type: NodeType;
    name: string;
}

export interface BitmapNodeJson extends NodeJson {
    type: "bitmap";
    offset: [number, number];
    width: number;
    height: number;
    bitmap: string;
}

export interface GroupNodeJson extends NodeJson {
    type: "group";
    children: NodeJson[];
}

export interface ShapeNodeJson extends NodeJson {
    type: "shape";
    offset: [number, number];
    shapes: ShapeState[];
}

export interface DocumentJson {
    header: IHeader;
    doc: {
        name: string;
        width: number;
        height: number;
        thumbnail: string;
        root: GroupNodeJson;
    }
}
