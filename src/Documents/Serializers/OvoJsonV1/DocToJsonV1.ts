import {OVODocument} from "../../OVODocument";
import {GroupNode} from "../../DocNodes/GroupNode";
import {BitmapLayerNode} from "../../DocNodes/Layers/BitmapLayerNode";
import {ShapeLayerNode} from "../../DocNodes/Layers/ShapeLayer/ShapeLayerNode";
import {BitmapNodeJson, DocumentJson, GroupNodeJson, Header, ShapeNodeJson} from "./JsonTypeV1";


async function canvasToBase64(canvas: HTMLCanvasElement | OffscreenCanvas): Promise<string> {
    const tmpCanvas = document.createElement("canvas");
    tmpCanvas.width = canvas.width;
    tmpCanvas.height = canvas.height;
    const ctx = tmpCanvas.getContext("2d");
    if (ctx === null) {
        throw new Error("Failed to get context");
    }
    ctx.drawImage(canvas, 0, 0);
    return tmpCanvas.toDataURL();
}

export async function docToJsonV1(doc: OVODocument) {


    let docDict = {
        name: doc.name,
        width: doc.width,
        height: doc.height,
        thumbnail: await canvasToBase64(doc.canvas),
        root: await groupNodeToJson(doc.rootNode)
    }

    const output: DocumentJson = {
        header: Header,
        doc: docDict
    }
    const jsonStr = JSON.stringify(output);
    console.log(jsonStr)

    return jsonStr;
}

async function bitmapNodeToJson(node: BitmapLayerNode): Promise<BitmapNodeJson> {
    return {
        type: "bitmap",
        name: node.name,
        offset: node.offset,
        width: node.width,
        height: node.height,
        bitmap: await canvasToBase64(node.canvas)
    }
}

async function shapeNodeToJson(node: ShapeLayerNode): Promise<ShapeNodeJson> {
    const shapes = [];
    for (let i = 0; i < node.shapes.length; i++) {
        const shape = node.shapes[i];
        shapes.push(shape.getState());
    }
    return {
        type: "shape",
        name: node.name,
        offset: node.offset,
        shapes: shapes
    }
}

async function groupNodeToJson(node: GroupNode): Promise<GroupNodeJson> {
    let children = [];
    for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child instanceof BitmapLayerNode) {
            children.push(await bitmapNodeToJson(child));
        } else if (child instanceof GroupNode) {
            children.push(await groupNodeToJson(child));
        } else if (child instanceof ShapeLayerNode) {
            children.push(await shapeNodeToJson(child));
        } else {
            throw new Error("Unknown node type");
        }
    }
    return {
        type: "group",
        name: node.name,
        children: children
    }
}
