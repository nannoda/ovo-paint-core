import {OVODocument} from "../../OVODocument";
import {GroupNodeJson, Header} from "./JsonTypeV1";
import {GroupNode} from "../../DocNodes/GroupNode";

function typeCheck<T>(dict: unknown, type: T): T {
    if (dict === undefined || dict === null) {
        throw new Error("Invalid json");
    }
    if (typeof dict === "string") {
        try {
            dict = JSON.parse(dict);
        } catch (e) {
            throw new Error(dict + " is not a valid json");
        }
    }
    if (dict === null) {
        throw new Error("Dict is null");
    }
    if (typeof dict !== "object") {
        throw new Error("Invalid object");
    }
    if (typeof type !== "object") {
        throw new Error("Invalid type");
    }
    for (const key in type) {
        if (!(key in dict)) {
            throw new Error("Invalid dict: missing " + key);
        }
        // @ts-ignore
        const value: any = dict[key] as any;
        const valueType = typeof value;
        // @ts-ignore
        const typeValue = typeof type[key];
        if (valueType !== typeValue) {
            throw new Error("Invalid dict: " + key + " is not " + typeValue);
        }
    }
    return dict as T;
}

async function jsonToDocV1(dict: unknown): Promise<OVODocument | null> {
    if (dict === undefined || dict === null) {
        throw new Error("Invalid json");
    }
    if (typeof dict === "string") {
        try {
            dict = JSON.parse(dict);
        } catch (e) {
            throw new Error(dict + " is not a valid json");
        }
    }
    if (dict === null) {
        throw new Error("Dict is null");
    }
    if (typeof dict !== "object") {
        throw new Error("Invalid object");
    }
    if (!("header" in dict)) {
        throw new Error("Invalid dict: missing header");
    }
    const header = dict["header"] as unknown;
    if (typeof header !== "object" || header === null) {
        throw new Error("Invalid header");
    }
    if (!("version" in header)) {
        throw new Error("Invalid header");
    }
    const version = header["version"] as unknown;
    if (typeof version !== "string") {
        throw new Error("Version is not a string");
    }
    if (version !== Header.version) {
        throw new Error("Invalid version");
    }
    if (!("type" in header)) {
        throw new Error("Invalid header: missing type");
    }
    const type = header["type"] as unknown;
    if (typeof type !== "string") {
        throw new Error("Type is not a string");
    }
    if (type !== Header.type) {
        throw new Error("Invalid type");
    }
    if (!("thumbnail" in header)) {
        throw new Error("Invalid header: missing thumbnail");
    }
    const thumbnail = header["thumbnail"] as unknown;
    if (typeof thumbnail !== "string") {
        throw new Error("Thumbnail is not a string");
    }

    if (!("doc" in dict)) {
        throw new Error("Invalid dict: missing doc");
    }
    const docDict = dict["doc"] as unknown;
    if (typeof docDict !== "object" || docDict === null) {
        throw new Error("Invalid doc");
    }
    if (!("name" in docDict)) {
        throw new Error("Invalid doc: missing name");
    }
    const name = docDict["name"] as unknown;
    if (typeof name !== "string") {
        throw new Error("Invalid name");
    }
    if (!("width" in docDict)) {
        throw new Error("Invalid doc: missing width");
    }
    const width = docDict["width"] as unknown;
    if (typeof width !== "number") {
        throw new Error("Invalid width");
    }
    if (!("height" in docDict)) {
        throw new Error("Invalid doc: missing height");

    }
    const height = docDict["height"] as unknown;
    if (typeof height !== "number") {
        throw new Error("Invalid height");
    }
    if (!("root" in docDict)) {
        throw new Error("Invalid doc: missing root");
    }
    const root = docDict["root"] as unknown;
    if (typeof root !== "object" || root === null) {
        throw new Error("Invalid root");
    }

    const doc = new OVODocument(name, width, height);
    doc.rootNode = await jsonToGroupNode(root);
    return doc;
}

async function jsonToGroupNode(dict: unknown): GroupNode {
    if (dict === undefined || dict === null) {
        throw new Error("[jsonToGroupNode] Invalid json");
    }
    if (typeof dict !== "object") {
        throw new Error("[jsonToGroupNode] Invalid object");
    }
    if (!("type" in dict)) {
        throw new Error("[jsonToGroupNode] Invalid dict: missing type");
    }
    const type = dict["type"] as unknown;
    if (typeof type !== "string") {
        throw new Error("[jsonToGroupNode] Type is not a string");
    }
    if (type !== "group") {
        throw new Error("[jsonToGroupNode] Invalid type");
    }
    if (!("name" in dict)) {
        throw new Error("[jsonToGroupNode] Invalid dict: missing name");
    }
    const name = dict["name"] as unknown;
    if (typeof name !== "string") {
        throw new Error("[jsonToGroupNode] Name is not a string");
    }
    if (!("children" in dict)) {
        throw new Error("[jsonToGroupNode] Invalid dict: missing children");
    }


}
