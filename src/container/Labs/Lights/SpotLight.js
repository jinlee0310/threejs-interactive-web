import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Light } from "./Light";
import GUI from "lil-gui";

export default class SpotLight extends Light {
    _canvas = null;
    _camera = null;
    _renderer = null;
    _scene = null;

    constructor() {
        const $wrapper = document.createElement("div");
        $wrapper.id = "spot-light";

        const $h2 = document.createElement("h2");
        $h2.innerText = "SpotLight";

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
    }

    render() {
        this.create();
        this.createLight();
        this.resize();
        this.draw();
    }

    createLight() {
        const light = new THREE.SpotLight(
            0xffffff,
            2.5,
            30,
            Math.PI * 0.3,
            0.2,
            0.5
        );
        light.position.set(0, 20, 0);
        this._lightHelper = new THREE.SpotLightHelper(light);
        this._scene.add(light);
        this._scene.add(this._lightHelper);
        this.createGui(light);
    }

    createGui(light) {
        const gui = new GUI({
            container: document.querySelector("#spot-light"),
        });
        gui.add(light, "intensity").min(0).max(5).step(0.5);
        gui.add(light.position, "x").min(0).max(30).step(1);
        gui.add(light.position, "y").min(0).max(30).step(1);
        gui.add(light.position, "z").min(0).max(30).step(1);
        gui.add(light, "decay").min(0).max(3).step(0.01);
        gui.add(light, "distance").min(0).max(50).step(1);
        gui.add(light, "angle")
            .min(0)
            .max(Math.PI / 2)
            .step(Math.PI / 50);
        gui.addColor(light, "color");
    }

    draw() {
        this._renderer.render(this._scene, this._camera);

        this._controls.update();

        this._lightHelper.update();

        requestAnimationFrame(() => this.draw());
    }

    resize() {
        this._camera.aspect = window.innerWidth / 3 / (window.innerHeight / 2);
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(window.innerWidth / 3, window.innerHeight / 2);
        this._renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }
}
