// import {PaintTool} from "../../PaintTools/PaintTool";
import {PaintToolEvent} from "../../PaintToolEvent";
import {PaintTool} from "../../../../PaintTools/PaintTool";

type workerEventKey = "setCanvas" | "setTool" | "toolOp" | "log" | "postBack" | "returnBitmap";

export interface DocWorkerEvent<T = any> {
    key: workerEventKey;
    data: T;
}

export interface CanvasUpdateEvent {
    canvas: OffscreenCanvas;
}

export interface ToolUpdateEvent {
    tool: string;
}

export interface ToolOpEvent {
    event: {
        pos: Vec2;
        button: number;
        type: "down" | "up" | "move";
        pressure: number;
    };
}

export interface PostBackEvent {
    key: string;
}


export function docManagerWorker() {
    console.log("DocManagerWorker.ts");

    let canvas: OffscreenCanvas;
    let ctx: OffscreenCanvasRenderingContext2D;

    let tool: PaintTool;

    self.onmessage = (messageEvent) => {
        let workerEvent = messageEvent.data as DocWorkerEvent;
        // console.log("DocManagerWorker.ts got message: " + workerEvent.key);
        switch (workerEvent.key) {
            case "setCanvas":
                let canvasUpdateEvent = workerEvent.data as CanvasUpdateEvent;
                canvas = canvasUpdateEvent.canvas;
                ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
                break;
            case "setTool":
                let toolUpdateEvent = workerEvent.data as ToolUpdateEvent;
                tool = self.eval('new (' + toolUpdateEvent.tool + ')') as PaintTool;
                // tool.onMove({
                //     pos: [0,0],
                //     button: 0,
                //     type: "move",
                //     pressure: 0,
                //     canvas: canvas,
                //     ctx: ctx,
                //     extra: {},
                // })
                // // tool = toolUpdateEvent.tool;
                console.log("DocManagerWorker.ts got tool: " + toolUpdateEvent.tool)
                break;
            case "toolOp":
                let toolOpEvent = workerEvent.data as ToolOpEvent;
                let paintToolEvent: PaintToolEvent = {
                    pos: toolOpEvent.event.pos,
                    button: toolOpEvent.event.button,
                    type: toolOpEvent.event.type,
                    pressure: toolOpEvent.event.pressure,
                    canvas: canvas,
                    ctx: ctx,
                    extra: {},
                }
                tool.onMove(paintToolEvent);
                break;
            case "log":
                console.log(workerEvent.data);
                console.log(canvas);
                console.log(tool);
                break;
            case "postBack":
                postMessage("DocManagerWorker.ts got postBack");
                break;
            case "returnBitmap":
                ctx.fillStyle = "red";
                ctx.fillRect(0, 0, 100, 100);
                let bitmap = canvas.transferToImageBitmap();
                postMessage(bitmap);
                break;
            default:
                console.log("DocManagerWorker.ts got unknown message: " + workerEvent.key);
        }
    }
}
