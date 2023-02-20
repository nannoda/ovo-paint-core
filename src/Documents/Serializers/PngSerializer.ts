import {DocSerializer} from "./DocSerializer";
import {OVODocument} from "../OVODocument";

export class PngSerializer extends DocSerializer{
    get extension(): string {
        return "png";
    }

    fromBlob(blob: Blob): Promise<OVODocument> {
        let img = new Image();
        img.src = URL.createObjectURL(blob);
        throw new Error("Method not implemented.");
    }

    toBlob(data: OVODocument): Promise<Blob> {
        throw new Error("Method not implemented.");
    }
}