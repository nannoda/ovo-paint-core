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
import {drawCircle, drawHermitCurve, drawLine, drawPointDebug} from "./submodules/common-ts-utils/Canvas/PaintCanvas";

console.log("Main.ts");


function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    let size: Vec2 = [3840, 2160];
    htmlCanvas.width = size[0];
    htmlCanvas.height = size[1];
    console.log(currUser);
    if (localStorage.getItem("USER_SIGNATURE") === null) {
        console.log("Setting user signature");
        let signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        localStorage.setItem("USER_SIGNATURE", signature);
    } else {
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
        ctx.drawImage(workerCanvas.content, 0, 0);
        requestAnimationFrame(frameUpdate);
    }

    let lastPoints: Vec2[] = [];
    let counter = 0;

    frameUpdate();
    htmlCanvas.onpointermove = (event) => {
        // console.log( "pointermove")
        event.preventDefault();


        if (event.pressure > 0.01) {
            let point: Vec2 = [event.offsetX, event.offsetY];
            if (lastPoints.length > 4) {
                let lastPoint = lastPoints[lastPoints.length - 1];
                let lastLastPoint = lastPoints[lastPoints.length - 2];
                let lastLastLastPoint = lastPoints[lastPoints.length - 3];
                let lastLastLastLastPoint = lastPoints[lastPoints.length - 4];

                workerCanvas.lineWidth = 20 * event.pressure;

                drawHermitCurve(workerCanvas, lastLastLastLastPoint, lastLastLastPoint, lastLastPoint, lastPoint);

                // drawPointDebug(workerCanvas, [event.offsetX, event.offsetY], 20);
            }else if(lastPoints.length > 0){
                let lastPoint = lastPoints[lastPoints.length - 1];
                workerCanvas.lineWidth = 20 * event.pressure;
                drawLine(workerCanvas, lastPoint[0], lastPoint[1], point[0], point[1]);
            }

            counter++;
            lastPoints.push(point);

        } else {
            lastPoints = [];
        }
    }

}

main()

console.log("Main.ts done.")
