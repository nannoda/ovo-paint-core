import {DocNode, RenderEvent} from "./DocNode";

export class NodeGroup extends DocNode {
    _nodes: DocNode[] = [];

    constructor(name: string = "Untitled", offset: Vec2 = [0, 0]) {
        super(name, offset);
    }

    _renderBackground(e: RenderEvent) {
        let index = this._getActiveLayerIndex(e.activeLayer);
        if (index === -1) {
            return;
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

    _renderForeground(e: RenderEvent) {
        for (let node of this._nodes) {
            if (node === e.activeLayer) {
                e.reachActiveLayer = true;
                return;
            }
            node.render(e);
        }
    }

    _renderExport(e: RenderEvent) {
        for (let node of this._nodes) {
            node.render(e);
        }
    }

    render(e: RenderEvent) {
        switch (e.renderMode) {
            case "background":
                this._renderBackground(e);
                break;
            case "foreground":
                this._renderForeground(e);
                break;
            case "export":
                this._renderExport(e);
        }
    }
}