
console.log("Main.ts");


function main() {
    let htmlCanvas = document.getElementById("canvas") as HTMLCanvasElement;
    let size: Vec2 = [3840, 2160];
    htmlCanvas.width = size[0];
    htmlCanvas.height = size[1];
}

main()

console.log("Main.ts done.")
