import {DocNode} from "./Documents/DocNodes/DocNode";
import {GroupNode} from "./Documents/DocNodes/GroupNode";

export function printDocNodeTree(node: DocNode, depth: number = 0) {
    console.log("  ".repeat(depth) + " " + node.name + " [" + node.constructor.name + "]");
    if (node instanceof GroupNode) {
        for (let child of node._nodes) {
            printDocNodeTree(child, depth + 1);
        }
    }
}
