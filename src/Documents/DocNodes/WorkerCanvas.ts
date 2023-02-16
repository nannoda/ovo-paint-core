import {createWorkerFromFunction} from "../../submodules/common-ts-utils/WebWorker/CreateWorker";

function workerCode() {

    function error(msg: string) {
        console.log("Worker Error: " + msg);
    }

    let canvas: OffscreenCanvas;
    let ctx: OffscreenCanvasRenderingContext2D;
    let initialized = false;
    onmessage = function (e) {
        if (!e.data.key) {
            error("No key in message");
            return;
        }
        let data = e.data as CanvasWorkerEvent;

        if (!initialized && data.key !== "init") {
            error("Canvas Worker not initialized");
            return;
        }

        switch (data.key) {
            case "init":
                canvas = data.args[0] as OffscreenCanvas;
                ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
                initialized = true;
                break;
            case "canvasOp":
                let canvasMethod = data.args[0];
                let canvasArgs = data.args[1] as any[];
                if (!(canvasMethod in canvas))
                    error("Unknown canvas method: " + canvasMethod);
                try {
                    (canvas as any)[canvasMethod](...canvasArgs);
                } catch (e) {
                    error("Error in canvas method: " + canvasMethod);
                    console.error(e)
                }
                break;
            case "ctxOp":
                let ctxMethod = data.args[0];
                let ctxArgs = data.args[1] as any[];
                if (!(ctxMethod in ctx))
                    error("Unknown ctx method: " + ctxMethod);
                try {
                    (ctx as any)[ctxMethod](...ctxArgs);
                } catch (e) {
                    error("Error in ctx method: " + ctxMethod);
                    console.error(e)
                }
                break;
            case "canvasVar":
                let canvasVar = data.args[0];
                let canvasVarValue = data.args[1];
                if (!(canvasVar in canvas))
                    error("Unknown canvas var: " + canvasVar);
                (canvas as any)[canvasVar] = canvasVarValue;
                break;
            case "ctxVar":
                let ctxVar = data.args[0];
                let ctxVarValue = data.args[1];
                if (!(ctxVar in ctx))
                    error("Unknown ctx var: " + ctxVar);
                (ctx as any)[ctxVar] = ctxVarValue;
                break;
            default:
                console.log("Unknown event key: " + data.key);
        }
    }
}

type CanvasWorkerEventKey = "init" | "canvasOp" | "ctxOp" | "canvasVar" | "ctxVar";

interface CanvasWorkerEvent {
    key: CanvasWorkerEventKey;
    args: any[];
}

export class WorkerCanvas {
    protected _canvas: HTMLCanvasElement;
    protected _worker: Worker;

    protected _lineCap: CanvasLineCap = "butt";
    protected _lineJoin: CanvasLineJoin = "miter";
    protected _lineWidth: number = 1;
    protected _strokeStyle: string | CanvasGradient | CanvasPattern = "#000000";
    protected _fillStyle: string | CanvasGradient | CanvasPattern = "#000000";

    protected _font: string = "10px sans-serif";

    get font(): string {
        return this._font;
    }

    set font(value: string) {
        this._font = value;
        this.sendCommand("ctxVar", ["font", value]);
    }

    protected _textAlign: CanvasTextAlign = "start";

    get textAlign(): CanvasTextAlign {
        return this._textAlign;
    }

    set textAlign(value: CanvasTextAlign) {
        this._textAlign = value;
        this.sendCommand("ctxVar", ["textAlign", value]);
    }

    protected _textBaseline: CanvasTextBaseline = "alphabetic";

    get textBaseline(): CanvasTextBaseline {
        return this._textBaseline;
    }

    set textBaseline(value: CanvasTextBaseline) {
        this._textBaseline = value;
        this.sendCommand("ctxVar", ["textBaseline", value]);
    }

    protected _globalAlpha: number = 1;

    get globalAlpha(): number {
        return this._globalAlpha;
    }

    set globalAlpha(value: number) {
        this._globalAlpha = value;
        this.sendCommand("ctxVar", ["globalAlpha", value]);
    }

    protected _globalCompositeOperation: GlobalCompositeOperation = "source-over";

    get globalCompositeOperation(): GlobalCompositeOperation {
        return this._globalCompositeOperation;
    }

    set globalCompositeOperation(value: GlobalCompositeOperation) {
        this._globalCompositeOperation = value;
        this.sendCommand("ctxVar", ["globalCompositeOperation", value]);
    }

    protected _shadowBlur: number = 0;

    get shadowBlur(): number {
        return this._shadowBlur;
    }

    set shadowBlur(value: number) {
        this._shadowBlur = value;
        this.sendCommand("ctxVar", ["shadowBlur", value]);
    }

    protected _shadowColor: string = "rgba(0, 0, 0, 0)";

    get shadowColor(): string {
        return this._shadowColor;
    }

    set shadowColor(value: string) {
        this._shadowColor = value;
        this.sendCommand("ctxVar", ["shadowColor", value]);
    }


    protected _shadowOffsetX: number = 0;

    get shadowOffsetX(): number {
        return this._shadowOffsetX;
    }

    set shadowOffsetX(value: number) {
        this._shadowOffsetX = value;
        this.sendCommand("ctxVar", ["shadowOffsetX", value]);
    }

