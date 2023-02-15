"use strict";
(() => {
  // src/Worker.ts
  function workerFunction() {
    console.log("Worker.ts"), self.onmessage = (event) => {
      console.log("Worker.ts got message: "), console.log(event.data);
      let ctx = event.data.canvas.getContext("2d");
      ctx.fillStyle = "red", ctx.fillRect(0, 0, 100, 100);
    }, console.log("Worker.ts done.");
  }

  // src/submodules/common-ts-utils/WebWorker/CreateWorker.ts
  function createWorkerFromFunction(workerFunction2) {
    checkCompatibility();
    let blob = new Blob(["(" + workerFunction2.toString() + ")()"], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  }
  function checkCompatibility() {
    if (window.Worker === void 0)
      throw new Error("Your browser does not support Web Workers.");
  }

  // src/Main.ts
  console.log("Main.ts");
  function main() {
    let offscreenCanvas = document.getElementById("canvas").transferControlToOffscreen(), worker = createWorkerFromFunction(workerFunction);
    worker.onmessage = (event) => {
      console.log("Main.ts got message: " + event.data);
    }, worker.postMessage({ canvas: offscreenCanvas }, [offscreenCanvas]);
  }
  main();
  console.log("Main.ts done.");
})();
//# sourceMappingURL=test.js.map
