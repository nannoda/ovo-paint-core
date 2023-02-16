import {workerFunction} from "./Worker";
import {createWorkerFromFunction} from "./submodules/common-ts-utils/WebWorker/CreateWorker";
import {
    CanvasUpdateEvent,
    docManagerWorker,
    DocWorkerEvent, ToolOpEvent,
    ToolUpdateEvent
} from "./Documents/DocManager/DocManagerWorker";
import {DotPen} from "./PaintTools/DotPen";
import {WorkerLayer} from "./Documents/DocNodes/WorkerLayer";

console.log("Main.ts");


function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;

    let size:Vec2 = [2000, 2000];
    let layer = new WorkerLayer(size);
    htmlCanvas.width = size[0];
    htmlCanvas.height = size[1];

    let ctx = htmlCanvas.getContext("2d") as CanvasRenderingContext2D;

    function frameUpdate() {
        ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
        ctx.drawImage(layer.bitmap, 0, 0);
        ctx.drawImage(layer.bitmap, 0, 0);
        ctx.drawImage(layer.bitmap, 0, 0);
        ctx.drawImage(layer.bitmap, 0, 0);
        requestAnimationFrame(frameUpdate);
    }
    frameUpdate();
    htmlCanvas.onpointermove = (event) => {
        layer.drawDot([event.offsetX, event.offsetY]);
    }


    // let offscreenCanvas = htmlCanvas.transferControlToOffscreen();
    //
    // let worker = createWorkerFromFunction(docManagerWorker);
    // worker.onmessage = (event) => {
    //     console.log("Main.ts got message: " + event.data);
    // }
    // let canvasEvent: CanvasUpdateEvent = {
    //     canvas: offscreenCanvas
    // }
    //
    // let docWorkerEvent: DocWorkerEvent = {
    //     key: "setCanvas",
    //     data: canvasEvent
    // }
    //
    // worker.addEventListener("message", (event) => {
    //     console.log("Main.ts got message: ");
    //     console.log(event.data);
    //     console.log(event.origin);
    // });
    //
    //
    //
    // worker.postMessage(docWorkerEvent, [offscreenCanvas]);
    //
    // function objectToStr(obj: any): string {
    //     return obj["constructor"].toString();
    // }
    //
    // let pen = new DotPen();
    //
    // let penConstructorStr = objectToStr(pen);
    //
    // let toolEvent: ToolUpdateEvent = {
    //     tool: penConstructorStr
    // }
    //
    // console.log(penConstructorStr);
    //
    // docWorkerEvent = {
    //     key: "setTool",
    //     data: toolEvent
    // }
    //
    // worker.postMessage(docWorkerEvent);
    //
    // docWorkerEvent = {
    //     key: "log",
    //     data: "nothing"
    // }
    // worker.postMessage(docWorkerEvent)
    //
    // function methodsToStringDict(method: any) {
    //     let dict: any = {};
    //     for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(method))) {
    //         dict[key] = method[key].toString();
    //     }
    //     return dict;
    // }
    //
    // // get all methods from pen
    // let penDict = methodsToStringDict(pen);
    // let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(pen));
    //
    // console.log(pen["onMove"].toString())
    // console.log(penDict);
    //
    //
    // htmlCanvas.addEventListener("pointermove", (event) => {
    //     let toolOpEvent: ToolOpEvent = {
    //         event: {
    //             pos: [event.offsetX, event.offsetY],
    //             button: event.button,
    //             type: "move",
    //             pressure: event.pressure
    //         }
    //     }
    //
    //     docWorkerEvent = {
    //         key: "toolOp",
    //         data: toolOpEvent
    //     }
    //
    //     worker.postMessage(docWorkerEvent);
    // })
    // docWorkerEvent = {
    //     key: "returnBitmap",
    //     data: "nothing"
    // }
    //
    // worker.postMessage(docWorkerEvent)
    //
    // worker.addEventListener("message", (event) => {
    //     console.log("Main.ts got message: ");
    //     if (event.data instanceof ImageBitmap) {
    //         console.log("Main.ts got ImageBitmap");
    //         let newCanvas = document.createElement("canvas");
    //         newCanvas.width = event.data.width;
    //         newCanvas.height = event.data.height;
    //         let ctx = newCanvas.getContext("2d") as CanvasRenderingContext2D;
    //         ctx.drawImage(event.data, 0, 0);
    //         document.body.appendChild(newCanvas);
    //     }
    // });

    // let ctx = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    // ctx.fillStyle = "red";
    // ctx.fillRect(0,0,100,100);
}

main()

console.log("Main.ts done.")
