import {DocSerializer} from "./DocSerializer";
import {OVODocument} from "../OVODocument";
import {BitmapLayerNode} from "../DocNodes/Layers/BitmapLayerNode";

export class PngSerializer extends DocSerializer {
    get extension(): string {
        return "png";
    }

    fromBlob(blob: Blob, name: string): Promise<OVODocument> {
        let img = new Image();
        img.src = URL.createObjectURL(blob);
        return new Promise<OVODocument>((resolve, reject) => {
            img.onload = () => {
                let doc = new OVODocument(name, img.width, img.height);
                let layer = new BitmapLayerNode(img.width, img.height);
                layer.ctx.drawImage(img, 0, 0);
                resolve(doc);
            }
        });
    }

    toBlob(data: OVODocument): Promise<Blob> {
        data.render({
            renderMode: "export",
        })
        const tmpCanvas = document.createElement("canvas");
        tmpCanvas.width = data.width;
        tmpCanvas.height = data.height;
        const tmpCtx = tmpCanvas.getContext("2d");

        return new Promise<Blob>((resolve, reject) => {
            if (!tmpCtx) {
                reject("Failed to create canvas context");
                return;
            }
            tmpCtx.drawImage(data.content, 0, 0);
            tmpCanvas.toBlob((blob) => {
                    if (blob) {
                        resolve(blob);
                    } else {
                        reject("Failed to create blob");
                    }
                },
                "image/png"
            );
        })

    }
}