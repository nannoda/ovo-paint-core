import {createWorkerFromFunction} from "../../submodules/common-ts-utils/WebWorker/CreateWorker";
import {docManagerWorker} from "./DocManagerWorker";

export class DocManager {
    private _document: Document;
    private _worker: Worker;

    constructor(document: Document) {
        this._document = document;
        this._worker = createWorkerFromFunction(docManagerWorker)
        this.manage(document);
    }
    manage(doc: Document) {
        this._document = doc;
    }
}
