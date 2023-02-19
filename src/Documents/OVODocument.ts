import {currUser, User} from "./Security/User";
import {DocNode} from "./DocNodes/DocNode";
import {GroupNode} from "./DocNodes/GroupNode";

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
    modifyInfo: DocumentModifyInfo;
    _canvas: OffscreenCanvas;
    _ctx: OffscreenCanvasRenderingContext2D;
    cache: DocumentCache;
    backgroundFillStyle: string | CanvasGradient | CanvasPattern;
    _rootNode: GroupNode;
    _activeNode: DocNode;

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

        let image = new Image();
        image.src = "./assets/paper.png";
        image.onload = () => {
            this.backgroundFillStyle = this._ctx.createPattern(image, "repeat") as CanvasPattern;
        }
        this.backgroundFillStyle = "white";

        // this.backgroundFillStyle = this._ctx.createPattern(image, "repeat") as CanvasPattern;


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
        this._ctx.fillStyle = this.backgroundFillStyle;
        this._ctx.fillRect(0, 0, this._canvas.width, this._canvas.height);
        this.cache.background = this._canvas;
    }
}
