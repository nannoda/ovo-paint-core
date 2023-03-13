export interface ISerializers<T> {
    fromBlob(blob: Blob): Promise<T>;

    toBlob(data: T): Promise<Blob>;
}
