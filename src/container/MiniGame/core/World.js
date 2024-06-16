import { Renderer } from "../../../lib/Renderer";
import { Sizer } from "../../../lib/Sizer";
import { Camera } from "../../../lib/Camera";
import SEventEmitter from "../../../lib/EventEmitter";

class World {
    _currentScene = null;
    _instance = null;
    #canvas = null;

    get canvas() {
        return this.#canvas;
    }

    get currentScene() {
        return this._currentScene;
    }

    set currentScene(scene) {
        this._currentScene = scene;
    }

    get instance() {
        if (!this._instance) this._instance = new World();

        return this._instance;
    }

    generateCanvas = () => {
        this.#canvas = document.createElement("canvas");
        this.#canvas.setAttribute("id", "canvas");

        document.body.appendChild(this.#canvas);
    };

    initialize = () => {
        this.domElement = this.#canvas;
        this.eventEmitter = SEventEmitter;

        this.sizer = new Sizer();
        this.camera = new Camera(this);
        this.renderer = new Renderer(this);

        this.eventEmitter.onResize(() => this.resize());
    };

    resize() {
        this.camera.resize(); // 종횡비 변경
        this.renderer.resize(); // renderer size, 픽셀 수 변경
    }

    update(player, mode) {
        this.camera.update(player, mode);
        this.renderer.update();
    }
}

export const SWorld = new World();
