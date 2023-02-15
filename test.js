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

  // src/Documents/DocManager/DocManagerWorker.ts
  function docManagerWorker() {
    console.log("DocManagerWorker.ts");
    let canvas, ctx, tool;
    self.onmessage = (messageEvent) => {
      let workerEvent = messageEvent.data;
      switch (workerEvent.key) {
        case "setCanvas":
          canvas = workerEvent.data.canvas, ctx = canvas.getContext("2d");
          break;
        case "setTool":
          let toolUpdateEvent = workerEvent.data;
          tool = self.eval("new (" + toolUpdateEvent.tool + ")"), console.log("DocManagerWorker.ts got tool: " + toolUpdateEvent.tool);
          break;
        case "toolOp":
          let toolOpEvent = workerEvent.data, paintToolEvent = {
            pos: toolOpEvent.event.pos,
            button: toolOpEvent.event.button,
            type: toolOpEvent.event.type,
            pressure: toolOpEvent.event.pressure,
            canvas,
            ctx,
            extra: {}
          };
          tool.onMove(paintToolEvent);
          break;
        case "log":
          console.log(workerEvent.data), console.log(canvas), console.log(tool);
          break;
        default:
          console.log("DocManagerWorker.ts got unknown message: " + workerEvent.key);
      }
    };
  }

  // src/PaintTools/DotPen.ts
  var DotPen = class {
    onMove(e) {
      let ctx = e.ctx;
      ctx.fillStyle = "black", ctx.beginPath(), ctx.arc(e.pos[0], e.pos[1], 5, 0, 2 * Math.PI), ctx.fill();
    }
    onDown(e) {
    }
    onUp(e) {
    }
  };

  // src/Main.ts
  console.log("Main.ts");
  function main() {
    let htmlCanvas = document.getElementById("canvas");
    htmlCanvas.width = 4e3, htmlCanvas.height = 2e3;
    let offscreenCanvas = htmlCanvas.transferControlToOffscreen(), worker = createWorkerFromFunction(docManagerWorker);
    worker.onmessage = (event) => {
      console.log("Main.ts got message: " + event.data);
    };
    let docWorkerEvent = {
      key: "setCanvas",
      data: {
        canvas: offscreenCanvas
      }
    };
    worker.addEventListener("message", (event) => {
      console.log("LOL");
    }), worker.postMessage(docWorkerEvent, [offscreenCanvas]);
    function objectToStr(obj) {
      return obj.constructor.toString();
    }
    let pen = new DotPen(), penConstructorStr = objectToStr(pen), toolEvent = {
      tool: penConstructorStr
    };
    console.log(penConstructorStr), docWorkerEvent = {
      key: "setTool",
      data: toolEvent
    }, worker.postMessage(docWorkerEvent), docWorkerEvent = {
      key: "log",
      data: "nothing"
    }, worker.postMessage(docWorkerEvent);
    function methodsToStringDict(method) {
      let dict = {};
      for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(method)))
        dict[key] = method[key].toString();
      return dict;
    }
    let penDict = methodsToStringDict(pen), methods = Object.getOwnPropertyNames(Object.getPrototypeOf(pen));
    console.log(pen.onMove.toString()), console.log(penDict), htmlCanvas.addEventListener("pointermove", (event) => {
      docWorkerEvent = {
        key: "toolOp",
        data: {
          event: {
            pos: [event.offsetX, event.offsetY],
            button: event.button,
            type: "move",
            pressure: event.pressure
          }
        }
      }, worker.postMessage(docWorkerEvent);
    });
  }
  main();
  console.log("Main.ts done.");
})();
//# sourceMappingURL=test.js.map
