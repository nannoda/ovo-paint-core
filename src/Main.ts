import {workerFunction} from "./Worker";
import {createWorkerFromFunction} from "./submodules/common-ts-utils/WebWorker/CreateWorker";
import {
    CanvasUpdateEvent,
    docManagerWorker,
    DocWorkerEvent, ToolOpEvent,
    ToolUpdateEvent
} from "./Documents/DocManager/DocManagerWorker";
import {DotPen} from "./PaintTools/DotPen";

console.log("Main.ts");


function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    htmlCanvas.width = 4000;
    htmlCanvas.height = 2000;
    let offscreenCanvas = htmlCanvas.transferControlToOffscreen();

    let worker = createWorkerFromFunction(docManagerWorker);
    worker.onmessage = (event) => {
        console.log("Main.ts got message: " + event.data);
    }
    let canvasEvent: CanvasUpdateEvent = {
        canvas: offscreenCanvas
    }

    let docWorkerEvent: DocWorkerEvent = {
        key: "setCanvas",
        data: canvasEvent
    }

    worker.addEventListener("message", (event) => {
        console.log("LOL")
    });

    worker.postMessage(docWorkerEvent, [offscreenCanvas]);

    function objectToStr(obj: any): string {
        return obj["constructor"].toString();
    }

    let pen = new DotPen();

    let penConstructorStr = objectToStr(pen);

    let toolEvent: ToolUpdateEvent = {
        tool: penConstructorStr
    }

    console.log(penConstructorStr);

    docWorkerEvent = {
        key: "setTool",
        data: toolEvent
    }

    worker.postMessage(docWorkerEvent);

    docWorkerEvent = {
        key: "log",
        data: "nothing"
    }
    worker.postMessage(docWorkerEvent)

    function methodsToStringDict(method: any) {
        let dict: any = {};
        for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(method))) {
            dict[key] = method[key].toString();
        }
        return dict;
    }

    // get all methods from pen
    let penDict = methodsToStringDict(pen);
    let methods = Object.getOwnPropertyNames(Object.getPrototypeOf(pen));

    console.log(pen["onMove"].toString())
    console.log(penDict);


    htmlCanvas.addEventListener("pointermove", (event) => {
        let toolOpEvent: ToolOpEvent = {
            event: {
                pos: [event.offsetX, event.offsetY],
                button: event.button,
                type: "move",
                pressure: event.pressure
            }
        }

        docWorkerEvent = {
            key: "toolOp",
            data: toolOpEvent
        }

        worker.postMessage(docWorkerEvent);

        // let ctx = offscreenCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        // ctx.fillStyle = "red";
        // ctx.fillRect(event.offsetX, event.offsetY, 10, 10);


    })
    //
    // let toolEvent:ToolUpdateEvent = {
    //     tool: pen
    // }
    //
    // docWorkerEvent = {
    //     key: "updateTool",
    //     data: toolEvent
    // }
    //
    // worker.postMessage(docWorkerEvent)
    //
    // let toolOpEvent:ToolOpEvent = {
    //     event: {
    //         pos: [0, 0],
    //         button: 0,
    //         type: "move",
    //         pressure: 10
    //     }
    // }
    //
    // docWorkerEvent = {
    //     key: "toolOp",
    //     data: toolOpEvent
    // }
    //
    // worker.postMessage(docWorkerEvent);
}

main()

console.log("Main.ts done.")
