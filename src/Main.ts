import {workerFunction} from "./Worker";
import {createWorkerFromFunction} from "./submodules/common-ts-utils/WebWorker/CreateWorker";

console.log("Main.ts");


function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    let offscreenCanvas = htmlCanvas.transferControlToOffscreen();

    let worker = createWorkerFromFunction(workerFunction);
    worker.onmessage = (event) => {
        console.log("Main.ts got message: " + event.data);
    }
    worker.postMessage({canvas: offscreenCanvas}, [offscreenCanvas]);
}

main()

console.log("Main.ts done.")