    protected _shadowOffsetY: number = 0;

    get shadowOffsetY(): number {
        return this._shadowOffsetY;
    }

    set shadowOffsetY(value: number) {
        this._shadowOffsetY = value;
        this.sendCommand("ctxVar", ["shadowOffsetY", value]);
    }

    protected _imageSmoothingEnabled: boolean = true;

    get imageSmoothingEnabled(): boolean {
        return this._imageSmoothingEnabled;
    }

    set imageSmoothingEnabled(value: boolean) {
        this._imageSmoothingEnabled = value;
        this.sendCommand("ctxVar", ["imageSmoothingEnabled", value]);
    }

    protected _imageSmoothingQuality: ImageSmoothingQuality = "low";

    get imageSmoothingQuality(): ImageSmoothingQuality {
        return this._imageSmoothingQuality;
    }

    set imageSmoothingQuality(value: ImageSmoothingQuality) {
        this._imageSmoothingQuality = value;
        this.sendCommand("ctxVar", ["imageSmoothingQuality", value]);
    }

    protected _filter: string = "none";

    get filter(): string {
        return this._filter;
    }

    set filter(value: string) {
        this._filter = value;
        this.sendCommand("ctxVar", ["filter", value]);
    }

    protected _width: number;
    protected _height: number;

    get width(): number {
        return this._width;

    }

    set width(value: number) {
        this._width = value;
        this.sendCommand("canvasVar", ["width", value]);
    }

    get height(): number {
        return this._height;
    }

    set height(value: number) {
        this._height = value;
        this.sendCommand("canvasVar", ["height", value]);
    }

    get lineCap(): CanvasLineCap {
        return this._lineCap;
    }

    set lineCap(value: CanvasLineCap) {
        this._lineCap = value;
        this.sendCommand("ctxVar", ["lineCap", value]);
    }

    get lineJoin(): CanvasLineJoin {
        return this._lineJoin;
    }

    set lineJoin(value: CanvasLineJoin) {
        this._lineJoin = value;
        this.sendCommand("ctxVar", ["lineJoin", value]);
    }

    get lineWidth(): number {
        return this._lineWidth;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
        this.sendCommand("ctxVar", ["lineWidth", value]);
    }

    get strokeStyle(): string | CanvasGradient | CanvasPattern {
        return this._strokeStyle;
    }

    set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
        this._strokeStyle = value;
        this.sendCommand("ctxVar", ["strokeStyle", value]);
    }

    get fillStyle(): string | CanvasGradient | CanvasPattern {
        return this._fillStyle;
    }

    set fillStyle(value: string | CanvasGradient | CanvasPattern) {
        this._fillStyle = value;
        this.sendCommand("ctxVar", ["fillStyle", value]);
    }

    get content(): CanvasImageSource {
        return this._canvas;
    }

    moveTo(x: number, y: number) {
        this.sendCommand("ctxOp", ["moveTo", [x, y]]);
    }

    lineTo(x: number, y: number) {
        this.sendCommand("ctxOp", ["lineTo", [x, y]]);
    }

    curveTo(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
        this.sendCommand("ctxOp", ["bezierCurveTo", [x1, y1, x2, y2, x3, y3]]);
    }

    stroke() {
        this.sendCommand("ctxOp", ["stroke", []]);
    }

    fill() {
        this.sendCommand("ctxOp", ["fill", []]);
    }

    clearRect(x: number, y: number, width: number, height: number) {
        this.sendCommand("ctxOp", ["clearRect", [x, y, width, height]]);
    }

    fillRect(x: number, y: number, width: number, height: number) {
        this.sendCommand("ctxOp", ["fillRect", [x, y, width, height]]);
    }

    strokeRect(x: number, y: number, width: number, height: number) {
        this.sendCommand("ctxOp", ["strokeRect", [x, y, width, height]]);
    }

    beginPath() {
        this.sendCommand("ctxOp", ["beginPath", []]);
    }

    closePath() {
        this.sendCommand("ctxOp", ["closePath", []]);
    }

    arc(x: number, y: number, radius: number, startAngle: number, endAngle: number, anticlockwise?: boolean) {
        this.sendCommand("ctxOp", ["arc", [x, y, radius, startAngle, endAngle, anticlockwise]]);
    }


    onResponse(e: MessageEvent) {

    }

    sendCommand(key: CanvasWorkerEventKey, args: any) {
        (
            async () => {
                this._worker.postMessage({
                    key: key,
                    args: args,
                })
            }
        )()
    }

    constructor(width: number, height: number) {
        let canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        // document.body.appendChild(canvas);
        let worker = createWorkerFromFunction(workerCode);
        worker.onmessage = (e) => {
            this.onResponse(e);
        }
        let workerCanvas = canvas.transferControlToOffscreen();
        worker.postMessage(
            {
                key: "init",
                args: [workerCanvas]
            },
            [workerCanvas]
        )
        this._canvas = canvas;
        this._worker = worker;

        this._width = width;
        this._height = height;

        this.lineCap = "round";
        this.lineJoin = "round";
        this.lineWidth = 2;
        this.strokeStyle = "#000000";
    }
}