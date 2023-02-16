"use strict";
(() => {
  // src/submodules/common-ts-utils/WebWorker/CreateWorker.ts
  function createWorkerFromFunction(workerFunction) {
    checkCompatibility();
    let blob = new Blob(["(" + workerFunction.toString() + ")()"], { type: "application/javascript" });
    return new Worker(URL.createObjectURL(blob));
  }
  function checkCompatibility() {
    if (window.Worker === void 0)
      throw new Error("Your browser does not support Web Workers.");
  }

  // src/Documents/DocNodes/WorkerLayer.ts
  function layerWorkerCode() {
    let canvas, ctx;
    function drawDot(pos) {
      ctx.fillStyle = "red", ctx.beginPath(), ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI), ctx.fill();
    }
    function updateBitmap() {
      let bitmap = canvas.transferToImageBitmap();
      self.postMessage({
        key: "updateBitmap",
        data: bitmap
      }), ctx.drawImage(bitmap, 0, 0);
    }
    self.onmessage = (e) => {
      let data = e.data;
      switch (data.key) {
        case "setCanvas":
          canvas = data.data, console.log(canvas), ctx = canvas.getContext("2d");
          break;
        case "drawDot":
          ctx.fillStyle = "red", ctx.beginPath(), ctx.arc(data.data[0], data.data[1], 5, 0, 2 * Math.PI), ctx.fill(), updateBitmap();
          break;
        default:
          console.log("Unknown event key: " + data.key);
      }
    };
  }
  var WorkerLayer = class {
    postMessage(e, transfer) {
      if (transfer !== void 0) {
        this._worker.postMessage(e, transfer);
        return;
      }
      this._worker.postMessage(e, transfer);
    }
    get bitmap() {
      return this._bitmap;
    }
    constructor(size, offset = [0, 0]) {
      this._size = size, this._offset = offset, this._worker = createWorkerFromFunction(layerWorkerCode), this._worker.onmessage = (e) => {
        let data = e.data;
        switch (data.key) {
          case "updateBitmap":
            this._bitmap = data.data;
            break;
          default:
            console.log("Unknown event key: " + data.key);
        }
      };
      let tmpCanvas = new OffscreenCanvas(size[0], size[1]), ctx = tmpCanvas.getContext("2d");
      ctx.fillStyle = "red", ctx.fillRect(0, 0, 100, 100), this._bitmap = tmpCanvas.transferToImageBitmap();
      let canvas = new OffscreenCanvas(size[0], size[1]);
      this.postMessage(
        {
          key: "setCanvas",
          data: canvas
        },
        [canvas]
      );
    }
    drawDot(pos) {
      this.postMessage({
        key: "drawDot",
        data: pos
      });
    }
  };

  // src/Main.ts
  console.log("Main.ts");
  function main() {
    let htmlCanvas = document.getElementById("canvas"), size = [2e3, 2e3], layer = new WorkerLayer(size);
    htmlCanvas.width = size[0], htmlCanvas.height = size[1];
    let ctx = htmlCanvas.getContext("2d");
    function frameUpdate() {
      ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height), ctx.drawImage(layer.bitmap, 0, 0), ctx.drawImage(layer.bitmap, 0, 0), ctx.drawImage(layer.bitmap, 0, 0), ctx.drawImage(layer.bitmap, 0, 0), requestAnimationFrame(frameUpdate);
    }
    frameUpdate(), htmlCanvas.onpointermove = (event) => {
      layer.drawDot([event.offsetX, event.offsetY]);
    };
  }
  main();
  console.log("Main.ts done.");
})();
//# sourceMappingURL=test.js.map
