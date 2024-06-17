import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Light } from "./Light";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";
import GUI from "lil-gui";

export default class RectAreaLight extends Light {
    _canvas = null;
    _camera = null;
    _renderer = null;
    _scene = null;
    _gui = null;
    constructor() {
        const $wrapper = document.createElement("div");
        $wrapper.id = "rect-area-light";

        const $h2 = document.createElement("h2");
        $h2.innerText = "Rect Area Light";

        $wrapper.appendChild($h2);

        const $canvas = document.createElement("canvas");

        $wrapper.appendChild($canvas);

        document.querySelector("#labs-lights").appendChild($wrapper);

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            canvas: $canvas,
        });

        renderer.setClearColor(0x333333);
        renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 3 / (window.innerHeight / 2),
            0.1,
            100
        );
        camera.position.set(15, 15, 15);

        super(scene);

        this._scene = scene;
        this._canvas = $canvas;
        this._renderer = renderer;
        this._camera = camera;

        this._controls = new OrbitControls(this._camera, this._canvas);

        this._gui = new GUI({
            container: document.querySelector("#rect-area-light"),
        });
    }

    render() {
        this.create();
        this.createLight();
        this.resize();
        this.draw();
    }

    createLight() {
        const light1 = new THREE.RectAreaLight(0xffffff, 1, 10, 10);
        light1.position.set(0, 0, 13);
        this._scene.add(light1);

        const lightHelper1 = new RectAreaLightHelper(light1);
        this._scene.add(lightHelper1);

        this.createLightGui(light1);

        const light2 = new THREE.RectAreaLight(0x00ff00, 1, 10, 10);
        light2.position.set(8, -2, -8);
        light2.rotation.y = (Math.PI * 3) / 4;
        light2.rotation.x = -Math.PI / 4;
        this._scene.add(light2);

        this.createLightToggleGui(light2);
    }

    createLightToggleGui(light) {
        const showLight = { value: true };
        this._gui
            .add(showLight, "value")
            .name("showLight2")
            .onChange((v) => {
                if (v) {
                    this._scene.add(light);
                } else {
                    this._scene.remove(light);
                }
            });
    }

    createLightGui(light) {
        this._gui.add(light, "intensity").min(0).max(5).step(0.5);
        this._gui.add(light.position, "x").min(0).max(30).step(1);
        this._gui.add(light.position, "y").min(0).max(30).step(1);
        this._gui.add(light.position, "z").min(0).max(30).step(1);
        this._gui.add(light, "width").min(0).max(30).step(1);
        this._gui.add(light, "height").min(0).max(30).step(1);
        this._gui.addColor(light, "color");
    }

    draw() {
        this._renderer.render(this._scene, this._camera);

        this._controls.update();

        requestAnimationFrame(() => this.draw());
    }

    resize() {
        this._camera.aspect = window.innerWidth / 3 / (window.innerHeight / 2);
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
