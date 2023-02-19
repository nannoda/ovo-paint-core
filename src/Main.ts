import {BitmapLayerNode} from "./Documents/DocNodes/BitmapLayerNode";
import {GroupNode} from "./Documents/DocNodes/GroupNode";
import {OVODocument} from "./Documents/OVODocument";
import {DebugPen} from "./PaintTools/BitmapPaintTools/DebugPen";
import {BasicPen} from "./PaintTools/BitmapPaintTools/BasicPen";
import {IUndoRedo} from "./Interface/IUndoRedo";

console.log("Main.ts");

export function penTest() {

}

function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    let size: Vec2 = [8000, 4500];
    htmlCanvas.width = size[0];
    htmlCanvas.height = size[1];

    let doc = new OVODocument("Untitled", size[0], size[1]);


    let layer1 = new BitmapLayerNode(size[0], size[1], "Layer 1");
    layer1.activeCtx.fillStyle = "red";
    layer1.activeCtx.fillRect(0, 0, 100, 100);
    let layer2 = new BitmapLayerNode(size[0], size[1], "Layer 2");
    layer2.activeCtx.fillStyle = "blue";
    layer2.activeCtx.fillRect(100, 100, 100, 100);
    let layer3 = new BitmapLayerNode(size[0], size[1], "Layer 3");
    layer3.activeCtx.fillStyle = "green";
    layer3.activeCtx.fillRect(200, 200, 100, 100);
    let layer4 = new BitmapLayerNode(size[0], size[1], "Layer 4");
    layer4.activeCtx.fillStyle = "yellow";
    layer4.activeCtx.fillRect(300, 300, 100, 100);
    let layer5 = new BitmapLayerNode(size[0], size[1], "Layer 5");
    layer5.activeCtx.fillStyle = "purple";
    layer5.activeCtx.fillRect(400, 400, 100, 100);
    let layer6 = new BitmapLayerNode(size[0], size[1], "Layer 6");
    layer6.activeCtx.fillStyle = "orange";
    layer6.activeCtx.fillRect(500, 500, 100, 100);

    let group1 = new GroupNode("Group 1");
    let group2 = new GroupNode("Group 2");
    let group3 = new GroupNode("Group 3");
    let group4 = new GroupNode("Group 4");

    group1.addNode(layer1);
    group1.addNode(layer2);
    group2.addNode(group1);
    group2.addNode(layer3);


    group4.addNode(layer4);

    group3.addNode(layer5);
    group3.addNode(layer6);
    group4.addNode(group3);

    group2.addNode(group4);


    doc.rootNode.addNode(group2);

    let pen = new BasicPen();

    doc._activeNode = layer1;

    window.addEventListener("keydown", (e) => {
        e.preventDefault();
        if (e.key === "z" && e.ctrlKey) {
            console.log(e)
            if (e.shiftKey) {
                layer1.redo()
            } else {
                layer1.undo()
            }
        }
    })

    window.addEventListener("keydown", (e) => {
        if (e.key === "y" && e.ctrlKey) {
            layer1.redo()
        }
    })

    let history: IUndoRedo[] = [];

    htmlCanvas.addEventListener("pointerdown", (e) => {
        pen.onDown(
            {
                pos: [e.offsetX, e.offsetY],
                pressure: e.pressure,
                node: doc._activeNode as BitmapLayerNode,
                type: "down",
                button: e.button,
                history: history
            }
        );
    });
    htmlCanvas.addEventListener("pointermove", (e) => {
        pen.onMove(
            {
                pos: [e.offsetX, e.offsetY],
                pressure: e.pressure,
                node: doc._activeNode as BitmapLayerNode,
                type: "move",
                button: e.button,
                history: history
            }
        );
        // doc.render({
        //     renderMode: "edit",
        // });
        // ctx.clearRect(0, 0, size[0], size[1]);
        // ctx.drawImage(doc.content, 0, 0);
    });
    htmlCanvas.addEventListener("pointerup", (e) => {
        pen.onUp(
            {
                pos: [e.offsetX, e.offsetY],
                pressure: e.pressure,
                node: doc._activeNode as BitmapLayerNode,
                type: "up",
                button: e.button,
                history: history
            }
        );
    });
    let ctx = htmlCanvas.getContext("2d") as CanvasRenderingContext2D;

    function frame() {
        doc.render({
            renderMode: "export",
        });
        ctx.clearRect(0, 0, size[0], size[1]);
        ctx.drawImage(doc.content, 0, 0);
        requestAnimationFrame(frame);
    }

    frame();
}

main()

console.log("Main.ts done.")
