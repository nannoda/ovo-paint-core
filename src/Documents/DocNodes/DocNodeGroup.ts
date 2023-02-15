import {AbstractDocNode} from "./AbstractDocNode";

/**
 * A group of nodes that are rendered together.
 *
 */
export class DocNodeGroup extends AbstractDocNode {
    private _children: AbstractDocNode[] = [];

    addNode(node: AbstractDocNode) {
        this._children.push(node);
    }

    removeNode(node: AbstractDocNode) {
        this._children = this._children.filter(child => child !== node);
    }

    get children(): AbstractDocNode[] {
        return this._children;
    }

    forceRender(): void {
        const ctx = this._renderCtx;
        ctx.clearRect(0, 0, this.width, this.height);
        for (const child of this.children) {
            child.render();
            ctx.drawImage(child.renderCanvas, child.offset[0], child.offset[1]);
        }
    }
}
