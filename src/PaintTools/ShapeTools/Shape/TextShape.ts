import {Shape} from "./Shape";
import WebFont from "webfontloader";

export class TextShape extends Shape {
    _content: string;
    position: Vec2;

    _knowSize:boolean = false;

    font: string;
    fontSize: number;

    width: number;
    height: number;

    order: "v" | "h" = "h";

    set content(value: string) {
        this._content = value;
        [this.width, this.height] = this.getSize();
        WebFont.load({
            google: {
                families: [this.font]
            }
        })
    }


    get content(): string {
        return this._content;
    }

    getSize(): Vec2 {
        let canvas = new OffscreenCanvas(1, 1);
        let ctx = canvas.getContext("2d") as OffscreenCanvasRenderingContext2D;
        ctx.font = `${this.fontSize}px ${this.font}`;
        let metrics = ctx.measureText(this.content);
        let height = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
        let width = metrics.width;
        return [width, height];
    }

    constructor(content: string, position: Vec2, font: string, size: number) {
        super();
        this._content = content;
        this.position = position;
        this.font = font;
        this.fontSize = size;

        let link = document.createElement("link") as HTMLLinkElement;
        let fontName = font.split(" ").join("+");

        let url = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;

        let success = false;

        fetch(url).then((res) => {
            if (res.status === 200){
                console.log("Font loaded")
                res.text().then(
                    (text) => {
                        console.log(text)
                        let dict = CSS.escape(text);
                        console.log(dict)
                    }
                )
            }
        })




        link.href = url;
        link.rel = "stylesheet";
        document.head.appendChild(link);



        [this.width, this.height] = this.getSize();
    }

    renderTo(e: OffscreenCanvasRenderingContext2D): void {
        e.fillStyle = "black";
        e.font = `${this.fontSize}px ${this.font}`;
        if (this.order === "h") {
            this.drawText(this.content, e);
        } else {
            let tmpText = this.content.split("").join("\n");
            // console.log(tmpText)
            this.drawText(tmpText, e);
        }
    }

    drawText(content: string, e: OffscreenCanvasRenderingContext2D): void {
        e.fillStyle = "black";
        e.font = `${this.fontSize}px ${this.font}`;
        const lines = content.split("\n");
        for (let i = 0; i < lines.length; i++) {
            e.fillText(lines[i], this.position[0], this.position[1] + i * this.fontSize);
        }
    }

    inRange(pos: Vec2): boolean {
        let minX = this.position[0];
        let minY = this.position[1] - this.height;
        let maxX = this.position[0] + this.width;
        let maxY = this.position[1];
        return pos[0] >= minX && pos[0] <= maxX && pos[1] >= minY && pos[1] <= maxY;
    }

    renderUI(e: OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D): void {
        if  (!this._knowSize){
            [this.width, this.height] = this.getSize();
            this._knowSize = true;
        }

        e.fillStyle = "black";
        e.strokeStyle = "black";
        let minX = this.position[0];
        let minY = this.position[1] - this.height;
        let maxX = this.position[0] + this.width;
        let maxY = this.position[1];
        e.clearRect(0, 0, e.canvas.width, e.canvas.height);
        e.strokeRect(minX, minY, maxX - minX, maxY - minY)

        // console.log("Render UI")
    }
}
