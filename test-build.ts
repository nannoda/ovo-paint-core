import {build} from "esbuild";
import {glsl} from "esbuild-plugin-glsl";

console.log("Building...");

async function buildProject(watch: boolean) {
    build
    (
        {
            entryPoints: ["src/Main.ts"],
            bundle: true,
            sourcemap: true,
            outfile: "test.js",
            plugins: [glsl()],
            watch: true,
            minify: false,
            minifySyntax: true,
            logLevel: "info",
            loader: {
                ".glsl": "text",
            }
        }
    ).catch(
        (e) => {
            console.log(e);

            process.exit(1);
        }
    );
}

async function main() {
    let watch = false;
    if (process.argv.length > 2 && process.argv[2] == "--watch") {
        watch = true;
    }
    await buildProject(watch);
}

(
    async () => {
        await main();
    }
)();


console.log("Done.");
