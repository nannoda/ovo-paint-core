import {OVODocument} from "../../OVODocument";
import {BitmapNodeJson, DocumentJson, GroupNodeJson, ShapeNodeJson} from "./JsonTypeV1";
import {GroupNode} from "../../DocNodes/GroupNode";
import {BitmapLayerNode} from "../../DocNodes/Layers/BitmapLayerNode";
import {ShapeLayerNode} from "../../DocNodes/Layers/ShapeLayer/ShapeLayerNode";
import {TextShape} from "../../../../../PaintTools/ShapeTools/Shape/TextShape";
import {SimpleShape} from "../../../../../PaintTools/ShapeTools/Shape/SimpleShape";

export function typeCheck<T>(dict: unknown, type: T, message: string = ""): T {
    if (dict === undefined || dict === null) {
        throw new Error(`[${message}] dict is null`);
    }
    if (typeof dict === "string") {
        try {
            dict = JSON.parse(dict);
        } catch (e) {
            throw new Error(`[${message}] Invalid json string ${dict}`);
        }
    }
    if (dict === null) {
        throw new Error(`[${message}] Invalid json`);
    }
    if (typeof dict !== "object") {
        throw new Error(`[${message}] Invalid object`);
    }
    if (typeof type !== "object") {
        throw new Error(`[${message}] Invalid type: ${type}`);
    }
    for (const key in type) {
        if (!(key in dict)) {
            throw new Error(`[${message}] Invalid dict: missing ${key}`);
        }
        // @ts-ignore
        const value: any = dict[key] as any;
        const valueType = typeof value;
        // @ts-ignore
        const typeValue = typeof type[key];
        if (valueType !== typeValue) {
            throw new Error(`[${message}] Invalid dict: ${key} is not a ${typeValue}`);
        }
    }
    return dict as T;
}

export async function jsonToDocV1(dict: unknown): Promise<OVODocument | null> {
    if (dict === undefined || dict === null) {
        throw new Error("Invalid json");
    }
    const docJsonTemplate: DocumentJson = {
        header: {
            version: "",
            type: "",
        },
        doc: {
            name: "",
            width: 0,
            height: 0,
            thumbnail: "",
            root: {
                type: "group",
                name: "",
                children: []
            }
        }
    }
    try {
        const docDict = typeCheck<DocumentJson>(dict, docJsonTemplate, "jsonToDocV1");
        const doc = new OVODocument(docDict.doc.name, docDict.doc.width, docDict.doc.height);

        doc.rootNode = await jsonToGroupNode(docDict.doc.root);

        return doc;
    } catch (e) {
        console.error(e);
        return null;
    }
}

async function base64ToImage(base64: string): Promise<HTMLImageElement> {
    const img = new Image();
    img.src = base64;
    return new Promise((resolve, reject) => {
        img.onload = () => {
            resolve(img);
        }
        img.onerror = () => {
            reject();
        }
    });
}


async function jsonToBitmapNode(dict: unknown): Promise<BitmapLayerNode> {
    const bitmapNodeJsonTemplate: BitmapNodeJson = {
        type: "bitmap",
        name: "",
        offset: [0, 0],
        width: 0,
        height: 0,
        bitmap: ""
    }
    const bitmapNodeDict = typeCheck<BitmapNodeJson>(dict, bitmapNodeJsonTemplate, "jsonToBitmapNode");
    const bitmapNode = new BitmapLayerNode(bitmapNodeDict.width, bitmapNodeDict.height, bitmapNodeDict.name);
    bitmapNode.offset = bitmapNodeDict.offset;
    bitmapNode.ctx.drawImage(await base64ToImage(bitmapNodeDict.bitmap), 0, 0, bitmapNodeDict.width, bitmapNodeDict.height);
    return bitmapNode;
}

async function jsonToShapeNode(dict: unknown): Promise<ShapeLayerNode> {
    const shapeNodeJsonTemplate: ShapeNodeJson = {
        type: "shape",
        name: "",
        offset: [0, 0],
        shapes: []
    }
    const shapeNodeDict = typeCheck<ShapeNodeJson>(dict, shapeNodeJsonTemplate, "jsonToShapeNode");
    const shapeNode = new ShapeLayerNode(shapeNodeDict.name);
    shapeNode.offset = shapeNodeDict.offset;

    for (let i = 0; i < shapeNodeDict.shapes.length; i++) {
        const shapeJson = shapeNodeDict.shapes[i];
        if (shapeJson.type === "text") {
            const text = new TextShape("", [0, 0], "Arial", 12);
            text.applyState(shapeJson as any);
            shapeNode.addShape(text);
        }
        if (shapeJson.type === "simple") {
            const simple = new SimpleShape([0, 0], [0, 0]);
            simple.applyState(shapeJson as any);
            shapeNode.addShape(simple)
        }
    }
    return shapeNode;
}


async function jsonToGroupNode(dict: unknown): Promise<GroupNode> {
    const groupNodeJsonTemplate: GroupNodeJson = {
        type: "group",
        name: "",
        children: []
    }
    const groupNodeDict = typeCheck<GroupNodeJson>(dict, groupNodeJsonTemplate, "jsonToGroupNode");
    const groupNode = new GroupNode(groupNodeDict.name);
    for (let i = 0; i < groupNodeDict.children.length; i++) {
        const child = groupNodeDict.children[i];
        if (child.type === "group") {
            groupNode.addNode(await jsonToGroupNode(child));
        } else if (child.type === "bitmap") {
            groupNode.addNode(await jsonToBitmapNode(child));
        } else if (child.type === "shape") {
            groupNode.addNode(await jsonToShapeNode(child));
        } else {
            throw new Error("Unknown node type");
        }
    }
    return groupNode;
}
