import {ISerializers} from "./ISerializers";
import {OVODocument} from "../OVODocument";

export abstract class DocSerializer implements ISerializers<OVODocument>{
    abstract get extension(): string;
    abstract fromBlob(blob: Blob): Promise<OVODocument>;
    abstract toBlob(data: OVODocument): Promise<Blob>;
}