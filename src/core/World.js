import * as THREE from "three";
import { Renderer } from "../lib/Renderer";
import { Sizer } from "../lib/Sizer";
import { Camera } from "../lib/Camera";
import SEventEmitter from "../lib/EventEmitter";

class World {
    _currentScene = null;

    get currentScene() {
        return this._currentScene;
    }

    set currentScene(scene) {
        this._currentScene = scene;
    }

    constructor() {
        const $canvas = document.createElement("canvas");
        $canvas.setAttribute("id", "canvas");

        document.body.appendChild($canvas);

        this.domElement = $canvas;
        this.eventEmitter = SEventEmitter;

        this.sizer = new Sizer();
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);

        this.eventEmitter.onResize(() => this.resize());
    }

    resize() {
        this.camera.resize(); // 종횡비 변경
        this.renderer.resize(); // renderer size, 픽셀 수 변경
    }

    update(player, mode) {
        this.camera.update(player, mode);
        this.renderer.update();
    }
}

const SWorld = new World();
export default SWorld;
