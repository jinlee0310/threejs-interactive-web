import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Light } from "./Light";
import GUI from "lil-gui";

export default class HemisphereLight extends Light {
    _canvas = null;
    _camera = null;
    _renderer = null;
    _scene = null;
    _controls = null;

    _gui = null;
    get gui() {
        return this._gui;
    }
    constructor() {
        const $wrapper = document.createElement("div");
        $wrapper.id = "hemisphere-light";

        const $h2 = document.createElement("h2");
        $h2.innerText = "Hemisphere Light";

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

        document.querySelector("#labs-lights").appendChild($wrapper);

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / 3 / (window.innerHeight / 2),
            0.1,
            100
        );
        camera.position.set(15, 15, 15);

        const controls = new OrbitControls(camera, $canvas);

        super(scene);

        this._canvas = $canvas;
        this._renderer = renderer;
        this._scene = scene;
        this._camera = camera;
        this._controls = controls;
        this._gui = new GUI({
            container: document.querySelector("#hemisphere-light"),
        });
    }

    render() {
        this.create();
        this.createLight();
        this.resize();
        this.draw();
    }

    createLight() {
        const light = new THREE.HemisphereLight(0xf3f3f3, 0x0000ff);
        light.position.set(0, 10, 0);

        const lightHelper = new THREE.HemisphereLightHelper(light);
        this._scene.add(light);
        this._scene.add(lightHelper);
        this.createGui(light);
    }

    createGui(light) {
        this._gui.add(light, "intensity").min(0).max(5).step(0.5);
        this._gui.add(light.position, "x").min(0).max(30).step(1);
        this._gui.add(light.position, "y").min(0).max(30).step(1);
        this._gui.add(light.position, "z").min(0).max(30).step(1);
        this._gui.addColor(light, "color");
        this._gui.addColor(light, "groundColor");
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
