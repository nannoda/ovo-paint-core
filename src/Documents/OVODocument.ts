import {currUser, User} from "./Security/User";
import {DocNode} from "./DocNodes/DocNode";
import {GroupNode} from "./DocNodes/GroupNode";
import {IUndoRedo} from "../Interface/IUndoRedo";
import {getCheckBoard} from "./BackgroundFills";

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

export class OVODocument {
    public name: string;
    get width(): number {
        return this._canvas.width;
    }

    get height(): number {
        return this._canvas.height;
    }

    get canvas(): OffscreenCanvas {
        return this._canvas;
    }
    modifyInfo: DocumentModifyInfo;
    _canvas: OffscreenCanvas;
    _ctx: OffscreenCanvasRenderingContext2D;
    cache: DocumentCache;
    // backgroundFillStyle: string | CanvasGradient | CanvasPattern;
    background: "white" | "black" | "transparent";
    private readonly _rootNode: GroupNode;
    _activeNode: DocNode;

    get activeNode(): DocNode {
        return this._activeNode;
    }

    set activeNode(value: DocNode) {
        this._activeNode = value;
    }

    get rootNode(): GroupNode {
        return this._rootNode;
    }

    _history: IUndoRedo[] = [];

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
        // let checkBoard = getCheckBoard();
        // this.backgroundFillStyle = "white";

        this.background = "transparent";

        this._rootNode = new GroupNode("root");
        this._activeNode = this._rootNode;
    }

    get content(): CanvasImageSource {
        return this._canvas;
    }

    render(e: DocumentRenderOptions): void {
        // console.log("Rendering Document: " + this.name);
        switch (e.renderMode) {
            case "export":
                this.drawBackgroundImage();
                this._rootNode.render({
                    activeNode: this._activeNode,
                    reachActiveLayer: false,
                    renderMode: "export",
                    canvas: this._canvas,
                    ctx: this._ctx
                });

                break;
            case "edit":
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
                break;
        }
    }

    drawBackgroundImage(): void {
        // console.log("Rendering Document Background: " + this.name);

        if (this.background === "transparent") {
            this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }else{
            this._ctx.fillStyle = this.background;
            this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }
        this.cache.background = this._canvas;
    }
}
