import {OVODocument} from "../OVODocument";
import {DocSerializer} from "./DocSerializer";

function jsonStrToWarpedJson(jsonStr: string): string {
    const warpLength = 2;
    let lines = jsonStr.split("\n");
    let newLines = [];
    for (let i = 0; i < lines.length; i++) {
        // if the line only contains whitespace, skip it
        let currLine = lines[i].trim();
        if (currLine.length === 0) {
            continue;
        }
        if (currLine.length > warpLength) {
            // split the line so that all length are less than warpLength
            let line = currLine;
            while (line.length > warpLength) {
                newLines.push(line.substring(0, warpLength));
                line = line.substring(warpLength);
            }
            newLines.push(line);
        } else {
            newLines.push(currLine);
        }
    }
    return newLines.join("\n");
}

const headerStr = "OVOJSON,1.0";

export class OvoJsonSerializer extends DocSerializer {
    get extension(): string {
        return "ovojson";
    }

    async fromBlob(blob: Blob, name: string): Promise<OVODocument> {
        const str = await blob.text();
        if (str.length === 0) {
            throw new Error("Empty file");
        }
        if (!str.startsWith(headerStr)) {
            throw new Error("Invalid file header");
        }

        const wJsonStr = str.substring(headerStr.length);


        throw new Error("Method not implemented.");
    }

    async toBlob(data: OVODocument): Promise<Blob> {
        let str = headerStr + "\n";


        throw new Error("Method not implemented.");
    }
}