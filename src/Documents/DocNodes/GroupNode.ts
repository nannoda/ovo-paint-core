import {DocNode, DocNodeRenderEvent} from "./DocNode";

export class GroupNode extends DocNode {
    _nodes: DocNode[] = [];

    get children(){
        return this._nodes;
    }

    constructor(name: string = "New Group", offset: Vec2 = [0, 0]) {
        super(name, offset);
    }

    addNode(node: DocNode) {
        this._nodes.push(node);
    }

    removeNode(node: DocNode) {
        let index = this._nodes.indexOf(node);
        if (index !== -1) {
            this._nodes.splice(index, 1);
        } else {
            console.log("Node not found");
        }
    }

    _renderBackground(e: DocNodeRenderEvent) {
        for (let node of this._nodes) {
            if (node === e.activeNode) {
                e.reachActiveLayer = true;
                return;
            }
            node.render(e);
        }
    }

    _getActiveLayerIndex(activeLayer: DocNode) {
        for (let i = 0; i < this._nodes.length; i++) {
            if (this._nodes[i] === activeLayer) {
                return i;
            }
        }
        return -1;
    }

    _renderForeground(e: DocNodeRenderEvent) {

        let index = this._getActiveLayerIndex(e.activeNode);
        if (index === -1) {
            for (let node of this._nodes) {
                node.render(e);
            }
        } else {
            e.reachActiveLayer = true;
            for (let i = index + 1; i < this._nodes.length; i++) {
                this._nodes[i].render(e);
            }
        }
    }

    _renderExport(e: DocNodeRenderEvent) {
        // console.log("Rendering GroupNode: " + this.name)
        for (let node of this._nodes) {
            // console.log("Rendering Node: " + node.name)
            node.render(e);
        }
    }

    render(e: DocNodeRenderEvent) {
        // console.log("Rendering GroupNode: " + this.name)
        switch (e.renderMode) {
            case "background":
                this._renderBackground(e);
                break;
            case "foreground":
                this._renderForeground(e);
                break;
            case "export":
                this._renderExport(e);
                break;
            case "edit":
                this._renderExport(e);
        }
    }
}
