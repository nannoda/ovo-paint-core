import {OVODocument} from "../OVODocument";

export abstract class DocSerializer {
    abstract get extension(): string;

    abstract fromBlob(blob: Blob, name: string): Promise<OVODocument | null>;

    abstract toBlob(data: OVODocument): Promise<Blob>;
}
