export class DocManager {
    private _document: Document;

    constructor(document: Document) {
        this._document = document;
        this.manage(document);
    }


    manage(doc: Document) {
        this._document = doc;
    }
}
