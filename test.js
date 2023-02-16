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

  // src/Documents/DocNodes/AbstractDocNode.ts
  var AbstractDocNode = class {
    constructor(size, name = "Untitled", offset = [0, 0]) {
      this.isDirty = !0;
      this._name = name, this.offset = offset;
    }
    get name() {
      return this._name;
    }
    set name(name) {
      this._name = name;
    }
    /**
     * Get the image source that represents the rendered content of this node.
     */
    get content() {
      return this._content;
    }
    /**
     * Render the content of this node to the render canvas.
     */
    render() {
      this.isDirty && this.forceRender();
    }
    /**
     * Force the node to render its content to the render canvas.
     * Doesn't check if the node is dirty.
     */
    forceRender() {
    }
  };

  // src/Documents/DocNodes/BitmapLayer.ts
  function layerWorkerCode() {
    let canvas, ctx;
    function drawDot(pos) {
      ctx.fillStyle = "#000000", ctx.beginPath(), ctx.arc(pos[0], pos[1], 5, 0, 2 * Math.PI), ctx.fill(), console.log("drawDot");
    }
    self.onmessage = (e) => {
      let data = e.data;
      switch (data.key) {
        case "setCanvas":
          canvas = data.data, console.log(canvas), ctx = canvas.getContext("2d");
          break;
        case "drawDot":
          drawDot(data.data);
          break;
        default:
          console.log("Unknown event key: " + data.key);
      }
    };
  }
  var BitmapLayer = class extends AbstractDocNode {
    constructor(size, offset = [0, 0]) {
      super(size, "BitmapLayer", offset);
      this._size = size, this._offset = offset, this._worker = createWorkerFromFunction(layerWorkerCode), this._content = document.createElement("canvas"), this._content.width = size[0], this._content.height = size[1];
      let canvas = this._content.transferControlToOffscreen();
      this.postMessage(
        {
          key: "setCanvas",
          data: canvas
        },
        [canvas]
      );
    }
    postMessage(e, transfer) {
      if (transfer !== void 0) {
        this._worker.postMessage(e, transfer);
        return;
      }
      this._worker.postMessage(e, transfer);
    }
    drawDot(pos) {
      this.postMessage({
        key: "drawDot",
        data: pos
      });
    }
    get height() {
      return 0;
    }
    get width() {
      return 0;
    }
  };

  // src/Main.ts
  console.log("Main.ts");
  function main() {
    let htmlCanvas = document.getElementById("canvas"), size = [3840, 2160], layer = new BitmapLayer(size);
    htmlCanvas.width = size[0], htmlCanvas.height = size[1];
    let ctx = htmlCanvas.getContext("2d");
    function frameUpdate() {
      ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height), ctx.drawImage(layer.content, 0, 0), ctx.drawImage(layer.content, 0, 0), ctx.drawImage(layer.content, 0, 0), ctx.drawImage(layer.content, 0, 0), requestAnimationFrame(frameUpdate);
    }
    frameUpdate(), htmlCanvas.onpointermove = (event) => {
      console.log("pointermove"), layer.drawDot([event.offsetX, event.offsetY]);
    };
  }
  main();
  console.log("Main.ts done.");
})();
//# sourceMappingURL=test.js.map
