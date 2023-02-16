"use strict";
(() => {
  var __async = (__this, __arguments, generator) => new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }, rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    }, step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });

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
        __async(this, null, function* () {
          this._worker.postMessage(e, transfer);
        });
        return;
      }
      __async(this, null, function* () {
        this._worker.postMessage(e);
      });
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

  // src/Documents/DocNodes/WorkerCanvas.ts
  function workerCode() {
    function error(msg) {
      console.log("Worker Error: " + msg);
    }
    let canvas, ctx, initialized = !1;
    onmessage = function(e) {
      if (!e.data.key) {
        error("No key in message");
        return;
      }
      let data = e.data;
      if (!initialized && data.key !== "init") {
        error("Canvas Worker not initialized");
        return;
      }
      switch (data.key) {
        case "init":
          canvas = data.args[0], ctx = canvas.getContext("2d"), initialized = !0;
          break;
        case "canvasOp":
          let canvasMethod = data.args[0], canvasArgs = data.args[1];
          canvasMethod in canvas || error("Unknown canvas method: " + canvasMethod);
          try {
            canvas[canvasMethod](...canvasArgs);
          } catch (e2) {
            error("Error in canvas method: " + canvasMethod), console.error(e2);
          }
          break;
        case "ctxOp":
          let ctxMethod = data.args[0], ctxArgs = data.args[1];
          ctxMethod in ctx || error("Unknown ctx method: " + ctxMethod);
          try {
            ctx[ctxMethod](...ctxArgs);
          } catch (e2) {
            error("Error in ctx method: " + ctxMethod), console.error(e2);
          }
          break;
        case "canvasVar":
          let canvasVar = data.args[0], canvasVarValue = data.args[1];
          canvasVar in canvas || error("Unknown canvas var: " + canvasVar), canvas[canvasVar] = canvasVarValue;
          break;
        case "ctxVar":
          let ctxVar = data.args[0], ctxVarValue = data.args[1];
          ctxVar in ctx || error("Unknown ctx var: " + ctxVar), ctx[ctxVar] = ctxVarValue;
          break;
        default:
          console.log("Unknown event key: " + data.key);
      }
    };
  }
  var WorkerCanvas = class {
    constructor(width, height) {
      this._lineCap = "butt";
      this._lineJoin = "miter";
      this._lineWidth = 1;
      this._strokeStyle = "#000000";
      this._fillStyle = "#000000";
      this._font = "10px sans-serif";
      this._textAlign = "start";
      this._textBaseline = "alphabetic";
      this._globalAlpha = 1;
      this._globalCompositeOperation = "source-over";
      this._shadowBlur = 0;
      this._shadowColor = "rgba(0, 0, 0, 0)";
      this._shadowOffsetX = 0;
      this._shadowOffsetY = 0;
      this._imageSmoothingEnabled = !0;
      this._imageSmoothingQuality = "low";
      this._filter = "none";
      let canvas = document.createElement("canvas");
      canvas.width = width, canvas.height = height;
      let worker = createWorkerFromFunction(workerCode);
      worker.onmessage = (e) => {
        this.onResponse(e);
      };
      let workerCanvas = canvas.transferControlToOffscreen();
      worker.postMessage(
        {
          key: "init",
          args: [workerCanvas]
        },
        [workerCanvas]
      ), this._canvas = canvas, this._worker = worker, this._width = width, this._height = height, this.lineCap = "round", this.lineJoin = "round", this.lineWidth = 2, this.strokeStyle = "#000000";
    }
    get font() {
      return this._font;
    }
    set font(value) {
      this._font = value, this.sendCommand("ctxVar", ["font", value]);
    }
    get textAlign() {
      return this._textAlign;
    }
    set textAlign(value) {
      this._textAlign = value, this.sendCommand("ctxVar", ["textAlign", value]);
    }
    get textBaseline() {
      return this._textBaseline;
    }
    set textBaseline(value) {
      this._textBaseline = value, this.sendCommand("ctxVar", ["textBaseline", value]);
    }
    get globalAlpha() {
      return this._globalAlpha;
    }
    set globalAlpha(value) {
      this._globalAlpha = value, this.sendCommand("ctxVar", ["globalAlpha", value]);
    }
    get globalCompositeOperation() {
      return this._globalCompositeOperation;
    }
    set globalCompositeOperation(value) {
      this._globalCompositeOperation = value, this.sendCommand("ctxVar", ["globalCompositeOperation", value]);
    }
    get shadowBlur() {
      return this._shadowBlur;
    }
    set shadowBlur(value) {
      this._shadowBlur = value, this.sendCommand("ctxVar", ["shadowBlur", value]);
    }
    get shadowColor() {
      return this._shadowColor;
    }
    set shadowColor(value) {
      this._shadowColor = value, this.sendCommand("ctxVar", ["shadowColor", value]);
    }
    get shadowOffsetX() {
      return this._shadowOffsetX;
    }
    set shadowOffsetX(value) {
      this._shadowOffsetX = value, this.sendCommand("ctxVar", ["shadowOffsetX", value]);
    }
    get shadowOffsetY() {
      return this._shadowOffsetY;
    }
    set shadowOffsetY(value) {
      this._shadowOffsetY = value, this.sendCommand("ctxVar", ["shadowOffsetY", value]);
    }
    get imageSmoothingEnabled() {
      return this._imageSmoothingEnabled;
    }
    set imageSmoothingEnabled(value) {
      this._imageSmoothingEnabled = value, this.sendCommand("ctxVar", ["imageSmoothingEnabled", value]);
    }
    get imageSmoothingQuality() {
      return this._imageSmoothingQuality;
    }
    set imageSmoothingQuality(value) {
      this._imageSmoothingQuality = value, this.sendCommand("ctxVar", ["imageSmoothingQuality", value]);
    }
    get filter() {
      return this._filter;
    }
    set filter(value) {
      this._filter = value, this.sendCommand("ctxVar", ["filter", value]);
    }
    get width() {
      return this._width;
    }
    set width(value) {
      this._width = value, this.sendCommand("canvasVar", ["width", value]);
    }
    get height() {
      return this._height;
    }
    set height(value) {
      this._height = value, this.sendCommand("canvasVar", ["height", value]);
    }
    get lineCap() {
      return this._lineCap;
    }
    set lineCap(value) {
      this._lineCap = value, this.sendCommand("ctxVar", ["lineCap", value]);
    }
    get lineJoin() {
      return this._lineJoin;
    }
    set lineJoin(value) {
      this._lineJoin = value, this.sendCommand("ctxVar", ["lineJoin", value]);
    }
    get lineWidth() {
      return this._lineWidth;
    }
    set lineWidth(value) {
      this._lineWidth = value, this.sendCommand("ctxVar", ["lineWidth", value]);
    }
    get strokeStyle() {
      return this._strokeStyle;
    }
    set strokeStyle(value) {
      this._strokeStyle = value, this.sendCommand("ctxVar", ["strokeStyle", value]);
    }
    get fillStyle() {
      return this._fillStyle;
    }
    set fillStyle(value) {
      this._fillStyle = value, this.sendCommand("ctxVar", ["fillStyle", value]);
    }
    get content() {
      return this._canvas;
    }
    moveTo(x, y) {
      this.sendCommand("ctxOp", ["moveTo", [x, y]]);
    }
    lineTo(x, y) {
      this.sendCommand("ctxOp", ["lineTo", [x, y]]);
    }
    curveTo(x1, y1, x2, y2, x3, y3) {
      this.sendCommand("ctxOp", ["bezierCurveTo", [x1, y1, x2, y2, x3, y3]]);
    }
    stroke() {
      this.sendCommand("ctxOp", ["stroke", []]);
    }
    fill() {
      this.sendCommand("ctxOp", ["fill", []]);
    }
    clearRect(x, y, width, height) {
      this.sendCommand("ctxOp", ["clearRect", [x, y, width, height]]);
    }
    fillRect(x, y, width, height) {
      this.sendCommand("ctxOp", ["fillRect", [x, y, width, height]]);
    }
    strokeRect(x, y, width, height) {
      this.sendCommand("ctxOp", ["strokeRect", [x, y, width, height]]);
    }
    beginPath() {
      this.sendCommand("ctxOp", ["beginPath", []]);
    }
    closePath() {
      this.sendCommand("ctxOp", ["closePath", []]);
    }
    arc(x, y, radius, startAngle, endAngle, anticlockwise) {
      this.sendCommand("ctxOp", ["arc", [x, y, radius, startAngle, endAngle, anticlockwise]]);
    }
    onResponse(e) {
    }
    sendCommand(key, args) {
      __async(this, null, function* () {
        this._worker.postMessage({
          key,
          args
        });
      });
    }
  };

  // src/Main.ts
  console.log("Main.ts");
  function main() {
    let htmlCanvas = document.getElementById("canvas"), size = [4e3, 4e3], layer = new BitmapLayer(size);
    if (htmlCanvas.width = size[0], htmlCanvas.height = size[1], localStorage.getItem("USER_SIGNATURE") === null) {
      console.log("Setting user signature");
      let signature2 = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("USER_SIGNATURE", signature2);
    } else
      console.log("User signature already set"), console.log(localStorage.getItem("USER_SIGNATURE"));
    let signature = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log(signature), self.test = {
      Test: "Test"
    }, self.eval("console.log(test)"), self.test = void 0, self.eval("console.log(test)");
    let workerCanvas = new WorkerCanvas(size[0], size[1]), ctx = htmlCanvas.getContext("2d");
    function frameUpdate() {
      ctx.clearRect(0, 0, htmlCanvas.width, htmlCanvas.height), ctx.drawImage(workerCanvas.content, 0, 0), requestAnimationFrame(frameUpdate);
    }
    frameUpdate(), htmlCanvas.onpointermove = (event) => {
      workerCanvas.fillStyle = "#000000", workerCanvas.beginPath(), workerCanvas.arc(event.offsetX, event.offsetY, 5, 0, 2 * Math.PI), workerCanvas.fill();
    };
  }
  main();
  console.log("Main.ts done.");
})();
//# sourceMappingURL=test.js.map
