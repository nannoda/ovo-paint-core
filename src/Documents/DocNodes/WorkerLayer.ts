import {createWorkerFromFunction} from "../../submodules/common-ts-utils/WebWorker/CreateWorker";

function layerWorkerCode() {
    let canvas: OffscreenCanvas;
    let ctx: OffscreenCanvasRenderingContext2D;

    function drawDot(pos: Vec2) {
        ctx.fillStyle = "red";
        ctx.beginPath();
        ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI);
        ctx.fill();
    }

    function updateBitmap(){
        let bitmap = canvas.transferToImageBitmap();
        self.postMessage({
            key: "updateBitmap",
            data: bitmap,
        })
        ctx.drawImage(bitmap, 0, 0)
    }

    self.onmessage = (e) => {
        let data = e.data as LayerWorkerEvent;
        switch (data.key) {
            case "setCanvas":
                canvas = data.data as OffscreenCanvas;
                console.log(canvas)
                ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
                break;
            case "drawDot":
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(data.data[0], data.data[1], 5, 0, 2 * Math.PI);
                ctx.fill();
                updateBitmap();
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


export class WorkerLayer {
    private _bitmap: ImageBitmap;
    private _worker: Worker;
    private _size: Vec2;
    private _offset: Vec2;

    postMessage(e: LayerWorkerEvent, transfer?: Transferable[]) {
        if (transfer !== undefined){
            this._worker.postMessage(e, transfer);
            return;
        }
        this._worker.postMessage(e, transfer);
    }

    get bitmap(): ImageBitmap {
        return this._bitmap;
    }

    constructor(size: Vec2, offset: Vec2 = [0, 0]) {
        this._size = size;
        this._offset = offset;

        this._worker = createWorkerFromFunction(layerWorkerCode);

        this._worker.onmessage = (e) => {
            let data = e.data ;
            switch (data.key) {
                case "updateBitmap":
                    this._bitmap = data.data as ImageBitmap;
                    break;
                default:
                    console.log("Unknown event key: " + data.key);
            }
        }

        let tmpCanvas = new OffscreenCanvas(size[0], size[1]);
        let ctx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        ctx.fillStyle = "red";
        ctx.fillRect(0, 0, 100, 100);
        this._bitmap = tmpCanvas.transferToImageBitmap();

        let canvas = new OffscreenCanvas(size[0], size[1]);

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
}