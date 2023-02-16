import {currUser, User} from "./Security/User";

export class Document {
    private _name: string;
    private _content: string;

    lastModified: Date = new Date();
    lastModifiedBy: User = currUser;

    constructor(name: string, content: string) {
        this._name = name;
        this._content = content;
    }

    get name(): string {
        return this._name;
    }

    get content(): string {
        return this._content;
    }

    set content(content: string) {
        this._content = content;
    }
}
