import {BitmapLayerNode} from "./Documents/DocNodes/Layers/BitmapLayerNode";
import {GroupNode} from "./Documents/DocNodes/GroupNode";

export function nodeRenderTest() {
    let size: Vec2 = [3840, 2160];
    let layer1 = new BitmapLayerNode(size[0], size[1], "Layer 1");
    let layer2 = new BitmapLayerNode(size[0], size[1], "Layer 2");
    let layer3 = new BitmapLayerNode(size[0], size[1], "Layer 3");
    let layer4 = new BitmapLayerNode(size[0], size[1], "Layer 4");
    let layer5 = new BitmapLayerNode(size[0], size[1], "Layer 5");
    let layer6 = new BitmapLayerNode(size[0], size[1], "Layer 6");

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


    let tmpCanvas = new OffscreenCanvas(size[0], size[1]);
    let tmpCtx = tmpCanvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
    group2.render({
        ctx: tmpCtx,
        canvas: tmpCanvas,
        renderMode: "foreground",
        activeNode: layer1,
        reachActiveLayer: false
    })
}
