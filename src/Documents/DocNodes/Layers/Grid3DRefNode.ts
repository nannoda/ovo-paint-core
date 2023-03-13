import {ReferenceLayerNode} from "./ReferenceLayerNode";
import {DocNodeRenderEvent} from "../DocNode";

export class Grid3DRefNode extends ReferenceLayerNode {
    world: Vec3 = [0, 0, 0];
    eye: Vec3 = [10, 10, 10];
    up: Vec3 = [0, 1, 0];
    fov: number = 0;
    near: number = 0;
    far: number = 0;

    constructor(size: Vec2, name: string = "New Grid3D Reference Layer", offset: Vec2 = [0, 0]) {
        super(size, name, offset);
        this.drawGrid3D();
    }

    drawGrid3D() {
        this.contentCtx.fillStyle = "rgba(183,101,101,0.28)";
        this.contentCtx.fillRect(0, 0, this.contentCanvas.width, this.contentCanvas.height);

        let lookAtMatrix = this.lookAt();
        let perspectiveMatrix = this.perspective();
        console.log(lookAtMatrix);
        console.log(perspectiveMatrix);

        function inverse(m: Mat4): Mat4 {
            let t: Mat4 = [
                [m[0][0], m[1][0], m[2][0], m[3][0]],
                [m[0][1], m[1][1], m[2][1], m[3][1]],
                [m[0][2], m[1][2], m[2][2], m[3][2]],
                [m[0][3], m[1][3], m[2][3], m[3][3]]
            ];
            return t;
        }

        function multiply(a: Mat4, b: Mat4): Mat4 {
            let t: Mat4 = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    for (let k = 0; k < 4; k++) {
                        t[i][j] += a[i][k] * b[k][j];
                    }
                }
            }
            return t;
        }

        let viewMatrix = inverse(lookAtMatrix);
        let viewProjectionMatrix = multiply(perspectiveMatrix, viewMatrix);
        let viewportMatrix = this.viewport();
        let transformMatrix = multiply(viewportMatrix, viewProjectionMatrix);

        function transformPoint(m: Mat4, p: Vec3): Vec3 {
            let t: Vec3 = [0, 0, 0];
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    t[i] += m[i][j] * p[j];
                }
                t[i] += m[i][3];
            }
            return t;
        }

        let p1: Vec3 = [0, 0, 0];
        let p2: Vec3 = [1, 0, 0];
        let p3: Vec3 = [0, 1, 0];
        let p4: Vec3 = [0, 0, 1];

        let p1t = transformPoint(transformMatrix, p1);
        let p2t = transformPoint(transformMatrix, p2);
        let p3t = transformPoint(transformMatrix, p3);
        let p4t = transformPoint(transformMatrix, p4);

        this.contentCtx.beginPath();
        this.contentCtx.moveTo(p1t[0], p1t[1]);
        this.contentCtx.lineTo(p2t[0], p2t[1]);
        this.contentCtx.lineTo(p3t[0], p3t[1]);
        this.contentCtx.lineTo(p4t[0], p4t[1]);
        this.contentCtx.lineTo(p1t[0], p1t[1]);
        this.contentCtx.stroke();

        this.contentCtx.beginPath();
        this.contentCtx.moveTo(p1t[0], p1t[1]);
        this.contentCtx.lineTo(p2t[0], p2t[1]);
        this.contentCtx.lineTo(p3t[0], p3t[1]);
        this.contentCtx.lineTo(p4t[0], p4t[1]);
        this.contentCtx.lineTo(p1t[0], p1t[1]);
        this.contentCtx.stroke();

        console.log(p1t, p2t, p3t, p4t)


    }

    viewport(): Mat4 {
        let t: Mat4 = [
            [this.contentCanvas.width / 2, 0, 0, this.contentCanvas.width / 2],
            [0, this.contentCanvas.height / 2, 0, this.contentCanvas.height / 2],
            [0, 0, 0.5, 0.5],
            [0, 0, 0, 1]
        ];
        return t;
    }

    perspective(): Mat4 {
        let t: Mat4 = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        let aspect = this.contentCanvas.width / this.contentCanvas.height;
        let f = 1 / Math.tan(this.fov / 2);
        let nf = 1 / (this.near - this.far);
        t[0][0] = f / aspect;
        t[1][1] = f;
        t[2][2] = (this.far + this.near) * nf;
        t[2][3] = -1;
        t[3][2] = 2 * this.far * this.near * nf;
        t[3][3] = 0;
        return t;
    }

    lookAt(): Mat4 {
        function normalize(v: Vec3): Vec3 {
            let d = Math.sqrt(dot(v, v));
            return [v[0] / d, v[1] / d, v[2] / d];
        }

        function dot(u: Vec3, v: Vec3): number {
            return u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
        }

        function sub(u: Vec3, v: Vec3): Vec3 {
            return [u[0] - v[0], u[1] - v[1], u[2] - v[2]];
        }

        function cross(u: Vec3, v: Vec3): Vec3 {
            return [
                u[1] * v[2] - u[2] * v[1],
                u[2] * v[0] - u[0] * v[2],
                u[0] * v[1] - u[1] * v[0]
            ];
        }

        let up = this.up;
        let eye = this.eye;
        let world = this.world;
        let z = normalize(sub(eye, world));
        let x = normalize(cross(up, z));
        let y = normalize(cross(z, x));
        let t: Mat4 = [
            [x[0], x[1], x[2], -dot(x, eye)],
            [y[0], y[1], y[2], -dot(y, eye)],
            [z[0], z[1], z[2], -dot(z, eye)],
            [0, 0, 0, 1]
        ];
        return t;
    }

    render(e: DocNodeRenderEvent) {
        // super.render(e);
        // this.drawGrid3D();
        // e.ctx.clearRect(0, 0, e.canvas.width, e.canvas.height);
        e.ctx.drawImage(this.contentCanvas, 0, 0);
    }
}
