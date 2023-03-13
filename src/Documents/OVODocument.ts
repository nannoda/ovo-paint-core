import {currUser, User} from "./Security/User";
import {DocNode} from "./DocNodes/DocNode";
import {GroupNode} from "./DocNodes/GroupNode";
import {IUndoRedo} from "../Interface/IUndoRedo";

type DocumentRenderMode = "export" | "edit";

export interface DocumentRenderOptions {
    renderMode: DocumentRenderMode;
}

export interface DocumentModifyInfo {
    modifiedBy: User;
    modified: boolean;
}

export interface DocumentCache {
    background: CanvasImageSource;
    foreground: CanvasImageSource;
}

type docEventKey = "changeActiveNode"

export class OVODocument {
    public name: string;

    _events: { [key: string]: (() => Promise<void>)[] } = {};
    modifyInfo: DocumentModifyInfo;
    background: "white" | "black" | "transparent";
    _history: IUndoRedo[] = [];
    private readonly _canvas: OffscreenCanvas;
    private readonly _ctx: OffscreenCanvasRenderingContext2D;
    private cache: DocumentCache;

    constructor(name: string,
                width: number, height: number,
                modifyInfo: DocumentModifyInfo = {
                    modified: false,
                    modifiedBy: currUser
                }) {
        this.name = name;
        this._canvas = new OffscreenCanvas(width, height);
        this._ctx = this._canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        if (!this._ctx) {
            throw new Error("Failed to create OffscreenCanvasRenderingContext2D");
        }
        this.modifyInfo = modifyInfo;

        this.cache = {
            background: new OffscreenCanvas(width, height),
            foreground: new OffscreenCanvas(width, height)
        }
        this.background = "transparent";

        this._rootNode = new GroupNode("root");
        this._activeNode = this._rootNode;
    }

    get width(): number {
        return this._canvas.width;
    }

    get height(): number {
        return this._canvas.height;
    }

    get canvas(): OffscreenCanvas {
        return this._canvas;
    }

    protected _rootNode: GroupNode;

    get rootNode(): GroupNode {
        return this._rootNode;
    }

    set rootNode(value: GroupNode) {
        this._rootNode = value;
    }

    _activeNode: DocNode;

    get activeNode(): DocNode {
        return this._activeNode;
    }

    set activeNode(value: DocNode) {
        this.trigger("changeActiveNode");
        this._activeNode = value;
    }

    get content(): CanvasImageSource {
        return this._canvas;
    }

    on(key: docEventKey, callback: () => Promise<void>) {
        if (!this._events[key]) {
            this._events[key] = [];
        }
        this._events[key].push(callback);
    }

    trigger(key: docEventKey) {
        if (this._events[key]) {
            for (let callback of this._events[key]) {
                (async () => {
                    await callback();
                })();
            }
        }
    }

    removeNode(node: DocNode) {
        function deleteNode(parent: GroupNode, node: DocNode) {
            for (let i = 0; i < parent.children.length; i++) {
                if (parent.children[i] === node) {
                    parent.children.splice(i, 1);
                    return;
                }
                if (parent.children[i] instanceof GroupNode) {
                    deleteNode(parent.children[i] as GroupNode, node);
                }
            }
        }

        deleteNode(this._rootNode, node);
    }

    renderExport(): void {
        this.drawBackgroundImage();
        this._rootNode.render({
            activeNode: this._activeNode,
            reachActiveLayer: false,
            renderMode: "export",
            canvas: this._canvas,
            ctx: this._ctx
        });
    }

    renderEdit(): void {
        this.drawBackgroundImage();
        this._rootNode.render({
            activeNode: this._activeNode,
            reachActiveLayer: false,
            renderMode: "edit",
            canvas: this._canvas,
            ctx: this._ctx
        });
    }

    renderCache() {
        this.drawBackgroundImage();
        this._ctx.drawImage(this.cache.background, 0, 0);
        this._activeNode.render({
            activeNode: this._activeNode,
            reachActiveLayer: true,
            renderMode: "activeNode",
            canvas: this._canvas,
            ctx: this._ctx
        });
        this._ctx.drawImage(this.cache.foreground, 0, 0);
    }

    render(e: DocumentRenderOptions): void {
        // console.log("Rendering Document: " + this.name);
        switch (e.renderMode) {
            case "export":
                this.renderExport();
                break;
            case "edit":
                this.renderEdit();
                break;
        }
    }

    drawBackgroundImage(): void {
        if (this.background === "transparent") {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        } else {
            this._ctx.fillStyle = this.background;
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
}
