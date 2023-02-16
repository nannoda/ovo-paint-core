import {createWorkerFromFunction} from "../../submodules/common-ts-utils/WebWorker/CreateWorker";
import {AbstractDocNode} from "./AbstractDocNode";

function layerWorkerCode() {
    let canvas: OffscreenCanvas;
    let ctx: OffscreenCanvasRenderingContext2D;

    function drawDot(pos: Vec2) {

        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI);
        ctx.fill();
        console.log("drawDot")
    }

    //
    // function updateBitmap(){
    //     let bitmap = canvas.transferToImageBitmap();
    //     self.postMessage({
    //         key: "updateBitmap",
    //         data: bitmap,
    //     })
    //     ctx.drawImage(bitmap, 0, 0)
    // }

    self.onmessage = (e) => {
        let data = e.data as LayerWorkerEvent;
        switch (data.key) {
            case "setCanvas":
                canvas = data.data as OffscreenCanvas;
                console.log(canvas)
                ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
                break;
            case "drawDot":
                drawDot(data.data as Vec2)
                break;
            default:
                console.log("Unknown event key: " + data.key);
        }
    }
}

type layerEventKey = "setCanvas" | "drawDot"

interface LayerWorkerEvent {
    key: layerEventKey;
    data: any;
}


export class BitmapLayer extends AbstractDocNode {
    protected _worker: Worker;
    protected _size: Vec2;
    protected _offset: Vec2;
    protected _content: CanvasImageSource;

    postMessage(e: LayerWorkerEvent, transfer?: Transferable[]) {
        if (transfer !== undefined) {
            (async () => {
                this._worker.postMessage(e, transfer);
            })()
            return;
        }
        (async () => {
            this._worker.postMessage(e);
        })()
    }

    constructor(size: Vec2, offset: Vec2 = [0, 0]) {
        super(size, "BitmapLayer", offset);
        this._size = size;
        this._offset = offset;

        this._worker = createWorkerFromFunction(layerWorkerCode);
        this._content = document.createElement("canvas");
        this._content.width = size[0];
        this._content.height = size[1];

        let canvas = this._content.transferControlToOffscreen();

        this.postMessage(
            {
                key: "setCanvas",
                data: canvas
            }, [canvas]
        );
    }

    drawDot(pos: Vec2) {
        this.postMessage({
            key: "drawDot",
            data: pos
        });
    }


    get height(): number {
        return 0;
    }

    get width(): number {
        return 0;
    }
}