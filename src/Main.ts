import {workerFunction} from "./Worker";
import {createWorkerFromFunction} from "./submodules/common-ts-utils/WebWorker/CreateWorker";
import {
    CanvasUpdateEvent,
    docManagerWorker,
    DocWorkerEvent, ToolOpEvent,
    ToolUpdateEvent
} from "./Documents/DocManager/DocManagerWorker";
import {DotPen} from "./PaintTools/DotPen";
import {BitmapLayer} from "./Documents/DocNodes/BitmapLayer";
import {WorkerCanvas2D} from "./submodules/common-ts-utils/WebWorker/WorkerCanvas2D";
import {currUser} from "./Documents/Security/User";

console.log("Main.ts");


function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;

    let size:Vec2 = [4000, 4000];
    let layer = new BitmapLayer(size);
    htmlCanvas.width = size[0];
    htmlCanvas.height = size[1];
    console.log(currUser);
    if( localStorage.getItem("USER_SIGNATURE") === null) {
        console.log("Setting user signature");
        let signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("USER_SIGNATURE", signature);
    }else{
        console.log("User signature already set");
        console.log(localStorage.getItem("USER_SIGNATURE"));
    }
    let signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log(signature);
    (self as any).test = {
        "Test": "Test"
    }
    self.eval("console.log(test)");
    (self as any).test = undefined;
    self.eval("console.log(test)");

    let workerCanvas = new WorkerCanvas2D(size[0], size[1]);


    let ctx = htmlCanvas.getContext("2d") as CanvasRenderingContext2D;

    function frameUpdate() {
        ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height);
        // ctx.drawImage(layer.content, 0, 0);
        ctx.drawImage(workerCanvas.content, 0, 0);
        // ctx.drawImage(layer.content, 0, 0);
        // ctx.drawImage(layer.content, 0, 0);
        // ctx.drawImage(layer.content, 0, 0);
        requestAnimationFrame(frameUpdate);
    }
    frameUpdate();
    htmlCanvas.onpointermove = (event) => {
        // console.log( "pointermove")
        workerCanvas.fillStyle = "#000000";
        workerCanvas.beginPath();
        workerCanvas.arc(event.offsetX, event.offsetY, 5, 0, 2 * Math.PI);

        workerCanvas.fill();

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
