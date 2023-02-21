// import {BitmapLayerNode} from "./Documents/DocNodes/Layers/BitmapLayerNode";
// import {GroupNode} from "./Documents/DocNodes/GroupNode";
// import {OVODocument} from "./Documents/OVODocument";
// import {IUndoRedo} from "./Interface/IUndoRedo";
// import {ShapeLayerNode} from "./Documents/DocNodes/Layers/ShapeLayerNode";
// import {TextTool} from "../../PaintTools/ShapeTools/TextTool";
// import {printDocNodeTree} from "./Debug";
// import {Grid3DRefNode} from "./Documents/DocNodes/Layers/Grid3DRefNode";
//
// console.log("Main.ts");
//
// export function penTest() {
//
// }
//
// export function saveTest(){
//     let btn = document.createElement("button");
//     btn.innerText = "Save";
//     btn.addEventListener("click", () => {
//         let canvas = document.getElementById("canvas") as HTMLCanvasElement;
//         let canvasData = canvas.toDataURL("image/png");
//         let data = {
//             data: canvasData,
//             name: "test.png"
//         }
//         let jsonStr = JSON.stringify(data);
//         let blob = new Blob([jsonStr], {type: "application/json"});
//
//         let link = document.createElement("a");
//
//         link.download = "test.json";
//         link.href = URL.createObjectURL(blob);
//         link.click();
//
//     })
//     document.body.appendChild(btn);
// }
//
// function main() {
//     saveTest();
//     let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
//     let size: Vec2 = [3000, 3000];
//     htmlCanvas.width = size[0];
//     htmlCanvas.height = size[1];
//
//     document.fonts.ready.then((set ) => {
//         console.log("Fonts loaded")
//         console.log(set)
//         set.forEach((font) => {
//             console.log(font.family)
//         })
//     })
//
//     let scale = 1;
//     let canvasWidth = size[0] + "px";
//     let canvasHeight = size[1] + "px";
//     htmlCanvas.addEventListener("wheel", (e) => {
//         // e.preventDefault();
//         if (e.ctrlKey){
//             e.preventDefault();
//             scale -= e.deltaY * 0.005;
//             htmlCanvas.style.maxWidth = (parseInt(canvasWidth) * scale) + "px";
//             htmlCanvas.style.maxHeight = (parseInt(canvasHeight) * scale) + "px";
//             console.log(scale)
//         }
//         console.log(e)
//     })
//
//
//
//
//     let doc = new OVODocument("Untitled", size[0], size[1]);
//
//
//     let layer1 = new BitmapLayerNode(size[0], size[1], "Layer 1");
//     layer1.activeCtx.fillStyle = "red";
//     layer1.activeCtx.fillRect(0, 0, 100, 100);
//     let layer2 = new BitmapLayerNode(size[0], size[1], "Layer 2");
//     layer2.activeCtx.fillStyle = "blue";
//     layer2.activeCtx.fillRect(100, 100, 100, 100);
//     let layer3 = new BitmapLayerNode(size[0], size[1], "Layer 3");
//     layer3.activeCtx.fillStyle = "green";
//     layer3.activeCtx.fillRect(200, 200, 100, 100);
//     let layer4 = new BitmapLayerNode(size[0], size[1], "Layer 4");
//     layer4.activeCtx.fillStyle = "yellow";
//     layer4.activeCtx.fillRect(300, 300, 100, 100);
//     let layer5 = new BitmapLayerNode(size[0], size[1], "Layer 5");
//     layer5.activeCtx.fillStyle = "purple";
//     layer5.activeCtx.fillRect(400, 400, 100, 100);
//     let layer6 = new BitmapLayerNode(size[0], size[1], "Layer 6");
//     layer6.activeCtx.fillStyle = "orange";
//     layer6.activeCtx.fillRect(500, 500, 100, 100);
//
//     let layer7 = new ShapeLayerNode();
//
//     let group1 = new GroupNode("Group 1");
//     let group2 = new GroupNode("Group 2");
//     let group3 = new GroupNode("Group 3");
//     let group4 = new GroupNode("Group 4");
//
//     group1.addNode(layer7);
//
//     group1.addNode(layer1);
//     group1.addNode(layer2);
//     group2.addNode(group1);
//     group2.addNode(layer3);
//
//
//     group4.addNode(layer4);
//
//     group3.addNode(layer5);
//     group3.addNode(layer6);
//     group4.addNode(group3);
//
//     group2.addNode(group4);
//
//     group2.addNode(new Grid3DRefNode(size))
//
// // JavaScript code
//     const myObject = document.getElementById('my-object');
//     let rotation = 0;
//
//
//     doc.rootNode.addNode(group2);
//
//     let tool = new TextTool();
//
//     // doc._activeNode = layer7;
//     doc._activeNode = layer7;
//
//     printDocNodeTree(doc.rootNode);
//
//     window.addEventListener("keydown", (e) => {
//         e.preventDefault();
//         if (e.key === "z" && e.ctrlKey) {
//             console.log(e)
//             if (e.shiftKey) {
//
//             } else {
//                 let undo = history.pop();
//                 if (undo) {
//                     undo.undo();
//                 }
//
//             }
//         }
//     })
//
//     window.addEventListener("keydown", (e) => {
//         e.preventDefault();
//         if (e.key === "y" && e.ctrlKey) {
//             layer1.redo()
//         }
//     })
//
//     let history: IUndoRedo[] = [];
//
//     let uiCanvas = new OffscreenCanvas(size[0], size[1])
//     let uiCtx = uiCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
//
//
//     let ui = {
//         canvas: uiCanvas,
//         ctx: uiCtx,
//         scale: 1
//     }
//
//     htmlCanvas.addEventListener("pointerdown", (e) => {
//         tool.onDown(
//             {
//                 pos: [e.offsetX, e.offsetY],
//                 pressure: e.pressure,
//                 node: doc._activeNode as ShapeLayerNode,
//                 type: "down",
//                 button: e.button,
//                 history: history,
//                 ui: ui
//             }
//         );
//     });
//     htmlCanvas.addEventListener("pointermove", (e) => {
//         tool.onMove(
//             {
//                 pos: [e.offsetX, e.offsetY],
//                 pressure: e.pressure,
//                 node: doc._activeNode as ShapeLayerNode,
//                 type: "move",
//                 button: e.button,
//                 history: history,
//                 ui: ui
//             }
//         );
//         // doc.render({
//         //     renderMode: "edit",
//         // });
//         // ctx.clearRect(0, 0, size[0], size[1]);
//         // ctx.drawImage(doc.content, 0, 0);
//     });
//     htmlCanvas.addEventListener("pointerup", (e) => {
//         tool.onUp(
//             {
//                 pos: [e.offsetX, e.offsetY],
//                 pressure: e.pressure,
//                 node: doc._activeNode as ShapeLayerNode,
//                 type: "up",
//                 button: e.button,
//                 history: history,
//                 ui: ui
//             }
//         );
//     });
//     let ctx = htmlCanvas.getContext("2d") as CanvasRenderingContext2D;
//
//     function frame() {
//         doc.render({
//             renderMode: "export",
//         });
//         ctx.clearRect(0, 0, size[0], size[1]);
//         ctx.drawImage(doc.content, 0, 0);
//         ctx.drawImage(uiCanvas, 0, 0);
//         requestAnimationFrame(frame);
//     }
//
//     frame();
// }
//
// main()
//
// console.log("Main.ts done.")
